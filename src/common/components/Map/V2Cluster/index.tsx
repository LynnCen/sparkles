import React, { ReactNode, useEffect } from 'react';
import styles from './index.module.less';
import { isArray } from '@lhb/func';
import ReactDOM from 'react-dom';
import './index.module.less';
import cs from 'classnames';
import { v4 } from 'uuid'; // 用来生成不重复的key

const defaultZIndex = 15;

interface configKeyProps {
  // keyName
  countList?: string;
  total?: string;
  color?: string;
  areaName?: string;
  lng?: string;
  lat?: string;
}
export interface V2ClusterProps {
  /**
   * @description 地图示例（若不主动传，需将组件作为AMap的子组件）
   */
  _mapIns?: any;
  /**
   * @description 省市区聚合数据，理想格式参照ts-config，可通过configKey配置对应属性
   */
  circleData: any[]; // 高德是js工具
  /**
   * @description 可通过configKey配置对应的数据属性
   */
  configKey?: configKeyProps;
  /**
   * @description 是否需要隐藏个数为0的数据
   */
  hideZero?: boolean;
  /**
   * @description 聚合圈marker配置,具体请参考https://lbs.amap.com/api/javascript-api-v2/documentation#marker
   */
  markerConfig?: any;
  /**
   * @description 聚合圈下方详细数据marker配置,具体请参考https://lbs.amap.com/api/javascript-api-v2/documentation#marker
   */
  labelMarkerConfig?: any;
  /**
   * @description 聚合圈内的插槽内容
   */
  slot?: (value: any) => ReactNode;
  /**
   * @description 聚合圈下方详细数据的插槽内容
   */
  labelSlot?: (value: any) => ReactNode;
  /**
   * @description 是否展示聚合圈下方详细数据,默认展示
   */
  showLabel?: boolean;
  /**
   * @description 处理聚合圈marker的移入事件
   */
  handleMouseover?: (item: any, marker: any, e: React.MouseEvent) => void;
  /**
   * @description 处理聚合圈marker的移出事件
   */
  handleMouseout?: (item: any, marker: any, e: React.MouseEvent) => void;
  /**
   * @description 自义定聚合圈marker的颜色
   */
  circleColors?: string[];
  /**
   * @description 存放聚合圈marker实例的setState
   */
  setMarkerGroup?: (group: any) => void;
  /**
   * @description 聚合圈样式类名
   */
  circleBoxClassName?: string;
  /**
   * @description 聚合圈下方详细数据样式类名
   */
  circleLabelClassName?: string;
}
/**
 * @description 便捷文档地址
 * @see https://reactpc.lanhanba.net/components/Map/v2cluster
 */

const V2Cluster: React.FC<V2ClusterProps> = ({
  circleData,
  configKey = {},
  hideZero = true,
  slot,
  labelSlot,
  markerConfig = {},
  labelMarkerConfig = {},
  showLabel = false,
  handleMouseover,
  handleMouseout,
  circleColors,
  setMarkerGroup,
  circleBoxClassName,
  circleLabelClassName,
  ...props
}) => {
  const { _mapIns } = props;
  // 聚合marker样式组件
  const CircleContent = ({ value }: any) => {
    let total = 0; // 计算总数
    let lDeg = 0;
    let rDeg = 0;

    const countList = value[configKey?.countList || 'countList'];
    // 需要先遍历求和 count
    countList.forEach((item: any) => {
      total += item[configKey?.total || 'total'];
    });

    const styleList: any = [];
    // 先计算每个圈的占比样式
    if (total !== 0) {
      countList.forEach((item: any, index: number) => {
        const ItemTotal = item[configKey?.total || 'total'];
        const ItemColor = item[configKey?.color || 'color'];
        // 计算出每个选中的条目在所有选中项中的比重
        item.scale = ItemTotal / total;
        rDeg = rDeg + 360 * item.scale;
        // 判断是否传入了circleColors自定义聚合圈颜色
        if (isArray(circleColors) && circleColors.length) {
          // 如果传入的circleColors数组长度比value数组长度小，则求余从第一项开始重新取颜色。
          // ps: 0%0 = NaN
          styleList.push(`${circleColors[index % circleColors.length || 0]} ${lDeg}deg ${rDeg}deg`);
        } else {
          styleList.push(`${ItemColor} ${lDeg}deg ${rDeg}deg`);
        }
        // 每隔一个留4度的白色
        if (index !== countList.length - 1 && ItemTotal) {
          styleList.push(`#FFFFFF ${rDeg}deg ${rDeg + 4}deg`);
        }
        lDeg = rDeg + 4;
      });
    }

    return (
      <div
        className={cs(styles.circleBox, circleBoxClassName)}
        style={{
          background: `conic-gradient(${styleList.join(',')})`,
        }}
      >
        <div className={cs(styles.rainbowBg, 'rainbowBg')}>
          {slot ? (
            slot(value)
          ) : (
            <>
              <div className={cs(styles.textName, 'textName')}>
                {value[configKey?.areaName || 'areaName']}
              </div>
              <div className={cs(styles.textTotal, 'textTotal')}>{total}</div>
            </>
          )}
        </div>
      </div>
    );
  };

  // 聚合marker下方的详细数据组件
  const CircleLabelContent = ({ value } : any) => {
    return (
      <div className={cs(styles.mapLabel, circleLabelClassName)}>
        <div className={cs(styles.triangle, 'triangle')}></div>
        {labelSlot && labelSlot(value)}
      </div>
    );
  };

  // 绘制聚合物marker
  const drawCircle = () => {
    const markerArr: any = [];

    // 聚合marker下方的详细数据展示
    const labelMarker = new window.AMap.Marker({
      anchor: 'bottom',
      zIndex: defaultZIndex + 1,
      offset: [-30, 70],
      ...labelMarkerConfig,
    });
    _mapIns.add(labelMarker);

    // 拿到数据 生成聚合marker、绑定聚合marker默认事件
    circleData.forEach((item) => {
      const total = item[configKey.total || 'total'];
      const lng = +item[configKey?.lng || 'lng'];
      const lat = +item[configKey?.lat || 'lat'];
      const lnglat = new window.AMap.LngLat(lng, lat);
      if (total === 0 && hideZero) return;
      const marker = new window.AMap.Marker({
        position: lnglat,
        anchor: 'top-center',
        zIndex: defaultZIndex,
        extData: item,
        ...markerConfig, // 自定义marker配置
      });

      // 可通过抛出的markerGroup去重新绑定事件，也可以通过handleMouseover、handleMouseout对已有的移入移出事件进行补充

      // 默认绑定hover移入事件，展示下面详细label数据（可控），移入置顶
      marker.on('mouseover', (e: React.MouseEvent) => {
        // 展示下面详细label数据（可控）
        if (showLabel) {
          labelMarker.setPosition(lnglat);
          // 设置当前选中item
          const uid: any = v4();
          labelMarker.setContent(`<div id="${uid}"></div>`);
          ReactDOM.render(<CircleLabelContent value={item} />, document.getElementById(uid));
        }

        // 置顶
        marker.setzIndex(marker.getzIndex() + 1);

        handleMouseover?.(item, marker, e);
      });

      // 默认绑定hover移出事件，取消下方详细label数据的展示（可控），移出取消置顶，
      marker.on('mouseout', (e: React.MouseEvent) => {
        // 取消下方详细label数据的展示（可控）
        if (showLabel) {
          labelMarker.setContent(` `);
        }

        // 移出取消置顶
        marker.setzIndex(marker.getzIndex() - 1);

        handleMouseout?.(item, marker, e);
      });

      markerArr.push(marker);
    });

    const group = new window.AMap.OverlayGroup(markerArr);
    setMarkerGroup?.(group);
    _mapIns.add(group);

    // 使用ReactDOM.render 解决高德content需要传入字符串原生dom结构的问题，但是需要先渲染到地图上，才可以render，否则会找不到元素
    markerArr.forEach((marker: any) => {
      const uid: any = v4();
      marker.setContent(`<div id="${uid}"></div>`);
      ReactDOM.render(<CircleContent value={marker.getExtData()} />, document.getElementById(uid));
    });
  };

  useEffect(() => {
    if (_mapIns && circleData.length) {
      drawCircle();
    }
  }, [circleData, _mapIns]);

  return <></>;
};

export default V2Cluster;
