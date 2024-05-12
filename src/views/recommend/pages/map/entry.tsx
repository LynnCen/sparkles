import { FC, useState, useEffect } from 'react';
// import { Map } from 'react-amap';
import { urlParams } from '@lhb/func';
import { getDistrictBounds } from '@/common/utils/map';
import {
  shopRecommendGrids,
  shopRecommendPoints
} from '@/common/api/recommend';
import { get, } from '@/common/request/index';
import { debounce } from '@lhb/func';
import styles from './entry.module.less';
import Positioned from './components/Positioned';
import SupernatantForm from './components/SupernatantForm';
import Result from './components/Result';
import AMap from '@/common/components/AMap';

/**
 * 状态1： 自定义指标推荐（表单填写）
 * 状态2： 推荐结果（结果展示）
 */
const RecommendMap: FC<any> = () => {
  const zoomLevel = 15; // 地图缩放界别
  const id: string | number = urlParams(location.search)?.id || 0; // 详情时的id
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [pluginIsLoaded, setPluginIsLoaded] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<any>({ // 状态1时的搜索框数据
    pcdIds: [],
    visibleForm: false
  });
  const [polygonsBounds, setPolygonsBounds] = useState<Array<any>>([]); // 状态1时行政区域边界范围
  // 状态1时区分行政区域
  const [administrativeRegion, setAdministrativeRegion] = useState<any>({
    name: '杭州', // 名称（城市名或区域名）
    level: 'city' // 行政级别（市、区）
  });
  // 状态2时的 聚合数据
  const [aggregatedData, setAggregatedData] = useState<any>({
    data: [],
    markers: [], // 覆盖物
    instance: null, // 覆盖物群组的实例
  });
  // 状态2时的 点数据
  const [pointsData, setPointsData] = useState<any>({
    data: [],
    instance: null // 实例
  });
  // 状态2时的 高亮的状态区域
  const [targetHighlightMarker, setTargetHighlightMarker] = useState<any>({
    marker: null,
    score: 0
  });

  // 状态2时 点的label的marker
  const [targetLabelMarker, setTargetLabelMarker] = useState<any>(null);
  const [clickTargetPolymer, setClickTargetPolymer] = useState<any>(null);
  // 状态2时 分数的覆盖物群组
  const [scoreGroupMarker, setScoreGroupMarker] = useState<any>(null);
  const scoreColor = [
    '#c38e82',
    '#d29183',
    '#ffeff2',
    '#ffdee4',
    '#ffcdd6',
    '#ffbcc8',
    '#ffabba',
    '#ff9aac',
    '#ff899e',
    '#ff7890',
    '#ff6782',
    '#ff5674',
    '#ff4567',
    '#ff3459',
    '#ff234b',
    '#ff012f',
    '#f42626',
    '#ec4949',
    '#fb4c4c',
    '#f90909',
    '#ff0000'
  ];

  useEffect(() => {
    if (!amapIns) return; // 地图要先加载完
    if (id) { // 状态2 详情时
      getAggregatedData(); // 获取聚合数据
      return;
    }
    pluginIsLoaded && targetBounds(); // 状态1 行政区域范围
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns, administrativeRegion, pluginIsLoaded]);

  useEffect(() => {
    amapIns && amapIns.on('zoomend', zoomChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);

  useEffect(() => {
    if (!id) return;

    // 将高亮的聚合区域图形颜色变回原来颜色
    clickTargetPolymer && targetHighlightMarker.marker && targetHighlightMarker.marker.setOptions({
      fillOpacity: 0.3,
      fillColor: scoreColor[targetHighlightMarker.score],
      strokeColor: scoreColor[targetHighlightMarker.score]
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickTargetPolymer]);

  const amapCreated = (ins: any) => {
    setAmapIns(ins);
    !id && window.AMap.plugin(['AMap.DistrictSearch'], () => {
      setPluginIsLoaded(true);
    });
  };

  // 状态1 显示行政区域
  const targetBounds = async () => {
    const { name, level } = administrativeRegion;
    const bounds: any = await getDistrictBounds({
      subdistrict: 0, // 获取边界不需要返回下级行政区
      extensions: 'all', // 返回行政区边界坐标组等具体信息
      level // 查询行政级别为 市
    }, name);

    polygonsBounds && amapIns && amapIns.remove(polygonsBounds); // 清除上次结果
    const polygons: Array<any> = [];
    for (let i = 0, l = bounds.length; i < l; i++) {
      // 生成行政区划polygon
      const polygon = new window.AMap.Polygon({
        strokeWeight: 1,
        path: bounds[i],
        fillOpacity: 0.2,
        fillColor: '#006aff',
        strokeColor: '#006aff'
      });
      polygons.push(polygon);
    }
    setPolygonsBounds(polygons);
    amapIns.add(polygons);
    amapIns.setFitView(polygons);// 视口自适应
  };

  // 状态2 聚合数据
  const getAggregatedData = () => {
    // 获取聚合区域数据]
    shopRecommendGrids({ id })
      .then(({ grid }) => {
        const markers: Array<any> = [];
        // 绘制区域图形
        grid.forEach((val: any, index: number) => {
          val.index = index;
          const { site, score } = val;
          const path = site.map((siteItem: any) => [siteItem.lng, siteItem.lat]);
          const polygonAggregation = drawAggregatedArea(path, score); // 绘制区域
          markers.push(polygonAggregation);
          polygonAggregation.on('click', clickPolygonAggregation);
        });
        const overlayGroups = new window.AMap.OverlayGroup(markers);
        amapIns.add(overlayGroups);
        amapIns.setFitView(markers);
        setAggregatedData({
          data: grid,
          instance: overlayGroups,
          markers
        });
      });
  };

  const clickPolygonAggregation = (e: any) => {
    setClickTargetPolymer(e);
    amapIns.setFitView(e.target); // 放大到合适的区域
  };

  // 状态2 绘制聚合区域
  const drawAggregatedArea = (path = [], score) => {
    let center;
    try {
      const bounds = new window.AMap.Bounds(path[0], path[2]); // 取对角线的两个点
      center = bounds && bounds.getCenter(); // 获取矩形中心点
    } catch (error) { }
    return new window.AMap.Polygon({
      path,
      fillColor: scoreColor[score],
      strokeOpacity: 1,
      fillOpacity: 0.75,
      strokeColor: scoreColor[score],
      strokeWeight: 1,
      // strokeStyle: 'solid',
      strokeDasharray: [5, 5],
      extData: {
        score,
        center // [center.lng, center.lat]
      },
      zIndex: 10
    });
  };

  // 状态2 地图缩放
  const zoomChange = debounce(async () => {
    if (!id) return;
    const curZoom = amapIns.getZoom();
    if (curZoom > zoomLevel) { // 显示点
      // 隐藏聚合区域图形
      // aggregatedData.instance && aggregatedData.instance.hide();
      aggregatedData.markers.forEach((markerItem: any) => {
        markerItem.setOptions({
          fillOpacity: 0.3,
        });
      });
      pointsData.instance && pointsData.instance.show();
      // 显示分数
      scoreGroupMarker && scoreGroupMarker.show();
      !scoreGroupMarker && scoreViewHandle();
      if (pointsData.data.length && pointsData.instance) return;
      // 获取点的数据
      const { url } = await shopRecommendPoints({ id });
      // url 接口返回存放数据的json文件地址
      const points = await get(url); // 获取数据
      setPointsData((state) => ({ ...state, data: points }));
      // 海量点 https://lbs.amap.com/api/jsapi-v2/documentation#massmarks
      const massPoints = points.map((item: any) => {
        return {
          lnglat: [item.lng, item.lat],
          style: 2, // 样式索引值
          name: item.name
        };
      });
      const mass = new window.AMap.MassMarks(massPoints, {
        // opacity: 0.8,
        zIndex: 111,
        cursor: 'pointer',
        style: {
          url: 'https://staticres.linhuiba.com/project-custom/location2.0/store-developer/map_select@2x.png',
          anchor: new window.AMap.Pixel(3, 3),
          size: new window.AMap.Size(40, 40),
          zIndex: 1,
        }
      });
      const marker = new window.AMap.Marker({ content: ' ', map: amapIns });
      setTargetLabelMarker(marker);
      mass.on('mouseover', function (e) {
        marker.setPosition(e.data.lnglat);
        marker.setLabel({
          direction: 'center',
          content: e.data.name
        });
      });
      mass.setMap(amapIns);
      setPointsData((state) => ({ ...state, instance: mass }));

    } else {
      // 显示聚合图形
      aggregatedData.instance && aggregatedData.instance.show();
      // 隐藏点
      pointsData.instance && pointsData.instance.hide();
      aggregatedData.markers.forEach((markerItem: any) => {
        markerItem.setOptions({
          fillOpacity: 0.75,
        });
      });
      targetLabelMarker && targetLabelMarker.setLabel({
        content: null
      });
      scoreGroupMarker && scoreGroupMarker.hide();
    }
  }, 300);
  // 状态2 指定的聚合区域高亮
  const targetHighlight = (target: any) => {
    const { index, score } = target;
    // 重置
    for (let i = 0; i < 20; i++) { // 返回的数据分值是从高到低排序的
      aggregatedData.markers[i].setOptions({
        fillOpacity: 0.75,
        fillColor: scoreColor[score],
        strokeColor: scoreColor[score]
      });
    }
    const targetMarker = aggregatedData.markers[index];
    if (targetMarker) {
      targetMarker.setOptions({
        fillOpacity: 1,
        fillColor: '#006aff',
        strokeColor: '#006aff'
      });

      setTargetHighlightMarker({
        marker: targetMarker,
        score
      });
    }
    amapIns.setFitView(targetMarker, false, [1, 1, 1, 1], zoomLevel);
  };

  //
  const scoreViewHandle = () => {
    const markers: Array<any> = [];
    aggregatedData.markers.forEach((markerItem: any) => {
      const { _opts } = markerItem;
      const { extData } = _opts || {};
      const { center, score } = extData || {};
      const marker = new window.AMap.Marker({
        position: center,
        content: `<span class='color-white fn-48'>${score}</span>`,
        anchor: 'center'
      });
      markers.push(marker);
    });
    const overlayGroups = new window.AMap.OverlayGroup(markers);
    setScoreGroupMarker(overlayGroups);
    amapIns.add(overlayGroups);
  };

  return (
    <div className={styles.container}>
      {
        !id && (
          <Positioned
            setSearchData={setSearchData}
            change={setAdministrativeRegion} />
        )
      }
      {/* <Map
        version='2.0'
        amapkey={amapKey}
        events={{
          created: amapCreated,
          zoomchange: zoomChange
        }}>
      </Map> */}
      <AMap loaded={amapCreated}/>
      {
        !id && <SupernatantForm
          searchData={searchData}
          setSearchData={setSearchData} />
      }
      {
        id > 0 && <Result
          id={id}
          aggregatedData={aggregatedData.data.filter((item, index) => index < 20)}
          targetHighlight={(target) => targetHighlight(target)} />
      }
    </div>
  );
};

export default RecommendMap;
