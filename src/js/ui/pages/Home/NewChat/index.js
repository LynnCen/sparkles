/**
 * @Author Pull
 * @Date 2021-05-23 16:03
 * @project store.js
 */

import React, { Component } from "react";
import { Divider, message, Modal } from "antd";
import { device } from "utils/tools";
import classNames from "classnames";
import SessionInfo from "./components/SessionInfo/SessionInfo";
import InfiniteScroll from "react-infinite-scroller";
import Message from "./components/Message/Message";
import { inject, observer } from "mobx-react";
import { ipcRenderer, popMenu } from "../../../../platform";
import { injectIntl } from "react-intl";
import moment from "moment";
import MessageType from "@newSdk/model/MessageType";
import { clipboard } from "electron";
import delMessage from "@newSdk/service/api/message/delMessage";
import revokeMessage from "@newSdk/service/api/message/revokeMessage";
import { localTextTransform } from "./components/MessageInput/editor";
import { getSelectDom } from "utils/dom/helper";
import UiEventCenter, { UiEventType } from "utils/sn_event_center";
import styles from "./styles.less";
import translateStore from "./components/Message/MessageContent/TextContent/stores/translate";
import tmmUserInfo from "@newSdk/model/UserInfo";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";
import MessageInput from "./components/MessageInput";
import { isMe, isP2P } from "@newSdk/utils";
import { renderStyle } from "./utils";
import quoteStore from "./components/quote/quoteStore";
import { pickerStore } from "components/TmmPickerBoard/pickerStore";
import forwardMessage from "utils/chatController/forwardMessage";
import MessageStatus from "@newSdk/model/MessageStatus";
import { getNameWeight } from "utils/nameWeight";
import { AT_ALL, AT_CONTENT_U, AT_CONTENT_T } from "@newSdk/model/message/AtMessageContent";
import nodePath from "path";
import { remote, app } from "electron";
import { saveFile, checkOriginCache, checkCompressCache } from "utils/sn_utils";
import CalcSize from "@newSdk/utils/ImageSource";
import Notice from "./components/Notification/Notice";
const msgRef = React.createRef();
const container_id = "message_list_container";
const ActionOrder = {
    Copy: 1,
    DeleteAll: 2,
    DeleteOfMe: 3,
    Forward: 4,
    Quote: 5,
    MultiSelect: 6,
    Translate: 7,
    TranslateHide: 7,
    FileSaveAs: 8,
};

@inject((store) => ({
    messageList: store.NewChat.currentMessageList,
    insertDraftDb: store.NewChat.insertDraftDb,
    timeGroupByMessageList: store.NewChat.timeGroupByMessageList,
    sliceMessageList: store.NewChat.sliceMessageList,
    loadMessage: store.NewChat.loadHistoryMessage,
    messageLoading: store.NewChat.messageLoading,
    hasMore: store.NewChat.hasMore,
    focusSessionId: store.NewSession.focusSessionId,
    locale: store.settings.locale,
    getProxyUserInfoInGroup: store.UserProxyEntity.getProxyUserInGroupInfo,
    toggleShowSelect: store.NewChat.toggleShowSelect,
    updateMsgIdsWillDelete: store.NewChat.updateMsgIdsWillDelete,
    msgIdsWillDelete: store.NewChat.msgIdsWillDelete,
    initIntersectionObserver: store.IntersectionWatcher.initObserver,
}))
@observer
class Chat extends Component {
    state = {
        unreadCount: 0,
    };

    componentDidMount() {
        // setTimeout(() => this.scrollToBottom(), 50);
        this.scrollToBottom("auto");
        // todo: intersection
        // this.initInterSection();

        UiEventCenter.on(UiEventType.SCROLL_TO_BOTTOM, this.scrollToBottom);
    }

    componentWillUnmount() {
        UiEventCenter.off(UiEventType.SCROLL_TO_BOTTOM, this.scrollToBottom);
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        const options = {
            initScroll: false,
        };
        // 切换会话
        try {
            const oldMsg = prevProps.messageList[0] || {};
            const newMsg = this.props.messageList[0] || {};

            const equalSessionId = prevProps.focusSessionId !== this.props.focusSessionId;
            const sameMsg = oldMsg.chatId !== newMsg.chatId;
            if (equalSessionId || sameMsg) {
                options.initScroll = true;
                return options;
            }
        } catch (e) {
            console.log("throw e getSnapshotBeforeUpdate", e);
        }

        const old = prevProps.messageList.length;
        const current = this.props.messageList.length;

        // new Message
        if (current > old && this.refs.scrollContainer) {
            const { scrollHeight, scrollTop, clientHeight } = this.refs.scrollContainer;
            // 滚动距离低于两屏 && new Message
            // 新消息来了之后 如果滚动距离大于一条消息 就滚动到底部
            if (scrollHeight - scrollTop < clientHeight * 1.5 && old + 1 === current) {
                options.initScroll = true;
            } else options.initScroll = false;
        }

        // init done
        if (!old && current) options.initScroll = true;

        return options;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.refs.scrollContainer) return;

        // const { scrollHeight, scrollTop, clientHeight } = this.refs.scrollContainer;
        // console.log("effect scroll", snapshot.initScroll);
        if (snapshot.initScroll) {
            this.scrollToBottom("auto");
        }

        // const preIndex = prevProps.messageList.length - 1;
        // const toNewMessage =
        // this.props.messageList && this.props.messageList.length > prevProps.messageList.length;

        // if (toNewMessage) return this.scrollToBottom("smooth");
    }

    scrollToBottom = (behavior = "auto") => {
        if (!this.refs.scrollContainer) return;

        const { scrollHeight, clientHeight } = this.refs.scrollContainer;
        this.refs.scrollContainer.style.scrollBehavior = behavior;
        this.refs.scrollContainer.scrollTop = scrollHeight - clientHeight;
        setTimeout(() => this.props.sliceMessageList(), 1e3);
    };

    initInterSection() {
        // todo: intersection
        // const { initIntersectionObserver } = this.props;
        // const { scrollContainer } = this.refs;
        // if (scrollContainer) {
        //     initIntersectionObserver(scrollContainer);
        // } else {
        //     setTimeout(
        //         () => initIntersectionObserver(document.querySelector(`#${container_id}`)),
        //         500
        //     );
        // }
    }

    loadMore = () => {
        this.props.loadMessage();
    };

    onShowModal = (mid, func, intlId) => {
        const { intl, focusSessionId, shouldUseDarkColors } = this.props;
        let modal = Modal.confirm({
            centered: true,
            okButtonProps: { loading: false },
            className: shouldUseDarkColors ? "antd-modal-custom-dark" : "",
        });
        const delMsg = async () => {
            try {
                modal.update({ okButtonProps: { loading: true } });
                await func([mid], focusSessionId);
                message.config({
                    getContainer: () => msgRef && msgRef.current,
                });
                message.success({ content: intl.formatMessage({ id: "Deleted" }), duration: 2 });
            } catch (e) {
            } finally {
                modal.update({ okButtonProps: { loading: false } });
                modal.destroy();
            }
        };
        modal.update({
            content: intl.formatMessage({ id: intlId }),
            cancelText: intl.formatMessage({ id: "Cancel" }),
            okText: intl.formatMessage({ id: "Delete" }),
            onCancel: modal.destroy,
            onOk: delMsg,
        });
    };

    onDelMsg = (mid) => {
        this.onShowModal(mid, delMessage, "DeleteOneMsg");
    };

    onReCallMsg = async (mid) => {
        this.onShowModal(mid, revokeMessage, "DeleteOneMsg");
    };

    onSelect = (mid) => {
        this.props.toggleShowSelect(true);
        this.props.updateMsgIdsWillDelete(mid, true);
    };
    onFileSaveAs = async (Message) => {
        const { content, type } = Message;
        const { objectId, fileType, name } = content;
        const {
            intl: { formatMessage },
        } = this.props;
        let compressImgPath;
        if (type == MessageType.ImgMessage) {
            // check local cache
            const compressSize = CalcSize.setThumb(content.width, content.height);
            compressImgPath = await checkCompressCache({
                path: objectId,
                ...compressSize,
                type: fileType,
            });
        }
        const localPath = (await checkOriginCache(objectId, fileType)) || compressImgPath;
        if (!localPath) {
            switch (type) {
                case MessageType.ImgMessage:
                    message.info(formatMessage({ id: "img_download_tip" }));
                    break;
                case MessageType.VideoMessage:
                    message.info(formatMessage({ id: "video_download_tip" }));
                    break;
                case MessageType.AttachmentMessage:
                    message.info(formatMessage({ id: "file_download_tip" }));
                    break;
            }
            return;
        }
        const { base } = nodePath.parse(localPath);
        const dir = remote.app.getPath("pictures") || app.getPath("downloads");
        const defaultPath = nodePath.join(dir, name ? name : base);
        const path = remote.dialog.showSaveDialogSync({
            properties: ["showHiddenFiles", "createDirectory"],
            defaultPath,
        });
        if (path) return saveFile(localPath, path);
    };

    handleCopyToClipboard = ({ html, text }) => {
        if (!html && !text) return;
        if (!html) {
            html = localTextTransform(text);
        }
        // console.log/**/
        clipboard.write({
            html,
            text,
        });
    };
    decorateCopyAction = (template, message) => {
        const { type, content, chatId } = message;
        const {
            intl: { formatMessage },
            getProxyUserInfoInGroup,
        } = this.props;
        const copyAble = [MessageType.TextMessage, MessageType.AtMessage];
        const atType = type === MessageType.AtMessage;
        let atText = "";
        if (atType) {
            Array.from(content.items, (item) => {
                if (item.t == AT_CONTENT_U) {
                    atText += ` @${
                        item.v == AT_ALL
                            ? formatMessage({ id: "AtMentionAll" })
                            : getNameWeight(getProxyUserInfoInGroup(chatId, item.v))
                    } `;
                } else {
                    atText += item.v;
                }
            });
        }
        if (copyAble.includes(type)) {
            template.push({
                label: formatMessage({ id: "Copy" }),
                click: () => {
                    const html = getSelectDom();

                    if (html) {
                        return this.handleCopyToClipboard({
                            html,
                            text: atType ? atText : content.text,
                        });
                    } else {
                        return this.handleCopyToClipboard({ text: atType ? atText : content.text });
                    }
                },
                key: "Copy",
                // role: "copy",
                sort: ActionOrder.Copy,
            });
        }
    };
    decorateQuoteAction = (template, message) => {
        const quoteAble = [
            MessageType.TextMessage,
            MessageType.ImgMessage,
            MessageType.VideoMessage,
            MessageType.AttachmentMessage,
            MessageType.MomentShareMessage,
            MessageType.MiniProgramMessage,
            MessageType.AtMessage,
        ];

        const { type, status } = message;
        const {
            intl: { formatMessage },
        } = this.props;

        if (quoteAble.includes(type)) {
            template.push({
                label: formatMessage({ id: "Quote" }),
                click: () => {
                    UiEventCenter.emit(UiEventType.INPUT_FOCUS);
                    this.props.insertDraftDb(
                        {
                            chatId: message.chatId,
                            type: 1,
                            extra: message,
                        },
                        true
                    );
                    quoteStore.quoteMessage(message);
                },
                key: "Quote",
                sort: ActionOrder.Quote,
            });
        }
    };
    decorateForwardAction = (template, message) => {
        // const forwardUnAble = [MessageType.AudioMessage, MessageType.TransactionMessage, MessageType.];
        const forwardAble = [
            MessageType.ImgMessage,
            MessageType.VideoMessage,
            MessageType.TextMessage,
            MessageType.AttachmentMessage,
            MessageType.MomentShareMessage,
            MessageType.MiniProgramMessage,
        ];

        const { type } = message;
        const {
            intl: { formatMessage },
        } = this.props;
        if (forwardAble.includes(type)) {
            template.push({
                label: formatMessage({ id: "Forward" }),
                click: () => forwardMessage(message),
                key: "Forward",
                sort: ActionOrder.Forward,
            });
        }
    };

    decorateTranslateAction = (template, message) => {
        const translateAble = [MessageType.TextMessage, MessageType.AtMessage];
        const {
            intl: { formatMessage },
            messageList,
            locale,
        } = this.props;
        const { type, local = {}, mid, content, sender } = message;
        const { translate } = local;
        if (!translateAble.includes(type) || sender === tmmUserInfo._id) return;

        const lastMessage = messageList[messageList.length - 1];
        const translateInfo = translateStore.getTransition(mid);
        // 关闭翻译
        if (translateInfo.status === translateStore.translateStatus.Translated) {
            template.push({
                label: formatMessage({ id: "Hide" }),
                click: () => translateStore.handleRemoveTranslate(mid, this.refs.scrollContainer),
                key: "TranslateHide",
                sort: ActionOrder.TranslateHide,
            });
        } else {
            // 翻译
            template.push({
                label: formatMessage({ id: "Translate" }),
                click: () =>
                    translateStore.handleTranslate(
                        mid,
                        content.text,
                        {
                            scrollContainer: this.refs.scrollContainer,
                            isLastMsg: mid === lastMessage.mid,
                        },
                        type
                    ),
                key: "Translate",
                sort: ActionOrder.Translate,
            });
        }
    };

    decorateDeleteMessage = (template, message) => {
        const { intl } = this.props;
        const { mid, timestamp, sender, type } = message;
        const isMe = sender === sessionStorage.getItem("userId");
        const { formatMessage } = intl;

        const isDelAllDisable = [MessageType.RTCMessage].includes(type);
        // if (disableMessageType.includes(type)) return;

        // const isExpired = moment.duration(moment().diff(moment(timestamp))).minutes() >= 2;
        if (isMe && !isDelAllDisable) {
            template.push({
                label: formatMessage({ id: "DeleteForAll" }),
                click: () =>
                    // to react node
                    this.onReCallMsg(mid),
                key: "DeleteForAll",
                sort: ActionOrder.DeleteAll,
            });
        }
        template.push({
            label: formatMessage({ id: "DeleteForMe" }),
            click: () => this.onDelMsg(mid),
            key: "DeleteForMe",
            sort: ActionOrder.DeleteOfMe,
        });
    };
    decorateFileSaveAs = async (template, message) => {
        const { intl } = this.props;
        const { type, content } = message;
        const { formatMessage } = intl;
        const FileSaveAsAble = [
            MessageType.ImgMessage,
            MessageType.VideoMessage,
            MessageType.AttachmentMessage,
        ];
        if (FileSaveAsAble.includes(type)) {
            template.push({
                label: formatMessage({ id: "saveAs" }),
                click: () => this.onFileSaveAs(message),
                key: "FileSaveAs",
                sort: ActionOrder.FileSaveAs,
            });
        }
    };
    handleMessageAction = (message) => {
        const { intl } = this.props;
        const { mid, timestamp, sender } = message;

        const { formatMessage } = intl;
        let template = [
            {
                label: formatMessage({ id: "MultiSelect" }),
                click: () => this.onSelect(mid),
                key: "MultiSelect",
                sort: ActionOrder.MultiSelect,
            },
        ];
        this.decorateDeleteMessage(template, message);
        this.decorateQuoteAction(template, message);
        this.decorateCopyAction(template, message);
        this.decorateForwardAction(template, message);
        this.decorateTranslateAction(template, message);
        this.decorateFileSaveAs(template, message);
        if (message.status === MessageStatus.sendFail) {
            template = template.filter(
                (item) => item.key === "MultiSelect" || item.key === "DeleteForMe"
            );
        }
        popMenu(template.sort((a, b) => a.sort - b.sort));
    };

    render() {
        const {
            hasMore,
            focusSessionId,
            locale,
            timeGroupByMessageList,
            messageLoading,
        } = this.props;
        moment.locale(locale);

        return !!focusSessionId ? (
            <section className={classNames(styles.container)}>
                <div className={styles.config}>
                    <SessionInfo />
                </div>
                <Notice />
                <article className={styles.content}>
                    <section className={styles.list} ref="scrollContainer" id={container_id}>
                        <InfiniteScroll
                            loadMore={this.loadMore}
                            pageStart={0}
                            isReverse={true}
                            // hasMore={!!(hasMore && messageList.length)}
                            hasMore={true}
                            initialLoad={false}
                            useWindow={false}
                            loader={
                                <p className={styles.loaderNotification} key={0}>
                                    {hasMore && messageLoading ? "loading..." : " " /*no more*/}
                                </p>
                            }
                        >
                            {timeGroupByMessageList.keys.map((g, j) => {
                                return (
                                    <React.Fragment key={g}>
                                        <Divider className={styles.timeLine}>
                                            <div className={styles.timeSplit}>
                                                {moment(g).calendar()}
                                            </div>
                                        </Divider>
                                        {(timeGroupByMessageList.groupedArr[g] || []).map(
                                            (msg, i) => (
                                                <Message
                                                    groupTime={g}
                                                    message={msg}
                                                    key={msg.mid}
                                                    // todo: intersection
                                                    // addObserve={addObserve}
                                                    handleContextMenu={this.handleMessageAction}
                                                    {...renderStyle(
                                                        timeGroupByMessageList.groupedArr[g],
                                                        i
                                                    )}
                                                />
                                            )
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </InfiniteScroll>
                    </section>

                    <aside className={styles.editor}>
                        <MessageInput />
                    </aside>
                </article>

                <div ref={msgRef} />
            </section>
        ) : (
            <aside className={styles.empty}>
                <ImageIcon enumType={supportEnumType.TMMLogoIcon} />
            </aside>
        );
    }
}

export default injectIntl(Chat);
