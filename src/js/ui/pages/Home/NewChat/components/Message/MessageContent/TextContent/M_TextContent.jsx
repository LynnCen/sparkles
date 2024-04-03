/**
 * @Author Pull
 * @Date 2021-06-04 21:05
 * @project TextContentViewMore
 */
import React, { Component, Fragment, PureComponent } from "react";
import styles from "./styles.less";
import { parse_text } from "../../../MessageInput/image_of_emoji/emoji_helper";
import { renderMessageStatus } from "../../../../../index";
import classnames from "classnames";
import { TranslateComplete, CssLoadingChrSpin, FailFilled } from "../../../../../../../icons";
import { observer, inject } from "mobx-react";
import common from "../../../../../../../stores_new/common";
import { injectIntl } from "react-intl";
import translateStore from "./stores/translate";
import { TranslateCode } from "@newSdk/service/api/message/translate";
import UiEventCenter, { UiEventType } from "utils/sn_event_center";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";
import QuoteLayout from "../../QuoteLayout";
import { isGroup } from "@newSdk/utils";
import { FormatDigest } from "../../../../../../Home/index";
import { message } from "antd";
import { AT_ALL, AT_CONTENT_U, AT_CONTENT_T } from "@newSdk/model/message/AtMessageContent";
const currentRef = React.createRef();

const TextContentLineHeight = 17;
const Padding = [5, 13, 7, 12];
@inject((stores) => ({
    focusSessionInfo: stores.NewSession.focusSessionInfo,
}))
@observer
class TextContent extends Component {
    state = {
        compactMargin: false,
    };

    constructor(props) {
        super(props);
        const { message } = this.props;
        translateStore.proxyMessageTranslate(message);
    }

    renderFooterLeft = (translateInfo) => {
        const { intl } = this.props;
        const { formatMessage } = intl;

        if (translateStore.isLoading(translateInfo)) {
            return (
                <Fragment>
                    <span className={styles.icon}>
                        <CssLoadingChrSpin />
                    </span>
                    <span className={styles.text}>{formatMessage({ id: "TranslateLoading" })}</span>
                </Fragment>
            );
        }

        if (translateStore.isTranslateFail(translateInfo)) {
            return (
                <Fragment>
                    <span className={styles.icon}>
                        <ImageIcon enumType={supportEnumType.Translate_Message_Fail} />
                    </span>
                    <span className={styles.text}>{formatMessage({ id: "TranslateFail" })}</span>
                </Fragment>
            );
        }

        return (
            <Fragment>
                <span className={styles.icon}>
                    <TranslateComplete />
                </span>
                <span className={styles.text}>{formatMessage({ id: "TMMTMMTranslate" })}</span>
            </Fragment>
        );
    };

    renderTranslateContent = (translateInfo) => {
        const { intl, message, focusSessionInfo } = this.props;
        const { formatMessage } = intl;
        // console.log("renderTranslateContent", { ...translateInfo });
        const translateErrorMap = {
            [TranslateCode.Fail]: formatMessage({ id: "TranslateError" }),
            [TranslateCode.NetworkError]: formatMessage({ id: "NetworkError" }),
            [TranslateCode.TargetLangUnSupport]: formatMessage({ id: "TranslateFailUnSupport" }),
            [TranslateCode.SourceLangUnSupport]: formatMessage({ id: "TranslateFailUnSupport" }),
        };

        if (translateStore.isTranslateFail(translateInfo)) {
            return (
                <span className={styles.translateContent}>
                    {translateErrorMap[translateInfo.code] || ""}
                </span>
            );
        }

        if (typeof translateInfo.text == "object") {
            console.log({ ...translateInfo.text.items }, "message", this.props.message);
            const items = translateInfo.text.items;
            return (
                <FormatDigest
                    message={{
                        type: message.type,
                        content: { items },
                        chatId: focusSessionInfo.chatId,
                    }}
                    atStyles={true}
                />
            );
        }
        return (
            <span className={classnames(styles.translateContent, styles.success)}>
                {/* {translateInfo.text ? <FormatDigest message={translateInfo.text} /> : null} */}

                {translateInfo.text || ""}
            </span>
        );
    };

    componentDidMount() {
        // UI 需求：：：：： 当行文本将时间挤到下一行时，缩小时间与单行文本间单间距。
        const innerRef = this.refs.textContent;

        if (innerRef && currentRef.current) {
            const h = innerRef.offsetHeight;
            const containerH = currentRef.current.offsetHeight;

            const [top, , bottom] = Padding;
            const paddingH = top + bottom;
            // 误差值
            if (
                h < TextContentLineHeight + 3 && // 单行文本
                containerH - paddingH - TextContentLineHeight > 10 // 高度被撑开
            ) {
                this.setState({
                    compactMargin: true,
                });
            }
        }
    }

    render() {
        const {
            intl,
            message,
            isMe,
            timeToShow,
            text,
            extraNode,
            items,
            focusSessionInfo,
        } = this.props;
        const { compactMargin } = this.state;
        const { formatMessage } = intl;
        const { mid, extra } = message;

        const translateInfo = translateStore.getTransition(mid);
        const isQuote = extra && extra.mids && Array.isArray(extra.mids) && extra.mids.length;
        const group = isGroup(focusSessionInfo.chatId);
        return (
            <Fragment>
                <div
                    className={classnames(styles.textContainer, {
                        [styles.me]: isMe,
                    })}
                    style={{ padding: Padding }}
                    ref={currentRef}
                >
                    {isQuote ? <QuoteLayout mids={extra.mids} isMe={isMe} /> : null}

                    {/* @ or text */}
                    {Array.isArray(items) && group
                        ? // <FormatDigest message={message} atStyles={true} isMe={isMe} />
                          items.map((it, index) => {
                              return (
                                  <span
                                      className={classnames(styles.textContent)}
                                      style={{
                                          lineHeight: TextContentLineHeight + "px",
                                          margin: `${it.t == AT_CONTENT_U ? "0 1px" : "0"}`,
                                          color: `${
                                              it.t == AT_CONTENT_U
                                                  ? `${isMe ? "#FFF" : "#00C6DB"}`
                                                  : ""
                                          }`,
                                          opacity: `${
                                              it.t == AT_CONTENT_U ? `${isMe ? ".6" : ""}` : ""
                                          }`,
                                      }}
                                      ref="textContent"
                                      key={index}
                                  >
                                      {it.t == AT_CONTENT_T
                                          ? parse_text(it.v || "", styles.emoji)
                                          : ` @${it.v} `}
                                      {extraNode ? (
                                          <span className={styles.extraIcon}>{extraNode}</span>
                                      ) : null}
                                  </span>
                              );
                          })
                        : null}

                    <span
                        className={classnames(styles.textContent)}
                        style={{ lineHeight: TextContentLineHeight + "px" }}
                        ref="textContent"
                    >
                        {parse_text(text || "", styles.emoji, {}, false)}
                        {extraNode ? <span className={styles.extraIcon}>{extraNode}</span> : null}
                    </span>
                    {/* 时间 */}
                    {translateStore.isUnTranslated(translateInfo) && (
                        <div
                            className={classnames(styles.textInfo, {
                                [styles.compactMargin]: compactMargin,
                            })}
                        >
                            <div className={styles.textBox}>
                                <span className={classnames(styles.textTime)}>{timeToShow}</span>
                                {isMe && (
                                    <span className={styles.textStatus} data-status={status}>
                                        {renderMessageStatus(message, formatMessage)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 翻译 */}
                {translateStore.isTranslated(translateInfo) && (
                    <div
                        className={classnames(styles.textTranslate, {
                            // [styles.translated]: translateStore.isTranslated(translateInfo),
                        })}
                    >
                        <div
                            className={classnames(styles.content, {
                                [styles.show]: translateStore.isTranslated(translateInfo),
                            })}
                        >
                            <i className={classnames(styles.divider, "dark-theme-bg_deep")} />
                            {this.renderTranslateContent(translateInfo)}
                        </div>

                        <footer
                            className={classnames(styles.icons, {
                                [styles.show]:
                                    translateInfo.status &&
                                    !translateStore.isUnTranslated(translateInfo),
                            })}
                        >
                            <div className={styles.left}>
                                {this.renderFooterLeft(translateInfo)}
                            </div>
                            <span
                                className={classnames(styles.text, {
                                    [styles.mySend]: isMe,
                                })}
                            >
                                {timeToShow}
                            </span>
                        </footer>
                    </div>
                )}
            </Fragment>
        );
    }
}

export default injectIntl(TextContent);
