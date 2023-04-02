// import { AccessItem } from '@/models/data';
import { Access } from '@/services/user-type';

export interface ItemType {
  id: string,
  name: string,
  status: number,
  create_time: number
}

export interface AccessItem {
  label: string,
  value: number,
  is_select: 0 | 1
}

export interface ItemInfoType {
  id: string,
  name: string,
  create_time: number,
  access: AccessItem[]
}

export interface QueryParamsType {
  page?: number;
  row?: number;
}

export interface EditType {
  id?: string;
  name?: string;
  access?: Record<string, number[]>;
  remark?: string;
}

