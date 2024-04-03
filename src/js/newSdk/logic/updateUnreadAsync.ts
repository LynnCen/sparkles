/**
 * @description: 由于初始化消息时，更新会话未读相对耗时，且未读数不影响主流程，所以切换为异步
 */
import messageModel from "@newSdk/model/Message";
import chatModel from "@newSdk/model/Chat";
import { arrayToMap, getBaseInfoByChatId } from "@newSdk/utils";

export default (() => {
    const collections = new Set<string>();
    let throttle: NodeJS.Timeout | any = null;
    const timeout = 1e3;

    const add = (list: string[]) => list.forEach((id) => collections.add(id));

    const _handleUpdate = async (chatIds: string[]) => {
        const unreadMap: Record<string, number> = {};
        // 串行
        for await (const chatId of chatIds) {
            unreadMap[chatId] = await messageModel.getAllUnReadMsgById(chatId);
        }
        const sessionMap = arrayToMap(await chatModel.getSessionList(), "chatId");
        // const sessionMap = (() => {
        //     const map = new Math
        // })();
        const updateList = [];
        for await (const id of chatIds) {
            const info = sessionMap.get(id);
            if (info) updateList.push({ ...info, unreadCount: unreadMap[id] });
            else {
                const baseInfo = await getBaseInfoByChatId(id);
                updateList.push(
                    chatModel.createNewSession({
                        chatId: id,
                        name: baseInfo.name,
                        unreadCount: unreadMap[id],
                    })
                );
            }
        }
        await chatModel.bulkPutSession(updateList);
    };

    const update = () => {
        if (throttle) clearTimeout(throttle);

        throttle = setTimeout(() => {
            const list = Array.from(collections);
            collections.clear();
            throttle = null;
            _handleUpdate(list);
        }, timeout);
    };

    return {
        add,
        update,
    };
})();
