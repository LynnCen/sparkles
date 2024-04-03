import getUserListInfo from "@newSdk/service/api/getUserListInfo";

export const getMemberInfoByIdWithThrottle = (() => {
    let throttleTimer: any = null;
    let downloadList: Set<string> = new Set();
    const throttleInterval = 100;

    return (uids: string[]) => {
        uids.forEach((uid) => downloadList.add(uid));

        if (throttleTimer) clearTimeout(throttleTimer);

        throttleTimer = setTimeout(() => {
            const list: string[] = Array.from(downloadList);
            downloadList = new Set();
            throttleTimer = null;
            if (!list.length) return;
            // getGroupInfos(list);
            getUserListInfo(list);
        }, throttleInterval);
    };
})();
