import { FetchData } from '@/common/components/FilterTable/ts-config';
import { Permission } from '@/common/components/Operate/ts-config';
import { SelectionOptionItem } from '@/common/components/Select/ts-config';
export type ObjectProps = { [propname: string]: any };

// 弹窗状态
export enum ModalStatus {
  ADD = 'add', // 授权
  EDIT = 'edit', // 编辑授权
}
// 应用名
export enum AppId {
  LOCATION = 1, // LOCATION
  PMS = 2, // PMS
  LOCATIONS_SPACE = 18, // Locations商业直租
}
export interface AuthorizeModalProps {
  visible: boolean;
  type: 'add' | 'edit';
  id?: number; // 应用id
  tenantId?: number | string; // 租户id
  tenantName: string; // 租户名称
  appName: string; // 应用名称
  roleId: number; // 角色id
  time?: any[]; // 有效期
  brandId?: number; // 品牌id
  brandName?: string; // 品牌名称
  industryId?: number; // 行业id
  industryName?: string; // 行业名称
  appVersion?: number; // 授权版本
}
export interface AuThorizeAppProps {
  modalParams: AuthorizeModalProps;
  onClose: Function;
  onSearch: Function;
}

export interface TenantDetailProps {
  tenantId: string | number;
  detail?: any;
}

export interface CrowdStorehouseStoreList { // 客流宝门店列表
  meta?: Meta;
  objectList?: StoreListItem[];
  pageNum?: number;
  pageSize?: number;
  totalNum?: number;
}

export interface Meta {
  /**
   * 批量按钮
   */
  permissions?: Permission[];
}

export interface StoreListItem {
  createdAt: string;
  /**
   * 活动日期
   */
  date: string;
  /**
   * 门店设备
   */
  devices?: Device[];
  id: number;
  /**
   * 管理员
   */
  managers: Manager[];
  /**
   * 门店名称
   */
  name: string;
  /**
   * 门店编号
   */
  number: string;
  /**
   * 按钮权限
   */
  permissions: Permission[];
  /**
   * 关联门店
   */
  store: Store;
  /**
   * 门店类型
   */
  typeName: string;
}

export interface Device {
  /**
   * 是否显示  1：是  0：否
   */
  checked: number;
  id: number;
  /**
   * 名称
   */
  name: string;
}

export interface Manager {
  id?: number;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 姓名
   */
  name?: string;
}

/**
* 关联门店
*/
export interface Store {
  id: number;
  /**
   * 名称
   */
  name: string;
  /**
   * 云盯id
   */
  storeId: string;
}


export interface CrowdStorehouseProps {
  tenantId: number;
  visible: boolean;
  drawerClose: (visible: boolean) => void;
}

export interface CrowdStorehouseSearchParams {
  endDate?: string;
  manager?: string;
  name?: string;
  page?: string;
  size?: string;
  sort?: string;
  sortField?: string;
  startDate?: string;
  tenantId: number;
  isCurPage?: boolean;
  source?: string | number;
  deviceStatus?: string | number;
  status?: string | number;
  businessDate?: string | number;
  start?: string | number;
  end?: string | number;
}

export interface CrowdStorehouseSearchProps {
  change: (params: any) => {}
}

export interface CrowdStorehouseTableProps {
  loadData: (params?: CrowdStorehouseSearchParams) => Promise<FetchData>;
  searchParams: CrowdStorehouseSearchParams;
  rowSelectionChange: (ids: number[]) => void;
  setManager: (id: number, managers: Manager[]) => void;
  selectIds: number[];
  edit: (id: number) => void;
  updateData: () => void;
}

export interface CrowdStorehouseImportProps {
  visible: boolean;
  tenantId: number;
  modalHandle: (visible: boolean) => void;
  loadData: any;
}

export interface ManagerState {
  visible: boolean;
  managers: Manager[];
  isBatch?: boolean;
  // modalHandle: (visible: boolean) => void;
}

export interface BatchDelManagerModalProps {
  storeIds: number[] | number;
  loadData: () => Promise<FetchData>;
  modalData: ManagerState,
  modalHandle: (visible: boolean) => void;
}


export enum StoreAttribute {
  DemoticStore = 1, // 正铺
  TemporaryStore, // 快闪店
  LongTermStore // 慢闪店
}

export interface StoreCreateForm {
  /**
   * 展位地址
   */
  boothAddress?: string;
  /**
   * 展位id
   */
  boothId?: number;
  /**
   * 展位名称
   */
  boothName?: string;
  /**
   * 品牌
   */
  brandId: number;
  /**
   * 市
   */
  cityId?: number;
  /**
   * 活动日期
   */
  date: string;
  /**
   * 区
   */
  districtId?: number;
  /**
   * 门店id
   */
  id?: number;
  /**
   * 行业
   */
  industryIds: number[];
  /**
   * 名称
   */
  name: string;
  /**
   * 门店编号
   */
  number: string;
  /**
   * 推广产品
   */
  product?: string;
  /**
   * 推广目的
   */
  promotionPurposeIds?: number[];
  /**
   * 省
   */
  provinceId?: number;
  /**
   * 租户id
   */
  tenantId?: number;
  /**
   * 门店类型  1：正铺  2：快闪店  3：慢闪店
   */
  type: number;
}

export interface StoreDetail {
  /**
   * 展位地址
   */
  boothAddress: string;
  /**
   * 展位id
   */
  boothId?: number;
  /**
   * 展位名称
   */
  boothName: string;
  /**
   * 品牌id数组
   */
  brand: {
    id: number;
    name: string;
  };
  /**
   * 市
   */
  cityId: number;
  /**
   * 活动日期
   */
  date: string | Date;
  /**
   * 区
   */
  districtId: number;
  id: number;
  /**
   * 行业id数组
   */
  industryIds: number[];
  /**
   * 名称
   */
  name: string;
  /**
   * 门店编号
   */
  number: string;
  /**
   * 推广产品
   */
  product?: string;
  /**
   * 推广目的
   */
  promotionPurposes?: SelectionOptionItem[];
  /**
   * 省
   */
  provinceId: number;
  /**
   * 租户id
   */
  tenantId: number;
  /**
   * 门店类型  1：正铺  2：快闪店  3：慢闪店
   */
  type: number;
}


export interface BoothSearchItem {
  /**
   * 地址
   */
  address: string;
  /**
   * 市
   */
  cityId: number;
  /**
   * 区
   */
  districtId: number;
  id: number;
  /**
   * 名称
   */
  name: string;
  /**
   * 省
   */
  provinceId: number;
}
