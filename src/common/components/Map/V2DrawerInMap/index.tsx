/**
 * @Description 地图页抽屉
 */
import React, { FC, ReactNode } from 'react';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import cs from 'classnames';
import styles from './index.module.less';

interface MapDrawerProps {
  /**
   * @description 抽屉的位置
   * @default left
   */
  placement?: 'left' | 'right' | string;
  /**
   * @description 容器自定义类名
   */
  mapDrawerClassName?: string; // 容器自定义类名
  /**
   * @description 容器自定义样式
   */
  mapDrawerStyle?: React.CSSProperties; // 容器自定义样式
  /**
   * @description 自定义关闭按钮
   */
  closeNode?: ReactNode; // 自定义的关闭按钮
  /**
   * @description 自定义抽屉内容
   */
  children?: ReactNode; // 自定义抽屉内容
  /**
   * @description 自定义抽屉外部的元素
   */
  outChildren?: ReactNode; // 自定义抽屉外部的元素
  /**
   * @description 抽屉组件的展示或者收起状态
   * @default true
   */
  visible: boolean; // 控制抽屉组件的展示与收起
  /**
   * @description 控制抽屉组件的展示与收起
   */
  setVisible: Function;
  /**
   * @description 关闭按钮样式自定义
   */
  closeConStyle?: React.CSSProperties;// 关闭按钮样式自定义
}
/**
* @description 便捷文档地址
* @see https://reactpc.lanhanba.net/components/Map/v2drawer-in-map
*/
const V2DrawerInMap: FC<MapDrawerProps> = ({
  visible = true,
  mapDrawerClassName,
  mapDrawerStyle = {},
  placement = 'left',
  closeNode,
  outChildren,
  children,
  setVisible,
  closeConStyle
}) => {

  return (
    <div className={cs(
      styles.mapDrawerWrapper,
      mapDrawerClassName,
      visible ? styles.isShow : (placement === 'right' ? styles.isRightHide : styles.isHide),
      placement === 'right' ? styles.isRight : ''
    )}
    style={mapDrawerStyle}>
      {/* 需要展示在容器外部的元素内容 */}
      <div className={cs(styles.outWrapper)}>
        {/* closeNode 可完全自定义关闭按钮 */}
        {
          // 自定义关闭按钮 || 默认的关闭按钮
          closeNode || (
            <div className={cs(
              styles.closeCon,
              placement === 'left' ? styles.isLeft : styles.isRight,
            )}
            style={{
              ...closeConStyle
            }}
            onClick={() => setVisible(!visible)}>
              {
                ((visible && placement === 'right') || (!visible && placement === 'left'))
                  ? <CaretRightOutlined style={{
                    color: '#656E85',
                    position: 'absolute',
                    left: placement === 'left' ? '-16px' : '10px',
                    top: '10px'
                  }} />
                  : <CaretLeftOutlined style={{
                    color: '#656E85',
                    position: 'absolute',
                    left: placement === 'left' ? '-20px' : '6px',
                    top: '10px'
                  }} />
              }
            </div>
          )
        }
        {/* 展示在容器外部的元素 */}
        { outChildren }
      </div>
      <div className={styles.interiorWrapper}>
        { children }
      </div>
    </div>
  );
};

export default V2DrawerInMap;
