import {
  FC,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { isArray } from '@lhb/func';
import {
  COUNTRY_LEVEL,
  PROVINCE_LEVEL,
  CITY_LEVEL
} from '@/common/components/AMap/ts-config';
import { poiCollectIndustry } from '@/common/api/selection';

const OverviewCount: FC<any> = ({
  _mapIns,
  level,
  targetZoom,
  city,
  dataRef,
  treeCheckedKeys
}) => {
  const markersGroup: any = useRef(null);
  const levelRef = useRef(level);

  // 是否展示卡片覆盖物
  const checkedIsIndustry = useMemo(() => {
    // 地图的缩放级别大于区级时不展示markers
    if (level > CITY_LEVEL) return;
    // 左侧树有选中
    if (isArray(treeCheckedKeys) && treeCheckedKeys.length) {
      // 存储的行业key
      const { industryKeyId } = dataRef.current;
      // 选择的是行业类型
      if (treeCheckedKeys.every((key: string) => industryKeyId.has(key))) {
        return true;
      }
      return false;
    }
    return false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeCheckedKeys, level]);

  // 获取对应层级的行业id
  const getTargetIndustryLevel = useMemo(() => {
    if (checkedIsIndustry) { // 左侧树选中的是行业
      // 存储的行业key
      const { industryKeyId } = dataRef.current;
      const industryLevel = new Map(); // map结构，按照行业level为key，id为value
      treeCheckedKeys.forEach((keyItem: string) => { // 遍历选中的keys，例如['0,', '0-0', '0-0-1']
        // 卫语句 不存在就跳过
        if (!industryKeyId.has(keyItem)) return;
        const targetIndustryVal: any = industryKeyId.get(keyItem); // 选中的key对应的行业数据
        const { level: targetLevel, id: industryId } = targetIndustryVal || {};
        if (industryLevel.has(targetLevel)) { // 已经存储过对应的行业层级key，push进数组
          industryLevel.set(targetLevel, [...industryLevel.get(targetLevel), industryId]);
          return;
        }
        industryLevel.set(targetLevel, [industryId]);
      });
      return industryLevel;
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedIsIndustry, treeCheckedKeys]);

  useEffect(() => {
    if (checkedIsIndustry) { // 需要展示行业数量的卡片
      getCollectIndustry();
      return;
    }
    // 不展示markers
    markersGroup.current && markersGroup.current.clearOverlays();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedIsIndustry, treeCheckedKeys]);

  useEffect(() => {
    // 全国范围的缩放级别下，移动地图中心点不触发
    if (level === COUNTRY_LEVEL && levelRef.current === level) return;
    if (checkedIsIndustry) {
      getCollectIndustry();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city?.id, level]);

  // 请求接口，获取省市缩放级别下的行业数量
  const getCollectIndustry = async () => {
    // 清除上一次的markers
    markersGroup.current && markersGroup.current.clearOverlays();
    const firstIndustryIdList = getTargetIndustryLevel ? getTargetIndustryLevel.get(1) : null; // 一级行业ID数组
    const secondIndustryIdList = getTargetIndustryLevel ? getTargetIndustryLevel.get(2) : null; // 二级行业ID数组
    const thirdIndustryIdList = getTargetIndustryLevel ? getTargetIndustryLevel.get(3) : null; // 三级行业ID数组
    const { provinceId, id: cityId } = city;
    const params: any = {};
    levelRef.current = level; // 记录请求接口时的level值
    // 省缩放级别
    if (level === PROVINCE_LEVEL && provinceId) {
      params.provinceId = provinceId;
    }
    // 市缩放级别
    if (level === CITY_LEVEL && cityId) {
      params.cityId = cityId;
    }
    firstIndustryIdList && (params.firstIndustryIdList = firstIndustryIdList);
    secondIndustryIdList && (params.secondIndustryIdList = secondIndustryIdList);
    thirdIndustryIdList && (params.thirdIndustryIdList = thirdIndustryIdList);
    const data = await poiCollectIndustry(params);
    isArray(data) && drawOverviewCount(data);
  };

  // 绘制数量卡片覆盖物
  const drawOverviewCount = (data: Array<any>) => {
    const markers: Array<any> = [];
    data.forEach((item: any) => {
      const { lat, lng } = item;
      // 没有经纬度时，跳过
      if (!(lat && lng)) return;
      const marker = new window.AMap.Marker({
        content: `<div class='cardWrapper'>
          <div class='bold fs-12'>${item.name ? item.name : '-'}</div>
          <div class='cardVal'>${item.count}</div>
          </div>`,
        anchor: 'bottom-center',
        position: new window.AMap.LngLat(+lng, +lat),
        offset: [0, -6]
      });
      marker.on('click', () => {
        _mapIns.setZoomAndCenter(targetZoom, [lng, lat]);
      });
      markers.push(marker);
    });
    // 覆盖物群组
    markersGroup.current = new window.AMap.OverlayGroup(markers);
    _mapIns.add(markersGroup.current);
  };

  return (
    <></>
  );
};

export default OverviewCount;
