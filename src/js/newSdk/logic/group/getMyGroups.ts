import GroupInfo from "@newSdk/model/GroupInfo";

export const getMyGroups = async () => {
    const groups = await GroupInfo.getAllGroups();

    const myGroups = groups.filter((item) => !item.kicked);

    return myGroups;
};
