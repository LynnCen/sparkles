import MessageModal from "../model/Message";
import report from "../service/api/reportUnread";
import chatModel from "@newSdk/model/Chat";
import nc, { Event } from "../notification";
import contactsStore from '../../ui/pages/Second/stores'

function reportUnread() {
    let lastReport = 0;
    let throttleTimer: any = null;
    const throttleTimeout = 600;

    const reportFn = async () => {
        try {
            const chats = (await chatModel.getSessionList(
                (item) => !item.isMute && !item.hide && !!item.unreadCount && item.unreadCount > 0
            )) || [];
            // console.log(chats,'--------------------------');
            const unreadChats = chats.filter(item => item.hideInfo?.seq !== item.lastMessage?.sequence) || []
            // console.log(unreadChats,'---------------------->>>>');


            const count = unreadChats
                // .filter((chat) => !chat?.isMute && chat.unreadCount)
                .reduce((sum, cur) => {
                    if (cur.unreadCount) {
                        return sum + cur.unreadCount;
                    }
                    return sum;
                }, 0);

            // if (count != null) {
            // if (count === lastReport) return;
            lastReport = count;

            // 获取最新的一条消息
            const l = chats.sort((s1, s2) => {
                const { lastMessage: msg1 } = s1;
                const { lastMessage: msg2 } = s2;

                return msg2!.timestamp - msg1!.timestamp;
            });
            nc.publish(Event.UnreadCountUpdate, { unreadCount: count, msg: l[0] });
            return report(count);
            // }
        } catch (e) {
            console.log(e);
        }
    };

    return () => {
        if (throttleTimer) clearTimeout(throttleTimer);
        throttleTimer = setTimeout(() => {
            throttleTimer = null;
            return reportFn();
        }, throttleTimeout);
    };
}
const rp = reportUnread();
export default rp;
