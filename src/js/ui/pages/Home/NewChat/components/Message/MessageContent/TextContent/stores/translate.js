import { observable, action, computed } from "mobx";
import translate, { TranslateCode, translateV2 } from "@newSdk/service/api/message/translate";
import Message from "@newSdk/model/Message";
import MayBe from "@newSdk/utils/functor/MayBe";
import UiEventCenter, { UiEventType } from "utils/sn_event_center";
import MessageType from "@newSdk/model/MessageType";
class Translate {
    translateStatus = {
        UnTranslate: "unTranslate",
        Translated: "translated",
        TranslateFail: "translateFail",
        TranslateFailTarget: "translateFailTarget",
        TranslateFailSource: "translateFailSource",
        Loading: "loading",
    };

    @observable transitionMap = {};

    @computed get getTransition() {
        const map = translateStore.transitionMap;

        return (mid) => map[mid] || {};
    }

    async handleTranslate(mid, text, opts, type) {
        // 最后一个元素，滚动需求
        // if (isLastMsg) {
        const intoView = translateStore.ifScrollIntoView(opts);

        const translateInfo = translateStore.transitionMap[mid];

        if (!translateStore.isTranslateAble(translateInfo)) return;

        translateStore.setTransition(mid, {
            intoView,
            status: translateStore.translateStatus.Loading,
        });

        translateStore.scrollIntoViewIfNeed(mid);
        if (type == MessageType.AtMessage) {
            let lang = (() => {
                const set = localStorage.getItem("settings");
                if (!set) return "";
                const settings = JSON.parse(set);
                const { locale } = settings;
                if (["zh-TW", "zh-CN"].includes(locale)) return "cn";
                return settings.locale || "";
            })();
            await translateV2(mid, lang).then((res) => {
                translateStore.done(mid, res);
            });
        } else {
            await translate(mid, text).then((res) => {
                translateStore.done(mid, res);
            });
        }
    }

    async handleRemoveTranslate(mid) {
        await Message.updateTranslateV2({ mid, items: {} });
        await Message.updateTranslate({ mid, text: "" });

        translateStore.setTransition(mid, {
            status: translateStore.translateStatus.UnTranslate,
        });
    }

    @action proxyMessageTranslate(message) {
        const { local = {}, mid } = message;
        const { translate = {} } = local;
        if (translate.text) {
            translateStore.setTransition(mid, {
                status: translateStore.translateStatus.Translated,
                text: translate.text,
            });
        } else {
            translateStore.setTransition(mid, {
                status: translateStore.translateStatus.UnTranslate,
            });
        }
    }

    @action
    setTransition(mid, ob) {
        translateStore.transitionMap[mid] = ob;
        // console.log("setTransition", { ...translateStore.transitionMap });
    }

    @action
    done(mid, response = {}) {
        const { status, res, type } = response;
        // console.log(<FormatDigest message={response} />);
        let s, text;

        switch (status) {
            case TranslateCode.Success: {
                s = translateStore.translateStatus.Translated;
                text = type == MessageType.AtMessage ? JSON.parse(response.content) : res;
                break;
            }
            case TranslateCode.NetworkError:
            case TranslateCode.Fail: {
                s = translateStore.translateStatus.TranslateFail;
                break;
            }
            case TranslateCode.SourceLangUnSupport: {
                s = translateStore.translateStatus.TranslateFailSource;
                break;
            }
            case TranslateCode.TargetLangUnSupport: {
                s = translateStore.translateStatus.TranslateFailTarget;
                break;
            }
        }

        translateStore.setTransition(mid, {
            status: s,
            text,
            code: status,
            intoView: translateStore.getTransition(mid).intoView,
        });

        // 。。。。 todo:
        setTimeout(() => translateStore.scrollIntoViewIfNeed(mid), 16);
    }

    @action
    clearTransitionMap = () => {
        translateStore.transitionMap = {};
    };

    ifScrollIntoView({ isLastMsg, scrollContainer }) {
        const res = MayBe.of(scrollContainer).chain((ref) => ({
            scrollTop: ref.scrollTop,
            scrollHeight: ref.scrollHeight,
            clientHeight: ref.clientHeight,
        }));
        if (res && res.scrollHeight - res.scrollTop === res.clientHeight) {
            return {
                scrollTop: res.scrollTop,
                ref: scrollContainer,
            };
        }
    }
    scrollIntoViewIfNeed(mid) {
        const translateInfo = translateStore.getTransition(mid);

        const { intoView } = translateInfo;
        const currentScrollTop = MayBe.of(intoView)
            .map((v) => v.ref)
            .chain((ref) => ref.scrollTop);
        const oldScrollTop = MayBe.of(intoView).chain((ref) => ref.scrollTop);

        if (currentScrollTop && oldScrollTop && currentScrollTop === oldScrollTop) {
            UiEventCenter.emit(UiEventType.SCROLL_TO_BOTTOM);

            // 滚动以后更新当前值
            const props = { ...translateInfo };
            const view = { ...intoView };
            view.scrollTop = MayBe.of(intoView)
                .map((d) => d.ref)
                .chain((ref) => ref.scrollTop);

            translateStore.setTransition(mid, {
                ...props,
                intoView: view,
            });
        }
    }

    isTranslated(translateInfo) {
        const {
            Translated,
            TranslateFail,
            TranslateFailTarget,
            TranslateFailSource,
        } = translateStore.translateStatus;
        return (
            translateInfo.status &&
            [Translated, TranslateFail, TranslateFailTarget, TranslateFailSource].includes(
                translateInfo.status
            )
        );
    }

    isUnTranslated(translateInfo) {
        return (
            !translateInfo.status ||
            translateInfo.status === translateStore.translateStatus.UnTranslate
        );
    }

    isLoading(translateInfo) {
        return (
            translateInfo.status && translateInfo.status === translateStore.translateStatus.Loading
        );
    }

    isTranslateFail(translateInfo) {
        const {
            TranslateFail,
            TranslateFailTarget,
            TranslateFailSource,
        } = translateStore.translateStatus;
        return [TranslateFail, TranslateFailTarget, TranslateFailSource].includes(
            translateInfo.status
        );
    }

    isTranslateAble(translateInfo) {
        const { Translated } = translateStore.translateStatus;
        return (
            translateInfo &&
            !translateStore.isLoading(translateInfo) &&
            translateInfo.status !== Translated
        );
    }
}

export const translateStore = new Translate();

export default translateStore;
