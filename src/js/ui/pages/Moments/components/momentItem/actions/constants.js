import {
    DeleteIcon,
    MomentsActionReport,
    DisableIcon,
    LinkIcon,
    HumanIcon,
} from "../../../../../icons";
import localeFormat from "utils/localeFormat";

/**
 * @Author Pull
 * @Date 2021-10-31 11:16
 * @project constants
 */

export const ActionRole = {
    SEND: "send",
    LINK: "link",
    REPORT: "report",
    HIDE: "hide",
    DELETE: "delete",
};

export const ActionAuth = {
    All: "all",
    OWN: "own",
};

export const tabs = [
    {
        label: "sendToFriends",
        auth: ActionAuth.All,
        role: ActionRole.SEND,
        Icon: HumanIcon,
    },
    // {
    //     label: localeFormat({ id: "Copy" }),
    //     auth: ActionAuth.All,
    //     role: ActionRole.LINK,
    //     Icon: LinkIcon,
    // },
    {
        label: "report",
        auth: ActionAuth.All,
        role: ActionRole.REPORT,
        Icon: MomentsActionReport,
    },
    // {
    //     label: "hide his/her post",
    //     auth: ActionAuth.All,
    //     role: ActionRole.HIDE,
    //     Icon: DisableIcon,
    // },
    {
        label: "Delete",
        auth: ActionAuth.OWN,
        role: ActionRole.DELETE,
        Icon: DeleteIcon,
    },
];
