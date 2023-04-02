import { BucketObjectTypeImg } from '@/services/common';

export interface ItemType {
  _id: string;
  cate_id: string;
  mch_id: string;
  name: string;
  mch_name: string;
  icon: BucketObjectTypeImg;
  logo: BucketObjectTypeImg;
  is_recommend: number;
  is_top: number;
  link_url: string;
  itime: number;
  mark: string;
  rank: number;
  type: number;
  secret: string;
  status: number;
}

export interface ItemInfoType {
  _id: string;
  mch_id: string;
  cate_id: string;
  name: string;
  mch_name: string;
  icon: string;
  image: string;
  is_rank: number;
  is_recommend: number;
  is_top: number;
  link_url: string;
  status: number;
  pv: number;
  uv: number;
  rank: number;
  rank_position: number;
  secret: string;
  api_secret: string;
  mark: string;
  utime: number;
  recommend_time: number;
  create_time: number;
}

export interface QueryType {
  page?: number;
  row?: number;
  status?: string;
  type?: number;
  sorttime?: string;
}

export interface EditType extends Partial<ItemInfoType> {
  id?: string;
}
