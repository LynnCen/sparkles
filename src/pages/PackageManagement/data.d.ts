
import { UploadFile } from "antd/es/upload/interface";
import { Apk } from "./service";

export type ItemType = {
  id: string;
  type: number; // 1 Android 2 win 3 mac
  apk: ApkElement; // link address
  // yml: string; // yml link
  version: string;
  desc: string;
  create_time: number
};

export type UpdatedField = {
  id: string;
  type: number;
  apk: {
    file: UploadFile,
    fileList: UploadFile[]
  };
  yml: {
    file: UploadFile,
    fileList: UploadFile[]
  }
  version: string;
  desc?: string;
};

export interface ApkElement {
  objectId: string,
  name: string,
  fileType: string,
  size: number,
  bucketId: string
}

export interface UpdateParams {
  type: number;
  apk?: ApkElement;
  yml?: File;
  desc?: string,
  version: string
}

export interface YmlInfo {
  version: string,
  files: {
    url: string,
    sha512: string,
    size: number
  }
  path: string,
  sha512: string,
  releaseDate: string
}

export type QueryType = {
  page?: number;
  row?: number;
  // sorttime?: string;
};
