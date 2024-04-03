import getGroupInfos from "@newSdk/logic/group/getGroupInfos";

export const getGroupInfoByGidWithThrottle = (() => {
    let throttleTimer: any = null;
    let downloadList: Set<string> = new Set();
    const throttleInterval = 100;

    return (gid: string) => {
        downloadList.add(gid);

        if (throttleTimer) clearTimeout(throttleTimer);

        throttleTimer = setTimeout(() => {
            const list: string[] = Array.from(downloadList);
            downloadList = new Set();
            throttleTimer = null;
            if (!list.length) return;
            // getGroupInfos(list);
            getGroupInfos(list);
        }, throttleInterval);
    };
})();
