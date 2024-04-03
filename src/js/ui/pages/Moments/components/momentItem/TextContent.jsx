/**
 * @Author Pull
 * @Date 2021-10-30 15:57
 * @project TextContent
 */
import React, { Component, Fragment } from "react";
import TextContentViewMore from "../textContentViewMore/textContentViewMore";
import styles from "./moments.module.less";
import classNames from "classnames/bind";
import { inject } from "mobx-react";
import { parse_text } from "../../../Home/NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import { getNameWeight } from "utils/nameWeight";
const cx = classNames.bind(styles);

let initProxy = false;

@inject(({ UserInfoProxy }) => ({
    proxyUserInfo: UserInfoProxy.proxyInfo,
    getBaseInfo: UserInfoProxy.getBaseInfo,
}))
export class TextContent extends Component {
    getUserInfo() {
        const { forwardPresInfo, getBaseInfo } = this.props;
        if (!initProxy && forwardPresInfo && forwardPresInfo.length) {
            forwardPresInfo.forEach((item) => getBaseInfo(item.uid));
        }
    }

    parse(text, classNames) {
        return parse_text(text, classNames, {
            toStr: true,
            formatTopic: true,
        });
    }

    renderText() {
        const { forwardPresInfo = [], text = "", proxyUserInfo } = this.props;

        // console.log("input text", text);
        let _text = this.parse(text, "", true);
        // console.log("out put text", _text);
        forwardPresInfo.forEach((item) => {
            const userInfo = proxyUserInfo(item.uid);
            // const name = userInfo.friendAlias || userInfo.name;
            const name = getNameWeight({
                friendAlias: userInfo.friendAlias,
                alias: userInfo.alias,
                name: userInfo.name,
                uid: userInfo.uid,
                status: userInfo.status,
            });
            // const content = parse_text( || "")
            _text += `//<span style="color: #13a1af">@${name}:</span>${this.parse(item.text, "")}`;
        });
        return _text || "";
    }

    decorateTopic(text = "") {
        return text;
    }

    decorateText(text) {
        return this.decorateTopic(text);
        // return text;
    }

    render() {
        const text = this.renderText();
        const { limitContent } = this.props;
        return (
            <article className={cx("item-article")}>
                <TextContentViewMore
                    content={text}
                    limitContent={limitContent}
                    textClassName="dark-theme-color_lighter"
                    viewMoreClassName="dark-theme-bg_lighter dark-theme-color_lighter"
                />
            </article>
        );
    }
}

export default TextContent;
