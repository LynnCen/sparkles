/**
 * @Author Pull
 * @Date 2021-08-16 14:45
 * @project formatIntlTemplate
 */

import { observable, action, computed } from "mobx";
import UserInfo from "@newSdk/model/UserInfo";
import intlTemplateModel from "@newSdk/model/public/IntlTemplate";
import MessageType from "@newSdk/model/MessageType";
import _ from "lodash";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
import localeFormat from "utils/localeFormat";
import formatMis from "utils/date/formatMis";
import { getNameWeight } from "utils/nameWeight";
class FormatIntlTempLate {
    formatAbleType = [MessageType.IntlTemplateMessage, MessageType.DeleteFlagMessage];
    getLang() {
        // get local lang
        try {
            return JSON.parse(localStorage.getItem("settings")).locale;
        } catch (e) {
            console.error(e);
        }
        return "en";
    }

    getRole(target, operator) {
        if (operator === UserInfo._id) {
            return "operator";
        }

        if (target && target.includes(UserInfo._id)) {
            // sort current id to first
            const index = target.findIndex((item) => item === UserInfo._id);

            // 将当前用户排在第一位
            if (index !== -1) target.unshift(target.splice(index, 1)[0]);
            return "target";
        }
        return "other";
    }

    async getTemplate(lang, tplId, role) {
        const templateData = await intlTemplateModel.getTempByIdAndLang(tplId, lang);
        if (!templateData) return false;
        try {
            return templateData.content[role];
        } catch (e) {
            console.error(`error in new_stores\\formatIntlTemplate\\getTemplate`, e);
            return false;
        }
    }

    decorateTemplate(tem = "", message) {
        try {
            const {
                content: { temId, target },
            } = message;
            if (
                temId === "invite-join-session" &&
                (target.length === 0 || (target.length === 1 && target.includes(UserInfo._id)))
            ) {
                tem = tem.replace(/(,\s*)@{target}/, ` @{target}`);
            }
        } catch (e) {
            console.error(e);
        }

        return tem;
    }

    async transformMessage(message) {
        const { content, chatId, type, mid } = message;
        const { temId, operator, target = [] } = content;
        if (!content || !chatId || !self.formatAbleType.includes(type) || !temId) return "";

        // 获取当前语言环境
        const lang = self.getLang();

        // check cache
        // const history = self.intlMap.get(mid);
        // if (history && history.lang === lang && history.pending) {
        //     return history.pending;
        // }

        // 获取对应模板角色
        const role = self.getRole(target, operator);

        // 获取对应模板
        let tpl = await self.getTemplate(lang, temId, role);
        // 对个别模板进行单独处理（*****）
        tpl = self.decorateTemplate(tpl, message);
        if (!tpl) {
            tpl = localeFormat({ id: "Unknown" });
        }

        return tpl;
    }

    buildContent(tem, extraInfo, sourceMap) {
        const reg = /@\{(.+?)\}/gim;
        const separator = `,`;

        const getName = (id) => {
            if (UserInfo._id === id) return "";
            const userInfo = sourceMap.get(id);
            // if (!userInfo.name) {
            //     getUserListInfo([id]);
            // }
            if (userInfo) {
                const { name, friendAlias, alias, tmm_id, id } = userInfo;
                let displayName = getNameWeight({
                    friendAlias: userInfo.friendAlias,
                    alias: userInfo.alias,
                    name: userInfo.name,
                    uid: userInfo.uid,
                    status: userInfo.status,
                });
                // let displayName = friendAlias || alias || name;
                const n = displayName ? displayName : tmm_id || id;

                return n + separator;
            } else return "";
        };

        const sliceName = (name) => {
            return name.length ? name.slice(0, name.length - separator.length) : name;
        };

        const str = tem.replace(reg, (_, key) => {
            if (key === "operator") {
                const formatName = getName(extraInfo.operator);
                return sliceName(formatName);
            } else if (key === "target") {
                /**
                 * special action
                 */
                let uids = [];
                (extraInfo.target || []).forEach((uid) => {
                    if(!uid) return ;
                    const userInfo = sourceMap.get(uid);
                    if (!userInfo.name) {
                        uids.push(uid);
                    }
                });
                if (uids.length > 0) getUserListInfo(uids);
                let str = (extraInfo.target || []).reduce((s, uid) => (s += getName(uid)), "");
                return sliceName(str);
            } else {
                let val = extraInfo[key];

                // 时间处理
                if (key === "duration" && val) val = formatMis(val);

                //
                if (val) return val;
                return "";
            }
        });

        return str;
    }
}

const self = new FormatIntlTempLate();

export default self;
