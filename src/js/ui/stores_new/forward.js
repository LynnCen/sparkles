/**
 * @Author Pull
 * @Date 2021-07-28 10:01
 * @project forward
 */
import { observable, action, computed } from "mobx";
import { getSingleChatTarget, createSingleChatId } from "@newSdk/utils/index";
import sessionStore from "./session";
import contactsStore from "./contacts";
import UserInfo from "@newSdk/model/UserInfo";
import _ from "lodash";
import parseMessage from "@newSdk/model/message/_utils_parseMessage";
import { sendMessage } from "@newSdk/service/api/sendMessage";
import chatStore from "./chat";
import sessionInfoProxy from "./sessionInfoProxy";
import { OfficialServices } from "@newSdk/index";

class Forward {
    @observable visible = false;
    @observable recentList = [];
    @observable contactsList = [];
    @observable groupList = [];

    @observable forwardMessage = null;

    @observable isSearch = false;
    @observable search = "";

    @observable sending = false;

    modalPromise = null;

    @computed get selectedList() {
        return _.unionBy(self.contactsList, self.recentList, self.groupList, "id").filter(
            (item) => item.isSelect
        );
    }

    @computed get searchList() {
        const { search } = self;
        if (!search) return [];

        const recent = self.recentList.map((item) => {
            const info = sessionInfoProxy.sessionInfoProxy(item.chatId) || {};
            return {
                ...item,
                ...info,
                avatarPath: info.avatar,
            };
        });

        return _.unionBy(self.contactsList, recent, self.groupList, "id").filter((item) =>
            `${item.friendAlias}_${item.name}`.includes(search)
        );
    }

    @action
    async open(message) {
        self.visible = true;
        self.forwardMessage = message;

        const sevenDayLimit = Date.now() - 1000 * 60 * 60 * 24 * 7;
        self.recentList = sessionStore.sortSessionAsideByRule
            .filter(
                (item) =>
                    item.timestamp &&
                    item.timestamp >= sevenDayLimit &&
                    !OfficialServices.includes(getSingleChatTarget(item.chatId))
            )
            .map((item) => ({
                ...item,
                isSelect: false,
                avatarPath: item.avatar,
                recent: true,
                id: item.chatId.startsWith("s_") ? getSingleChatTarget(item.chatId) : item.chatId,
            }));

        self.contactsList = (await contactsStore.getFriends()).map((item) => ({
            ...item,
            isSelect: false,
        }));

        self.groupList = (await contactsStore.getGroupInfo()).map((item) => ({
            ...item,
            isSelect: false,
        }));

        return new Promise((resolve) => (self.modalPromise = resolve));
    }

    @action
    close(flag = false) {
        self.visible = false;
        self.recentList = [];
        self.contactsList = [];
        self.groupList = [];
        self.forwardMessage = null;
        self.sending = false;
        self.isSearch = false;
        self.search = "";
        console.log("---> effect", flag);
        self.modalPromise && self.modalPromise(flag);
    }

    @action
    input(search) {
        if (search.length) self.isSearch = true;
        else self.isSearch = false;

        self.search = search;
    }

    @action
    changeSelectState(id, flag) {
        const item = self.recentList.find((item) => item.id === id);
        if (item) item.isSelect = flag;

        // session
        if (id.startsWith("g_")) {
            const itemsOfGroup = self.groupList.find((item) => item.id === id);
            if (itemsOfGroup) itemsOfGroup.isSelect = flag;
        } else {
            // contracts
            const itemsOfContacts = self.contactsList.find((item) => item.id === id);
            if (itemsOfContacts) itemsOfContacts.isSelect = flag;
        }
    }

    async handleForward() {
        if (self.sending) return false;
        self.sending = true;
        try {
            self.selectedList.map(({ id }) => {
                let chatId = "";
                if (id.startsWith("g_")) chatId = id;
                else chatId = createSingleChatId(id, UserInfo._id);
                const message = parseMessage(self.forwardMessage);
                message.chatId = chatId;
                // console.log(message);
                if (chatId) {
                    return chatStore.sendMessage(message);
                }
            });
            self.close(true);
        } catch (e) {
            console.error(e);
        } finally {
            self.sending = false;
        }
    }

    select(id) {
        self.changeSelectState(id, true);
    }

    cancelSelect(id) {
        self.changeSelectState(id, false);
    }

    @action
    clearCache() {
        self.close();
    }
}

const self = new Forward();

export default self;
