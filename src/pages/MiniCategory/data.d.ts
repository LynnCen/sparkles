import type { BucketObjectTypeImg, TitleWithLangs } from '@/services/common';

export interface CateType {
  _id: string;
  name: string;
  status: number;
  type: number;
  rank: number;
}

export interface ItemType {
  _id: string;
  name: string;
  reorder: number;
  status: number;
  itime: number;
  type: number;
  icon: BucketObjectTypeImg;
}

export interface QueryType {
  page?: number;
  row?: number;
  status?: number;
  type?: number;
  sorttime?: string;
}

export interface EditType extends Partial<ItemType> {
  id?: string;
}

export interface LanguageType extends TitleWithLangs {
  _id: string;
  is_global: number;
}

export interface CateGoryInfo {
  _id: string;
  status: number;
  type: number;
  icon: BucketObjectTypeImg;
  rank: number;
  title: string;
  language: LanguageType[];
}
