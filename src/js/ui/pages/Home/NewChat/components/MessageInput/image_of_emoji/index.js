import React from "react";
import clazz from "classnames";
import styles from "./style.less";
import { injectIntl } from "react-intl";
import onClickOutside from "react-onclickoutside";
import emoji_data from "./emoji";
import { chunk } from "lodash";
import classNames from "classnames";
import localeFormat from "utils/localeFormat";
import keyValueModel from "@newSdk/model/keyValues/KeyValue";
import SupportDBKey from "@newSdk/model/keyValues/SupportDBKey";
import { inject, observer } from "mobx-react";
import _ from "lodash";
import ReactDOM from "react-dom";

@inject((stores) => ({
    lastEmoji: stores.NewSession.lastEmoji,
}))
@observer
class ImageOfEmoji extends React.Component {
    state = {
        showIndex: 0,
    };
    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true);
    }
    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true);
    }
    handleClickOutside = (event) => {
        // ..handling code goes here...
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.props.close();
        }
    };

    // handleClickOutside = (evt) => {
    //     // ..handling code goes here...
    //     console.log("handleClickOutside");
    //     this.props.close();
    // };

    onSelectEmoji = (emoji) => {
        this.props.output(emoji);
    };
    onEmojiModel = async (code) => {
        // const LastEmoji = await keyValueModel.getValueByKey(SupportDBKey.LastEmoji);
        let emojiList = [code];
        const LastEmoji = await keyValueModel.getValueByKey(SupportDBKey.LastEmoji);
        if (LastEmoji) {
            const filter = LastEmoji.filter((item) => item !== code);
            filter.push(code);
            emojiList = filter;
        }
        await keyValueModel.bulkPut(
            [
                {
                    key: SupportDBKey.LastEmoji,
                    val: JSON.stringify(emojiList),
                },
            ],
            SupportDBKey.LastEmoji
        );
    };

    render() {
        const { show, shouldUseDarkColors, position, bodyStyle = {}, lastEmoji, intl } = this.props;

        const { showIndex } = this.state;

        const ls = chunk(emoji_data, 100);
        const indexList = new Array(ls.length).fill(1);
        const emojiList = lastEmoji.map((item) => {
            const k = ls[showIndex].find((i) => i.title == item);
            return k;
        });
        return (
            show && (
                <div
                    ref="container"
                    tabIndex="-1"
                    className={clazz(styles.container, styles.show)}
                    style={{ bottom: `calc(100vh - ${position - 20}px)`, ...bodyStyle }}
                >
                    {emojiList.length > 0 && (
                        <div className={styles.text}>
                            {intl.formatMessage({ id: "recent_use" })}
                        </div>
                    )}
                    {emojiList.length > 0 && (
                        <div className={styles.emojiContainer}>
                            {emojiList.map((item) => {
                                return (
                                    <div
                                        className={styles.emojiItem}
                                        key={item.title}
                                        title={localeFormat({ id: item.title }) || item.title}
                                        onClick={() => {
                                            this.onEmojiModel(item.title);
                                            this.onSelectEmoji(item);
                                        }}
                                    >
                                        <img src={`assets/tmm_emoji/emoji_${item.title}.png`} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {emojiList.length > 0 && (
                        <div className={styles.text}>{intl.formatMessage({ id: "all_emo" })}</div>
                    )}
                    <div className={styles.emojiContainer}>
                        {ls[showIndex].map((item) => {
                            return (
                                <div
                                    className={styles.emojiItem}
                                    key={item.title}
                                    title={localeFormat({ id: item.title }) || item.title}
                                    onClick={() => {
                                        this.onEmojiModel(item.title);
                                        this.onSelectEmoji(item);
                                    }}
                                >
                                    <img src={`assets/tmm_emoji/emoji_${item.title}.png`} />
                                </div>
                            );
                        })}
                    </div>
                    {indexList.length > 1 && (
                        <div className={styles.indicatorContainer}>
                            <div className={styles.indicator}>
                                {indexList.map((val, i) => (
                                    <div
                                        className={classNames({
                                            [styles.selected]: i === showIndex,
                                            [styles.indicatorDot]: true,
                                        })}
                                        key={i}
                                        onClick={() => this.setState({ showIndex: i })}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )
        );
    }
}

@inject((stores) => ({
    lastEmoji: stores.NewSession.lastEmoji,
}))
@observer
export class EmojiPopover extends React.Component {
    state = {
        showIndex: 0,
    };
    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true);
    }
    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true);
    }
    handleClickOutside = (event) => {
        // ..handling code goes here...
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.props.close();
        }
    };
    onSelectEmoji = (emoji) => {
        this.props.output(emoji);
    };
    onEmojiModel = async (code) => {
        // const LastEmoji = await keyValueModel.getValueByKey(SupportDBKey.LastEmoji);
        let emojiList = [code];
        const LastEmoji = await keyValueModel.getValueByKey(SupportDBKey.LastEmoji);
        if (LastEmoji) {
            const filter = LastEmoji.filter((item) => item !== code);
            filter.push(code);
            emojiList = filter;
        }
        await keyValueModel.bulkPut(
            [
                {
                    key: SupportDBKey.LastEmoji,
                    val: JSON.stringify(emojiList),
                },
            ],
            SupportDBKey.LastEmoji
        );
    };
    render() {
        const { show, shouldUseDarkColors, position, bodyStyle = {}, lastEmoji } = this.props;
        const ls = chunk(emoji_data, 100);
        const { showIndex } = this.state;
        const emojiList = lastEmoji.map((item) => {
            const k = ls[showIndex].find((i) => i.title == item);
            return k;
        });
        return (
            emojiList && (
                <div className={styles.emojiPopover}>
                    {emojiList.map((item) => {
                        return (
                            <div
                                className={styles.emojiPopoverItem}
                                key={item.title}
                                title={localeFormat({ id: item.title }) || item.title}
                                onClick={() => {
                                    this.onEmojiModel(item.title);
                                    this.onSelectEmoji(item);
                                }}
                            >
                                <img src={`assets/tmm_emoji/emoji_${item.title}.png`} />
                            </div>
                        );
                    })}
                </div>
            )
        );
    }
}
export default injectIntl(ImageOfEmoji);
