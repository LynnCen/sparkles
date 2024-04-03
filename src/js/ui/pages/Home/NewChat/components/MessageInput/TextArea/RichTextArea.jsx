/**
 * @Author Pull
 * @Date 2021-10-18 13:45
 * @project RichTextArea
 */
import ReactQuill, { Quill } from "react-quill";
import EmojiImage from "../EditorBlots/emoji";
import AtSpan from "../EditorBlots/atspan";
import NativeImg from "../EditorBlots/nativeImg";
import NativeFile, { deleteFlagIdName } from "../EditorBlots/nativeFile";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    useMemo,
    Fragment,
} from "react";
import { device, MsgTools } from "utils/tools";
import useEffectOnce from "../../../../../../hooks/useEffectOnce";
import { ipcRenderer, popMenu } from "../../../../../../../platform";
import localeFormat from "utils/localeFormat";
import { clipboard } from "electron";
import { localTextTransform } from "../editor";
import { parse_emoji_obj_to_string } from "../image_of_emoji/emoji_helper";
import { readImageFromClipboard, readLocalPathFromClipboard } from "utils/clipboard/helper";
import { createFileCache, createImageCache } from "utils/sn_utils";
import sizeOf from "image-size";
import { Mb } from "utils/file/helper";
import nodeFs from "fs";
import nodePath from "path";
import { message } from "antd";
import FileIcon from "images/send_file_img.png";
import file_type from "@newSdk/utils/file_type";
import mime from "mime-types";
import emojiMapData from "../image_of_emoji/emoji";
import { arrayToMap } from "@newSdk/utils";
import { limitGifMb, limitFileMb, limitImageMb } from "utils/file/sendDropFile";
import { fileModalStore } from "components/TmmFileListModal/fileModalStore";
import ImageMessageContent from "@newSdk/model/message/ImageMessageContent";
import { generateVideoInfo } from "utils/file/generateVideoInfo";
import handleLocalMedia from "utils/file/uploadFile";
import CheckableTag from "antd/lib/tag/CheckableTag";
import usePreviousInput from "./usePreviousInput";
import { sessionBoardStore } from "components/TmmSessionBoard/sessionBoardStore";
import { useIntl } from "react-intl";

const Delta = Quill.import("delta");
const parchment = Quill.import("parchment");
Quill.register(AtSpan);
Quill.register(EmojiImage);
Quill.register(NativeImg);
Quill.register(NativeFile);

export const CusQuillBlockName = {
    EMOJI: "Emoji",
    IMAGE: "NativeImg",
    FILE: "NativeFile",
};
//
const MediaOpt = {
    ImgType: [".png", ".jpg", ".gif", ".jpeg", ".bmp", ".webp"],
    ImgSize: limitImageMb,
    dir: false,
    gifLimit: limitGifMb,
    fileLimit: limitFileMb,
};
export const RichTextArea = forwardRef(
    (
        {
            overlayContainerClassName,
            overlayClassNames,
            // onPasted,
            onEnter,
            pasteMediaAble = true,
            parseTopic = false,
            checkLimit = () => {},
            sortDraftMessage,
            ...nativeProps
        },
        ref
    ) => {
        const QuillRef = useRef(null);
        const [input, setInput] = useState("");
        const prevInput = usePreviousInput(input);

        const { formatMessage } = useIntl();
        useImperativeHandle(
            ref,
            () => ({
                _quill: QuillRef.current,
                insertCustomNode,
                clearTextArea,
                getFormatContent,
                selectEmojiWithImg,
                handleDeleteText,
                insertText,
                recursionEmojiText,
            }),
            [QuillRef.current, insertCustomNode]
        );
        useEffect(() => {
            checkLimitCharLength();
            checkLastAt();
        }, [input]);

        // const onKeyDownHandler = (e) => {
        //     // 粘贴
        //     if ((e.ctrlKey || (device.isMac() && e.metaKey)) && e.keyCode === 86) {
        //         return onPasted && onPasted();
        //     }
        // };
        const checkLastAt = async () => {
            const _Quill = getQuillInstance();
            const index = (_Quill.getSelection(true) && _Quill.getSelection(true).index) || 0;
            const text = _Quill.getText();
            const lastText = _Quill.getText(index - 1, 1);
            if (lastText == "@" && text) {
                // ("匹配最后一个@");
                if (!sessionBoardStore.viewAtList) await sessionBoardStore.openAt();
            } else {
                await sessionBoardStore.closeAt();
            }
        };
        const checkAt = async (range, context) => {
            insertText("@");
            // console.log("弹起@列表");
            if (!sessionBoardStore.viewAtList) await sessionBoardStore.openAt();
        };
        const clearTextArea = async () => {
            setInput("");
            if (sessionBoardStore.viewAtList) await sessionBoardStore.closeAt();
        };

        // 过滤粘贴文本，清除样式
        const handleCustomMatcher = (input, delta) => {
            let ops = [];
            delta.ops.forEach((op) => {
                if (op.insert && typeof op.insert === "string") {
                    if (op.insert.startsWith("#") && parseTopic) {
                        ops.push({
                            insert: op.insert,
                            attributes: { color: op.attributes && op.attributes.color },
                        });
                    } else {
                        ops.push({
                            insert: op.insert,
                        });
                    }
                } else if (op.insert && typeof op.insert === "object") {
                    // blob type el
                    const keys = Object.keys(op.insert);
                    if (keys.includes("Emoji")) {
                        ops.push({
                            insert: {
                                Emoji: op.insert["Emoji"],
                            },
                        });
                    } else if (keys.includes("AtSpan")) {
                        ops.push({
                            insert: {
                                AtSpan: op.insert["AtSpan"],
                            },
                        });
                    }
                }
            });
            delta.ops = ops;
            return delta;
        };

        const checkLimitCharLength = () => {
            const _Quill = getQuillInstance();
            const length = _Quill.getLength();
            const text = _Quill.getText();
            checkLimit(length, text);
        };
        const getQuillInstance = () => {
            const editor = QuillRef.current;

            if (!editor) return false;

            const _Quill = editor.getEditor();
            if (!_Quill) return false;

            return _Quill;
        };

        const insertCustomNode = (name, ops) => {
            const _Quill = getQuillInstance();
            if (!_Quill) return false;

            const index = (_Quill.getSelection(true) && _Quill.getSelection(true).index) || 0;
            _Quill.insertEmbed(index, name, ops, "user");
            const _index = (_Quill.getSelection(true) && _Quill.getSelection(true).index) || 0;
            _Quill.setSelection(_index + 1);
        };

        const insertHtml = (text) => {
            const _Quill = getQuillInstance();
            if (!_Quill) return false;

            const index = (_Quill.getSelection(true) && _Quill.getSelection(true).index) || 0;
            _Quill.pasteHTML(index, text);
        };

        const insertText = (text) => {
            const _Quill = getQuillInstance();
            if (!_Quill) return false;
            const index = (_Quill.getSelection(true) && _Quill.getSelection(true).index) || 0;

            _Quill.insertText(index, text);
        };

        // past --》
        const handleSyntaxClipboard = async () => {
            if (!pasteMediaAble) {
                // only support text;
                const text = clipboard.readText();
                if (text.trim()) return insertText(text);
            }

            // 1.1 local system file copy
            const local = readLocalPathFromClipboard();

            if (local) {
                return _handleLocalFile(local);
            }

            // 1.2 img copy, screenshot
            const info = await readImageFromClipboard();
            if (info) return _handleMediaSource(info, true);

            // 2. finally check text

            // const html = clipboard.readHTML();
            // if (html) {
            //     console.log(`insert html`, html);
            //     return insertHtml(html);
            // }
            const text = clipboard.readText();
            // emojiMapData
            if (text.trim()) {
                if (text) recursionEmojiText(text);
                // const withoutEmojiText = text.replace(/\[.*?\]/gim, (match) => {
                //     // console.log(text.length, text.indexOf(match));
                //     const index = text.indexOf(match);
                //     const emoji = emojiMap.get(match);
                //     if (!emoji) return match;

                //     // 插入表情
                //     selectEmojiWithImg(emoji, index);
                //     return "";
                // });
                // if (withoutEmojiText.trim()) return insertText(withoutEmojiText);
            }
        };

        const _handleLocalFile = async (local) => {
            const item = await handleLocalMedia(local);
            if (item) {
                fileModalStore.open([item]);
            }
        };
        const recursionEmojiText = (text) => {
            if (!text) return;
            const emojiMap = arrayToMap(emojiMapData, "code");
            // array  the match string is the  0 indexof array -> matchEmoji[0] = first match emoji string
            const matchEmoji = text.match(/\[.*?\]/);
            if (!matchEmoji) return insertText(text);
            const emoji = emojiMap.get(matchEmoji[0]);
            const indexEmoji = text.indexOf(matchEmoji[0]);
            // slice emojiText such as this -> "preText (first match emoji string)  lastText"
            const preText = text.slice(0, indexEmoji);
            const lastText = text.slice(indexEmoji + matchEmoji[0].length, text.length);
            //insert the preText
            if (preText.trim()) insertText(preText);
            //insert the first match emoji string
            // judge is emoji or another match strs which such as （^(?!http)[A-Za-z\u4e00-\u9fa5]+[\u4E00-\u9FA5A-Za-z\:\_\.\-\d]*$）
            if (emoji) {
                selectEmojiWithImg(emoji);
            } else {
                insertText(matchEmoji[0]);
            }
            //judge the lastText wheather include the match emoji string
            // if true recursion call the recursionEmojiText
            // if false insertText lastText
            if (lastText.match(/\[.*?\]/gim)) {
                recursionEmojiText(lastText);
            } else {
                insertText(lastText);
            }
        };
        const _handleMediaSource = async (info, isImage) => {
            if (isImage) {
                const { compressPath, originPath, size, contentHash, ext, fileSize, name } = info;
                const localPath = compressPath || originPath;
                console.log({
                    type: fileModalStore.MEDIA_TYPE.Image,
                    dataset: {
                        localPath: localPath,
                        width: size.width,
                        height: size.height,
                        name: name || nodePath.basename(localPath),
                        objectId: contentHash,
                        ext: ext || nodePath.extname(localPath),
                        size: fileSize,
                    },
                });
                fileModalStore.open([
                    {
                        type: fileModalStore.MEDIA_TYPE.Image,
                        dataset: {
                            localPath: localPath,
                            width: size.width,
                            height: size.height,
                            name: name || nodePath.basename(localPath),
                            objectId: contentHash,
                            ext: ext || nodePath.extname(localPath),
                            size: fileSize,
                        },
                    },
                ]);
            } else {
                const { size, name, ext, text, localPath } = info;
                const isVideo = file_type.isVideo(ext);
                if (isVideo) {
                    // 生成poster
                    const { duration, poster, posterFullPath } = await generateVideoInfo(localPath);
                    return fileModalStore.open([
                        {
                            type: fileModalStore.MEDIA_TYPE.Video,
                            dataset: {
                                size,
                                name,
                                ext,
                                duration,
                                poster,
                                localPath,
                                objectId: text,
                                posterFullPath,
                            },
                        },
                    ]);
                }

                fileModalStore.open([
                    {
                        type: fileModalStore.MEDIA_TYPE.File,
                        dataset: {
                            size,
                            name,
                            ext,
                            objectId: text,
                        },
                    },
                ]);
            }
        };

        // 富文本 文档片段 类型分类
        const _composeContent = (ops) => {
            const range = [];
            let prevType;
            let section = [];

            ops.forEach(({ insert, attributes }) => {
                let type = "";
                if (
                    typeof insert === "string" ||
                    Object.keys(insert).includes("Emoji") ||
                    Object.keys(insert).includes("AtSpan")
                ) {
                    type = "text";
                    if (prevType === type) {
                        section.push(insert);
                    } else {
                        section = [insert];
                    }
                    prevType = type;
                } else {
                    type = "block";
                    if (prevType !== type && section.length) {
                        range.push(section);
                    }
                    range.push([insert]);
                    section = [];
                }

                prevType = type;
            });

            if (section.length) range.push(section);
            return range;
        };

        // 获取当前所有内容
        const getFormatContent = () => {
            const _Quill = getQuillInstance();
            if (!_Quill) return;

            try {
                // rich editor content
                const { ops } = _Quill.getContents();

                return _composeContent(ops);
            } catch (e) {
                console.error("error", e);
            }
        };

        const onContextMenu = () => {
            const templates = [
                {
                    label: localeFormat({ id: "Copy" }),
                    // click: this.handleCopySelect,
                    role: "copy",
                    key: "Copy",
                },
                {
                    label: localeFormat({ id: "Paste" }),
                    click: handleSyntaxClipboard,
                    // role: "paste",
                    key: "Paste",
                },
                {
                    label: localeFormat({ id: "SelectAll" }),
                    // click: this.handleCopyAll,
                    role: "selectAll",
                    key: "SelectAll",
                },
            ];

            popMenu(templates);
        };

        // 表情选择
        const selectEmojiWithImg = (emoji) => {
            const elStr = parse_emoji_obj_to_string(emoji);
            const tpl = document.createElement("template");
            tpl.innerHTML = elStr;
            const emojiNode = tpl.content.childNodes[0];
            const src = emojiNode.getAttribute("src");
            const alt = emojiNode.getAttribute("alt");
            insertCustomNode("Emoji", { src, alt });
        };

        //
        const handleEnter = () => {
            // 发送
            if (sessionBoardStore.viewAtList) return;
            if (onEnter) {
                onEnter();
                setInput("");
            }
        };
        const handleDeleteText = (index, length, source) => {
            const _Quill = getQuillInstance();
            if (!_Quill) return;
            const _index = (_Quill.getSelection(true) && _Quill.getSelection(true).index) || 0;
            _Quill.deleteText(_index, 1);
        };
        const onChange = (content, delta, source, editor) => {
            const contents = getFormatContent();
            // console.log(contents.flat(1));
            // const firstStr = contents.flat(1)[0].split("")[0];
            // console.log(firstStr == "\n");
            sortDraftMessage(content);
            setInput(content);
        };
        const handleUpAndDown = () => {
            if (sessionBoardStore.viewAtList) return false;
            return true;
        };
        const modules = useMemo(() => {
            return {
                toolbar: null,
                keyboard: {
                    bindings: {
                        enter: {
                            key: 13,
                            shiftKey: false,
                            handler: handleEnter,
                        },

                        cv: {
                            key: 86,
                            shortKey: true,
                            handler: handleSyntaxClipboard,
                        },
                        at: {
                            key: 50,
                            shiftKey: true,
                            handler: checkAt,
                        },
                        up: {
                            key: 38,
                            shiftKey: false,
                            handler: handleUpAndDown,
                        },
                        down: {
                            key: 40,
                            shiftKey: false,
                            handler: handleUpAndDown,
                        },
                    },
                },
                clipboard: {
                    matchers: [[Node.TEXT_NODE, handleCustomMatcher]],
                },
            };
        }, []);
        return (
            <Fragment>
                <section
                    onContextMenu={onContextMenu}
                    className={overlayContainerClassName}
                    // onClick={handleCapturePop}
                >
                    <ReactQuill
                        modules={modules}
                        className={overlayClassNames}
                        ref={QuillRef}
                        onChange={onChange}
                        value={input}
                        placeholder={formatMessage({ id: "InputPlaceholder" })}
                        // onKeyDown={onKeyDownHandler}
                        {...nativeProps}
                    />
                </section>
            </Fragment>
        );
    }
);

export default RichTextArea;
