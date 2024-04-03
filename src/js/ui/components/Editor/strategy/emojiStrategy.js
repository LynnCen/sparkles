import map_data from "../../../pages/Home/NewChat/components/MessageInput/image_of_emoji/emoji";
import { findWithRegex } from "components/Editor/utils/findWithRegex";
const escapedFind = map_data.map((item) => item.unicode).join("|");
const search = new RegExp(
    `<object[^>]*>.*?</object>|<span[^>]*>.*?</span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|(${escapedFind})`,
    "gi"
);

export function emojiStrategy(contentBlock, callback, contentState) {
    findWithRegex(search, contentBlock, callback);
}
