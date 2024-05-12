/**
 * @Description 商区围栏
 */

import { BUSINESS_FIT_ZOOM, DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import { isArray, isEqual, urlParams } from '@lhb/func';
import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { v4 } from 'uuid';
import styles from './index.module.less';
import { markerType, maxAddressMarkerCount } from '../../ts-config';

const BusinessDistrict = ({
  amapIns,
  businessDistrictMarkerRef,
  // isShowBusinessDistrict,
  setSelectedBusinessDistrict,
  selectedBusinessDistrict,
  curClickTypeRef,
  // isSelectToolBox,
  areaData,
  setDetailData,
  detailData,
  // isShowDistrictCluster,
  clearAllMarker,
  listData
}) => {

  const {
    businessAreaId,
    lng,
    lat
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const marketPolygonGroupsRef = useRef<any>(null);
  const curSelectedRef = useRef<any>(null);
  const curSelectedMarkerRef = useRef<any>(null);
  const hoverMarkerRef = useRef<any>(null);
  // const curIsSelectToolBoxRef = useRef<any>(null);
  const hasJumpRef = useRef<boolean>(false);
  // useEffect(() => {
  //   curIsSelectToolBoxRef.current = isSelectToolBox;
  // }, [isSelectToolBox]);


  const createBusinessDistrictMarker = () => {
    // 对比前后数据，对新的数据新增，重叠的数据不动，未使用的旧数据删除
    const newAddData:any = [];// 需要新加的数据
    const equalData:any = [];// 相同的数据id

    // 获取要新增的数据和相同的数据id
    areaData.map((item) => {
      let isEqualFlag = false;
      businessDistrictMarkerRef.current.forEach((marker) => {
        if (marker.getExtData()?.id === item.id) {
          // 和旧数据完全相同
          if (isEqual(marker.getExtData(), item)) {
            equalData.push(item.id);
            isEqualFlag = true;
          }
        }
      });
      // 需要新增的数据
      if (!isEqualFlag) {
        newAddData.push(item);
      }
    });
    const newAddressMarker:any = [];
    // 移出不包括的旧数据
    businessDistrictMarkerRef.current.map((marker) => {
      marker.show();// 这段代码用于新增商圈后addressMarker的显示
      if (!equalData.includes(marker.getExtData()?.id)) {
        marker.remove();
      } else {
        newAddressMarker.push(marker);
      }
    });
    businessDistrictMarkerRef.current = newAddressMarker;

    // 绘制具体商圈地址marker时,省市区聚合 和 区聚合隐藏
    clearAllMarker({
      hideAddressMarkerRef: false,
      hidePolygonMarkerRef: false,
      hideBusinessDistrictMarkerRef: false
    });

    newAddData.map((item) => {
      const arr = item?.polygon?.map((item) => {
        return [+item.lng, +item.lat];
      });
      const polygon = new window.AMap.Polygon({
        path: arr,
        fillColor: `#006AFF`,
        strokeOpacity: 1,
        fillOpacity: 0.1,
        strokeColor: `#006AFF`,
        strokeWeight: 3,
        strokeStyle: 'solid',
        zIndex: 60,
        zooms: [DISTRICT_ZOOM, 20],
        bubble: true,
        cursor: 'pointer',
        extData: {
          ...item
        }
      });
      // 鼠标移入--hover
      polygon.on('mouseover', () => {
        if (curSelectedRef.current?.id === item.id) return;

        amapIns.remove(hoverMarkerRef.current);
        amapIns.add(hoverMarkerRef.current);

        item?.polygon?.[0]?.lng && item?.polygon?.[0]?.lat &&
        hoverMarkerRef.current.setPosition([item.polygon[0].lng, item.polygon[0].lat]);

        const uid = v4();
        hoverMarkerRef.current.setContent(`<div id="${uid}"></div>`);
        ReactDOM.render(
          <SignContent
            node={polygon.getExtData()}
          />
          , document.getElementById(uid));

        polygon.setOptions({
          strokeColor: '#FF861D',
          fillColor: '#FF861D',
        });
      });
      // 鼠标移出
      polygon.on('mouseout', () => {
        // 如果移出当前已选中的，不改变
        if (curSelectedRef.current?.id === item.id) return;
        polygon.setOptions({
          strokeColor: '#006AFF',
          fillColor: '#006AFF',
        });
        hoverMarkerRef.current.setContent(` `);
      });

      // 点击事件
      polygon.on('click', () => {
        clickAddressMarker(item);
      });
      businessDistrictMarkerRef.current.push(polygon);
    });

    marketPolygonGroupsRef.current = new window.AMap.OverlayGroup(businessDistrictMarkerRef.current);
    // isShowBusinessDistrict 展示商区围栏
    // isShowDistrictCluster  展示区级别聚合
    // 当不展示区级别聚合且展示商区围栏时，show()
    if (!(listData.length >= maxAddressMarkerCount)) {
      marketPolygonGroupsRef.current.show();
    } else {
      marketPolygonGroupsRef.current.hide();
    }

    amapIns.add(marketPolygonGroupsRef.current);
    jumpBusinessArea(true);

    // 当数据更新时，对于选中的商圈容量的标志curSelectedMarkerRef内容也需要更新
    if (curSelectedRef.current?.id) {
      newAddData.map((item) => {
        if (item?.id === curSelectedRef.current?.id) {
          drawSelected(item);
        }
      });
    }
  };


  const clickAddressMarker = (item) => {
    // 工具箱使用中时不支持点击打开详情
    // if (curIsSelectToolBoxRef.current) return;
    if (recover()) {
      // 设置detail，detail会触发useEffect 去执行对应的方法
      curClickTypeRef.current = markerType.BusinessDistrictMarker;
      setSelectedBusinessDistrict({
        ...item,
        visible: true,
      });
    }
  };

  // 恢复被选中样式，且返回true、false表示是否往下执行
  const recover = () => {

    if (!(isArray(businessDistrictMarkerRef.current) && businessDistrictMarkerRef.current?.length)) return false;
    // 先恢复上一次的item，此时curSelectedRef未重新赋值，所以还是上一次的
    if (curSelectedRef.current?.id === 0 || curSelectedRef.current?.id) {
      businessDistrictMarkerRef.current.map((polygon) => {
        if (polygon.getExtData()?.id === curSelectedRef.current.id) {
          polygon.setOptions({
            strokeColor: '#006AFF',
            fillColor: '#006AFF',
          });
        }
        curSelectedMarkerRef.current.setContent(` `);
      });
    }
    // 取消选中(先保留，以免ui又需要点击可以取消选中)
    // if (curSelectedRef.current?.id === item.id && item.id) {
    //   curSelectedRef.current = null;
    //   setSelectedBusinessDistrict({
    //     id: null,
    //     visible: false,
    //   });
    //   return false;
    // }
    return true;
  };
  // 绘制选中样式
  const drawSelected = (item) => {
    if (!(isArray(businessDistrictMarkerRef.current) && businessDistrictMarkerRef.current?.length)) return;
    // 绘制下一个item
    businessDistrictMarkerRef.current.map((polygon) => {
      if (polygon.getExtData()?.id === item.id) {
        amapIns.remove(curSelectedMarkerRef.current);
        const uid = v4();
        curSelectedMarkerRef.current.setContent(`<div id="${uid}"></div>`);

        item?.polygon?.[0]?.lng && item?.polygon?.[0]?.lat &&
        curSelectedMarkerRef.current.setPosition([item?.polygon[0]?.lng, item?.polygon[0]?.lat]);

        amapIns.add(curSelectedMarkerRef.current);
        ReactDOM.render(
          <SignContent
            node={polygon.getExtData()}
          />
          , document.getElementById(uid));

        polygon.setOptions({
          strokeColor: '#FF861D',
          fillColor: '#FF861D',
        });
        if (curSelectedRef.current?.id !== item.id) {
          amapIns.setFitView(polygon);
        }
        // 在将这个item赋值给curSelectedRef
        curSelectedRef.current = {
          ...item,
          marker: curSelectedMarkerRef.current,
          polygonMarker: polygon,
        };

      }
    });
    if (detailData.businessAreaId !== item.businessAreaId) {
      setDetailData({
        id: null,
        visible: false
      });
    }
  };
  const jumpBusinessArea = (hasJump = false) => {
    areaData.map((item) => {
      if (item.businessAreaId === businessAreaId && !hasJumpRef.current) {
        if (curSelectedRef.current?.businessAreaId === businessAreaId) return;
        amapIns?.setZoomAndCenter(BUSINESS_FIT_ZOOM, [item.lng, item.lat], true);
        setSelectedBusinessDistrict({
          ...item,
          visible: true
        });
        curClickTypeRef.current = markerType.BusinessDistrictMarker;
        hasJumpRef.current = hasJump;
      }
    });
  };
  // 当areaData数据改变时，判断之前选中的数据是否在新的areaData中，不存在则移出curSelectedMarkerRef
  const curSelectedHasExist = () => {
    let isExist = false;
    areaData.map((item) => {
      if (item.businessAreaId === curSelectedRef.current?.businessAreaId && curSelectedRef.current?.businessAreaId) {
        isExist = true;
      }
    });
    if (!isExist) {
      curSelectedMarkerRef.current?.setContent(` `);
      hoverMarkerRef.current?.setContent(` `);
      // console.log('setSelectedBusinessDistrict-设置为空',);
      // 这里会导致市场容量（商区）没被选中
      // setSelectedBusinessDistrict({
      //   visible: false,
      //   id: null
      // });
    }
  };
  useEffect(() => {
    if (!amapIns) return;
    if (!(listData.length >= maxAddressMarkerCount)) {
      createBusinessDistrictMarker();
    }
    // isShowBusinessDistrict 展示商区围栏
    // isShowDistrictCluster  展示区级别聚合
    // 当不展示区级别聚合且展示商区围栏时，show()
    if (!(listData.length >= maxAddressMarkerCount)) {
      hoverMarkerRef.current?.show();
      curSelectedRef.current?.marker?.show();
    } else {
      hoverMarkerRef.current?.hide();
      curSelectedRef.current?.marker?.hide();
    }
  }, [amapIns, areaData]);


  useEffect(() => {
    if (!amapIns) return;
    jumpBusinessArea();
    curSelectedHasExist();
  }, [amapIns, areaData]);

  useEffect(() => {
    if (!amapIns) return;
    if (isArray(businessDistrictMarkerRef.current) && businessDistrictMarkerRef.current.length && selectedBusinessDistrict.visible) {
      // 试试加recover()
      recover();
      // 存在该值才绘制
      drawSelected(selectedBusinessDistrict);
    } else {
      // detail为null，则对应的index也不存在
      recover();
      curSelectedRef.current = null;
    }
  }, [selectedBusinessDistrict, amapIns]);

  useEffect(() => {
    if (!amapIns) return;
    curSelectedMarkerRef.current = new window.AMap.Marker({
      anchor: 'center',
      zooms: [DISTRICT_ZOOM, 20],
      content: ` `
    });
    hoverMarkerRef.current = new window.AMap.Marker({
      anchor: 'center',
      zooms: [DISTRICT_ZOOM, 20],
      content: ` `
    });
    amapIns.add(hoverMarkerRef.current);
  }, [amapIns]);

  useEffect(() => {
    if (businessAreaId && lng && lat && amapIns) {
      amapIns?.setZoomAndCenter(BUSINESS_FIT_ZOOM, [lng, lat], true);
    }
  }, [amapIns]);
  return <></>;
};


const SignContent = ({
  node
}) => {
  return <div className={styles.SignContent}>
    <div className={styles.triangle}></div>
    <div className={styles.contentCon}>
      <div className={styles.value}>
        容量进度 {node?.planProgress || '-'}
      </div>
    </div>
  </div>;
};
export default BusinessDistrict;
