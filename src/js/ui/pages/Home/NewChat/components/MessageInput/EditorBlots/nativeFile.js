/**
 * @Author Pull
 * @Date 2021-06-15 15:26
 * @project nativeFile
 */
import { Quill } from "react-quill";
const Inline = Quill.import("blots/embed");
import { supportFile } from "../../Message/MessageContent/FileContent/M_FileMessage";
import getTextWidth from "utils/canvas/getTextWidth";
import renderFileName from "utils/dom/renderFileName";
import { getMd5 } from "@newSdk/utils";

export const deleteFlagIdName = "uuid";
class EmojiImage extends Inline {
    static create(value) {
        const node = super.create();
        // const uuid = getMd5("nativeFile", "id");
        // node.setAttribute("src", value.Icon);
        node.setAttribute("alt", "NativeFile");
        node.setAttribute("draggable", "false");
        node.setAttribute("class", "native-file");
        node.setAttribute("data-text", value.text);
        node.setAttribute("data-ext", value.ext);
        node.setAttribute("data-size", value.size);
        node.setAttribute("data-name", value.name);
        // node.setAttribute(`data-${deleteFlagIdName}`, uuid);
        node.setAttribute("contenteditable", false);

        const text = renderFileName(value.name, value.ext);
        node.innerHTML = `<span class="content">
        <img class="img" src="assets/images/filetypes/${
            supportFile[(value.ext || "").toLowerCase()] || "unknown"
        }.png" alt="">
        <span class="name">${text}</span>
        </span>`;
        //         <span class="close" ${deleteFlagIdName}="${uuid}" onclick="console.log('clicked')"></span>
        return node;
    }

    update() {
        console.log("call update");
    }

    static formats(node) {
        return node.getAttribute("src");
    }

    static value(node) {
        return {
            alt: node.getAttribute("alt"),
            class: node.getAttribute("class"),
            dataset: node.dataset,
        };
    }
}

EmojiImage.blotName = "NativeFile";
EmojiImage.className = "native-file";
EmojiImage.tagName = "section";

export default EmojiImage;
