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
        node.setAttribute("alt", "nativeImg");
        node.setAttribute("draggable", "false");
        node.setAttribute("class", "native-img");
        node.setAttribute("data-width", value.size.width);
        node.setAttribute("data-height", value.size.height);
        node.setAttribute("data-text", value.contentHash);
        node.setAttribute("data-ext", value.ext);
        node.setAttribute("data-size", value.fileSize);
        return node;
    }

    static formats(node) {
        return node.getAttribute("src");
    }

    static value(node) {
        return {
            src: node.getAttribute("src"),
            alt: node.getAttribute("alt"),
            class: node.getAttribute("class"),
            dataset: node.dataset,
        };
    }
}

EmojiImage.blotName = "NativeImg";
EmojiImage.className = "native-img";
EmojiImage.tagName = "img";

export default EmojiImage;
