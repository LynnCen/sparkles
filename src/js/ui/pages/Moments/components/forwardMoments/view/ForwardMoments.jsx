/**
 * @Author Pull
 * @Date 2021-10-14 10:15
 * @project ForwardMoments
 */
import React from "react";
import { useForward } from "./useForward";
import styles from "./styles.less";
import { MessageFaceIcon, VideoStart } from "../../../../../icons";
import RichTextArea from "components/Editor";
import AuthPublishSelector from "../../postMoments/com/AuthPublishSelector";
import EmojiView from "../../../../Home/NewChat/components/MessageInput/image_of_emoji";
import { parse_text } from "../../../../Home/NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ForwardStore from "../../../store/forwardMoments";
import classNames from "classnames";
import forwardMoments from "../../../store/forwardMoments";
import { useIntl } from "react-intl";

export const ForwardMoments = ({ handleClose, forwardInfo, displayInfo }) => {
    const {
        inputRef, // 富文本 引用
        emojiVisible, // 表情 模态框
        selectEmoji, // 选择表情
        emojiShow, // 显示表情
        emojiHide, // 隐藏表情
        authSelected, // 权限选择回调
        authValue, // 权限值
        setSending, //
        selectedList, // 权限---> 用户选中
        onSubmitWithForwardMoment, // moments 转发
        onSubmitWithShareApplet, // 小程序 分享
        checkLimit,
        sending,
        sendAble,
    } = useForward(forwardInfo, handleClose);

    const { formatMessage } = useIntl();
    const renderMedia = (item) => {
        if (!item) return;
        if (item.percent !== undefined) return <ImageIcon enumType={supportEnumType.DOWNLOADING} />;
        if (item.downloadFail) return <ImageIcon enumType={supportEnumType.DOWNLOAD_FAIL} />;

        return <img className={styles.media} src={item.localPath} alt="" />;
    };

    const onSubmit = async () => {
        if (sending) return;
        setSending(true);

        try {
            if (forwardInfo.actionType === ForwardStore.ActionType.forwardMoment)
                await onSubmitWithForwardMoment();
            if (forwardInfo.actionType === ForwardStore.ActionType.shareApplet)
                await onSubmitWithShareApplet();
        } finally {
            setSending(false);
        }
    };

    const { sendInfo = {}, media } = displayInfo;
    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <section className={styles.input}>
                    <RichTextArea
                        checkLimit={checkLimit}
                        pasteMediaAble={false}
                        ref={inputRef}
                        placeholder={
                            forwardInfo.actionType === forwardMoments.ActionType.shareApplet
                                ? formatMessage({ id: "shareAppletTip" })
                                : "Say something"
                        }
                        overlayClassNames={styles["input-content"]}
                    />
                </section>

                <section className={`${styles.forwardArea} dark-theme-bg_normal`}>
                    {media && <aside className={styles.media}>{renderMedia(media)}</aside>}
                    <article className={styles.article}>
                        <span className={`${styles.name} dark-theme-color_lighter`}>
                            {sendInfo.name}
                        </span>
                        <span className={`${styles.content} dark-theme-color_grey`}>
                            {parse_text(sendInfo.text || "")}
                        </span>
                    </article>
                </section>
                <section className={styles.action}>
                    <div className={styles["user-action"]}>
                        <EmojiView
                            eventTypes="click"
                            show={emojiVisible}
                            close={emojiHide}
                            output={selectEmoji}
                            bodyStyle={{
                                left: 70,
                                bottom: 30,
                                boxShadow: "0px 0px 16px 0px #e9eaf0",
                            }}
                        />
                        <span onClick={emojiShow}>
                            <MessageFaceIcon
                                bodyStyle={{
                                    width: 24,
                                    height: 24,
                                    color: "#0d1324",
                                    cursor: "pointer",
                                }}
                            />
                        </span>
                    </div>
                    <div className={styles["send-action"]}>
                        <aside className={styles["action-auth"]}>
                            <AuthPublishSelector
                                // onLabelClick={handleLabelClick}
                                authSelected={authSelected}
                                authValue={authValue}
                            >
                                {selectedList && selectedList.length ? (
                                    <aside className={styles["auth-list"]}>
                                        {selectedList.map((item) => (
                                            <img
                                                title={item.friendAlias || item.name}
                                                className={styles["auth-select-img"]}
                                                src={item.avatarPath}
                                                alt={item.friendAlias || item.name}
                                            />
                                        ))}
                                    </aside>
                                ) : null}
                            </AuthPublishSelector>
                        </aside>
                        <button
                            className={classNames(styles.send, {
                                [`dark-theme-color_dark dark-theme-bg_light`]: !sendAble,
                            })}
                            disabled={!sendAble}
                            onClick={onSubmit}
                        >
                            {sending && (
                                <Spin
                                    indicator={
                                        <LoadingOutlined
                                            style={{ fontSize: 14, marginRight: 6 }}
                                            spin
                                        />
                                    }
                                />
                            )}{" "}
                            send
                        </button>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default ForwardMoments;
