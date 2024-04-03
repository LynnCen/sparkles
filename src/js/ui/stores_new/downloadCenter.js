/**
 * @Author Pull
 * @Date 2021-08-10 19:16
 * @project downloadCenter
 */

import { action, observable } from "mobx";
import {
    checkCompressCache,
    checkOriginCache,
    createImageCompress,
    writeCompressCache,
    writeOriginCache,
} from "utils/sn_utils";
import CalcSize from "@newSdk/utils/ImageSource";
import getObjectByKey, { getThumb, getFileObject } from "@newSdk/service/api/s3Client/getObject";
import nodeFs from "fs";
import ImageMessageContent from "@newSdk/model/message/ImageMessageContent";

class DownloadCenter {
    /**
     * key => {
     *      path: bool|string,
     *      percent: number,
     *      pendingOb: Promise, 表明正在下载
     *      callbacks: fn[]
     *  }
     *
     */
    @observable cacheCenter = new Map();

    @action setCache = (key, value) => {
        const ob = self.cacheCenter.get(key) || {};
        self.cacheCenter.set(
            key,
            Object.assign(ob, { path: value, callbacks: null, percent: 0, pendingOb: null })
        );
    };

    @action setProgress = (key, percent, callback) => {
        let ob = self.cacheCenter.get(key) || {};
        if (callback) {
            if (!ob.callbacks) ob.callbacks = [];
            ob.callbacks.push(callback);
        }

        // momentsNotification
        if (percent) ob.percent = percent;
        if (ob.callbacks && ob.callbacks.length) ob.callbacks.forEach((item) => item(percent));

        self.cacheCenter.set(key, ob);
    };

    @action setPending = (key, promise) => {
        const ob = self.cacheCenter.get(key) || {};
        self.cacheCenter.set(key, Object.assign(ob, { pendingOb: promise, percent: 0 }));
    };

    @action removeProgressSub = (infos, fn) => {
        const compressKey = self.getCompressKey(infos);
        const compressCache = self.cacheCenter.get(compressKey) || {};
        let callbacks = compressCache.callbacks;

        // check compress callback list
        const res = self.removeSubscribeCallback(callbacks, fn);
        if (res) return;

        // check origin callback list
        const originCacheKey = self.getOriginKey(infos);
        const originCache = self.cacheCenter.get(originCacheKey) || {};
        callbacks = originCache.callbacks;
        self.removeSubscribeCallback(callbacks, fn);
    };

    removeSubscribeCallback = (callbacks, fn) => {
        if (callbacks && callbacks.length) {
            const item = callbacks.findIndex((item) => item === fn);
            if (item !== -1) {
                callbacks.splice(item, 1);
                return true;
            }
        }
        return false;
    };
    getOriginKey = ({ objectId, fileType, bucketId }) => `${objectId}_${fileType}_${bucketId}`;
    getCompressKey = (infos) => {
        const { objectId, width, height, fileType, bucketId } = infos;
        const compressSize = CalcSize.setThumb(width, height);
        return `${objectId}_${compressSize.width}x${compressSize.height}_${fileType}_${bucketId}`;
    };

    async getCompressImage(infos, callback) {
        const { fileType } = infos;
        const compressKey = self.getCompressKey(infos);
        // const originKey = `${objectId}_${fileType}_${bucketId}`;

        const compressCache = self.cacheCenter.get(compressKey);
        // const originCache = self.cacheCenter.get(originKey);

        // gif download
        if (ImageMessageContent.unSupportCompressType.includes(fileType))
            return self.downloadOrigin(infos, callback);

        // other download
        if (compressCache && compressCache.path && nodeFs.existsSync(compressCache.path)) {
            return compressCache.path;
        }

        return self.downloadCompress(infos, callback);
    }

    async downloadCompress(infos, callback) {
        const { objectId, width, height, fileType, bucketId } = infos;
        const compressSize = CalcSize.setThumb(width, height);
        const compressKey = self.getCompressKey(infos);
        let compressCache = self.cacheCenter.get(compressKey);

        // check local cache
        const localPath = await checkCompressCache({
            path: objectId,
            ...compressSize,
            type: fileType,
        });
        if (localPath) {
            self.setCache(compressKey, localPath);
            return localPath;
        }

        // compressCache = self.cacheCenter.get(compressKey);
        // limit
        if (callback) self.setProgress(compressKey, undefined, callback);

        if (compressCache && compressCache.pendingOb) {
            return compressCache.pendingOb;
        }
        // download
        const pr = self.handleDownloadCompress(infos);
        self.setPending(compressKey, pr);

        const res = await pr;
        return res;
    }
    async downloadOrigin(infos, callback, checkCompress = false, downloadOrigin = false) {
        const { objectId, fileType } = infos;
        const originKey = self.getOriginKey(infos);
        const originCache = self.cacheCenter.get(originKey);
        try {
            if (originCache.pendingOb) console.log("originCache", originKey, originCache);
            // 1. check memory cache 检查当前cacheCenter是否已经有了该下载任务
            if (originCache && originCache.path && nodeFs.existsSync(originCache.path))
                return originCache.path;

            // 2. check local cache  cacheCenter中没有该下载任务 则检查本地中是否存在
            const res = await checkOriginCache(objectId, fileType);

            if (res) {
                self.setCache(originKey, res);
                // 判断是否压缩
                if (checkCompress) self.updateCompressAfterOriginDownload(res, infos);
                return res;
            }

            // limit
            if (callback) self.setProgress(originKey, undefined, callback);
            if (originCache && originCache.pendingOb) return originCache.pendingOb;

            const pr = self.handleOriginDownload(infos, checkCompress, downloadOrigin);
            self.setPending(originKey, pr);
            return await pr;
        } catch (e) {
            self.setCache(originKey, false);
            return false;
        }
    }

    async handleDownloadCompress(infos) {
        const { objectId, width, height, fileType, bucketId } = infos;
        const compressSize = CalcSize.setThumb(width, height);
        const compressKey = self.getCompressKey(infos);
        try {
            const resource = await getThumb(
                { filename: objectId, bucketID: bucketId, fileType: fileType },
                compressSize,
                ({ total, loaded }) =>
                    self.setProgress(compressKey, parseInt((loaded / total) * 100 + ""))
            ); // set progress)

            let _path = false;

            if (resource && resource.length) {
                _path = await writeCompressCache(resource, objectId, {
                    ...compressSize,
                    type: fileType,
                });
            }

            self.setCache(compressKey, _path);
            return _path;
        } catch (e) {
            console.error(e);
            self.setCache(compressKey, false);
            return false;
        }
    }
    //downloadOrigin -- download file flag
    async handleOriginDownload(infos, checkCompress, downloadOrigin) {
        const { objectId, fileType, bucketId } = infos;
        const originKey = self.getOriginKey(infos);
        try {
            let source; // file -> savePath  other -> binary

            if (downloadOrigin) {
                source = await getFileObject(
                    { fileType, filename: objectId, bucketID: bucketId },
                    ({ total, loaded }) =>
                        self.setProgress(originKey, parseInt((loaded / total) * 100 + "")) // set progress
                );
            } else {
                source = await getObjectByKey(
                    { fileType, filename: objectId, bucketID: bucketId },
                    ({ total, loaded }) =>
                        self.setProgress(originKey, parseInt((loaded / total) * 100 + "")) // set progress
                );
            }
            // const source = await getObjectByKey(
            //     { fileType, filename: objectId, bucketID: bucketId },
            //     ({ total, loaded }) =>
            //         self.setProgress(originKey, parseInt((loaded / total) * 100 + "")) // set progress
            // );

            let _path = false;
            if (source && downloadOrigin) {
                _path = source;
            } else if (source) {
                const path = await writeOriginCache(source, objectId, fileType);
                if (path) _path = path;
            }
            // if (source) {
            //     const path = await writeOriginCache(source, objectId, fileType);
            //     if (path) _path = path;
            // }
            self.setCache(originKey, _path);

            // check compress update;
            if (checkCompress) self.updateCompressAfterOriginDownload(_path, infos);
            return _path;
        } catch (e) {
            console.error(e);
            self.setCache(originKey, false);
            return false;
        }
    }
    // 下载图片后更新压缩图片
    async updateCompressAfterOriginDownload(buf, infos) {
        const { objectId, width, height, fileType } = infos;
        if (
            !ImageMessageContent.supportType.includes(fileType) ||
            ImageMessageContent.unSupportCompressType.includes(fileType)
        )
            return;
        const compressSize = CalcSize.setThumb(width, height);
        const compressKey = self.getCompressKey(infos);

        let current = self.cacheCenter.get(compressKey);
        if (current && current.path) return;

        let _path = await checkCompressCache({ path: objectId, ...compressSize, type: fileType });
        if (_path) return self.setCache(compressKey, _path);

        // compress
        _path = await createImageCompress({
            source: buf,
            path: objectId,
            ...compressSize,
            type: fileType,
        });
        if (_path) return self.setCache(compressKey, _path);
    }

    @action
    clearCache() {
        self.cacheCenter = new Map();
    }
}

const self = new DownloadCenter();

export default self;
