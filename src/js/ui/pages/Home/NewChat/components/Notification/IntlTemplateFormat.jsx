/**
 * @Author Pull
 * @Date 2021-08-16 17:53
 * @project IntlTemplateFormat
 */

import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { isGroup } from "@newSdk/utils";

@inject((store) => ({
    transformMessage: store.FormatIntlTemp.transformMessage,
    buildContent: store.FormatIntlTemp.buildContent,
    formatAbleType: store.FormatIntlTemp.formatAbleType,

    proxyUserBaseInfo: store.UserProxyEntity.getUserInfo,
    proxyUserInfoInGroup: store.UserProxyEntity.getUserInfoInGroup,
    getProxyUserInfoInGroup: store.UserProxyEntity.getProxyUserInGroupInfo,
    getProxyUserBaseInfo: store.UserProxyEntity.getProxyUserBaseInfo,
}))
@observer
class IntlTemplateFormat extends Component {
    state = {
        template: "",
    };

    componentDidMount() {
        this.transform();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { message } = prevProps;
        const { message: current } = this.props;

        // 消息变化 模板变更
        if (message && current && current.mid !== message.mid) {
            this.transform();
        }
    }

    transform() {
        const { transformMessage, message, formatAbleType } = this.props;
        if (!message || !formatAbleType.includes(message.type)) return;

        this.getUserInfo();
        transformMessage(message).then((template) => {
            this.setState({ template });
        });
    }

    getAllMember() {
        const { message } = this.props;
        const { content = {} } = message;
        let { operator, target = [] } = content;
        operator = Array.isArray(operator) ? operator : [operator];
        target = Array.isArray(target) ? target : [target];
        const uids = [...operator, ...target].filter(Boolean);
        return uids;
    }

    getUserInfo = () => {
        const { message, proxyUserBaseInfo, proxyUserInfoInGroup } = this.props;
        const { chatId } = message;
        const uids = this.getAllMember();
        const group = isGroup(chatId);
        uids.forEach((uid) => {
            if (group) proxyUserInfoInGroup(uid, chatId);
            proxyUserBaseInfo(uid);
        });
    };

    buildContent() {
        const uids = this.getAllMember();
        const { getProxyUserInfoInGroup, getProxyUserBaseInfo, message, buildContent } = this.props;
        const { template } = this.state;

        if (!template) return "";

        const { chatId } = message;
        const group = isGroup(chatId);
        // 构建用户信息
        const userMap = new Map();

        uids.forEach(async (uid) => {
            let userInfo = {};
            if (group) {
                userInfo = getProxyUserInfoInGroup(chatId, uid);
            } else {
                userInfo = getProxyUserBaseInfo(uid);
            }

            userMap.set(userInfo[uid] || uid, userInfo);
        });
        const str = buildContent(template, message.content, userMap);
        return str;
    }

    render() {
        const { template } = this.state;
        let text = this.buildContent();
        return <Fragment>{text || template}</Fragment>;
    }
}

export default IntlTemplateFormat;
