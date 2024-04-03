/**
 * @Author Pull
 * @Date 2021-10-14 10:15
 * @project ForwardMoments
 */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { usePostMoment } from "./usePostMoment";
import { Spin, Progress } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./styles.less";
import {
    EditIcon2,
    CloseIconBolder,
    ImageFileIcon,
    MessageFaceIcon,
    VideoStart,
} from "../../../../icons";
import UploadButton from "./com/UploadButton";
import AuthPublishSelector from "./com/AuthPublishSelector";
import EmojiView from "../../../Home/NewChat/components/MessageInput/image_of_emoji";
import { MediaType } from "../../constants/media";
import { injectIntl } from "react-intl";
import { AuthType } from "@newSdk/model/moments/instance/MomentsNormalContent";
import ThemeModal from "components/Tmm_Ant/ThemeModal";
import classNames from "classnames";
import EditorDraft from "components/Editor";
import localeFormat from "utils/localeFormat";
import common from "../../../../stores_new/common";
import { getNameWeight } from "utils/nameWeight";
export const PostMoment = injectIntl(({ intl, defaultTopic = "", handleRefreshMoments }) => {
    const {
        visible,
        show,
        hide,
        inputRef, // 富文本 引用
        emojiVisible, // 表情 模态框
        selectEmoji, // 选择表情
        emojiShow, // 显示表情
        emojiHide, // 隐藏表情
        uploadAble, // 显示上传按钮
        authSelected, // 权限选择回调
        authValue, // 权限值
        mediaList, // 上传媒体资源列表
        handleSelectMedia, // 拖拽上传文件 input -> path
        handleRemoveSelected, // 移除 媒体项
        selectedList, // 权限---> 用户选中
        checkLimit,
        sendAble,
        sending,
        onSubmit, // 发布
    } = usePostMoment(intl.formatMessage, handleRefreshMoments);

    return (
        <Fragment>
            <ThemeModal
                title={intl.formatMessage({ id: "publishTitle" })}
                visible={visible}
                width={600}
                maskStyle={{
                    backgroundColor: "#0006",
                }}
                wrapClassName={`${styles.modal} electron_drag-able`}
                closeIcon={
                    <span onClick={hide}>
                        <CloseIconBolder
                            overlayClass="dark-theme-color_lighter"
                            bodyStyle={{ width: 30, height: 30 }}
                        />
                    </span>
                }
                footer={null}
            >
                <section
                    onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) return handleSelectMedia(file.path);
                    }}
                >
                    {visible && (
                        <section className={styles.input}>
                            {/*<RichTextArea*/}
                            {/*    pasteMediaAble={false}*/}
                            {/*    ref={inputRef}*/}
                            {/*    placeholder="Say something"*/}
                            {/*    overlayClassNames={styles["input-content"]}*/}
                            {/*    parseTopic*/}
                            {/*    checkLimit={checkLimit}*/}
                            {/*/>*/}
                            <EditorDraft
                                placeholder={intl.formatMessage({ id: "saySomething" })}
                                checkLimit={checkLimit}
                                defaultTopic={defaultTopic}
                                ref={inputRef}
                            />
                        </section>
                    )}

                    <section className={styles.media}>
                        {uploadAble && <UploadButton onClick={() => handleSelectMedia()} />}

                        {mediaList.map((item) => (
                            <div
                                className={styles.imgContainer}
                                style={{
                                    cursor:
                                        item.mediaType === MediaType.VIDEO ? "default" : "pointer",
                                }}
                                key={item.key}
                            >
                                <span
                                    className={styles.close}
                                    onClick={() => handleRemoveSelected(item.key)}
                                >
                                    <CloseIconBolder
                                        bodyStyle={{ width: 14, height: 14, color: "#fff" }}
                                    />
                                </span>
                                {item.mediaType === MediaType.VIDEO && (
                                    <Fragment>
                                        <span className={styles.videoIcon}>
                                            <VideoStart />
                                        </span>
                                        <span className={styles.videoDuration}>
                                            00:{`${item.duration}`.padStart(2, "0")}
                                        </span>
                                    </Fragment>
                                )}
                                {item.percent !== undefined && (
                                    <span className={styles.progress}>
                                        {item.percent ? (
                                            <Progress
                                                percent={item.percent}
                                                type="circle"
                                                strokeColor={{
                                                    "0%": "#128fe7",
                                                    "100%": "#00c6db",
                                                }}
                                                width={75}
                                            />
                                        ) : null}
                                    </span>
                                )}

                                <img src={item.local} alt="" />
                            </div>
                        ))}
                    </section>

                    <section className={styles.action}>
                        <div className={styles["user-action"]}>
                            <EmojiView
                                eventTypes="click"
                                show={emojiVisible}
                                close={emojiHide}
                                output={selectEmoji}
                                shouldUseDarkColors={common.shouldUseDarkColors}
                                bodyStyle={{
                                    left: 70,
                                    bottom: 30,
                                    boxShadow: "0px 0px 16px 0px #e9eaf0",
                                }}
                            />
                            <span onClick={() => handleSelectMedia()}>
                                <ImageFileIcon
                                    overlayClass="dark-theme-color_lighter"
                                    bodyStyle={{ marginRight: 40, cursor: "pointer" }}
                                />
                            </span>

                            <span onClick={emojiShow}>
                                <MessageFaceIcon
                                    overlayClassName="dark-theme-color_lighter"
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
                                    {selectedList.length ? (
                                        <aside className={styles["auth-list"]}>
                                            {selectedList.map((item) => (
                                                <img
                                                    // title={item.friendAlias || item.name}
                                                    title={getNameWeight({
                                                        friendAlias: item.friendAlias,
                                                        alias: item.alias,
                                                        name: item.name,
                                                        uid: item.uid,
                                                        status: item.status,
                                                    })}
                                                    className={styles["auth-select-img"]}
                                                    src={item.avatarPath}
                                                    // alt={item.friendAlias || item.name}
                                                    alt={getNameWeight({
                                                        friendAlias: item.friendAlias,
                                                        alias: item.alias,
                                                        name: item.name,
                                                        uid: item.uid,
                                                        status: item.status,
                                                    })}
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
                                )}
                                {intl.formatMessage({ id: "publishTitle" })}
                            </button>
                        </div>
                    </section>
                </section>
            </ThemeModal>

            <aside className={styles.post} onClick={show}>
                <EditIcon2 bodyStyle={{ width: 21, height: 21 }} />
            </aside>
        </Fragment>
    );
});

export default PostMoment;
