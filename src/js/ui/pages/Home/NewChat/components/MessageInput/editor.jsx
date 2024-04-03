/**
 * @Author Pull
 * @Date 2021-05-31 10:50
 * @project editor
 */
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { ipcRenderer, isElectron } from "../../../../../../platform";
import clazz from "classnames";
import { inject, observer } from "mobx-react";
import styles from "./style.less";
import EmojiNew from "./image_of_emoji";
import { popMenu } from "../../../../../../platform";
import { parse_emoji_obj_to_string, parse_text } from "./image_of_emoji/emoji_helper";
import { injectIntl, FormattedMessage } from "react-intl";
import { parser1 as emojiParse } from "../../../../../utils/emoji";
import { isGroup, createMessageId } from "@newSdk/utils";
import { encode } from "@newSdk/utils/messageFormat";

import {
    AttachmentIcon,
    MessageFaceIcon,
    MessageSendIcon,
    MulSelectCloseIcon,
    DelIcon,
} from "../../../../../icons";
import helper from "../../../../../utils/helper";
import MessageType from "@newSdk/model/MessageType";
import sizeOf from "image-size";
import { createImageCache, createFileCache } from "utils/sn_utils";
import { sessionBoardStore } from "components/TmmSessionBoard/sessionBoardStore";
import mime from "mime-types";
import { message, Popover } from "antd";
import { MsgTools, device } from "utils/tools";
import FileIcon from "images/send_file_img.png";
import file_type from "@newSdk/utils/file_type";
import { writeFileToLocalIfAbsent, getFileType, getFilename } from "utils/fs_helper";
import VideoUpload from "./videoUpload";
import { clipboard } from "electron";
import { render } from "react-dom";
import TextMessageContent from "@newSdk/model/message/TextMessageContent";
import AtMessageContent from "@newSdk/model/message/AtMessageContent";
import draftTable from "@newSdk/model/draft";
import AttachmentMessageContent from "@newSdk/model/message/AttachmentMessageContent";
import ImageMessageContent from "@newSdk/model/message/ImageMessageContent";
import VideoMessageContent from "@newSdk/model/message/VideoMessageContent";
import UserInfoModel from "@newSdk/model/UserInfo";
import Edit from "images/icons/send.png";
import ThemePopover from "components/Tmm_Ant/ThemePopover";
import RichTextArea from "./TextArea/RichTextArea";
import getBasicBucketInfo from "@newSdk/logic/getBasicBucketInfo";
import { limitFileMb, limitFileSize } from "utils/file/sendDropFile";
import classes from "./style.less";
import { fileModalStore } from "components/TmmFileListModal/fileModalStore";
import nodePath from "path";
import delMessage from "@newSdk/service/api/message/delMessage";
import rootStyles from "../../style.less";
import ThemeModal from "components/Tmm_Ant/ThemeModal";
import classNames from "classnames";
import { handleFileMedia } from "utils/file/uploadFile";
import AtSessionMember from "components/TmmSessionBoard/components/AtSessionMember/AtSessionMember";
import onClickOutside from "react-onclickoutside";
import { AT_ALL, AT_CONTENT_U, AT_CONTENT_T } from "@newSdk/model/message/AtMessageContent";
import DraftModel from "@newSdk/model/draft";
import { getNameWeight } from "utils/nameWeight";
import quoteStore from "../quote/quoteStore";
import UiEventCenter, { UiEventType } from "utils/sn_event_center";
import { EmojiPopover } from "./image_of_emoji";
// Tag: newSdk

const richTextAreaRef = React.createRef();

@inject((stores) => ({
    sendMessage: stores.NewChat.sendMessage,
    insertDraftDb: stores.NewChat.insertDraftDb,
    focusSessionId: stores.NewSession.focusSessionId,
    insertTempNode: stores.NewChat.insertTempNode,
    commonStore: stores.Common,
    isShowSelect: stores.NewChat.isShowSelect,
    toggleShowSelect: stores.NewChat.toggleShowSelect,
    resetMsgIdsWillDelete: stores.NewChat.resetMsgIdsWillDelete,
    msgIdsWillDelete: stores.NewChat.msgIdsWillDelete,
    viewAtList: stores.SessionBoardStore.viewAtList,
    focusSessionInfo: stores.NewSession.focusSessionInfo,
    focusDraftInfo: stores.NewSession.focusDraftInfo,
    getProxyUserInfoInGroup: stores.UserProxyEntity.getProxyUserInGroupInfo,
    lastEmoji: stores.NewSession.lastEmoji,
}))
@observer
class MessageInput extends React.Component {
    state = {
        emojiInfo: { emojiVisible: false, pageY: 0 },
        sending: false,
    };

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.focusSessionId !== this.props.focusSessionId) return { reset: true };
        else return {};
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { focusDraftInfo } = this.props;
        if (snapshot.reset) {
            try {
                const _Quill = this.getQuillInstance();
                if (_Quill) {
                    richTextAreaRef.current && (await richTextAreaRef.current.clearTextArea());
                    await this.insertDraftMsg();
                    _Quill.root.focus();
                }
            } catch (e) {
                console.error("rich editor focus error", e);
            }
        }
    }

    componentDidMount() {
        this.insertDraftMsg();
        ipcRenderer.on("compress-end", this.handleCapture);
        ipcRenderer.on("currentWindow-focus", this.InputFocus);
        UiEventCenter.on(UiEventType.INPUT_FOCUS, this.handleForce);
        // document.querySelector("#root").addEventListener("click", this.handleForce);

        // document.addEventListener("click", this.handleClickOutside, true);
    }

    componentWillUnmount() {
        ipcRenderer.off("compress-end", this.handleCapture);
        UiEventCenter.off(UiEventType.INPUT_FOCUS, this.handleForce);
        // document.querySelector("#root").removeEventListener("click", this.handleForce);

        // document.removeEventListener("click", this.handleClickOutside, true);
    }
    handleClickOutside = (event) => {
        // ..handling code goes here...
        const domNode = ReactDOM.findDOMNode(this);

        if (!domNode || !domNode.contains(event.target)) {
            console.log("handleClickOutside");
        }
    };
    InputFocus = () => {
        const _Quill = this.getQuillInstance();
        if (_Quill) _Quill.root.focus();
    };
    insertDraftMsg = async () => {
        const {
            focusSessionInfo,
            focusSessionId,
            getProxyUserInfoInGroup,
            intl: { formatMessage },
        } = this.props;
        const _Quill = this.getQuillInstance();
        if (_Quill) {
            richTextAreaRef.current && (await richTextAreaRef.current.clearTextArea());
            _Quill.root.focus();
        }
        try {
            if (focusSessionInfo && focusSessionInfo.draft) {
                const { draft } = focusSessionInfo;
                const { type, content } = draft;
                if (type === MessageType.AtMessage) {
                    Array.from(content.items, (it, index) => {
                        let atValue = "";
                        if (it.t === AT_CONTENT_U) {
                            atValue =
                                it.v == AT_ALL
                                    ? formatMessage({ id: "AtMentionAll" })
                                    : getNameWeight(getProxyUserInfoInGroup(focusSessionId, it.v));
                            this.hanldeAtMember(it.v, atValue);
                        } else if (it.t === AT_CONTENT_T) {
                            if (richTextAreaRef.current)
                                richTextAreaRef.current.recursionEmojiText(it.v);
                        }
                    });
                } else if (type === MessageType.TextMessage) {
                    if (richTextAreaRef.current)
                        richTextAreaRef.current.recursionEmojiText(content.text);
                }
            }
        } catch (error) {
            console.log(error, "insertDraftMsg");
        }
    };
    handleForce = () => {
        const _Quill = this.getQuillInstance();
        if (_Quill) {
            const _index = (_Quill.getSelection(true) && _Quill.getSelection(true).index) || 0;
            _Quill.root.focus();
            _Quill.setSelection(_index);
        }
    };

    handleCapture = async (e, { isImage, isFile, ...info }) => {
        const { compressPath, originPath, size, contentHash, ext, fileSize } = info;

        const localPath = compressPath || originPath;

        fileModalStore.open([
            {
                type: fileModalStore.MEDIA_TYPE.Image,
                dataset: {
                    localPath,
                    width: size.width,
                    height: size.height,
                    objectId: contentHash,
                    name: nodePath.basename(localPath),
                    ext,
                    size: fileSize,
                },
            },
        ]);
    };

    getQuillInstance = () => {
        // const editor = this.refs.quill;
        const editor = richTextAreaRef.current && richTextAreaRef.current._quill;

        if (!editor) return false;

        const _Quill = editor.getEditor();
        if (!_Quill) return false;

        return _Quill;
    };

    handleClose = () => {
        this.setState({ emojiInfo: { emojiVisible: false, pageY: 0 } });
    };

    selectEmojiWithImg = (emoji) => {
        if (richTextAreaRef.current) {
            richTextAreaRef.current.selectEmojiWithImg(emoji);
            // this.setState({ emojiVisible: false, pageY: 0 });
            this.setState({ emojiInfo: { emojiVisible: false, pageY: 0 } });
        }
    };

    onSend = async () => {
        const { getFormatContent, clearTextArea } = richTextAreaRef.current || {};
        const { focusSessionId: chatId } = this.props;

        if (getFormatContent) {
            this.setState({ sending: true });
            try {
                const content = getFormatContent();
                if (content) {
                    clearTextArea();
                    await this.sendMultiMessage(content);
                }
            } catch (e) {
                console.error("error", e);
            } finally {
                DraftModel.deleteMsg(chatId);
                this.setState({ sending: false });
            }
        }
    };

    // 消息类型分类
    sendMultiMessage = async (content) => {
        for await (const fragment of content) {
            const isAtSpan = fragment.find((it) => {
                if (it instanceof Object && Object.keys(it).includes("AtSpan")) return true;
            });
            let message;
            if (isAtSpan && isGroup(this.props.focusSessionId)) {
                message = await this.handleSendAt(fragment);
            } else {
                message = await this.handleSendText(fragment);
            }
            this.props.sendMessage(message);
            // if (typeof el === "string" || Object.keys(el).includes("Emoji")) {
            //     await this.handleSendText(fragment);
            // } else if (Object.keys(el).includes("AtSpan") && isGroup(this.props.focusSessionId)) {
            //     await this.handleSendAt(fragment);
            // }
        }
    };
    sortDraftMessage = async () => {
        const { getFormatContent, clearTextArea } = richTextAreaRef.current || {};
        const { focusSessionId: chatId, focusDraftInfo } = this.props;
        if (getFormatContent) {
            try {
                const draftInfoDb = await draftTable.getMsg(chatId);
                const content = getFormatContent();
                if (content) {
                    for await (const fragment of content) {
                        const isAtSpan = fragment.find((it) => {
                            if (it instanceof Object && Object.keys(it).includes("AtSpan"))
                                return true;
                        });
                        let message;
                        if (isAtSpan && isGroup(this.props.focusSessionId)) {
                            message = await this.handleSendAt(fragment);
                        } else {
                            message = await this.handleSendText(fragment);
                        }
                        if (message) {
                            return await this.props.insertDraftDb(message);
                        } else if (draftInfoDb && draftInfoDb.extra && quoteStore.isQuote) {
                            return await this.props.insertDraftDb({
                                chatId,
                                type: 1,
                            });
                        } else if (!message && draftInfoDb && !draftInfoDb.extra) {
                            await DraftModel.deleteMsg(chatId);
                        }
                    }
                }
            } catch (e) {
                console.error("error", e);
            }
        }
    };
    // send
    handleSendText = async (textRange) => {
        const {
            intl: { formatMessage },
            focusSessionId: chatId,
        } = this.props;
        let text = "";
        textRange.forEach((item) => {
            if (typeof item === "string") text += item;
            else {
                // emoji
                const { alt } = item[`Emoji`];
                text += helper.HTMLDecode(alt);
            }
        });

        text = text.replace(/[\r\n]+$/g, "");
        if (!text.length) return;

        if (text.length > 2000) {
            ipcRenderer.send("debounce");
            // todo
            return this.props.insertTempNode({
                type: "error",
                message: formatMessage({ id: "textMessageTooLong" }),
            });
        }

        const message = new TextMessageContent(chatId, { text });
        return message;
        // this.props.sendMessage(message);
    };
    handleSendAt = async (textRange) => {
        const {
            intl: { formatMessage },
            focusSessionId: chatId,
        } = this.props;
        let itemArr = [];
        textRange.forEach((item) => {
            if (typeof item === "string") {
                itemArr.push({
                    t: AT_CONTENT_T,
                    v: item.replace(/[\r\n]+$/g, ""),
                });
            } else if (Object.keys(item).includes("AtSpan")) {
                // emoji
                const { dataset } = item[`AtSpan`];
                itemArr.push({
                    t: AT_CONTENT_U,
                    v: dataset.replace(/[\r\n]+$/g, ""),
                });
            } else if (Object.keys(item).includes("Emoji")) {
                const { alt } = item[`Emoji`];
                itemArr.push({
                    t: AT_CONTENT_T,
                    v: helper.HTMLDecode(alt).replace(/[\r\n]+$/g, ""),
                });
            }
        });
        const message = new AtMessageContent(chatId, itemArr);
        return message;
        // this.props.sendMessage(message);
    };
    handleDeleteSelected = () => {
        const {
            msgIdsWillDelete,
            toggleShowSelect,
            resetMsgIdsWillDelete,
            intl,
            focusSessionId,
        } = this.props;
        // try {
        ThemeModal.confirm({
            cancelText: intl.formatMessage({ id: "Cancel" }),
            okText: intl.formatMessage({ id: "Delete" }),
            content: intl.formatMessage({ id: "DeleteConfirmMsg" }),
            onOk: async () => {
                await delMessage(msgIdsWillDelete);
                toggleShowSelect(false);
                resetMsgIdsWillDelete();
                message.success({ content: intl.formatMessage({ id: "Deleted" }), duration: 2 });
            },
        });
        //     this.setState({ loading: true });
        //     this.state.modelOfConfirm.update({ okButtonProps: { loading: true } });
        //     //
        //     message.config({
        //         getContainer: () => document.querySelector(`.${rootStyles.msginfo}`),
        //     });
        //
        //     toggleShowSelect(false);
        //     resetMsgIdsWillDelete();
        // } catch (e) {
        //     console.log(e);
        // } finally {
        //     this.state.modelOfConfirm.update({ okButtonProps: { loading: false } });
        //     this.state.modelOfConfirm.destroy();
        // }
    };

    handleCancelSelected = () => {
        this.props.toggleShowSelect(false);
        this.props.resetMsgIdsWillDelete();
    };

    handleUploadFile = async (files) => {
        const {
            intl: { formatMessage },
        } = this.props;
        for (const file of files) {
            const f = await handleFileMedia(file.path, true);
            if (f) fileModalStore.open([f]);
        }

        this.refs.uploader.value = "";

        // const isVideo = file_type.isVideo(extension);
        // file upload
        // if (file.size > limitFileSize)
        //     return message.error(
        //         formatMessage(
        //             {
        //                 // id: isVideo ? "videoLimitSizeMb" : "fileLimitSizeMb",
        //                 id: "fileLimitSizeMb",
        //             },
        //             { size: limitFileMb }
        //         )
        //     );
        //
        // const { text, name, ext, size } = await createFileCache(file.path);
        // this.handleSendFile({ dataset: { text, name, ext, size } });
    };
    hanldeAtMember = async (uid, name) => {
        const _Quill = this.getQuillInstance();
        if (!_Quill) return;
        const _index = (_Quill.getSelection(true) && _Quill.getSelection(true).index) || 0;
        const lastText = _Quill.getText(_index - 1, 1);
        if (lastText == "@") _Quill.deleteText(_index - 1, 1);
        richTextAreaRef.current.insertCustomNode("AtSpan", {
            name: ` @${name} `,
            uid,
        });
    };
    render() {
        const {
            isShowSelect,
            focusSessionId,
            msgIdsWillDelete,
            viewAtList,
            lastEmoji,
        } = this.props;
        const { emojiInfo } = this.state;
        const {
            intl: { formatMessage },
        } = this.props;
        const group = isGroup(focusSessionId);
        return (
            <React.Fragment>
                {group && viewAtList ? (
                    <AtSessionMember
                        hanldeAtMember={this.hanldeAtMember}
                        group={group}
                        viewAtList={viewAtList}
                    />
                ) : null}

                <section className={styles.editorContainer}>
                    <aside className={styles.left}>
                        <span
                            className={classNames(styles.icon, styles.leftIcon)}
                            onClick={() =>
                                isShowSelect
                                    ? this.handleCancelSelected()
                                    : this.refs.uploader.click()
                            }
                        >
                            {isShowSelect ? (
                                <MulSelectCloseIcon bodyStyle={{ width: 20, height: 20 }} />
                            ) : (
                                <AttachmentIcon />
                            )}
                        </span>
                    </aside>
                    <article className={styles.center}>
                        {isShowSelect ? (
                            `${msgIdsWillDelete.length} selected`
                        ) : (
                            <RichTextArea
                                overlayContainerClassName={styles.container}
                                pasteMediaAble
                                ref={richTextAreaRef}
                                onEnter={this.onSend}
                                sortDraftMessage={this.sortDraftMessage}
                            />
                        )}
                    </article>

                    <aside className={styles.right} data-t={isShowSelect}>
                        {isShowSelect ? (
                            <Fragment>
                                <span
                                    onClick={this.handleDeleteSelected}
                                    className={classNames(styles.icon, styles.delIcon)}
                                >
                                    <DelIcon bodyStyle={{ width: 20, height: 20 }} />
                                </span>
                            </Fragment>
                        ) : (
                            <Fragment>
                                {!emojiInfo.emojiVisible && lastEmoji.length > 0 ? (
                                    <ThemePopover
                                        placement="topRight"
                                        content={
                                            <EmojiPopover
                                                close={this.handleClose}
                                                output={this.selectEmojiWithImg}
                                            />
                                        }
                                        title={null}
                                        mouseEnterDelay={0.6}
                                        mouseLeaveDelay={0.6}
                                    >
                                        <span
                                            className={styles.emoji}
                                            onClick={(e) => {
                                                e.nativeEvent.stopImmediatePropagation();
                                                sessionBoardStore.closeAt();
                                                this.setState({
                                                    emojiInfo: {
                                                        emojiVisible: !this.state.emojiInfo
                                                            .emojiVisible,
                                                        pageY: e.pageY,
                                                    },
                                                });
                                            }}
                                        >
                                            <MessageFaceIcon />
                                        </span>
                                    </ThemePopover>
                                ) : (
                                    <span
                                        className={styles.emoji}
                                        onClick={(e) => {
                                            e.nativeEvent.stopImmediatePropagation();
                                            sessionBoardStore.closeAt();
                                            this.setState({
                                                emojiInfo: {
                                                    emojiVisible: !this.state.emojiInfo
                                                        .emojiVisible,
                                                    pageY: e.pageY,
                                                },
                                            });
                                        }}
                                    >
                                        <MessageFaceIcon />
                                    </span>
                                )}
                                {/* <ThemePopover
                                    placement="topRight"
                                    content={
                                         (
                                            <EmojiPopover
                                                close={this.handleClose}
                                                output={this.selectEmojiWithImg}
                                            />
                                        ) 
                                    }
                                    title={null}
                                    mouseEnterDelay={0.6}
                                >
                                    <span
                                        className={styles.emoji}
                                        onClick={(e) => {
                                            e.nativeEvent.stopImmediatePropagation();
                                            sessionBoardStore.closeAt();
                                            this.setState({
                                                emojiInfo: {
                                                    emojiVisible: !this.state.emojiInfo
                                                        .emojiVisible,
                                                    pageY: e.pageY,
                                                },
                                            });
                                        }}
                                    >
                                        <MessageFaceIcon />
                                    </span>
                                </ThemePopover> */}

                                <ThemePopover
                                    placement="topRight"
                                    content={
                                        <div
                                            // specify string to bold
                                            dangerouslySetInnerHTML={{
                                                __html: `${formatMessage({
                                                    id: "SendPopver",
                                                }).replace(
                                                    formatMessage({ id: "Enter" }),
                                                    formatMessage({ id: "Enter" }).bold()
                                                )}${formatMessage({
                                                    id: "NextLinePopver",
                                                }).replace(
                                                    formatMessage({ id: "ShiftAndEnter" }),
                                                    formatMessage({ id: "ShiftAndEnter" }).bold()
                                                )}`,
                                            }}
                                        />
                                    }
                                    title={null}
                                    mouseEnterDelay={0.6}
                                >
                                    <aside className={styles.send} onClick={this.onSend}>
                                        <MessageSendIcon />
                                    </aside>
                                </ThemePopover>
                            </Fragment>
                        )}
                    </aside>

                    <EmojiNew
                        eventTypes="click"
                        close={this.handleClose}
                        output={this.selectEmojiWithImg}
                        show={emojiInfo.emojiVisible}
                        position={emojiInfo.pageY}
                    />

                    <input
                        onChange={(e) => this.handleUploadFile(e.target.files)}
                        multiple
                        ref="uploader"
                        style={{
                            display: "none",
                        }}
                        type="file"
                    />
                </section>
            </React.Fragment>
        );
    }
}

export default injectIntl(MessageInput);

export const localTextTransform = (text) => {
    // to react node
    const a = parse_text(text);
    // render dom
    let div = document.createElement("div");
    const Tem = () => <div>{a}</div>;
    render(<Tem />, div);
    // get html str
    const htmlStr = div.innerHTML;
    div = null;
    return htmlStr;
};
