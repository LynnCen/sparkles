import { CSSProperties } from 'react';

export interface CardProps {
  /**
   * 数量（今日或平均）
   */
  count: string;
  /**
   * 日均
   */
  dayAvg?: number;
  /**
   * 悬浮注释
   */
  label: string;
  /**
   * 环比（单位：1%）
   */
  ratio: number;
  /**
   * 环比标识（0：下浮  1：上浮）
   */
  ratioFlag: number;
  /**
   * 标题
   */
  title: string;
  /**
   * 累计数量
   */
  totalCount: string;
  /**
   * 累计悬浮注释
   */
  totalLabel: string;
  /**
   * 累计标题
   */
  totalTitle: string;
  icon?: string; // icon图标
  backgroundColor?: string; // 背景颜色
  shadowColor?: string; // 阴影颜色
  nullLabel?: string;
  col?: number; // 栅格布局占比
  showTooltip?: boolean; // 是否展示说明
  importTitle?: string // saas运营后台导入的大标题
  resetCardStyle?:CSSProperties; // 重置卡片样式
  /**
   * @description 数量类型,可选:[default, time]
   * @default 'default' 默认类型，不格式化数据
   */
   countType?: 'default'|'time' ;
}
