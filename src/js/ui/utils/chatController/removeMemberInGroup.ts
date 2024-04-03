import ThemeModal from "components/Tmm_Ant/ThemeModal";
import localeFormat from "utils/localeFormat";
import kickOutGroup from "@newSdk/service/api/group/kickOutGroup";

export const removeMemberInGroup = (() => {
    let removing = false;

    return (gid: string, name: string, uid: string) => {
        if (removing) return false;
        removing = true;

        ThemeModal.confirm({
            cancelText: localeFormat({ id: "Cancel" }),
            okText: localeFormat({ id: "ConfirmTranslate" }),
            content: localeFormat({ id: "RemoveGroupMember", data: { name } }),
            onOk: async () => {
                try {
                    await kickOutGroup(gid, [uid]);
                    removing = false;
                } catch (e) {
                    removing = false;
                }
            },
            onCancel: () => {
                removing = false;
            },
        });
    };
})();

export default removeMemberInGroup;
