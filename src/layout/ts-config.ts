import React from 'react';

export interface BasicType {
  children?: React.ReactNode;
  location?: any;
}

export interface IconType {
  iconName: string;
}

export enum HeaderStatus {
  CHANGE_ACCOUNT = 'changeAccount',
  LOGIN_OUT = 'loginOut',
}

// 需要收起左侧菜单栏的页面
export const foldUrl = [
  '/iterate/siteselectionmap', // 最新选址地图（第二代）
  '/iterate/siteselectionmapb', // 最新选址地图(b-第三代)
];
