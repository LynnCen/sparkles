import map_data from "../../../pages/Home/NewChat/components/MessageInput/image_of_emoji/emoji";

export default function (rawData) {
    const blocks = rawData.blocks;
    return blocks
        .map((block) => {
            let text = block.text;
            for (let i = 0; i < map_data.length; i++) {
                const regex = new RegExp(map_data[i].unicode, "gi");
                text = text.replace(regex, map_data[i].code);
            }
            return text;
        })
        .join("\n");
}
