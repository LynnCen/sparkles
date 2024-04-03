export const decThrottle = (timeout = 66) => {
    const pendingSet = new Set();
    let throttleTimer = null;

    return (target, _s, descriptor) => {
        const nativeCall = descriptor.value;

        descriptor.value = (ids) => {
            if (!ids) return;
            if (typeof ids === "string") ids = [ids];
            if (!ids || !ids.length) return;

            if (throttleTimer) clearTimeout(throttleTimer);

            ids.map((id) => pendingSet.add(id));

            throttleTimer = setTimeout(() => {
                throttleTimer = null;
                const idList = Array.from(pendingSet);
                pendingSet.clear();
                nativeCall(idList);
            }, timeout);
        };
    };
};
