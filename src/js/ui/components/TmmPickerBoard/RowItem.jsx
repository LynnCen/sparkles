import React, { Component } from "react";
import styles from "./styles.less";
import { Checkbox } from "antd";
import { pickerStore } from "components/TmmPickerBoard/pickerStore";
import { observer, inject } from "mobx-react";
import UserInfo from "components/UserInfo";
import Avatar from "components/Avatar";
import { getNameWeight } from "utils/nameWeight";
import ThemeCheckbox from "components/Tmm_Ant/ThemeCheckbox";
import { isGroup } from "@newSdk/utils";
import { userStatus } from "@newSdk/consts/userStatus";
import localFormat from "utils/localeFormat";
/**
 * @typedef {Object} IProps
 * @property { string } type
 * @property { Object } info
 * @property { boolean } selected
 */

/**
 * @extends {React.Component<IProps}
 */
@inject((stores) => ({
    getSessionInfo: stores.SessionInfoProxy.getSessionInfo,
    sessionInfoProxy: stores.SessionInfoProxy.sessionInfoProxy,

    proxyUserBaseInfo: stores.UserProxyEntity.getUserInfo,
    getProxyUserBaseInfo: stores.UserProxyEntity.getProxyUserBaseInfo,
}))
@observer
export class RowItem extends Component {
    componentDidMount() {
        const { type, info } = this.props;
        // 用户信息
        if (type === pickerStore.TabEnum.Contacts) {
            this.props.proxyUserBaseInfo(info.id);
        } else if (type === pickerStore.TabEnum.GroupMembers) {
            this.props.proxyUserBaseInfo(info.uid);
        } else {
            let chatId = "";
            if (type === pickerStore.TabEnum.Groups) {
                chatId = info.id;
            }
            if (type === pickerStore.TabEnum.Recent) {
                chatId = info.chatId;
            }

            if (chatId) {
                this.props.getSessionInfo(chatId);
            }
        }
    }

    renderAvatar(combineInfos) {
        const { type } = this.props;
        // 用户信息
        if (combineInfos.avatarPath) return combineInfos.avatarPath;
        if (combineInfos.avatar) return combineInfos.avatar;
        // if (type === pickerStore.TabEnum.Contacts) {
        //     return combineInfos.avatarPath;
        // } else if (type === pickerStore.TabEnum.GroupMembers) {
        //     return combineInfos.avatarPath;
        // } else {
        //     // 会话信息
        //     return combineInfos.avatar;
        // }
    }

    renderName(combineInfos) {
        const { type } = this.props;
        // 用户信息
        if (type === pickerStore.TabEnum.Contacts) {
            return getNameWeight({
                friendAlias: combineInfos.friendAlias,
                alias: combineInfos.alias,
                name: combineInfos.name,
                uid: combineInfos.uid,
                status: combineInfos.status,
            });
        } else {
            // 会话信息
            if (isGroup(combineInfos.chatId)) return combineInfos.name;
            return getNameWeight({
                friendAlias: combineInfos.friendAlias,
                alias: combineInfos.alias,
                name: combineInfos.name,
                uid: combineInfos.uid,
                status: combineInfos.status,
            });
        }
    }
    renderLightingName(keyords, search, className) {
        const regExp = new RegExp(`${search}`, "i");
        let newStr = keyords.replace(regExp, `<span style='color:#00C6DB;'>$&</span>`);
        let html = { __html: newStr };
        return <span dangerouslySetInnerHTML={html} className={className} />;
    }

    combineInfo = () => {
        const { type, info } = this.props;
        let base = {};
        // 用户信息
        if (type === pickerStore.TabEnum.Contacts) {
            base = this.props.getProxyUserBaseInfo(info.id);
        } else if (type === pickerStore.TabEnum.GroupMembers) {
            base = this.props.getProxyUserBaseInfo(info.uid);
        } else {
            // 会话信息
            // pickerStore.TabEnum.Groups
            // pickerStore.TabEnum.Recent
            let chatId = "";
            if (type === pickerStore.TabEnum.Groups) {
                chatId = info.id;
            }
            if (type === pickerStore.TabEnum.Recent) {
                chatId = info.chatId;
            }
            if (chatId) {
                base = this.props.sessionInfoProxy(chatId);
            }
        }
        return { ...info, ...base };
    };

    handleCheckChange = (flag) => {
        const { type: tabType, info } = this.props;
        const combineInfos = this.combineInfo();
        if (flag) {
            return pickerStore.updateSelect({
                tabType: pickerStore.forward ? "Forward" : tabType,
                baseInfo: info,
                selectedInfo: {
                    avatar: this.renderAvatar(combineInfos),
                    name: this.renderName(combineInfos),
                    type: pickerStore.forward ? "Forward" : tabType,
                    id: tabType === pickerStore.TabEnum.GroupMembers ? info.uid : info.id,
                },
            });
        }

        const uuid = pickerStore.getUUKey(tabType, info);
        return pickerStore.removeSelect(uuid, info);
    };
    render() {
        const { selected, type, info } = this.props;
        const combineInfos = this.combineInfo();
        // const filterManagerGroup =
        //     combineInfos.status === userStatus.Deleted && type === pickerStore.TabEnum.GroupMembers;
        const filterManagerGroup = combineInfos.status === userStatus.Deleted;
        return filterManagerGroup ? null : (
            <div className={styles.rowItem}>
                <article className={styles.left}>
                    <div className={styles.avatar}>
                        <Avatar src={this.renderAvatar(combineInfos)} size={32} />
                    </div>
                    {pickerStore.searchText ? (
                        <div className={styles.serach}>
                            {this.renderLightingName(
                                info.title,
                                pickerStore.searchText,
                                styles.serachTitle
                            )}
                            {info.subTitle ? (
                                <div className={styles.subTitle}>
                                    <span className={styles.prefix}>
                                        {localFormat({ id: info.subTitle.prefix })}:
                                    </span>
                                    {this.renderLightingName(
                                        info.subTitle.suffix,
                                        pickerStore.searchText,
                                        styles.suffix
                                    )}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <span className={styles.name}>{this.renderName(combineInfos)}</span>
                    )}
                </article>
                <aside className={styles.right}>
                    <ThemeCheckbox
                        checked={selected}
                        onChange={(e) => this.handleCheckChange(e.target.checked)}
                    />
                </aside>
            </div>
        );
    }
}

export default RowItem;
