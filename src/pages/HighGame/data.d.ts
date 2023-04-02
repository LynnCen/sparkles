import { BucketObjectTypeImg } from '@/services/common';

export interface ItemType {
  _id: string;
  url: string;
  image: string;
  link_id: string;
  status: number;
  sort: number;
  type: number;
  utime: number;
  itime: number;
  icon: BucketObjectTypeImg;
  logo: BucketObjectTypeImg;
}

export interface QueryType {
  page?: number;
  row?: number;
  name?: string;
  status?: string;
  sorttime?: string;
}

export interface EditType extends Partial<ItemType> {
  id?: string;
}
