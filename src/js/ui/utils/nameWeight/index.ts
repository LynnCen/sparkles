import { userStatus } from "@newSdk/consts/userStatus";
import localFormat from "utils/localeFormat";
interface info {
    name: String;
    friendAlias?: String;
    alias?: String;
    uid?: String;
    status?: number;
}

export const getNameWeight = (priority: info): String => {
    if (priority.status == userStatus.Deleted) {
        return localFormat({ id: "account_deleted" });
    }
    return priority.friendAlias || priority.alias || priority.name || priority.uid?.slice(-6) || "";
};
