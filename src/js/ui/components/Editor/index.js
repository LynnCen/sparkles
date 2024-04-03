import React, { forwardRef } from "react";
import Draft, { Modifier } from "draft-js";
import map_data from "../../pages/Home/NewChat/components/MessageInput/image_of_emoji/emoji";
import addEmoji from "components/Editor/modifiers/addEmoji";
import transformToText from "components/Editor/utils/transformToText";
import cx from "./styles.less";
import attachImmutableEntitiesToEmojis from "./modifiers/attachImmutableEntitiesToEmojis";

import { emojiStrategy } from "components/Editor/strategy/emojiStrategy";
import { hashtagStrategy } from "components/Editor/strategy/hashTagStrategy";

const {
    CompositeDecorator,
    Editor,
    EditorState,
    convertToRaw,
    RichUtils,
    convertFromHTML,
    ContentState,
} = Draft;

const Emoji = (props) => {
    const { decoratedText, children } = props;
    const backgroundImage = `url(assets/tmm_emoji/emoji_${
        map_data.find((item) => item.unicode === decoratedText).title
    }.png)`;
    return (
        <span className={cx.media} style={{ backgroundImage }} data-offset-key={props.offsetKey}>
            <span style={{ clipPath: "circle(0% at 50% 50%)" }}>{children}</span>
        </span>
    );
};

const HashtagSpan = (props) => {
    return (
        <span className={cx.hashtag} data-offset-key={props.offsetKey}>
            {props.children}
        </span>
    );
};
const compositeDecorator = new CompositeDecorator([
    {
        strategy: hashtagStrategy,
        component: HashtagSpan,
    },
    {
        strategy: emojiStrategy,
        component: Emoji,
    },
]);

class EditorDraft extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(compositeDecorator),
        };

        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.selectEmojiWithImg = this._confirmMedia.bind(this);
        this.getFormatContent = () => {
            const content = this.state.editorState.getCurrentContent();
            return transformToText(convertToRaw(content)) || "";
        };
        this.focus = () => this.refs.editor.focus();

        this.onChange = (editorState) => {
            const content = editorState.getCurrentContent();
            const rawText = transformToText(convertToRaw(content)) || "";
            this.props.checkLimit && this.props.checkLimit(rawText.length, rawText);
            // console.log(attachImmutableEntitiesToEmojis(editorState));
            this.setState({ editorState: attachImmutableEntitiesToEmojis(editorState) });
        };

        this.onAddTopic();
        this.props.forwardRef.current = this;
    }

    componentDidMount() {
        this.focus();
    }

    onAddTopic = () => {
        const { defaultTopic } = this.props;
        if (defaultTopic) {
            const contentState = ContentState.createFromText(`#${defaultTopic} `);
            const withTopicContent = EditorState.createWithContent(
                contentState,
                compositeDecorator
            );
            const newEditorState = EditorState.push(
                withTopicContent,
                Modifier.insertText(
                    withTopicContent.getCurrentContent(),
                    withTopicContent.getSelection(),
                    " "
                ),
                "insert-fragment"
            );
            this.state = {
                editorState: EditorState.moveFocusToEnd(newEditorState),
            };
        }
    };

    insertText = (text) => {
        const { editorState } = this.state;
        const contentState = ContentState.createFromText(text);
        const newEditorState = EditorState.push(editorState, contentState, "insert-characters");

        const rawText = transformToText(convertToRaw(newEditorState.getCurrentContent())) || "";
        this.props.checkLimit && this.props.checkLimit(rawText.length, rawText);
        this.setState({
            editorState: EditorState.moveFocusToEnd(newEditorState),
        });
    };

    clearTextArea = () => {
        this.setState({ editorState: EditorState.createEmpty(compositeDecorator) });
    };

    _confirmMedia(selected) {
        const { editorState } = this.state;
        const newEditorState = addEmoji(editorState, selected);
        this.setState(
            {
                editorState: newEditorState,
            },
            () => {
                setTimeout(() => this.focus(), 0);
            }
        );
    }

    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    render() {
        return (
            <div className={cx.container}>
                <div className={cx.inner} onClick={this.focus}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        placeholder={this.props.placeholder || "Write something..."}
                        handleKeyCommand={this.handleKeyCommand}
                        ref="editor"
                        spellCheck={true}
                    />
                </div>
            </div>
        );
    }
}

export default forwardRef((props, ref) => <EditorDraft {...props} forwardRef={ref} />);
