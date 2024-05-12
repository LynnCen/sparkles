import { isArray } from '@lhb/func';
import React, { useEffect } from 'react';
interface configKey {
  id?: string;
  url?: string;
  lng?: string;
  lat?: string;
}
export interface V2MassMarksProps {
  /**
   * @description 地图示例（若不主动传，需将组件作为AMap的子组件）
   */
  _mapIns?: any;
  /**
   * @description 海量点数据
   */
  massData: any;
  /**
   * @description 可通过configKey配置对应的数据属性
   */
  configKey?: configKey;
  /**
   * @description 存放聚合圈massMarks实例的setState
   */
  setMassMarks?: any;
}
/**
 * @description 便捷文档地址
 * @see https://reactpc.lanhanba.net/components/Map/v2mass-marks
 */

const V2PointCluster: React.FC<V2MassMarksProps> = ({
  massData,
  configKey,
  setMassMarks,
  ...props
}) => {
  const { _mapIns } = props;

  const drawMass = () => {
    // 归类数据，生成样式
    const massPointsStyle: any[] = []; // 海量点样式
    const massPoints: any[] = []; // 海量点数据

    massData.forEach((itemData) => {
      const id = itemData[configKey?.id || 'id'];
      const url = itemData[configKey?.url || 'url'];

      // 如果数据中是lnglat，则直接使用,否则根据配置的key获取
      if (!itemData.lnglat) {
        const lng = itemData[configKey?.lng || 'lng'];
        const lat = itemData[configKey?.lat || 'lat'];
        itemData.lnglat = [+lng, +lat];
      }

      // 判断是否已经存入同项数据的样式
      const targetIndex = massPointsStyle.findIndex((styleItem: any) => styleItem.id === id);
      // 已经有了
      if (targetIndex !== -1) {
        itemData.style = targetIndex;
      } else {
        // 如果没有，则生成样式
        massPointsStyle.push({
          id,
          url,
          style: massPointsStyle.length,
          size: new window.AMap.Size(32, 32),
        });
      }
      massPoints.push(itemData);
    });

    const mass = new window.AMap.MassMarks(massPoints, {
      style: massPointsStyle,
    });
    mass.setMap(_mapIns); // 将海量点插入地图
    setMassMarks && setMassMarks(mass);
  };

  useEffect(() => {
    if (isArray(massData) && massData.length > 0) {
      drawMass();
    }
  }, [massData]);

  return <></>;
};

export default V2PointCluster;
