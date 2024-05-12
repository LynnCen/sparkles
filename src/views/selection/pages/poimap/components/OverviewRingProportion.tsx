import {
  FC,
  useEffect,
  useRef,
  useMemo
} from 'react';
import { isArray } from '@lhb/func';
import {
  COUNTRY_LEVEL,
  PROVINCE_LEVEL,
  CITY_LEVEL
} from '@/common/components/AMap/ts-config';
import { poiBrandDistribution } from '@/common/api/selection';
import { ringChartStyle } from '@/common/utils/map';

const OverviewRingProportion: FC<any> = ({
  _mapIns,
  level,
  targetZoom,
  city,
  // dataRef,
  treeCheckedKeys
}) => {
  const ringMarkersGroup: any = useRef(null);
  const textMarker: any = useRef({
    marker: null,
    isShow: false
  });
  const levelRef = useRef(level);

  // 是否展示环状图覆盖物
  const checkedIsBrand = useMemo(() => {
    // 地图的缩放级别大于区时不展示markers
    if (level > CITY_LEVEL) return;
    // 左侧树有选中
    if (isArray(treeCheckedKeys) && treeCheckedKeys.length) {
      return true;
      // // 存储的品牌key
      // const { brandKeyId } = dataRef.current;
      // // 选择的是品牌类型 && 在省和市级别下才显示
      // if (treeCheckedKeys.every((key: string) => brandKeyId.has(key))) {
      //   return true;
      // }
      // return false;
    }
    return false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeCheckedKeys, level]);

  // 获取对应层级的行业id
  // const getTargetBrandIds = useMemo(() => {
  //   if (checkedIsBrand) { // 左侧树选中的是品牌
  //     // 存储的品牌key
  //     const { brandKeyId } = dataRef.current;
  //     const brandIds: Array<number> = [];
  //     treeCheckedKeys.forEach((keyItem: string) => { // 遍历选中的keys，例如['0,', '0-0', '0-0-1']
  //       // 卫语句 不存在就跳过
  //       if (!brandKeyId.has(keyItem)) return;
  //       const targetBrand: any = brandKeyId.get(keyItem); // 选中的key对应的品牌数据
  //       const { id: brandId } = targetBrand || {};
  //       brandId && brandIds.push(brandId);
  //     });
  //     return brandIds;
  //   }
  //   return null;
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [checkedIsBrand, treeCheckedKeys]);

  useEffect(() => {
    if (checkedIsBrand) { // 需要展示行业数量的卡片
      getBrandDistribution();
      return;
    }
    // 不展示markers
    ringMarkersGroup.current && ringMarkersGroup.current.clearOverlays();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedIsBrand, treeCheckedKeys]);

  useEffect(() => {
    // 全国范围的缩放级别下，移动地图中心点不触发
    if (level === COUNTRY_LEVEL && levelRef.current === level) return;
    if (checkedIsBrand) {
      getBrandDistribution();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city?.id, level]);

  const getBrandDistribution = async () => {
    ringMarkersGroup.current && ringMarkersGroup.current.clearOverlays();
    const { provinceId, id: cityId } = city;
    const params: any = {
      // brandIdList: getTargetBrandIds || []
      brandIdList: treeCheckedKeys
    };
    levelRef.current = level; // 记录请求接口时的level值
    // 省缩放级别
    if (level === PROVINCE_LEVEL && provinceId) {
      params.provinceId = provinceId;
    }
    // 市缩放级别
    if (level === CITY_LEVEL && cityId) {
      params.cityId = cityId;
    }
    const data = await poiBrandDistribution(params);
    isArray(data) && drawOverviewRing(data);
  };

  // 绘制环状图覆盖物
  const drawOverviewRing = (data: Array<any>) => {
    const markers: Array<any> = []; // 覆盖物
    data.forEach((item: any) => {
      const { brandCountList, lng, lat } = item;
      // 计算每组环状图的总数
      const total = isArray(brandCountList)
        ? brandCountList.reduce(
          (totalNum: number, cur: any) =>
            totalNum + cur.count || 0, // 累加
          0)
        : 0;
      const ringItemStyle = ringChartStyle(brandCountList || [], total);
      // 环状图元素
      const content = `<div style='background: conic-gradient(${ringItemStyle.join(',')});' class='ringWrapper'>
          <div class='innerRing'>
            <div class='fs-12 bold'>${item.name}</div>
            <div class='fs-12 bold'>${total}</div>
          </div>
        </div>`;
      const lnglat = [+lng, +lat];
      // 通过自定义marker将环状图元素插入地图
      const marker = new window.AMap.Marker({
        // zooms: zooms,
        content: content,
        anchor: 'bottom-left',
        // bubble: true,
        position: lnglat,
        // 台湾省没数据，产品要求置最底层，默认zIndex为4
        zIndex: item.id === 32 ? 1 : 4
      });
      markers.push(marker);

      // 鼠标移入环状图覆盖物展示的内容，放在外面是因为在mouseover在map遍历时会有一个奇怪的标点符号出现在html中
      let rowItem = '';
      isArray(brandCountList) ? brandCountList.forEach((brandItem: any) => {
        rowItem += `<div class='itemRow'>
        <div class='label'>${brandItem.brandName}：</div>
        <div class='valCon rt'>${brandItem.count} | ${total > 0 ? (brandItem.count / total * 100).toFixed(2) : 0}%</div>
      </div>`;
      }) : '';
      marker.on('click', () => {
        _mapIns.setZoomAndCenter(targetZoom, lnglat);
      });
      // 鼠标移入时展示具体占比信息
      marker.on('mouseover', () => {
        const div = document.createElement('div');
        div.className = isArray(brandCountList) ? 'cardMarkerWrapper' : '';
        div.innerHTML = `<div class='contentWrapper'>
            ${isArray(brandCountList) ? rowItem : ''}
          </div>`;

        div.addEventListener('mouseenter', () => {
          textMarker.current.isShow = true;
          textMarker.current.marker && textMarker.current.marker.show();
        });

        div.addEventListener('mouseleave', () => {
          textMarker.current.isShow = false;
          textMarker.current.marker && textMarker.current.marker.hide();
        });
        textMarker.current.marker = new window.AMap.Marker({
          position: lnglat,
          content: div,
        });
        _mapIns.add(textMarker.current.marker);
      });
      marker.on('mouseout', () => {
        if (textMarker.current.isShow) return;
        textMarker.current.isShow = false;
        textMarker.current.marker && textMarker.current.marker.hide();
      });
    });
    // 覆盖物群组
    ringMarkersGroup.current = new window.AMap.OverlayGroup(markers);
    _mapIns.add(ringMarkersGroup.current);
  };

  return (
    <></>
  );
};

export default OverviewRingProportion;
