import React from "react";
import { Avatar, Button, message } from "antd";
import ReactQuill, { Quill } from "react-quill";
import EmojiNew from "../../Home/NewChat/components/MessageInput/image_of_emoji";
import mapData from "../../Home/NewChat/components/MessageInput/image_of_emoji/emoji";
import { MessageFaceIcon } from "../../../icons";
import { FormattedMessage } from "react-intl";
import EmojiImage from "../../Home/NewChat/components/MessageInput/EditorBlots/emoji";
import { injectIntl } from "react-intl";

import cs from "./index.less";
import { debounce } from "underscore";
import classNames from "classnames";

Quill.register(EmojiImage);

class Editor extends React.Component {
    state = {
        value: "",
        emojiVisible: false,
        placeholder: "Say Something...",
        isEmpty: true,
        loading: false,
        isOverCount: false,
    };

    modules = {
        toolbar: null,
    };

    onHideEmoji = () => {
        this.setState({ emojiVisible: false });
    };

    formatInput = () => {
        const editor = this.refs.editor.getEditor();
        const { ops } = editor.getContents();

        return ops
            .map((op) => {
                if (!op.insert) return "";

                if (typeof op.insert === "string") {
                    return op.insert;
                }

                if (op.insert.Emoji) {
                    const d = mapData.find((d) => d.title === op.insert.Emoji.alt);
                    return (d && d.code) || "";
                }

                return "";
            })
            .join("")
            .trim();
    };

    insetEmbed = (embed) => {
        const editor = this.refs.editor.getEditor();
        editor.focus();
        const curIndex = editor.getSelection().index;
        editor.insertEmbed(curIndex, "Emoji", {
            src: `assets/tmm_emoji/emoji_${embed.title}.png`,
            alt: embed.title,
        });
        editor.setSelection(curIndex + 1);
    };

    onAddEmoji = (emoji) => {
        this.onHideEmoji();
        this.insetEmbed(emoji);
    };

    onChange = (content, delta, source, editor) => {
        this.setState({
            value: content,
            isEmpty: editor.getLength() === 1,
            isOverCount: editor.getLength() >= 500,
        });
        this.props.onChange && this.props.onChange(content);
    };

    onSend = debounce(() => {
        const { send, intl } = this.props;
        const { loading } = this.state;
        if (loading) return;
        this.setState({ loading: true });
        typeof send === "function" &&
            send(this.formatInput()).finally(() => this.setState({ loading: false, value: "" }));
    }, 500);

    render() {
        const { value, emojiVisible, isEmpty, loading, isOverCount } = this.state;
        const { intl, shouldUseDarkColors } = this.props;
        return (
            <div className={cs.tmm_commenteditor}>
                <EmojiNew
                    close={this.onHideEmoji}
                    output={this.onAddEmoji}
                    show={emojiVisible}
                    bodyStyle={{ bottom: 10 }}
                    shouldUseDarkColors={shouldUseDarkColors}
                />
                <div className={cs.editorwrapper}>
                    <ReactQuill
                        ref="editor"
                        modules={this.modules}
                        value={value}
                        onChange={this.onChange}
                        className={`${cs.tmm_commentInput} dark-theme-color_deppGrey`}
                        placeholder={intl.formatMessage({ id: "saySomething" })}
                    />
                </div>

                <div className={cs.tmm_commentAction}>
                    <i onClick={(e) => this.setState({ emojiVisible: true })}>
                        <MessageFaceIcon
                            overlayClassName="dark-theme-color_lighter"
                            title={<FormattedMessage id="Sticker" />}
                        />
                    </i>
                    <Button
                        type={"primary"}
                        shape={"round"}
                        className={classNames({
                            [`dark-theme-color_dark dark-theme-bg_light`]:
                                isEmpty || isOverCount || loading,
                        })}
                        disabled={isEmpty || isOverCount || loading}
                        onClick={this.onSend}
                    >
                        {intl.formatMessage({ id: "SendOut" })}
                    </Button>
                </div>
            </div>
        );
    }
}

export default injectIntl(Editor);
