import { string } from "prop-types";

export type ImageMedia = {
    width: number;
    height: number;
    objectId: string;
    fileType: string;
    bucketId: string;
};

export type AvatarPropsCom = {
    file_type: string;
    text: string;
    bucketId: string;
    width: number;
    height: number;
};
