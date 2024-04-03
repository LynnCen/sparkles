import ThemeModal from "components/Tmm_Ant/ThemeModal";
import localeFormat from "utils/localeFormat";
import removeAdmin from "@newSdk/service/api/group/removeAdmin";

export const removeAdminInGroup = (() => {
    let removing = false;

    return (gid: string, name: string, uid: string) => {
        if (removing) return false;
        removing = true;

        ThemeModal.confirm({
            cancelText: localeFormat({ id: "Cancel" }),
            okText: localeFormat({ id: "ConfirmTranslate" }),
            content: localeFormat({ id: "pc_group_admin_out_tip", data: { name } }),
            onOk: async () => {
                try {
                    await removeAdmin(gid, uid);
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

export default removeAdminInGroup;
