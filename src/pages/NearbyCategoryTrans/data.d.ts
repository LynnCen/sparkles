export interface NearbyCategoryTransItem {
  cate_id: number;
  cate_name: string;
  itime: number;
  lang: string;
  name: string;
  status: number;
  _id: string;
  sort?: number;
}

export interface NearbyCategoryTransParams {
  _id?: string;
  name?: string;
  category?: string;
  pageSize?: number;
  row?: number;
  current?: number;
  page?: number;
  sort?: number;
  status?: number;
  lang?: string;
  cate_name?: string;
  cate_id?: string;
  sorttime?: string;
}

export interface EditType extends Partial<NearbyCategoryTransItem> {
  id?: string;
}
