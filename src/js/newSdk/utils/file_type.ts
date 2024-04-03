export const generalVideos = [
    "mp4",
    "MP4",
    "flv",
    "f4v",
    "webm",
    "m4v",
    "M4V",
    "mov",
    "MOV",
    "3gp",
    "3g2",
    "rm",
    "rmvb",
    "wmv",
    "avi",
    "asf",
    "mpg",
    "mpeg",
    "mpe",
    "ts",
    "div",
    "dv",
    "divx",
    "vob",
    "dat",
    "mkv",
    "swf",
    "lavf",
    "cpk",
    "dirac",
    "ram",
    "qt",
    "fli",
    "flc",
    "mod",
];
export const isVideo = (ext: string) => {
    console.log(ext);
    return generalVideos.includes(ext);
};

export const generalImages = ["jpg", "jpeg", "png", "bmp", "webp", "gif"];
export const isImage = (ext: string) => {
    return generalImages.includes(ext);
};

export default { isVideo, isImage };
