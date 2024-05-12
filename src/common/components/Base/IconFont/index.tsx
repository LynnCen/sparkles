import React from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { Tooltip } from 'antd';

export interface IconType {
  /**
   * @description icon的名称
   */
  iconHref: string;
  /**
   * @description 额外插入的外层class
   */
  className?: string;
  /**
   * @description 是否是功能性按钮
   * @default false
   */
  functionality?: boolean;
  /**
   * @description 额外插入的外层样式
   */
  style?: React.CSSProperties;
  /**
   * @description 点击事件回调
   */
  onClick?: Function;
  /**
   * @description 只要设置就开启tooltip功能，入参请直接参考 https://4x.ant.design/components/tooltip-cn/
   */
  tooltipConfig?: any;
}
/**
* @description 便捷文档地址
* @see https://reactpc.lanhanba.net/components/base/icon-font
*/
const IconFont: React.FC<IconType> = ({
  iconHref,
  className,
  style,
  onClick,
  functionality,
  tooltipConfig,
}) => {
  const _svg = (functionality) => (
    <svg
      className={cs(styles.icon, className)}
      style={style}
      aria-hidden
      onClick={(e) => !functionality && onClick && onClick(e)}
    >
      <use xlinkHref={`#${iconHref}`} />
    </svg>
  );
  const coreRender = () => {
    return functionality ? (
      <span onClick={(e) => onClick && onClick(e)} className={styles.functionality}>
        {_svg(true)}
      </span>
    ) : _svg(false);
  };
  return (
    tooltipConfig ? <Tooltip placement='top' {...tooltipConfig}>
      {
        coreRender()
      }
    </Tooltip> : coreRender()
  );
};

export default IconFont;
