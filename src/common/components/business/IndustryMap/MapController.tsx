import { areaMap, areaMapShare, fetchMapDistrict, fetchMapDistrictShare } from '@/common/api/selection';
import { getTenantInfo } from '@/common/api/system';
import { CITY_LEVEL, CITY_ZOOM } from '@/common/components/AMap/ts-config';
import { valueFormat } from '@/common/utils/ways';
import { isArray, urlParams, isMobile } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import dayjs from 'dayjs';
import { FC, useEffect, useRef, useState } from 'react';
// import { areaDeatil } from '../../../../views/selection/pages/industry/ts-config';
// 目前的数据格式是"销售、交付、售后"，如果格式不同需要找数据部门黄武
// poi.function
const statusColor = [
  { label: '销售', color: '#006AFF' },
  { label: '交付', color: '#009963' },
  { label: '售后', color: '#222222' },
];

const MapController: FC<any> = ({
  level,
  city,
  brandCheckList,
  _mapIns,
  areaCheckList,
  month,
  setCurAreaInfo,
  areaColorMap,
  areaIconMap,
  showRankArea,
  featureVal,
  cityIds,
  tenantInfo
}) => {
  const labelMarkerRef = useRef<any>(null);
  const [areaGroupIns, setAreaGroup] = useState<any>(null);
  const [markerGroupIns, setMarkerGroup] = useState<any>(null);
  const isShare = urlParams(location.search)?.isShare;
  const zoom = _mapIns.getZoom();
  useEffect(() => {
    if (!_mapIns) return;
    labelMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      map: _mapIns,
      anchor: 'top-left',
      offset: [-34, 6],
      zIndex: 15,
      // topWhenClick: true
    });
    const areaGroup = new window.AMap.OverlayGroup();
    const markerGroupIns = new window.AMap.OverlayGroup();
    _mapIns.add(areaGroup);
    _mapIns.add(markerGroupIns);
    setAreaGroup(areaGroup);
    setMarkerGroup(markerGroupIns);
  }, [_mapIns]);
  useEffect(() => {
    if (level < CITY_LEVEL) {
      areaGroupIns?.clearOverlays();
      markerGroupIns?.clearOverlays();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);
  useEffect(() => {
    // 商圈的显示逻辑。为了刷新时不影响品牌点独立处理
    if (!_mapIns) return;
    areaGroupIns?.clearOverlays(); // 清除覆盖物群组
    if (areaCheckList.length === 0) return;
    // if (level >= DISTRICT_LEVEL) {
    if (level >= CITY_LEVEL) {
      getAreaList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaCheckList, level, city, _mapIns, showRankArea, areaGroupIns]);
  useEffect(() => {
    if (!_mapIns) return;
    markerGroupIns?.clearOverlays();
    if (brandCheckList.length === 0) return;

    if (level >= CITY_LEVEL) {
      createDistrictLayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, brandCheckList, city, _mapIns, month, featureVal]);

  const [shopFunctionStatus, setShopFunctionStatus] = useState<boolean>(false);
  const setTenantInfo = async () => {
    const data = await getTenantInfo();
    data && data.shopFunctionStatus && data.shopFunctionStatus > 0 && setShopFunctionStatus(true);
  };

  useEffect(() => {
    if (isShare) return;
    setTenantInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { createDistrictLayer, getAreaList, getAreaMarkerOpts, clickItemAreaMarker } = useMethods({
    createDistrictLayer: async () => {
      // 门店功能全不选的情况下传-1， 不然服务端会返回全部的
      const optionsVal = featureVal && featureVal.length ? featureVal : [-1];

      const params: any = {
        cityId: city.id,
        brandIds: brandCheckList,
        month: dayjs(month).format('YYYY-MM'),
      };
      // 取区id，districtId
      // const index = city.districtList.findIndex(e => e.name.includes(city.district));
      // index !== -1 && (params.districtId = city.districtList[index].id);

      if (shopFunctionStatus) {
        params.shopFunctions = optionsVal;
      }
      if (isShare) {
        params.cityIds = cityIds;
      }
      const api = isShare ? fetchMapDistrictShare : fetchMapDistrict;
      const res = await api(params);
      const markerList: any = [];
      res.forEach((poi) => {
        // poi.function目前的数据格式是"销售、交付、售后"，如果格式不同需要找数据部门黄武
        const color = statusColor.find((item) => item.label === poi?.function?.split('、')?.at(-1))?.color;
        const marker = new window.AMap.Marker({
          zooms: [CITY_ZOOM, 20],
          map: _mapIns,
          // 门店功能选择展示状态 0-不展示 1-汽车行业（销售、售后、交付） 2-餐饮行业（堂食、外卖）
          content: tenantInfo.shopFunctionStatus !== 1 ? `<div class='iconBox'>
          <div class='container'>
          ${poi.logo && poi.logo !== ''
    ? `<img src=${poi.logo} />` : ''}
          </div>
        </div>`
            : `<div class="carIconBox">
        <span class="triangle"></span>
        <span class="dot" style="background: ${color}"></span>
        <span class="text" style="color: ${color}">${poi.function.split('、').join('&')}</span>
        ${poi.logo && poi.logo !== '' ? `<img src=${poi.logo} />` : ''}
        </div>`,
          anchor: 'bottom-center',
          position: new window.AMap.LngLat(poi.lng, poi.lat),
        });

        let labelContent = `<div class='label'><div class='title'>${valueFormat(poi.name)}</div>`;
        labelContent += `<div class='marker'><div class='itemlabel'>开店类型：</div><div>${valueFormat(
          poi.openTypeName
        )}</div></div>`;
        labelContent += `<div class='marker'><div class='itemlabel'>营业状态：</div><div>${valueFormat(
          poi.statusName
        )}</div></div>`;
        labelContent += `<div class='marker'><div class='itemlabel'>门店类型：</div><div>${valueFormat(
          poi.typeName
        )}</div></div>`;
        labelContent += `<div class='marker'><div class='itemlabel'>门店功能：</div><div>${valueFormat(
          poi.function
        )}</div></div>`;
        labelContent += `<div class='marker'><div class='itemlabel'>地址：</div><div>${valueFormat(
          poi.address
        )}</div></div>`;
        labelContent += `<div class='marker'>
        <div class='itemlabel'>经纬度：</div>
        <div>${poi.lng ? Number.parseFloat(poi.lng).toFixed(1) + 'E' : '-'}，${
  poi.lat ? Number.parseFloat(poi.lat).toFixed(1) + 'N' : '-'
}</div></div>`;
        labelContent += '</div>';
        marker.on('mouseover', () => {
          labelMarkerRef.current.setMap(_mapIns);
          labelMarkerRef.current.setPosition([poi.lng, poi.lat]);
          labelMarkerRef.current.setContent(labelContent);
        });
        marker.on('mouseout', () => {
          labelMarkerRef.current.setContent(' ');
        });
        if (isMobile() && isShare) {
          marker.on('click', () => {
            labelMarkerRef.current.setMap(_mapIns);
            labelMarkerRef.current.setPosition([poi.lng, poi.lat]);
            labelMarkerRef.current.setContent(labelContent);

            setTimeout(() => {
              labelMarkerRef.current.setContent(' ');
            }, 3000);
          });
        }
        markerList.push(marker);
      });
      markerGroupIns?.addOverlays(markerList);
    },
    getAreaMarkerOpts: (item) => {
      // 绘制重点区域中商圈上的点标记
      const opts: any = {
        zooms: [CITY_ZOOM, 20],
        anchor: 'bottom-center',
        position: item.lng && item.lat ? [item.lng, item.lat] : item.fence[0],
        extData: item,
        content: ``,
      };
      const hasRank = showRankArea?.includes(item.areaId); // 是否展示排名
      const color = areaColorMap[item.areaId];
      const icon = areaIconMap[item.areaId];
      if (hasRank) {
        // 生成带排名的icon
        opts.content = `<div style='background: ${color}' class='rankMarker'>
        <div style='border-top: 6px solid ${color}' class='trangle'></div>
         ${item.rank ? 'NO.' + item.rank : ''}
        </div>`;
        // 带排名的叠加顺序高，优先展示，默认值：12
        opts.zIndex = 13;
      } else {
        opts.content = `<div>
                    <svg class='iconSvg fs-28' aria-hidden>
                      <use xlink:href='#${icon}' />
                    </svg>
                   </div>`;
      }
      return opts;
    },
    // 获取选中的重点商圈对应的数据
    getAreaList: async () => {
      // const { district, districtList } = city;
      // // 根据当前城市中的数据获取当前地图中心点的区域id
      // let districtId = '';
      // if (isArray(districtList) && district) {
      //   const target = districtList.find((item: any) => item.name.includes(district));
      //   if (target) {
      //     districtId = target?.id;
      //   }
      // }
      const params: any = {
        cityId: city.id,
        areaIds: areaCheckList,
      };
      // districtId && (params.districtId = districtId); // 市级别下传入区域id可返回聚合区的数据
      const api = isShare ? areaMapShare : areaMap;
      const res = await api(params);
      if (res.length === 0) return;
      const polygons: any = [];
      res.forEach((item) => {
        if (!isArray(item.fence) || item.fence.length === 0) return;
        // 绘制商圈覆盖物
        const polygon = new window.AMap.Polygon({
          path: item.fence,
          fillColor: areaColorMap[item.areaId],
          strokeOpacity: 1,
          fillOpacity: 0.3,
          strokeColor: areaColorMap[item.areaId],
          strokeWeight: 1,
          strokeStyle: 'dashed',
        });
        let labelContent = `<div class='label'>`;
        isArray(item.importValues) && item.importValues.length && item.importValues.map((item) => {
          if (item.name === '商圈名称') {
            labelContent += `<div class='bold mb-14'>${item.value}</div>`;
          }
        });
        const filterInfo = ['省', '市', '区', '地理围栏'];
        isArray(item.importValues) && item.importValues.length && item.importValues.map((item) => {
          filterInfo.includes(item.name) ? null
            : labelContent = labelContent + `<div class='container'><span class='itemlabel'>${item.name}：</span><span class='content'>${valueFormat(item.value)}</span></div>`;
        });
        labelContent += '</div>';
        // areaDeatil.forEach((detailItem) => {
        // const isExclusiveLine =
        //   (detailItem.key === 'electricBrands' ||
        //     detailItem.key === 'luxuryBrands' ||
        //     detailItem.key === 'ecology') &&
        //   item[detailItem.key];
        // labelContent += `<div ${isExclusiveLine ? '' : `class='marker'`}>
        //   <div class='itemlabel'>${detailItem.label}：</div>
        //   <div>${valueFormat(item[detailItem.key], detailItem.unit)}</div>
        // </div>`;
        // });
        // labelContent += `<div class='marker'>
        // <div class='itemlabel'>经纬度：</div>
        // <div>${item.lng?.toFixed(1) + 'E'}，${item.lat?.toFixed(1) + 'N'}</div></div>`;
        // labelContent += '</div>';
        // const labelContent = `<div>1</div>`;
        polygon.on('mouseover', () => {
          polygon.setOptions({
            fillOpacity: 0.4,
            strokeStyle: 'solid',
          });
          labelMarkerRef.current.setMap(_mapIns);
          labelMarkerRef.current.setPosition(item.lng && item.lat ? [item.lng, item.lat] : item.fence[0]);
          labelMarkerRef.current.setContent(labelContent);
        });
        polygon.on('mouseout', () => {
          polygon.setOptions({
            fillOpacity: 0.3,
            strokeStyle: 'dashed',
          });
          labelMarkerRef.current.setContent(' ');
        });
        polygon.on('click', () => {
          if (isMobile() && isShare) return;
          setCurAreaInfo(item);
          _mapIns.setFitView(polygon);
        });

        if (isMobile() && isShare) {
          polygon.on('click', () => {
            polygon.setOptions({
              fillOpacity: 0.4,
              strokeStyle: 'solid',
            });
            labelMarkerRef.current.setMap(_mapIns);
            labelMarkerRef.current.setPosition(item.lng && item.lat ? [item.lng, item.lat] : item.fence[0]);
            labelMarkerRef.current.setContent(labelContent);
            setTimeout(() => {
              polygon.setOptions({
                fillOpacity: 0.3,
                strokeStyle: 'dashed',
              });
              labelMarkerRef.current.setContent(' ');
            }, 3000);
          });
        }
        polygons.push(polygon);
        // if (item.rank <= 10) {
        // 增加商圈icon
        if (zoom < 17.5) {
          const areaMarker = new window.AMap.Marker(getAreaMarkerOpts(item));
          areaMarker.on('click', clickItemAreaMarker);
          polygons.push(areaMarker);
        }

        // }
      });
      areaGroupIns?.addOverlays(polygons);
    },
    // 点击每个商圈上的点marker
    clickItemAreaMarker(event: any) {
      // if (isMobile() && isShare) return;
      const { target } = event; // 点击的覆盖物对象
      const { _opts } = target || {};
      const { extData } = _opts || {}; // 获取当前覆盖物绑定的数据
      _mapIns.setFitView(target); // 将地图缩放到合适级别(marker过小，商圈展示不太合理)
      // _mapIns.setCenter(target._position);
      // _mapIns.setZoom(16);
      extData && setCurAreaInfo(extData); // 设置右边商圈具体信息的展示内容
    },
  });
  return <></>;
};

export default MapController;
