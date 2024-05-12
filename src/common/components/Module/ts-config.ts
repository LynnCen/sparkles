import React from 'react';

export interface ModuleProps {
  /** 标题 */
  title?: React.ReactNode;
  titleRight?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
