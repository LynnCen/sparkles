import { EditorState, SelectionState } from "draft-js";
import getWordAt from "./getWordsAt";

export default function getSearchText(editorState, selection) {
    const anchorKey = selection.getAnchorKey();
    const anchorOffset = selection.getAnchorOffset() - 1;
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(anchorKey);
    const blockText = currentBlock.getText();

    return getWordAt(blockText, anchorOffset);
}
