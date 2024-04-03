/**
 * @Author Pull
 * @Date 2021-10-23 14:38
 * @project mediaDownloadProxy
 */
import { observable, action, computed } from "mobx";
import { getThumb, getObjectByKey } from "@newSdk/service/api/s3Client/getObject";
import {
    writeCompressCache,
    checkOriginCache,
    writeOriginCache,
    checkCompressCache,
} from "utils/sn_utils";
import clipUtils from "@newSdk/utils/ImageSource";
import ImageMessageContent from "@newSdk/model/message/ImageMessageContent";
import { DefaultCompressSize, MediaType } from "../constants/media";
import { lo } from "pinyin/data/dict-zi-web";
import { CropImgBizType } from "@newSdk/base/consts";

class MediaDownloadProxy {
    @observable downloadList = {};

    preDownloadList = {};
    throttleInterval = 40;
    throttleTimer = null;

    @computed get getProxyInfo() {
        const cache = self.downloadList;

        return (item) => {
            if (!item || Object.keys(item).length === 0) return item || {};
            const key = self.getDownloadKey(item);
            return { ...cache[key] } || item;
        };
    }

    @action setDownloadItem = (item) => {
        if (!item) return;
        const key = self.getDownloadKey(item);

        if (!key.length) return;
        // 检查是否已在队列中, 下载失败的触发重试
        const exist = self.downloadList[key];
        if ((exist && !exist.downloadFail) || self.preDownloadList[key]) return;
        if (!self.preDownloadList[key]) {
            self.preDownloadList[key] = item;
            self.preDownloadList = { ...self.preDownloadList };
        }
    };

    // 下载开始跟新
    @action startDownload(item) {
        const key = self.getDownloadKey(item);
        const i = self.downloadList[key];
        // console.log(item.objectId, item);
        if (!i) {
            const nItem = { ...item };
            nItem.percent = 0;
            // console.log(nItem);

            self.downloadList[key] = nItem;
        }
    }

    // 下载 成功 更新
    @action downloadSuccess(key, path) {
        const item = self.downloadList[key];
        // console.log(item.objectId, item);
        if (item) {
            item.localPath = path;
            // console.log("download success", item.momentsId, { ...item });
            delete item.percent;
            self.downloadList = { ...self.downloadList };
        }
    }

    // 视频下载 poster 成功
    @action updateVideoPosterPath(key, posterPath) {
        const item = self.downloadList[key];

        if (item) {
            item.posterLocalPath = posterPath;
            self.downloadList = { ...self.downloadList };
        }
    }

    // 下载失败
    @action downloadFail(key) {
        const item = self.downloadList[key];
        // console.log(, item.momentsId);
        // console.log("download fail", item.objectId, item);
        if (item) {
            delete item.percent;
            // console.log("download fail", item.momentsId, { ...item });
            item.downloadFail = true;
            self.downloadList = { ...self.downloadList };
        }
    }

    getDownloadKey = (item) => {
        const { bucketId, objectId, format } = item;
        if (!bucketId || !objectId || !format) {
            console.error("invalid media item");
            return "";
        }
        return `${bucketId}_${objectId}_${format}`;
    };

    // 节流下载
    addDownloadList(item) {
        if (self.throttleTimer) clearTimeout(self.throttleTimer);

        // item.momentsId = id;
        // 加入下载队列
        self.setDownloadItem(item);

        // 下载
        self.throttleTimer = setTimeout(self.handleDownload, self.throttleInterval);
    }

    // 下载进度
    @action onProgress(key, percent) {
        if (self.downloadList[key]) {
            self.downloadList[key].percent = percent;
            self.downloadList = { ...self.downloadList };
        }
    }

    // 下载
    handleDownload() {
        const mediaList = Object.values(self.preDownloadList);
        // 清空下载列表
        self.preDownloadList = {};

        // console.log(mediaList);
        // 下载
        mediaList.forEach(async (item) => {
            self.startDownload(item);

            const { mediaType } = item;
            // console.log(item.momentsId, "download to ", mediaType);
            if (mediaType === MediaType.IMAGE) self.handleDownloadWithImage(item);
            if (mediaType === MediaType.VIDEO) self.handleDownloadWithVideo(item);
            if (mediaType === MediaType.Applet) self.handleDownloadOrigin(item);
        });
    }

    // 下载图片
    async handleDownloadWithImage(item) {
        // console.log(`----->> effect download`, item)
        // console.log("handleDownloadWithImage", item.momentsId);
        const { objectId, width: w, height: h } = item;
        // console.log(item);
        // const { width, height } = clipUtils.setThumb(w, h, DefaultCompressSize);
        const width = DefaultCompressSize.dWidth;
        const height = DefaultCompressSize.dHeight;
        let localPath = "";
        // 1. 检查本地是否存在

        localPath = await checkCompressCache(
            {
                path: objectId,
                width,
                height,
                type: item.format,
            },
            CropImgBizType.BizTypeMoments
        );

        // console.log(`------->> localPath`, localPath)
        // console.log("---------------->", item.objectId, localPath);
        const key = self.getDownloadKey(item);
        // if (localPath) {
        // console.log("target cache", item.momentsId, key);
        // }
        // console.log(item.momentsId, localPath);
        // 下载缩略图
        if (!localPath) {
            // console.log(
            //     item.objectId,
            //     2,
            //     ImageMessageContent.unSupportCompressType.includes(item.format)
            // );

            self.onProgress(key, 0);
            const res = ImageMessageContent.unSupportCompressType.includes(item.format)
                ? await getObjectByKey(
                      {
                          filename: item.objectId,
                          fileType: item.format,
                          bucketID: item.bucketId,
                      },
                      ({ loaded, total }) =>
                          self.onProgress(key, parseInt((loaded / total) * 100 + ""))
                  )
                : await getThumb(
                      {
                          filename: item.objectId,
                          fileType: item.format,
                          bucketID: item.bucketId,
                      },
                      { width, height },
                      ({ loaded, total }) =>
                          self.onProgress(key, parseInt((loaded / total) * 100 + ""))
                  );

            if (res && res.byteLength > 0) {
                localPath = await writeCompressCache(
                    res,
                    item.objectId,
                    {
                        width,
                        height,
                        type: item.format,
                    },
                    CropImgBizType.BizTypeMoments
                );
            }
        }

        if (localPath) return self.downloadSuccess(key, localPath);

        // 检查原图
        localPath = await checkOriginCache(objectId, item.format);
        if (localPath) return self.downloadSuccess(key, localPath);
        self.downloadFail(key);
    }
    // 下载视频
    async handleDownloadWithVideo(item) {
        const {
            bucketId,
            format: videoType,
            objectId,
            posterFormat: posterFileType,
            posterObjectId: posterObjectId,
            width,
            height,
        } = item;

        // 检测 poster 和 视频 缓存
        let [localPosterPath, localVideoPath] = await Promise.all([
            checkOriginCache(posterObjectId, posterFileType),
            checkOriginCache(objectId, videoType),
        ]);
        const key = self.getDownloadKey(item);
        // 下载 poster
        if (!localPosterPath) {
            getObjectByKey({
                filename: posterObjectId,
                fileType: posterFileType,
                bucketID: item.posterBucketID ? item.posterBucketID : bucketId, //22 5/31 Compatible mobile terminal
            }).then(async (res) => {
                if (res && res.size > 0) {
                    localPosterPath = await writeOriginCache(res, posterObjectId, posterFileType);
                }

                // 检查原图
                if (!localPosterPath)
                    localPosterPath = await checkOriginCache(posterObjectId, posterFileType);
                if (localPosterPath) self.updateVideoPosterPath(key, localPosterPath);
            });
        } else self.updateVideoPosterPath(key, localPosterPath);

        // 下载 video
        if (!localVideoPath) {
            // 下载
            getObjectByKey({
                filename: objectId,
                fileType: videoType,
                bucketID: bucketId,
            }).then(async (res) => {
                if (res && res.size > 0) {
                    localVideoPath = await writeOriginCache(res, objectId, videoType);
                }

                if (localPosterPath) self.downloadSuccess(key, localVideoPath);
            });
        } else self.downloadSuccess(key, localVideoPath);
    }
    // 下载原图
    async handleDownloadOrigin(item) {
        //
        const { objectId, format, bucketId, width, height } = item;
        const key = self.getDownloadKey({ bucketId, objectId, format });
        self.onProgress(key, 0);

        let localPath = await checkOriginCache(objectId, format);
        if (localPath) return self.downloadSuccess(key, localPath);

        try {
            const res = await getObjectByKey(
                {
                    filename: objectId,
                    bucketID: bucketId,
                    fileType: format,
                },
                ({ loaded, total }) => self.onProgress(key, parseInt((loaded / total) * 100 + ""))
            );
            if (res && res.byteLength > 0) {
                localPath = await writeOriginCache(res, item.objectId, item.format);
            }

            if (localPath) return self.downloadSuccess(key, localPath);

            self.downloadFail(key);
        } catch (e) {
            self.downloadFail(key);
        }
    }

    // --
    tryFixDifferentFields(item = {}, addon = {}) {
        const ob = { ...item, ...addon };
        if (!item.format) ob.format = item.fileType || item.file_type;
        if (!item.objectId) ob.objectId = item.text;

        return ob;
    }

    // 清空缓存
    @action
    clearCache() {
        self.downloadList = {};

        self.preDownloadList = {};
        self.throttleTimer = null;
    }
}

const self = new MediaDownloadProxy();

export default self;
