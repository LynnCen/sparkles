export interface NearbyCategoryType {
  itime: number;
  lang: string;
  name: string;
  region: string;
  reorder: number;
  status: number;
  thumb: string;
  _id: string;
}

export interface NearbyCategoryParams {
  id?: string;
  region?: string;
  name?: string;
  row?: number;
  page?: number;
  status?: string;
  sorttime?: string;
}

export interface EditType extends Partial<NearbyCategoryType> {
  id?: string;
}
