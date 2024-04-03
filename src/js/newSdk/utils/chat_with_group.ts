// @ts-ignore
import { groupBy, mapValues } from "lodash";
import { Session } from "@newSdk/model/Chat";

const groupChats = (chats: Session[]) => {
    const res = groupBy(chats, (item: Session) => item.chatId.split("_")[0]);

    return mapValues(res, (v: Session[]) => {
        return Array.from(v, (item: Session) => item.chatId);
    });
};

export default groupChats;
