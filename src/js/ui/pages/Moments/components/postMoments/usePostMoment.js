/**
 * @Author Pull
 * @Date 2021-10-14 10:17
 * @project useForward
 */
import { useRef, useState, useEffect } from "react";
import { defaultPublishAuthOptions } from "../../constants/publishAuthOptions";
import helper from "utils/helper";
import MomentsNormalContent, {
    AuthType,
} from "@newSdk/model/moments/instance/MomentsNormalContent";
import publishMoment from "@newSdk/service/api/moments/publishMoment";
import { useFilePicker } from "../../../../hooks/useFilePicker";
import sizeOf from "image-size";
import { createFileCache } from "utils/sn_utils";
import { createImageCache } from "./utils/createImageCache";
import { DefaultMomentsImgCompressOptions, MediaType, MediaLimit } from "../../constants/media";
import upload from "@newSdk/service/api/s3Client/upload";
import { isVideo, isImage, generalVideos, generalImages } from "@newSdk/utils/file_type";
import nodePath from "path";
import { message } from "antd";
import { getVideoPosterGen } from "./utils/createVideoCache";
import { lookup } from "mime-types";
import { overThanLimitWithFile } from "utils/sn_verification";
import { getMd5, trimAndDropEmpty } from "@newSdk/utils";
import { useUserSelect } from "../../../../hooks/useUserSelect";
import { PublishMomentLimitChar } from "../../constants/base";
import localeFormat from "utils/localeFormat";

export const usePostMoment = (formatters, handleRefreshMoments) => {
    // Modal box visible
    const [visible, setVisible] = useState(false);
    // Expression visible
    const [emojiVisible, setEmojiVisible] = useState(false);
    // Permission selector
    const [authValue, setAuthValue] = useState(defaultPublishAuthOptions);
    // Rich text instance
    const inputRef = useRef();
    // Upload control
    const [uploadAble, setUploadAble] = useState(true);
    // Media selection list
    const [mediaList, setMediaList] = useState([]);
    const mediaListRef = useRef([]);
    // Optional resource type
    const [mediaAble, setMediaAble] = useState("*");
    // selected user
    const [selectedList, setSelectList] = useState([]);
    const [inputLen, setInputLen] = useState(0);
    // is send
    const [sendAble, setSendAble] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        let _sendAble = true;
        if (inputLen > PublishMomentLimitChar) _sendAble = false;
        if (inputLen <= 0 && !mediaList.length) _sendAble = false;
        setSendAble(_sendAble);
    }, [inputLen, mediaList]);

    // select user
    const { handleUserSelect } = useUserSelect(
        {
            left: "-80px",
        },
        true
    );
    const { handlePick } = useFilePicker({ accept: "*" });

    //  authority
    // useEffect(() => {
    //     handleReSelect([]);
    // }, [authValue]);

    useEffect(() => {
        mediaListRef.current = mediaList;
    }, [mediaList]);

    // Upload quantity limit
    useEffect(() => {
        const item = mediaList[0];

        let _uploadAble = true;
        if (item) {
            const isImage = item.mediaType === MediaType.IMAGE;
            const isVideo = item.mediaType === MediaType.VIDEO;

            if (isImage && mediaList.length >= 9) _uploadAble = false;
            if (isVideo && mediaList.length >= 1) _uploadAble = false;
        }

        setUploadAble(_uploadAble);
    }, [mediaList]);

    // file type  Select  restrictions
    useEffect(() => {
        const item = mediaList[0];
        if (item) {
            const { format } = item;
            let supportMediaTypes = "";
            if (isVideo(format)) {
                generalVideos.map((fileType) => (supportMediaTypes += `${lookup(fileType)},`));
            }

            if (isImage(format)) {
                generalImages.map((fileType) => (supportMediaTypes += `${lookup(fileType)},`));
            }

            setMediaAble(supportMediaTypes);
        } else setMediaAble("*");
    }, [mediaList]);

    // Select user modal
    const handleReSelect = (initList) => {
        if (!initList || !initList.length) setSelectList([]);

        if ([AuthType.ShareWith, AuthType.DontShare].includes(authValue)) {
            handleUserSelect(initList).then((res) => setSelectList(res));
        } else {
            setSelectList([]);
        }
    };

    const resetState = () => {
        setVisible(false);
        setEmojiVisible(false);
        setAuthValue(defaultPublishAuthOptions);
        inputRef.current.clearTextArea && inputRef.current.clearTextArea();
        setUploadAble(true);
        setMediaList([]);
        setMediaAble("*");
    };

    const selectEmoji = (emoji) => {
        if (inputRef.current) {
            const { selectEmojiWithImg } = inputRef.current;
            selectEmojiWithImg(emoji);
            setEmojiVisible(false);
        }
    };

    // selected img
    const handleSelectMedia = async (path) => {
        if (!uploadAble) return;
        if (!path) {
            path = await handlePick();
        }

        // View type
        let ext = nodePath.parse(path).ext.slice(1).toLowerCase();
        if (mediaAble !== "*" && mediaAble.search(lookup(ext)) === -1)
            return message.warn(formatters({ id: "limitMediaRule" }));

        if (isVideo(ext)) {
            return handleVideo(path);
        }

        if (isImage(ext)) {
            return handLocalMediaPath(path);
        }

        return message.warn("unsupport type");
    };

    // Upload progress processing
    const handleProgress = (id, { loaded, total } = {}) => {
        const list = mediaListRef.current.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    percent: ((loaded / total) * 100).toFixed(0),
                };
            }
            return item;
        });
        setMediaList([...list]);
        // const uploadingItem = mediaList.find((item) => item.id === id);
        //
        // if (uploadingItem && uploadingItem.percent !== undefined) {
        //     uploadingItem.percent = ((loaded / total) * 100).toFixed(0);
        //     setMediaList([...mediaList]);
        // }
    };

    const handleVideo = async (path) => {
        // Detection size no more than 200kb
        if (await overThanLimitWithFile(path, MediaLimit.maxVideoSize))
            return message.warn(
                formatters({ id: "videoLimitSizeMb" }, { size: MediaLimit.maxVideoSize })
            );

        // 2. Generate cover image
        const posterInfoGen = await getVideoPosterGen(path, DefaultMomentsImgCompressOptions);
        // Testing often does not exceed 15s

        try {
            const { value: duration } = await posterInfoGen.next();
            if (duration > 15) {
                posterInfoGen.next(false);
                return message.warn(formatters({ id: "limitDuration15s" }));
            }
        } catch (e) {
            return message.warn("Invalid file");
        }

        const { value: posterInfo } = await posterInfoGen.next(true);
        // 1. Get local video cache
        const videoInfo = await createFileCache(path, "video");
        // insert
        const videoItem = {
            id: getMd5("mom", "video"),
            width: posterInfo.size.width,
            height: posterInfo.size.height,
            objectId: videoInfo.text,
            percent: 0,
            mediaType: MediaType.VIDEO,
            format: videoInfo.ext,
            duration: parseInt(posterInfo.videoDuration) || 0,
            size: videoInfo.size,
            posterObjectId: posterInfo.contentHash,
            posterFormat: posterInfo.ext,
            local: posterInfo.compressPath,
            key: Date.now(),
        };
        const _mediaList = [...mediaList];
        _mediaList.push(videoItem);
        setMediaList(_mediaList);
        // 3. upload video
        const bucketId = await upload(
            videoInfo.localPath,
            `${videoInfo.text}.${videoInfo.ext}`,
            (uploadProgress) => {
                handleProgress(videoItem.id, uploadProgress);
            }
        );
        removeProgress(videoItem.id, { bucketId, key: Date.now() });
    };

    //  handle local img path
    const handLocalMediaPath = async (path) => {
        // Check size
        const ext = nodePath.parse(path).ext.slice(1).toLowerCase();

        if (ext === "gif" && (await overThanLimitWithFile(path, MediaLimit.maxGifSize)))
            return message.warn(
                formatters({ id: "gifImgLimitSizeMb" }, { size: MediaLimit.maxGifSize })
            );

        if (ext !== "gif" && (await overThanLimitWithFile(path, MediaLimit.maxImageSize)))
            message.warn(
                formatters({ id: "gifImgLimitSizeMb" }, { size: MediaLimit.maxImageSize })
            );

        // 1. compress
        const sizeInfo = sizeOf(path);
        const compressInfo = await createImageCache(path, sizeInfo);

        if (!compressInfo) return;

        // Check whether the same resources are uploaded
        const existItem = mediaList.find((item) => item.objectId === compressInfo.contentHash);

        if (existItem) {
            // the same
            const duplicateItem = { ...existItem };
            duplicateItem.local = compressInfo.compressPath;
            duplicateItem.key = Date.now();
            return setMediaList([...mediaList, duplicateItem]);
        }
        // Upload occupancy progress
        const item = {
            id: getMd5("mom", "item"),
            width: compressInfo.size.width,
            height: compressInfo.size.height,
            objectId: compressInfo.contentHash,
            format: compressInfo.size.type,
            size: compressInfo.fileSize,
            mediaType: MediaType.IMAGE,
            percent: 0,
            local: compressInfo.compressPath,
            key: Date.now(),
        };
        const _mediaList = [...mediaList];
        _mediaList.push(item);
        setMediaList(_mediaList);

        // 2. upload aws
        const bucketId = await upload(
            compressInfo.compressPath,
            `${compressInfo.contentHash}.${compressInfo.size.type}`,
            (uploadProgress) => handleProgress(item.id, uploadProgress)
        );
        console.log(mediaList);
        removeProgress(item.id, { bucketId, key: Date.now() });
    };

    // upload success
    const removeProgress = (id, addOn = {}) => {
        const mediaList = mediaListRef.current;
        if (addOn.bucketId) {
            console.log(" upload success", id, mediaList);
            //  upload success
            const _media = mediaList.map((item) => {
                if (item.id === id) {
                    delete item.percent;
                    return { ...item, ...addOn };
                }

                return item;
            });
            setMediaList(_media);
        } else {
            // Upload failed  remove
            console.log("fail", id, [...mediaList]);
            const _media = mediaList.filter((item) => item.id !== id);
            setMediaList(_media);
        }
    };

    // Remove selected
    const handleRemoveSelected = (key) => {
        const _mediaList = [...mediaList];
        const i = _mediaList.findIndex((item) => item.key === key);
        if (i !== -1) {
            _mediaList.splice(i, 1);
            setMediaList(_mediaList);
        }
    };

    // Detection length
    const checkLimit = (charCount) => {
        setInputLen(charCount);
    };

    const onSubmit = async () => {
        if (sending) return;
        if (inputRef.current && sendAble) {
            const { getFormatContent } = inputRef.current;
            // const content = getFormatContent();
            // const text = formatTextContent(content[0]);
            const val = getFormatContent();

            const hasUploading = mediaList.filter((item) => item.percent !== undefined);
            if ((!val && !mediaList.length) || hasUploading.length) return;

            setSending(true);
            let authIds = [];
            if ([AuthType.ShareWith, AuthType.DontShare].includes(authValue)) {
                authIds = selectedList.map((item) => item.id);
            }
            const moment = trimAndDropEmpty(
                new MomentsNormalContent({
                    text: val,
                    type: 1,
                    authType: authValue,
                    media: JSON.parse(JSON.stringify(mediaList)),
                    authIds,
                })
            );

            // trim Will affect the topic segment
            moment.text = val;
            await publishMoment(moment).then((res) => {
                // Published successfully
                if (res) {
                    // console.log(res);
                    message.success(localeFormat({ id: "publishSuccess" }));
                    handleRefreshMoments && handleRefreshMoments(res);
                    resetState();
                }
                // Publishing failed
                else {
                    message.warn(localeFormat({ id: "publishFail" }));
                }
                setSending(false);
                // debugger;
            });
        }
    };

    const handleSelectAuth = (auth) => {
        if ([AuthType.ShareWith, AuthType.DontShare].includes(auth)) {
            const init = auth === authValue ? selectedList : [];
            handleUserSelect(init).then((list) => {
                if (!list || !list.length) return;
                setSelectList(list);
                setAuthValue(auth);
            });
        } else {
            setAuthValue(auth);
            setSelectList([]);
        }
    };

    return {
        visible,
        inputRef,
        emojiVisible,
        selectEmoji,
        authValue,
        uploadAble,
        selectedList,
        handleReSelect,
        show: () => setVisible(true),
        hide: () => setVisible(false),
        emojiShow: (e) => {
            e.nativeEvent.stopImmediatePropagation();
            setEmojiVisible(!emojiVisible);
        },
        emojiHide: () => setEmojiVisible(false),
        handleSelectMedia,
        handLocalMediaPath,
        handleRemoveSelected,
        mediaList,
        sending,
        authSelected: handleSelectAuth,
        onSubmit,
        checkLimit,
        sendAble,
    };
};

export default usePostMoment;
