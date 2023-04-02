export interface ItemType {
  _id: string;
  uid: string;
  u_name: string;
  ip: string;
  menu: string;
  ctr: string;
  method: string;
  m_desc: string;
  itime: number;
  data: any;
  is_suc: string;
}

export interface QueryParams {
  page?: number;
  row?: number;
  itime?: string;
  u_name?: string;
  method?: string;
  str?: string;
  m_desc?: string;
  sorttime?: string;
}

// export OpLog
