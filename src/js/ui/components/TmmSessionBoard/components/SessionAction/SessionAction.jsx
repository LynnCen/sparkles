import React, { Component, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "./styles.less";
import { OutlineClear, DelIcon } from "../../../../icons";
import quitGroup from "@newSdk/service/api/group/quitGroup";
import chat from "../../../../stores_new/chat";
import session from "../../../../stores_new/session";
import { sessionBoardStore } from "components/TmmSessionBoard/sessionBoardStore";
import ThemeModal from "components/Tmm_Ant/ThemeModal";
import { injectIntl, useIntl } from "react-intl";
import clearChatMessage from "@newSdk/logic/message/clearChatMessage";
import { themeMessage } from "components/Tmm_Ant/ThemeMessage";
import { isGroup } from "@newSdk/utils";
import revokeChatMySendMessages from "@newSdk/logic/message/revokeChatMySendMessages";
import getMyGroupList from "@newSdk/logic/group/getMyGroupList";
import { contactsStore } from "../../../../pages/Second/stores";
import ThemeCheckbox from "components/Tmm_Ant/ThemeCheckbox";
import { Checkbox, Modal } from "antd";
import localFormat from "utils/localeFormat";
const modalRef = React.createRef();

export class SessionAction extends Component {
    state = {
        selected: true,
    };
    handleQuitGroup = async () => {
        const { focusSessionId } = session;
        const { intl } = this.props;
        ThemeModal.confirm({
            content: <Content ref={modalRef} />,
            getContainer: false,
            okText: intl.formatMessage({ id: "Confirm" }),
            cancelText: intl.formatMessage({ id: "Cancel" }),
            onOk: async () => {
                try {
                    if (modalRef.current && modalRef.current.checked) {
                        await quitGroup(focusSessionId, true);
                        session.deleteSession(focusSessionId);
                        sessionBoardStore.close();
                        if (session.focusSessionId === focusSessionId && !chat.alreadyKicked)
                            chat.alreadyKicked = true;
                        const res = await clearChatMessage(focusSessionId);
                        if (res) {
                            await chat.clearMessage(focusSessionId);
                        }
                    } else {
                        await quitGroup(focusSessionId);
                        sessionBoardStore.close();
                        if (session.focusSessionId === focusSessionId && !chat.alreadyKicked)
                            chat.alreadyKicked = true;
                    }
                } catch (e) {
                    console.error(`quit group error`, e);
                }
            },
        });
    };

    handleClearMessage = () => {
        const { focusSessionId } = session;
        const { intl } = this.props;
        ThemeModal.confirm({
            content: intl.formatMessage({ id: "WantClearChat" }),
            okText: intl.formatMessage({ id: "Clear" }),
            cancelText: intl.formatMessage({ id: "Cancel" }),
            onOk: async () => {
                try {
                    const res = await clearChatMessage(focusSessionId);
                    if (res) {
                        themeMessage({
                            content: intl.formatMessage({ id: "ChatDeleted" }),
                            duration: 3,
                        });
                        await chat.clearMessage(focusSessionId);
                    }
                } catch (e) {
                    console.error(`clear message error`, e);
                }
            },
        });
    };
    handleDeleteMyMessage = () => {
        const { focusSessionId } = session;
        const { intl } = this.props;
        ThemeModal.confirm({
            content: intl.formatMessage({ id: "RevokeAllMessages" }),
            okText: intl.formatMessage({ id: "Delete" }),
            cancelText: intl.formatMessage({ id: "Cancel" }),
            onOk: async () => {
                try {
                    const res = await revokeChatMySendMessages(focusSessionId);
                    if (res) {
                        themeMessage({
                            content: intl.formatMessage({ id: "momentDeleted" }),
                            duration: 2,
                        });
                    }
                } catch (error) {
                    console.error("Delete message error", error);
                }
            },
        });
    };

    render() {
        const { intl } = this.props;
        const { focusSessionId } = session;
        const group = isGroup(focusSessionId);

        return (
            <section className={styles.box}>
                {[
                    {
                        title: intl.formatMessage({ id: "DeleteFromEveryone" }),
                        Icon: DelIcon,
                        visible: true,
                        handler: this.handleDeleteMyMessage,
                    },
                    {
                        title: intl.formatMessage({ id: "ClearChat" }),
                        Icon: OutlineClear,
                        visible: true,
                        handler: this.handleClearMessage,
                    },
                    {
                        title: intl.formatMessage({ id: "mp_group_out" }),
                        Icon: DelIcon,
                        visible: group,
                        handler: this.handleQuitGroup,
                    },
                ].map(({ title, Icon, visible, handler }) =>
                    visible ? (
                        <section className={styles.item} key={title} onClick={handler}>
                            <span className={styles.icon}>
                                <Icon />
                            </span>
                            <span className={styles.title}>{title}</span>
                        </section>
                    ) : null
                )}
            </section>
        );
    }
}
const Content = forwardRef((props, ref) => {
    const [checked, setChecked] = useState(true);
    function handleCheckChange(checked) {
        setChecked(checked);
    }
    useImperativeHandle(ref, () => ({
        checked,
    }));
    return (
        <div className={styles.Content}>
            <div> {localFormat({ id: "leave_group_tip" })}</div>
            <div className={styles.wrapper}>
                <Checkbox
                    checked={checked}
                    onChange={(e) => handleCheckChange(e.target.checked)}
                    className={styles.Checkbox}
                />
                {localFormat({ id: "delete_con_msg" })}
            </div>
        </div>
    );
});

export default injectIntl(SessionAction);
