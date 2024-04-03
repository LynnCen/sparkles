import map_data from "./emoji";
import React from "react";
import anchorme from "anchorme";

const all_codes = map_data.map((item) => item.re);

function htmlEscape(html, { useTopic = false }) {
    const htmlReg = /[<>"&]/g;
    const htmlWithTopicReg = /(<|>|"|&|#.*?(\s|$))/g;

    const reg = useTopic ? htmlWithTopicReg : htmlReg;
    return (html || "").replace(reg, function (match, pos, originalText) {
        switch (match) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case '"':
                return "&quot;";
            default:
                if (match && match.startsWith("#")) {
                    // 1. 截取最后位 #
                    const strArr = match.split("#");

                    const text = strArr.slice(0, strArr.length - 1);
                    const topic = `${strArr[strArr.length - 1]}`.trim();

                    if (topic.length <= 50 && topic.length >= 1) {
                        return `${text.join(
                            "#"
                        )}<span class="topic" data-tag="topic" data-name="${topic}">#${topic}</span> `;
                    }
                }
                return match;
        }
    });
}

const parse_text = (text, custom_class = "", ops = {}, isCommon = true) => {
    const { toStr = false, formatTopic = false } = ops;
    let s = htmlEscape(text, { useTopic: formatTopic });
    s = anchorme({
        input: s,
        options: {
            attributes: {
                target: "_blank",
            },
            specialTransform: [
                {
                    test: /^(http|https):\/\//,
                    transform: (string) => {
                        // return string;
                        // return `<a href="${decodeURI(string)}">${decodeURI(string)}</a>`;
                        return `<a href="${string}">${string}</a>`;
                    },
                },
            ],
        },
    });
    for (let i = 0; i < all_codes.length; i++) {
        s = s.replace(
            all_codes[i],
            "$#$" + parse_emoji_obj_to_string(map_data[i], custom_class) + "$#$"
        );
    }
    if (!isCommon) {
        s = checkLink(s);
    }
    const res = s.split(/\$\#\$/gm).filter((item) => item);
    return toStr
        ? res.join("")
        : res.map((item, index) => <span key={index} dangerouslySetInnerHTML={{ __html: item }} />);
};

const parse_emoji_obj_to_string = (emoji, custom_class = "") => {
    return `<img class="emoji ${
        custom_class ? custom_class : ""
    }" draggable="false" data-set="isemoji" alt="${emoji.code}" src="assets/tmm_emoji/emoji_${
        emoji.title
    }.png" />`;
};

const checkLink = (s) => {
    if (s.includes("<a") && s.includes("</a>")) {
        let arr = [];
        let count = 0;
        s.split("").forEach((item, index) => {
            if (item === "<") {
                arr.push({ start: index });
            }
            if (item === ">") {
                arr[count].end = index;
                count++;
            }
        });
        let dataArr = arr.reduce((pre, cur, index) => {
            if (index % 2 === 0) {
                return pre.concat([{ error: false, begin: cur }]);
            } else {
                pre[(index - 1) / 2].close = cur;
                return pre;
            }
        }, []);
        const linkRule = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        dataArr.forEach((item) => {
            const linkContent = s.substring(item.begin.end, item.close.start);
            linkRule.test(linkContent) ? (item.error = true) : (item.error = false);
        });
        dataArr = dataArr.filter((item) => {
            return item.error;
        });
        if (dataArr.length) {
            dataArr.forEach((item) => {
                s = s.split("");
                s.splice(item.begin.start, item.begin.end - item.begin.start + 1).splice(
                    item.close.start,
                    item.begin.end - item.close.start + 1
                );
                s = s.join("");
            });
        }
    }
    return s;
};

export { parse_emoji_obj_to_string, parse_text };
