import React, { useEffect } from 'react';
import { initDistrictLayer } from '../V2AMap/utils/amap';
export interface V2RegionColorProps {
  /**
   * @description 为简易行政区图设定各面的填充颜色和描边颜色。更多参数参看opts.styles：https://lbs.amap.com/api/javascript-api-v2/documentation#districtlayer
   */
  styles?: any;
  /**
   * @description  图层初始化参数。更多参数参看opts：https://lbs.amap.com/api/javascript-api-v2/documentation#districtlayer
   */
  options: any;
  /**
   * @description 关联数据
   */
  associatedData?: any[];
  /**
   * @description 关联数据的配置项
   */
  associatedDataConfig?: {
    needSort?: boolean; // 是否需要排序，目前的场景只有降序，
    sortFields?: string, // 默认：'total' 排序时依据的字段名，需要对应值是Number类型
    matchingFields?: string, // 填充行政区颜色（fill方法中匹配对应省份的字段名，可选值：'name', 'adcode',默认'name'）
    dataTargetFields?: string, // associatedData中需要匹配的字段名，默认'name'
    colors?: string[], // 排序时的颜色数组，注意是降序，默认：1-3名是一种颜色，4-10是另外一种颜色，其他的使用defaultFillColor
    defaultFillColor?: string; // 默认颜色 '#f2f2f2'
  };
  /**
   * @description 绘制的图层
   */
  layerRef?: any;
}
/**
* @description 便捷文档地址
* @see https://reactpc.lanhanba.net/components/Map/v2region-color
*/
const V2RegionColor: React.FC<V2RegionColorProps> = ({
  // _mapIns,
  styles,
  options,
  associatedData = [],
  associatedDataConfig = {},
  layerRef,
  ...props
}) => {
  const { _mapIns } = props as any;

  useEffect(() => {
    const targetLayer = initDistrictLayer(
      _mapIns,
      styles,
      options,
      associatedData,
      associatedDataConfig
    );
    _mapIns.add(targetLayer);
    // 会触发多次
    layerRef && (layerRef.current.push(targetLayer));
  }, [styles, options, associatedData, associatedDataConfig]);

  return (
    <></>
  );
};

export default V2RegionColor;
