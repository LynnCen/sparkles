export interface ItemType {
  cate_id: string;
  cate_name: string;
  intro: string;
  itime: number;
  name: string;
  pro_id: number;
  pro_name: string;
  status: number;
  thumb: string;
  _id: string;
  photos: imgItem[];
  location: number[];
}

type imgItem = string & { url: string };

export interface QueryType {
  page?: number;
  row?: number;
  name?: string;
  cate_id?: string;
  cate_name?: string;
  pro_id?: string;
  pro_name?: string;
  sorttime?: string;
}

export interface EditType extends Partial<ItemType> {
  id?: string;
  rank?: number;
  phone?: number;
  city?: string;
  adr?: string;
  photos?: string;
  location?: string;
}
