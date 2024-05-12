import { ExecFileSyncOptionsWithBufferEncoding } from 'child_process';

// 品牌类型枚举
export enum BrandType {
  BUYER = 1, // 买家品牌
  SUPPLER = 2, // 供应商品牌
  SERVICE = 3, // 服务商品牌
  OTHER = 4, // 其他品牌
}

/**
 * 品牌信息
 */
export interface BrandInfo {
  /**
   * 品牌ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 类型
   */
  type?: number;

  /**
   * logo
   */
  logo?:ExecFileSyncOptionsWithBufferEncoding

  /**
   * icon
   */
  icon?:ExecFileSyncOptionsWithBufferEncoding

  level?:string;
}


export interface BrandModalInfo extends BrandInfo{
  visible: boolean;
}

export interface BrandModalProps {
  setBrandModalInfo: Function;
  brandModalInfo: BrandModalInfo;
  onSearch: Function;
}


// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
}

