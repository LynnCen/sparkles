/**
 * @Author Cen
 * @Date 2022-04-20
 * @project @
 */
import { Quill } from "react-quill";
const Embed = Quill.import("blots/embed");

class AtSpan extends Embed {
    // static name;
    static create(value) {
        const node = super.create(value);
        node.setAttribute("class", "atSpan");
        node.setAttribute("contenteditable", false);
        // node.setAttribute("style", "color: #00C6DB;display:inline-block;height:18px");
        node.setAttribute("data-text", value.uid ? value.uid : value.dataset);
        node.innerText = value.name;
        return node;
    }
    static formats(node) {
        return node.getAttribute("class");
    }
    static value(node) {
        return {
            class: node.getAttribute("class"),
            // style: node.getAttribute("style"),
            dataset: node.dataset.text,
            name: node.innerText,
        };
    }
}

AtSpan.blotName = "AtSpan";
AtSpan.className = "atSpan";
AtSpan.tagName = "p";

export default AtSpan;
