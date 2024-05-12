export type ObjectProps = { [propname: string]: any };

export interface FilterProps {
  onSearch: Function;
}

export interface LogListProps {
  loadData: Function;
  params: ObjectProps;
}
export interface ListResult {
  objectList?: ListRecordProps[];
  pageNum?: number;
  pageSize?: number;
  totalNum?: number;
}

export interface ListRecordProps {
  /**
   * ID
   */
  id?: number;
  /**
   * 请求用户
   */
  creator?: string;
  /**
   * 请求IP
   */
  ip?: string;
  /**
   * 创建时间
   */
  gmtCreate?: string;
  /**
   * 请求类型
   */
   method?: string;
  /**
   * 请求地址
   */
   uri?: string;
}
