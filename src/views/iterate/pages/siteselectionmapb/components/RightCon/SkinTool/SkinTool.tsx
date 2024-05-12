/**
 * @Description 左下角地图皮肤工具箱
 */
import { FC, useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import { Tooltip } from 'antd';
import IconFont from '@/common/components/IconFont';
import { getFoodHeapMap, getHeatMapList } from '@/common/api/selection';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { debounce } from '@lhb/func';
import { mapToolBoxImg, mapToolEnum } from '../../../ts-config';
import cs from 'classnames';
type activeType = mapToolEnum.normal | mapToolEnum.satellite | mapToolEnum.population | mapToolEnum.food;

const FootHeatMapZoom = 15.3;// 产品确定的zoom

const mapToolBox = [
  { content: '普通地图', key: mapToolEnum.normal },
  { content: '卫星地图', key: mapToolEnum.satellite },
  // { content: '人口热力', key: mapToolEnum.population },
  // { content: '餐饮热力', key: mapToolEnum.food }
];

const SkinTool:FC<any> = ({
  mapIns,
  mapHelpfulInfo,
  isPositioning,
  targetCity
}) => {
  const { city, district, level } = mapHelpfulInfo;

  const [active, setActive] = useState<activeType>(mapToolEnum.normal);// 当前选中项
  const [radius, setRadius] = useState<number>(0);// 获取可视范围左上角到地图中心点的距离，作为半径
  const [curZoom, setCurZoom] = useState<number>(0);// 获取当前的zoom
  const [center, setCenter] = useState<any>();// 中心点

  const satelliteRef = useRef<any>(null);// 卫星地图
  const heatMapRef = useRef<any>(null);// 热力图
  const polygonRef = useRef<any>([]);// 餐饮热力图（围栏）

  // 处理点击事件
  const handleActive = (item) => {
    // 当在全国、省级别选择人口热力或者餐饮热力时，提示信息并无法选中
    if (
      (mapToolEnum.population === item.key && level < CITY_LEVEL) ||
      (curZoom < FootHeatMapZoom && item.key === mapToolEnum.food)
    ) {
      V2Message.warning('当前范围过大，热力效果无法加载，请缩小地图查看');
      return;
    }
    setActive(item.key);
  };

  // 处理人口热力图，选中或区id改变后触发
  const handleHeatMap = async() => {
    if (active !== mapToolEnum.population) return;
    const data = await getHeatMapList({
      provinceId: city?.provinceId,
      cityId: city?.id,
      districtId: district?.id,
    });
    heatMapRef.current.show();
    heatMapRef.current?.setDataSet({ data });
  };

  // 处理餐饮热力，选中或zoomend后触发
  const handleFoodHeatMap = async() => {
    if (active !== mapToolEnum.food) return;
    // 先清空上一次的
    polygonRef.current?.length && polygonRef.current.map((polygon) => {
      mapIns.remove(polygon);
    });
    polygonRef.current = [];
    const center = mapIns.getCenter();
    const data = await getFoodHeapMap({
      range: radius,
      lng: center.lng,
      lat: center.lat,
    });
    let maxPoiNum = 0;
    data.map((item) => {
      if (item.poiNum > maxPoiNum) {
        maxPoiNum = item.poiNum;
      }
    });

    data.map((item) => {
      createFoodHeatMap(item, maxPoiNum);
    });
    const overlayGroups = new window.AMap.OverlayGroup(polygonRef.current);
    mapIns.add(overlayGroups);
  };
  // 绘制餐饮热力
  const createFoodHeatMap = (item, maxPoiNum) => {
    const path = item.grid.map((item) => {
      return [item?.lng, item?.lat];
    });
    // 如果小于0.1则显示0.1
    const opacity = item.poiNum / maxPoiNum < 0.1 ? 0.1 : item.poiNum / maxPoiNum;
    const polygon = new window.AMap.Polygon({
      path: path,
      fillColor: '#9059FF',
      strokeOpacity: opacity,
      fillOpacity: opacity,
      strokeColor: '#9059FF',
      strokeWeight: 0.8,
      strokeStyle: 'dashed',
    });
    polygonRef.current.push(polygon);
  };
  // 处理地图缩放，获取半径
  const handleZoomEnd = debounce(() => {

    const zoom = mapIns.getZoom();
    const center = mapIns.getBounds().getCenter(); // 获取地图可视区域的中心点坐标
    setCurZoom(zoom);
    setCenter(center);
    if (zoom >= FootHeatMapZoom) {
      const northWest = mapIns.getBounds().getNorthWest(); // 获取地图可视区域的西北坐标（左上角）
      const radius = window.AMap.GeometryUtil.distance(northWest, center);// 获取两点之间的距离
      // 最多1000m
      setRadius(radius > 1000 ? 1000 : radius);
    }
  }, 100);
  // 初始化，引入卫星地图、人口热力,绑定缩放事件
  useEffect(() => {
    if (!mapIns) return;
    // 初始化卫星地图
    satelliteRef.current = new window.AMap.TileLayer.Satellite(mapIns);
    satelliteRef.current.setMap(null);
    // 初始化热力地图
    heatMapRef.current = new window.AMap.HeatMap(mapIns, {
      radius: 25,
      opacity: [0, 0.6],
    });
    mapIns.on('moveend', handleZoomEnd);
    return () => {
      mapIns.off('moveend', handleZoomEnd);
    };
  }, [mapIns]);

  // 当选项改变的时候，设置对应的地图样式
  useEffect(() => {
    if (active === mapToolEnum.satellite) {
      // 当选中卫星地图时
      satelliteRef.current?.setMap(mapIns);
    } else {
      satelliteRef.current?.setMap(null);
    }

    if (active === mapToolEnum.population) {
      // 当选中人口热力时
      handleHeatMap();
    } else {
      heatMapRef.current?.hide();
    }

    if (active === mapToolEnum.food) {
      // 当选中餐饮热力时
      handleFoodHeatMap();
    } else {
      polygonRef.current?.length && polygonRef.current.map((polygon) => {
        mapIns.remove(polygon);
      });
      polygonRef.current = [];
    }
  }, [active]);

  // 当地图区id改变或者层级改变，处理人口热力
  useEffect(() => {
    if (active !== mapToolEnum.population) return;

    if (level < CITY_LEVEL) {
      V2Message.warning(`当前范围过大，热力效果无法加载，请缩小地图查看`);
      heatMapRef.current.hide();
      setActive(mapToolEnum.normal);
      return;
    }
    handleHeatMap();
  }, [level, district?.id, active]);

  // 当半径或者层级改变时，处理餐饮热力
  useEffect(() => {
    if (active !== mapToolEnum.food) return;

    if (curZoom < FootHeatMapZoom) {
      V2Message.warning(`当前范围过大，热力效果无法加载，请缩小地图查看`);
      polygonRef.current?.length && polygonRef.current.map((polygon) => {
        mapIns.remove(polygon);
      });
      polygonRef.current = [];
      setActive(mapToolEnum.normal);
      return;
    }
    handleFoodHeatMap();
  }, [radius, active, curZoom, center]);

  useEffect(() => {
    if (!mapIns) return;
    handleZoomEnd();
  }, [mapIns, isPositioning]);

  return <div className={cs(styles.skinToolCon, targetCity ? '' : styles.rightMove)}>
    {
      mapToolBox.map((item, index) =>
        <Tooltip
          placement='top'
          title={item.content}
          color='#000000'
          key={item.key}>
          <div
            onClick={() => handleActive(item)}
            className={cs(styles.card, active === item.key ? styles.active : '')}>
            <img src={mapToolBoxImg[index]} className={styles.img}/>
            {active === item.key
              ? <span className={styles.selectedBox}>
                <IconFont iconHref='iconic_wancheng' className={styles.icon}/>
              </span>
              : <></>}
          </div>
        </Tooltip>
      )
    }
  </div>;
};
export default SkinTool;
