/**
 * @Author Pull
 * @Date 2021-05-31 15:27
 * @project emoji
 */
import { Quill } from "react-quill";
const Inline = Quill.import("blots/embed");

class EmojiImage extends Inline {
    static create(value) {
        const node = super.create();
        node.setAttribute("src", value.src);
        node.setAttribute("alt", value.alt);
        node.setAttribute("draggable", "false");
        node.setAttribute("class", "emoji");
        node.setAttribute("data-class", "media-em");
        return node;
    }

    static formats(domNode) {
        return domNode.getAttribute("src");
    }

    static value(node) {
        return {
            src: node.getAttribute("src"),
            alt: node.getAttribute("alt"),
            class: node.getAttribute("class"),
        };
    }
}

EmojiImage.blotName = "Emoji";
EmojiImage.className = "emoji";
EmojiImage.tagName = "img";

export default EmojiImage;
