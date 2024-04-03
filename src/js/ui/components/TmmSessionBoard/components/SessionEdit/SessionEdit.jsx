import React, { Component, Fragment } from "react";
import { BackIcon2 } from "../../../../icons";
import { sessionBoardStore } from "components/TmmSessionBoard/sessionBoardStore";
import styles from "./styles.less";
import { inject, observer } from "mobx-react";
import Avatar from "components/Avatar";
import GroupAvatarMask from "../SessionInfo/GroupAvatarMask";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { isGroup, isMe } from "@newSdk/utils";
import { getNameWeight } from "utils/nameWeight";
import { Input, message } from "antd";
import localeFormat from "utils/localeFormat";
import updateGroupName from "@newSdk/service/api/group/updateGroupName";
import { chatNameLimitLen } from "utils/chatController/createGroup";
import updateGroupMyAlias from "@newSdk/service/api/group/updateGroupMyAlias";
import updateGroupNotice from "@newSdk/service/api/group/updateGroupNotice";
import ReactDOM from "react-dom";
import GroupInfo from "@newSdk/model/GroupInfo";
const { TextArea } = Input;
const groupRef = React.createRef();
const descriptionRef = React.createRef();
const aliasRef = React.createRef();
@inject((stores) => ({
    getSessionInfo: stores.SessionInfoProxy.getSessionInfo,
    sessionInfoProxy: stores.SessionInfoProxy.sessionInfoProxy,
    focusSessionInfo: stores.NewSession.focusSessionInfo,
    getProxyUserInfoInGroup: stores.UserProxyEntity.getProxyUserInGroupInfo,
    focusSessionId: stores.NewSession.focusSessionId,
}))
@observer
export class SessionEdit extends Component {
    state = {
        groupName: "",
        groupDes: "",
        myAlias: "",
    };
    componentDidMount() {
        const {
            sessionInfoProxy,
            focusSessionInfo,
            getProxyUserInfoInGroup,
            focusSessionId,
        } = this.props;
        let domNode = ReactDOM.findDOMNode(descriptionRef.current);

        if (domNode) {
            domNode.addEventListener("keydown", this.handleUpdateDescription);
        }

        const info = { ...focusSessionInfo, ...sessionInfoProxy(focusSessionId) };
        const myGroupInfo = getProxyUserInfoInGroup(focusSessionId, tmmUserInfo._id);
        this.setState({
            groupName: info.name,
            myAlias: myGroupInfo.alias ? myGroupInfo.alias : myGroupInfo.name,
            groupDes: info.notice,
        });
    }
    editAble = () => {
        const { ownerInfo, adminsInfo } = sessionBoardStore;
        const isAdmin = adminsInfo.find(({ uid }) => uid === tmmUserInfo._id);
        const isOwner = ownerInfo.uid === tmmUserInfo._id;
        if (isOwner || isAdmin) return true;
        return false;
    };
    handleUpdateGroupName = async (e) => {
        let name = e.target.value;
        const { focusSessionInfo, focusSessionId } = this.props;
        if (name.length > chatNameLimitLen) name = name.slice(0, chatNameLimitLen - 2) + "...";
        const res = await updateGroupName(focusSessionId, name);
        if (groupRef.current) groupRef.current.blur();
        this.resPrompt(res);
    };
    handleUpdateDescription = (description) => {
        if (description.keyCode == 13 && description.shiftKey) {
            description.preventDefault();
            this.setState({
                groupDes: this.state.groupDes + "\n",
            });
        } else if (description.keyCode == 13) {
            description.preventDefault();
            let notice = description.target.value;
            const { focusSessionInfo, focusSessionId } = this.props;
            const { chatId } = focusSessionInfo;
            if (!notice.trim()) notice = "";

            if (focusSessionId) {
                const res = updateGroupNotice(focusSessionId, notice);
                if (descriptionRef.current) descriptionRef.current.blur();
                this.resPrompt(res);
            }
        }
    };

    handleChangeMyGroupAlias = (val) => {
        const alias = val.target.value;
        const { focusSessionInfo, focusSessionId } = this.props;
        const { chatId } = focusSessionInfo;
        if (focusSessionId) {
            const res = updateGroupMyAlias(focusSessionId, alias);
            if (aliasRef.current) aliasRef.current.blur();
            this.resPrompt(res);
        }
    };
    resPrompt = (res) => {
        if (!res) return message.warn(localeFormat({ id: "EditFailed" }));
        message.success(localeFormat({ id: "EditSuccessful" }));
    };
    handelBack = () => {
        const { focusSessionInfo, sessionInfoProxy, focusSessionId } = this.props;
        const info = { ...focusSessionInfo, ...sessionInfoProxy(focusSessionId) };
        sessionBoardStore.closeAllMembers();

        if (focusSessionId && info.isNewNotice) {
            GroupInfo.updateGroupInfoById(focusSessionId, {
                isNewNotice: false,
            });
        }
    };
    render() {
        const {
            sessionInfoProxy,
            focusSessionInfo,
            getProxyUserInfoInGroup,
            focusSessionId,
        } = this.props;
        const { groupName, groupDes, myAlias } = this.state;
        const info = { ...focusSessionInfo, ...sessionInfoProxy(focusSessionId) };
        const myGroupInfo = getProxyUserInfoInGroup(focusSessionId, tmmUserInfo._id);
        const group = isGroup(focusSessionId);
        return (
            <section className={styles.sessionEdit}>
                <div className={styles.fullHead}>
                    <div className={styles.back}>
                        <span className={styles.backIcon} onClick={this.handelBack}>
                            <BackIcon2 />
                        </span>
                        <span className={styles.title}>{localeFormat({ id: "mp_edit" })}</span>
                    </div>
                </div>
                <div className={styles.avatarBox}>
                    <div className={styles.avatar}>
                        <Avatar src={info.avatar} size={64} />
                        {group && this.editAble() && (
                            <div className={styles.mask}>
                                <GroupAvatarMask gid={focusSessionId} />
                            </div>
                        )}
                    </div>
                    <aside className={styles.description}>Set New Photo or Video</aside>
                </div>
                {[
                    {
                        title: localeFormat({ id: "mp_group_name" }),
                        placeholder: localeFormat({ id: "group_name_input" }),
                        visible: this.editAble(),
                        defaultValue: info.name,
                        // autoSize: { minRows: 1, maxRows: 1 },
                        onPressEnter: this.handleUpdateGroupName,
                        refs: groupRef,
                        maxLength: 30,
                        value: groupName,
                        style: {
                            border: groupName ? "" : "1px solid red",
                        },
                        onChange: (e) => this.setState({ groupName: e.target.value }),
                    },
                    {
                        title: localeFormat({ id: "mp_info" }),
                        placeholder: localeFormat({ id: "mp_group_info_input" }),
                        visible: this.editAble(),
                        defaultValue: groupDes,
                        autoSize: { minRows: 2, maxRows: 3 },
                        onPressEnter: this.handleUpdateDescription,
                        style: {
                            // height: "48px",
                            border: groupDes ? "" : "1px solid red",
                        },
                        refs: descriptionRef,
                        maxLength: 200,
                        value: groupDes,
                        onChange: (e) => this.setState({ groupDes: e.target.value }),
                        textArea: true,
                    },
                    {
                        title: localeFormat({ id: "group_name" }),
                        visible: true,
                        // autoSize: { minRows: 1, maxRows: 1 },
                        defaultValue: myGroupInfo.alias ? myGroupInfo.alias : myGroupInfo.name,
                        onPressEnter: this.handleChangeMyGroupAlias,
                        refs: aliasRef,
                        maxLength: 10,
                        value: myAlias,
                        style: {
                            border: myAlias ? "" : "1px solid red",
                        },
                        onChange: (e) => this.setState({ myAlias: e.target.value }),
                    },
                ].map(
                    (
                        {
                            title,
                            visible,
                            rows,
                            defaultValue,
                            onPressEnter,
                            style,
                            refs,
                            maxLength,
                            value,
                            onChange,
                            textArea,
                            autoSize,
                            placeholder,
                        },
                        index
                    ) => {
                        return !visible ? null : (
                            <div key={index} className={styles.editGroupBox}>
                                <aside className={styles.editGroupTitle}>{title} </aside>
                                {textArea ? (
                                    <Input.TextArea
                                        className={styles.editGroupInput}
                                        defaultValue={defaultValue}
                                        // onPressEnter={onPressEnter}
                                        bordered={false}
                                        style={style}
                                        allowClear
                                        ref={refs}
                                        maxLength={maxLength}
                                        value={value}
                                        onChange={onChange}
                                        autoSize={autoSize}
                                        placeholder={placeholder}
                                    />
                                ) : (
                                    <Input
                                        className={styles.editGroupInput}
                                        defaultValue={defaultValue}
                                        onPressEnter={onPressEnter}
                                        bordered={false}
                                        style={style}
                                        allowClear
                                        ref={refs}
                                        maxLength={maxLength}
                                        value={value}
                                        onChange={onChange}
                                        placeholder={placeholder}
                                    />
                                )}
                            </div>
                        );
                    }
                )}
            </section>
        );
    }
}
