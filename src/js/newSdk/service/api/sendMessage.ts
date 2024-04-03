import { Message } from "@newSdk/model/Message";
import axios from "@newSdk/service/apiCore/tmmCore";
import MessageStatus from "@newSdk/model/MessageStatus";
import chatModel from "../../model/Chat";
import messageModel from "../../model/Message";
import memberModel, { FriendsStatus } from "@newSdk/model/Members";
import { getSingleChatTarget } from "@newSdk/utils";
import { isSuccess } from "@newSdk/utils/server_util";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
import updateUserInfo from "@newSdk/logic/updateFriendsInfo";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
import DraftModel from "@newSdk/model/draft";
enum SendMessageStatus {
    NotFriendForOther = 100000, // You are not a friend of the other party
    NotMyFriend = 100001, // The other person is not your friend
    StrangerBoth = 100002, // Are not friends
    NotInGroup = 100010, //Not in the group
    UserDeleted = 100011, //User deleted
    ForbidType = 100007, // Prohibited message type
    BlackmailedOther = 100021, //I blackmailed each other
    BlackmailedMe = 100022, // the other blackmailed me
    BlackmailedEachOther = 100023, //Pull each other black
}

/**/
export type sendMessageHooks = {
    resolveHandler?: (message: Message) => void;
    rejectHandler?: (message: Message) => void;
};
export const sendMessage = async (message: Message, hooks?: sendMessageHooks) => {
    const { mid, chatId, content, type, extra } = message;

    const data: any = {
        mid,
        chat_id: chatId,
        content,
        type,
        send_time: message.timestamp || Date.now(),
    };
    if (extra) data.extra = extra;
    await axios({
        url: "/sendMessage",
        method: "post",
        data,
    })
        .then(async (res) => {
            const [message] = await messageModel.getMessagesByMids([mid]);
            message.timestamp = Date.now();

            const {
                data: { err_code, sequence },
            } = res;

            if (err_code) {
                let relationCode = null;
                switch (err_code) {
                    case SendMessageStatus.StrangerBoth:
                        relationCode = FriendsStatus.stranger;
                        break;
                    case SendMessageStatus.NotMyFriend:
                        relationCode = FriendsStatus.strangerForMe_friendsForYou;
                        break;
                    case SendMessageStatus.NotFriendForOther:
                        relationCode = FriendsStatus.friendsForMe_strangerForYou;
                        break;
                    case SendMessageStatus.NotInGroup:
                        MessagePrompt.error(localFormat({ id: "notInGroup" }));
                        break;
                    case SendMessageStatus.UserDeleted:
                        const uid = getSingleChatTarget(message.chatId);
                        getUserListInfo([uid]);
                        MessagePrompt.error(localFormat({ id: "account_deleted" }));
                        break;
                    // case SendMessageStatus.ForbidType:
                    //     MessagePrompt.error(localFormat({ id: "notInGroup" }));
                    //     break;
                    // case SendMessageStatus.BlackmailedOther:
                    //     MessagePrompt.error(localFormat({ id: "notInGroup" }));
                    //     break;
                    // case SendMessageStatus.BlackmailedMe:
                    //     MessagePrompt.error(localFormat({ id: "notInGroup" }));
                    //     break;
                    // case SendMessageStatus.BlackmailedEachOther:
                    //     MessagePrompt.error(localFormat({ id: "notInGroup" }));
                    //     break;
                }
                message.status = MessageStatus.sendFail;
                if (relationCode) {
                    const uid = getSingleChatTarget(message.chatId);
                    if (uid) {
                        message.local = { ...(message.local || {}), notFriends: true };
                        memberModel.updateMemberInfo(uid, { isFriend: relationCode });
                    }
                }
            } else {
                message.status = MessageStatus.sent;
                message.sequence = sequence;
                // messageModel.updateItem(message);
            }

            await chatModel.getSessionById(message.chatId).then((session) => {
                if (session) {
                    let lastSucTime = 0;
                    if (session.lastMessage?.timestamp) {
                        lastSucTime = session.lastMessage.timestamp as number;
                    }

                    message.displayTime = Math.max(lastSucTime, Date.now());
                }
                message.displayTime = Date.now();

                if (!hooks?.resolveHandler || message.status !== MessageStatus.sent)
                    messageModel.updateItem(message);
                // chatModel.updateLastMessage(chatId, message);
                // chatModel.updateSessionById(chatId, {
                //     lastMessage: message,
                //     timestamp: message.timestamp,
                // });
            });

            if (hooks?.resolveHandler) {
                return hooks.resolveHandler(message);
            }
        })
        .catch(async (err) => {
            const [message] = await messageModel.getMessagesByMids([mid]);
            if (hooks?.rejectHandler) return hooks.rejectHandler(message);

            // 消息发送失败，
            if (message.status !== MessageStatus.awaitSend) {
                message.status = MessageStatus.awaitSend;
                // chatModel.updateLastMessage(chatId, message);
                // chatModel.updateSessionById(chatId, {
                //     lastMessage: message,
                //     timestamp: message.timestamp,
                // });
                messageModel.updateItem(message);
            }
        })
        .finally(() => {
            // DraftModel.deleteMsg(chatId);
        });
};
