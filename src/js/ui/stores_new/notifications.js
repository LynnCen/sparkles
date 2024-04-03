import { observable, action } from "mobx";
import { addNewNotification, fetchNotifications } from "@newSdk/logic/moments/notifications";

class Notifications {
    @observable notifications = [];
    @observable counts = 0; // unread

    @action initNotifications(data) {
        notificationsStore.notifications = data;
    }
    @action addNotifications(data) {
        notificationsStore.notifications = notificationsStore.notifications.concat(data);
    }
    @action getNewNotification() {
        fetchNotifications().then(notificationsStore.initNotifications);
    }
    @action clearAllNotifications() {
        notificationsStore.notifications = notificationsStore.notifications.map((item) => {
            return { ...item, is_read: 1 };
        });
        notificationsStore.counts = 0;
    }
    @action setCounts(count) {
        notificationsStore.counts = count;
    }
}

const notificationsStore = new Notifications();
export default notificationsStore;
