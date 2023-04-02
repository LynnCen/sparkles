import ex from 'umi/dist';
import { AppItem } from '@/services/appList';

export interface ItemType {
  _id: string;
  status: number;
  type: number;
  rank: number;
  aids: any[];
}

export interface ItemInfoType {
  _id: string;
  status: number;
  type: number;
  rank: number;
  aids: AppItem[];
  language: LangType[];
}

export interface QueryType {
  page?: number;
  row?: number;
  name?: string;
  app_id?: string;
  rank_position?: string;
  status?: string;
  is_top?: string;
  _id?: string;
  sorttime?: string;
}

export interface ItemInfoAddType {
  _id: string;
  status: number;
  type: number;
  rank: number;
  aids: sting;
  language: sting;
}

export interface EditType extends Partial<ItemInfoType> {
  id?: string;
}

export interface LangType {
  is_global: number;
  lang: string;
  title: string;
  _id: string;
}

export interface AppItemType {
  _id: string;
  rid: string;
  aids: string;
  rank: number;
  language: LangType[];
}
