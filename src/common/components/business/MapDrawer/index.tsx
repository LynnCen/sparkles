import {
  // CSSProperties,
  FC,
  ReactNode
} from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';

interface MapDrawerProps {
  placement?: 'left' | 'right'; // 抽屉位置
  mapDrawerClassName?: any; // 容器自定义类名
  mapDrawerStyle?: Object; // 容器自定义样式
  closeNode?: ReactNode; // 自定义的关闭按钮
  children?: ReactNode; // 自定义抽屉内容
  outChildren?: ReactNode; // 自定义抽屉外部的元素
  visible: boolean; // 控制抽屉组件的展示与收起
  setVisible: Function;
  closeConStyle?:any;// 关闭按钮样式自定义
}

const MapDrawer: FC<MapDrawerProps> = ({
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

export default MapDrawer;
