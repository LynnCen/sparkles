import { observable, action } from "mobx";

class OverallUserCard {
    @observable show = false;
    @observable isMyFriend = false;
    @observable user = {};
    @observable config = { top: 30, left: 30 };

    @observable cache = {};

    @action toggle(
        show = self.show,
        user = self.user,
        config = self.config,
        isMyFriend = self.isMyFriend
    ) {
        self.show = show;
        self.user = user;
        self.config = config;
        self.isMyFriend = isMyFriend;
    }

    @action setCache(key, data) {
        self.cache = {
            [key]: data,
        };
    }

    @action onUserInfoUpdate(user) {
        if (self.user && self.user.uid === user.uid) {
            self.user = user;
        }
    }

    @action
    clearCache() {
        self.show = false;
        self.isMyFriend = false;
        self.user = {};
        self.config = { top: 30, left: 30 };
        self.cache = {};
    }
}

const self = new OverallUserCard();
export default self;
