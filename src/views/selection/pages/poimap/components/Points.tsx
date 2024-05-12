import {
  FC,
  useEffect,
  useRef,
  useMemo
} from 'react';
import { isArray } from '@lhb/func';
import { poiMapBrandList } from '@/common/api/selection';
import { DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';

const Points: FC<any> = ({
  _mapIns,
  level,
  city,
  // dataRef,
  treeCheckedKeys
}) => {
  const pointMarkersGroup: any = useRef(null);
  const textMarker: any = useRef({
    marker: null,
    isShow: false
  });

  // 递归遍历查找对应的品牌集合
  // const recursionBrandData = (data: Array<any>, ids: Array<number>) => {
  //   data.forEach((item: any) => {
  //     const { children, isBrand, id } = item;
  //     // 行业层-继续向下遍历
  //     if (isArray(children) && children.length) {
  //       recursionBrandData(children, ids);
  //       return;
  //     }
  //     // 到了最底层-品牌层
  //     if (isBrand) {
  //       ids.push(id);
  //     }
  //   });
  // };

  // 是否展示品牌点
  const showPoiBrands = useMemo(() => {
    // 全国范围、省范围、市范围时不展示
    if (level < DISTRICT_LEVEL) return;
    // 左侧树有选中
    if (isArray(treeCheckedKeys) && treeCheckedKeys.length) {
      // // 存储的品牌key
      // const { brandKeyId } = dataRef.current;
      // // 选择的是品牌类型
      // if (treeCheckedKeys.every((key: string) => brandKeyId.has(key))) {
      //   return true;
      // }
      // return false;
      return true;
    }
    return false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeCheckedKeys, level]);

  // 获取对应的品牌id
  // const getTargetBrandIds = useMemo(() => {
  //   if (showPoiBrands) { // 需要显示品牌时
  //     // 存储的品牌key
  //     const { brandKeyId, industryKeyId, tiledData } = dataRef.current;
  //     const brandIds: Array<number> = [];
  //     // 选择的是品牌类型
  //     if (treeCheckedKeys.every((key: string) => brandKeyId.has(key))) {
  //       treeCheckedKeys.forEach((keyItem: string) => { // 遍历选中的keys，例如['0,', '0-0', '0-0-1']
  //         // 卫语句 不存在就跳过
  //         if (!brandKeyId.has(keyItem)) return;
  //         const targetBrand: any = brandKeyId.get(keyItem); // 选中的key对应的品牌数据
  //         const { id: brandId } = targetBrand || {};
  //         brandId && brandIds.push(brandId);
  //       });
  //       return brandIds;
  //     }
  //     // 选择的是行业，在区级别下展示该行业下的所有品牌，查找该行业下的所有子品牌
  //     const targetIndustryIds: Array<number> = [];
  //     treeCheckedKeys.forEach((keyItem: string) => {
  //       const targetIndustry: any = industryKeyId.get(keyItem); // 选中的key对应的行业
  //       const { id: industryId } = targetIndustry || {};
  //       industryId && targetIndustryIds.push(industryId);
  //     });
  //     // 从平铺的数组中捞出对应的行业
  //     const targetIndustryData = tiledData.filter((item: any) => targetIndustryIds.includes(item.id));
  //     const allBrandIds: Array<number> = [];
  //     // 递归查找该该行业下的品牌
  //     recursionBrandData(targetIndustryData, allBrandIds);
  //     return Array.from(new Set(allBrandIds));
  //   }
  //   return null;
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [showPoiBrands, treeCheckedKeys]);

  useEffect(() => {
    if (showPoiBrands) {
      getPoiBrandList();
      return;
    }
    // 不展示markers
    pointMarkersGroup.current && pointMarkersGroup.current.clearOverlays();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPoiBrands, treeCheckedKeys, city?.district]);
  // useEffect(() => {
  //   console.log(`当前level`, level, showPoiBrands);
  //   if (level < DISTRICT_LEVEL) {
  //     // 不展示markers
  //     pointMarkersGroup.current && pointMarkersGroup.current.clearOverlays();
  //     return;
  //   };
  //   if (showPoiBrands) {
  //     console.log(`触发条件2`, city);
  //     getPoiBrandList();
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [city?.district, level]);

  // 获取对应的品牌列表
  const getPoiBrandList = async () => {
    pointMarkersGroup.current && pointMarkersGroup.current.clearOverlays();
    const { district: districtName, districtList } = city;
    const targetDistrict = districtList.find((item: any) => item.name === districtName);
    const params: any = {
      districtId: targetDistrict?.id,
      // brandIdList: getTargetBrandIds || [],
      brandIdList: treeCheckedKeys
    };
    const data = await poiMapBrandList(params);
    pointMarkersGroup.current && pointMarkersGroup.current.clearOverlays();
    isArray(data) && drawPointMarks(data);
  };

  // 地图上绘制品牌点
  const drawPointMarks = (data: Array<any>) => {
    const markers: Array<any> = [];
    data.forEach((item: any) => {
      const {
        location,
        icon
      } = item;
      const lnglatStrArr = location ? location.split(',') : '';
      if (!(isArray(lnglatStrArr) && lnglatStrArr.length === 2)) return; // 没有经纬度时跳过
      const lnglat = [+lnglatStrArr[0], +lnglatStrArr[1]];
      // 品牌覆盖物
      const marker = new window.AMap.Marker({
        // zooms: [CITY_ZOOM, 20],
        content: `<div class='pointCon'>
          <div class='imgCon'>
            ${icon ? `<img src=${icon} width='100%' height='100%'/>` : ''}
          </div>
        </div>`,
        anchor: 'top-center',
        position: lnglat,
        offset: [-1.5, -36],
      });
      markers.push(marker);

      // 鼠标移入时展示具体信息
      marker.on('mouseover', () => {
        // 创建div后，利用事件委托，监听鼠标的移入移出
        const div = document.createElement('div');
        div.className = 'cardMarkerWrapper';
        div.innerHTML = `<div class='contentWrapper'>
            <div class='fs-14 bold'>${item.brandName}</div>
            <div class='itemRow'>
              <div class='label'>门店名称：</div>
              <div class='valCon'>${item.shopName}</div>
            </div>
            <div class='itemRow'>
              <div class='label'>门店地址：</div>
              <div class='valCon'>${item.shopAddress}</div>
            </div>
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
          anchor: 'top-left',
          offset: [-35, 0],
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
    pointMarkersGroup.current = new window.AMap.OverlayGroup(markers);
    _mapIns.add(pointMarkersGroup.current);
  };

  return (
    <>

    </>
  );
};

export default Points;
