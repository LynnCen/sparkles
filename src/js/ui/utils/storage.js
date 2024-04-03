export default {
    get: (key) => {
        return new Promise((resolve, reject) => {
            try {
                const keyList = key.split(".");

                let ob = localStorage;
                for (let i = 0, len = keyList.length; i < len; i++) {
                    const key = keyList[i];
                    if (!key) break;
                    const current = ob[key];
                    if (current) {
                        try {
                            ob = JSON.parse(current);
                        } catch (e) {
                            ob = current;
                            break;
                        }
                    } else {
                        ob = current;
                        break;
                    }
                }
                resolve(ob);
            } catch (err) {
                reject(err);
            }
        });
    },

    set: (key, data) => {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    },

    remove: (key) => {
        return new Promise((resolve, reject) => {
            try {
                localStorage.removeItem(key);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    },
};
