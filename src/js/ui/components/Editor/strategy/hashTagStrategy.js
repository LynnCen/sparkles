import { findWithRegex } from "components/Editor/utils/findWithRegex";
import map_data from "../../../pages/Home/NewChat/components/MessageInput/image_of_emoji/emoji";
const escapedFind = map_data.map((item) => item.unicode).join("|");

const HASHTAG_REGEX = new RegExp(`#[^\\s@#${escapedFind}]{1,50}\\s`, "gi");

export function hashtagStrategy(contentBlock, callback, contentState) {
    findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}
