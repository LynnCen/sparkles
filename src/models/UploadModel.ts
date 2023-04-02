import {ServiceMsg} from "./BaseModel";

export interface UploadModelImgMsg extends ServiceMsg <UploadModelImg> {

}

export interface UploadModelImg {
  id: number;
  img: string;
  source: string;
  title: string;
  type: string;
  url: string;
  userId: number;
}
