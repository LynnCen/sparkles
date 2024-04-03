// @ts-ignore
import { groupBy, reduce, flatten, sortBy } from "lodash";
import chatModel from "@newSdk/model/Chat";
import { MessageItem } from "@newSdk/service/api/PullMessage";

// @ts-ignore
const update_by_last = async (arr) => {
    const grouped = groupBy(arr, (item: { chat_id: any }) => item.chat_id);
    const chatIDs = Object.keys(grouped);
    const newGrouped = Promise.all(
        chatIDs.map(async (chat) => {
            let lastMsg;
            try {
                lastMsg = await chatModel.getSessionById(chat);
            } catch (e) {
                console.log(e);
            }

            let diffTime = lastMsg ? lastMsg.lastMessage?.displayTime : 0;

            return reduce(
                grouped[chat],
                function (acc: any, cur: MessageItem) {
                    let displayTime = diffTime
                        ? Math.max(diffTime, cur.create_time)
                        : cur.create_time;
                    let res = [
                        ...acc,
                        {
                            ...cur,
                            displayTime,
                        },
                    ];
                    diffTime = displayTime;
                    return res;
                },
                []
            );
        })
    );

    const res = await newGrouped;
    return sortBy(flatten(res), "sequence");
};

export { update_by_last };
