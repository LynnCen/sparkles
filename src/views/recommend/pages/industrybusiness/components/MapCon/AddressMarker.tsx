/**
 * @Description  点位marker
 */
import { BUSINESS_FIT_ZOOM, BUSINESS_ZOOM, DISTRICT_LEVEL, DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import { isArray, isEqual } from '@lhb/func';
import { FC, useEffect, useRef } from 'react';
import { RankStatus, businessType, maxAddressMarkerCount } from '../../ts-config';
import { v4 } from 'uuid';
import ReactDOM from 'react-dom';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import cs from 'classnames';
const addressMarkerZIndex = 10;

const AddressMarker:FC<any> = ({
  amapIns,
  listData,
  addressMarkerRef,
  polygonMarkerRef,
  setDetailData,
  level,
  isSelectToolBox,
  detailData,
  mapShowType,
  // polygonListData,
  selectionsRef,
  isBusinessZoom,
  clearAllMarker
}) => {
  // const [isBusinessZoom, setIsBusinessZoom] = useState<boolean>(false);
  // const firstLoadRef = useRef<boolean>(true);// 根据url的商圈id在第一次加载的时候，定位到具体的商圈
  const curSelectedRef = useRef<any>(null);// 当前选中的商圈
  const hasHoverListRef = useRef<any>([]);
  const mapShowTypeRef = useRef<any>(null);
  const curIsSelectToolBoxRef = useRef<any>(null);

  useEffect(() => {
    curIsSelectToolBoxRef.current = isSelectToolBox;
  }, [isSelectToolBox]);


  // 处理绘制商圈数据
  const createAddressMarker = () => {
    let newAddData:any = [];// 需要新加的数据

    if (mapShowTypeRef.current !== mapShowType) {
      newAddData = listData;
      addressMarkerRef.current.map((marker) => {
        marker.remove();
      });
      addressMarkerRef.current = [];
    } else {
      const equalData:any = [];// 相同的数据id

      // 获取要新增的数据和相同的数据id
      listData.map((item) => {
        let isEqualFlag = false;
        addressMarkerRef.current.forEach((marker) => {
          if (marker.getExtData()?.id === item.id) {
            item.uid = marker.getExtData()?.uid;
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
      addressMarkerRef.current.map((marker) => {
        marker.show();// 这段代码用于新增商圈后addressMarker的显示
        if (!equalData.includes(marker.getExtData()?.id)) {
          marker.remove();
        } else {
          newAddressMarker.push(marker);
        }
      });
      addressMarkerRef.current = newAddressMarker;
    }
    mapShowTypeRef.current = mapShowType;

    // 绘制具体商圈地址marker时,省市区聚合 和 区聚合隐藏
    clearAllMarker({
      hideAddressMarkerRef: false,
      hidePolygonMarkerRef: false,
      // hideBusinessDistrictMarkerRef: false
    });

    // 对需要新加的数据进行遍历
    newAddData.forEach((item) => {
      createAddressLabelMarker(item);
    });
  };
  // 绘制商圈点位marker
  const createAddressLabelMarker = (item) => {
    const uid:any = v4();

    const marker = new window.AMap.Marker({
      position: new window.AMap.LngLat(+item?.lng, +item?.lat),
      anchor: 'center',
      zIndex: addressMarkerZIndex,
      zooms: [DISTRICT_ZOOM, 20],
      extData: {
        ...item,
        uid,
      }
    });
    amapIns.add(marker);

    marker.setContent(`<div id="${uid}"></div>`);
    ReactDOM.render(
      <Point
        node={item}
        selectionsRef={selectionsRef}
        mapShowTypeRef={mapShowTypeRef}
        hasHoverListRef={hasHoverListRef}
        isAnimation={true}
      />
      , document.getElementById(uid));

    addressMarkerRef.current.push(marker);
    marker.on('click', () => {
      clickAddressMarker(item);
    });
    // hover后变橙色
    marker.on('mouseover', () => {
      // 如果已选中某个，则直接返回
      if (curSelectedRef.current?.id === item.id) return;
      marker.setzIndex(addressMarkerZIndex + 1);
    });
    // 将hover后的橙色恢复成蓝色
    marker.on('mouseout', () => {
      // 如果已选中某个，则直接返回
      if (curSelectedRef.current?.id === item.id) return;
      marker.setzIndex(addressMarkerZIndex);
    });
  };

  // 绘制商圈围栏-围栏
  const createAddressPolygon = (item) => {
    const arr = item?.polygon?.map((item) => {
      return [+item.lng, +item.lat];
    });
    const polygon = new window.AMap.Polygon({
      path: arr,
      fillColor: `${item.type === businessType.DIYBusiness ? '#b033ee' : '#006AFF'}`,
      strokeOpacity: 1,
      fillOpacity: 0.1,
      strokeColor: `${item.type === businessType.DIYBusiness ? '#b033ee' : '#006AFF'}`,
      strokeWeight: 1,
      strokeStyle: 'dashed',
      zIndex: 60,
      zooms: [BUSINESS_ZOOM, 20],
      anchor: 'bottom-center',
      bubble: true,
      extData: item
    });
    // 切换展示商圈排名的时候，需要绘制之前已选中的
    if (curSelectedRef.current?.id === item.id) {
      polygon.setOptions({
        strokeColor: '#FC7657',
        fillColor: '#FC7657',
      });
    }
    polygonMarkerRef.current.push(polygon);

    // 再绘制完后，根据detail看是否选中
    jumpToAddress(listData);
  };
  // 绘制商圈围栏-圆圈
  const createAddressCircle = (item) => {
    const circle = new window.AMap.Circle({
      center: [item?.lng, item?.lat],
      radius: item?.radius, // 半径（米）
      strokeColor: `${item.type === businessType.DIYBusiness ? '#b033ee' : '#006AFF'}`,
      strokeWeight: 2,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      zooms: [BUSINESS_ZOOM, 20],
      fillColor: `${item.type === businessType.DIYBusiness ? '#b033ee' : '#006AFF'}`,
      zIndex: 50,
      bubble: true, // 为了支持在商圈围栏上测距
      extData: item
    });
    // 切换展示商圈排名的时候，需要绘制之前已选中的
    if (curSelectedRef.current?.id === item.id) {
      circle.setOptions({
        strokeColor: '#FC7657',
        fillColor: '#FC7657',
      });
    }
    polygonMarkerRef.current.push(circle);
  };

  // marker点击事件
  const clickAddressMarker = (item) => {
    // 工具箱使用中时不支持点击打开详情
    if (curIsSelectToolBoxRef.current) return;
    if (recover(item)) {
      // 设置detail，detail会触发useEffect 去执行对应的方法
      setDetailData({
        ...item,
        visible: true,
        // index,
      });
    }
  };
  // 恢复被选中样式，且返回true、false表示是否往下执行
  const recover = (item) => {
    if (!(isArray(addressMarkerRef.current) && addressMarkerRef.current?.length)) return false;
    // 先恢复上一次的item，此时curSelectedRef未重新赋值，所以还是上一次的

    if (curSelectedRef.current?.id === 0 || curSelectedRef.current?.id) {
      addressMarkerRef.current.map((addressMarker) => {
        if (addressMarker.getExtData()?.id === curSelectedRef.current.id) {
          // addressMarker.setContent(getContent(addressMarker.getExtData(), isBranch, Normal, false));
          // const uid:any = v4();
          amapIns.remove(addressMarker);
          addressMarker.setContent(`<div id="${addressMarker.getExtData()?.uid}"></div>`);
          amapIns.add(addressMarker);
          ReactDOM.render(
            <Point
              node={addressMarker.getExtData()}
              selectionsRef={selectionsRef}
              mapShowTypeRef={mapShowTypeRef}
              hasHoverListRef={hasHoverListRef}
            />
            , document.getElementById(addressMarker.getExtData()?.uid));

          addressMarker.setzIndex(addressMarkerZIndex);
        }
      });
      curSelectedRef.current?.border?.setOptions({
        strokeColor: `${curSelectedRef.current.type === businessType.DIYBusiness ? '#b033ee' : '#006AFF'}`,
        fillColor: `${curSelectedRef.current.type === businessType.DIYBusiness ? '#b033ee' : '#006AFF'}`,
      });
    }
    // 取消选中
    if (curSelectedRef.current?.id === item.id) {
      curSelectedRef.current = null;
      setDetailData({
        id: null,
        visible: false,
      });
      return false;
    }
    return true;
  };

  // 绘制选中样式
  const drawSelected = (item) => {
    if (!(isArray(addressMarkerRef.current) && addressMarkerRef.current?.length)) return;
    // 绘制下一个item
    addressMarkerRef.current.map((addressMarker) => {
      if (addressMarker.getExtData()?.id === item.id) {
        amapIns.remove(addressMarker);
        addressMarker.setContent(`<div id="${addressMarker.getExtData()?.uid}"></div>`);
        amapIns.add(addressMarker);
        ReactDOM.render(
          <Point
            node={addressMarker.getExtData()}
            selectionsRef={selectionsRef}
            mapShowTypeRef={mapShowTypeRef}
            hasHoverListRef={hasHoverListRef}
            curSelectedId={addressMarker.getExtData()?.id}
          />
          , document.getElementById(addressMarker.getExtData()?.uid));
        addressMarker.setzIndex(addressMarkerZIndex + 1);
      }
    });
    let border = null;
    polygonMarkerRef.current.map((polygonMarker) => {
      if (polygonMarker.getExtData()?.id === item.id) {
        border = polygonMarker;
        polygonMarker.setOptions({
          strokeColor: '#FC7657',
          fillColor: '#FC7657',
        });
      }
    });
    // 在将这个item赋值给curSelectedRef
    curSelectedRef.current = {
      ...item,
      border,
    };
  };
  const jumpToAddress = (data) => {
    if (detailData.id) {
      data.map((item) => {
        if (item.planClusterId === detailData.id) {
          setDetailData({
            ...item,
            visible: true,
          });
        }
      });
    }
  };
  useEffect(() => {
    if (!amapIns || level < DISTRICT_LEVEL) return;

    // 区以下不做聚合的时候才展示具体点位
    if (!(listData.length >= maxAddressMarkerCount)) {
      createAddressMarker();
    } else {
      addressMarkerRef.current.map((item) => {
        item.hide();
      });
    }
  }, [listData, amapIns, mapShowType]);

  useEffect(() => {
    if (!amapIns || level < DISTRICT_LEVEL) return;
    // 如果展示区聚合，直接return结束
    if (listData.length >= maxAddressMarkerCount) return;
    if (!isBusinessZoom) {
      isArray(polygonMarkerRef.current) && polygonMarkerRef.current.length &&
      polygonMarkerRef.current.map((marker) => {
        amapIns.remove(marker);
      });
      polygonMarkerRef.current = [];
      return;
    };
    // const newAddData:any = [];// 需要新加的数据

    // const listDataIdList = listData.map((item) => item.id);
    // const oldMarkerData = polygonMarkerRef.current.map((marker) => marker.getExtData()?.id);// 旧的polygonMarkerRef对应的id
    // // 获取要新增的数据
    // listData.map((item) => {
    //   if (!oldMarkerData.includes(item.id)) {
    //     newAddData.push(item);
    //   }
    // });
    // const newPolygonMarkerArr:any = [];
    // // 移出不包括的旧数据
    // polygonMarkerRef.current.map((marker) => {
    //   if (!listDataIdList.includes(marker.getExtData()?.id)) {
    //     marker.remove();
    //   } else {
    //     newPolygonMarkerArr.push(marker);
    //   }
    // });
    // polygonMarkerRef.current = newPolygonMarkerArr;


    const newAddData:any = [];// 需要新加的数据

    const equalData:any = [];// 相同的数据id

    // 获取要新增的数据和相同的数据id
    listData.map((item) => {
      let isEqualFlag = false;
      polygonMarkerRef.current.forEach((marker) => {
        if (marker.getExtData()?.id === item.id) {
          item.uid = marker.getExtData()?.uid;
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
    polygonMarkerRef.current.map((marker) => {
      marker.show();// 这段代码用于新增商圈后addressMarker的显示
      if (!equalData.includes(marker.getExtData()?.id)) {
        marker.remove();
      } else {
        newAddressMarker.push(marker);
      }
    });
    polygonMarkerRef.current = newAddressMarker;

    // 绘制具体商圈地址marker时,省市区聚合 和 区聚合隐藏
    clearAllMarker({
      hideAddressMarkerRef: false,
      hidePolygonMarkerRef: false,
      // hideBusinessDistrictMarkerRef: false
    });

    newAddData.map((item) => {
      if (item?.radius) {
        createAddressCircle(item);
      } else {
        createAddressPolygon(item);
      }
    });
    const polygonGroups = new window.AMap.OverlayGroup(polygonMarkerRef.current);
    // 一次性添加到地图上
    amapIns.add(polygonGroups);
  }, [isBusinessZoom, amapIns, mapShowType, listData]);

  // // 选择列表某项时，定位到对应的商圈
  useEffect(() => {
    if (!amapIns) return;
    const { visible, lng, lat, id } = detailData;
    if (!(visible && lng && lat)) return;
    if (curSelectedRef.current?.id !== id) {
      amapIns?.setZoomAndCenter(BUSINESS_FIT_ZOOM, [+lng, +lat], false, 300);
    }
  }, [detailData]);

  useEffect(() => {
    if (!amapIns) return;
    if (isArray(addressMarkerRef.current) && addressMarkerRef.current.length && detailData.visible) {
      // 存在该值才绘制
      hasHoverListRef.current.push(detailData.id);
      drawSelected(detailData);
    } else {
      // detail为null，则对应的index也不存在
      recover(detailData);
      curSelectedRef.current = null;
    }
  }, [detailData, amapIns, isBusinessZoom]);

  return <div>

  </div>;
};


const Point:FC<any> = ({
  node,
  selectionsRef,
  mapShowTypeRef,
  hasHoverListRef,
  curSelectedId,
  isAnimation
}) => {
  const getIconColor = (firstLevelCategoryId: number) => {
    const { firstLevelCategory } = selectionsRef.current;
    if (!(isArray(firstLevelCategory) && firstLevelCategory.length)) return null;
    return firstLevelCategory.find((item: any) => item.id === firstLevelCategoryId);
  };

  const isSelected = hasHoverListRef.current.includes(node?.id) && node.id === curSelectedId;// 此时被选中的
  const hasViewColor = hasHoverListRef.current.includes(node?.id) && node.id !== curSelectedId;// 选中过

  const showContent = () => {
    if (mapShowTypeRef.current === RankStatus.normal) {
      return node.areaName;
    }
    if (mapShowTypeRef.current === RankStatus.brandRank) {
      if (node.type === businessType.DIYBusiness) {
        return `新增商圈`;
      }
      return `NO.${node.mainBrandsRank}`;
    }
    if (mapShowTypeRef.current === RankStatus.yhtRank) {
      if (node.type === businessType.DIYBusiness) {
        return `新增商圈`;
      }
      return `NO.${node.yhtRank}`;
    }
  };
  return <div className={cs(styles.pointCon, isAnimation ? styles.isScale : '')}>
    <div
      className={styles.triangle}
      style={{
        border: `4px solid ${isSelected ? getIconColor(node?.firstLevelCategoryId)?.color
          : hasViewColor
            ? getIconColor(node?.firstLevelCategoryId)?.hasViewColor : 'white'}`,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
      }}
    ></div>
    <div
      className={styles.contentCon}
      style={{
        backgroundColor: isSelected ? getIconColor(node?.firstLevelCategoryId)?.color
          : hasViewColor
            ? getIconColor(node?.firstLevelCategoryId)?.hasViewColor : 'white'
      }}
    >
      <div
        className={styles.iconBox}
        style={{
          backgroundColor: hasHoverListRef.current.includes(node?.id) ? 'white' : getIconColor(node?.firstLevelCategoryId)?.color
        }}
      >
        <IconFont
          style={{
            color: isSelected ? getIconColor(node?.firstLevelCategoryId)?.color
              : hasViewColor ? getIconColor(node?.firstLevelCategoryId)?.hasViewColor : 'white'
          }}
          iconHref={getIconColor(node?.firstLevelCategoryId)?.icon}/>
      </div>
      <div
        style={ hasHoverListRef.current.includes(node?.id) ? {
          color: 'white',
        } : {}}
        className={styles.value}>
        {showContent()}
      </div>
      {/* 根据产品需求，此处不需要用到状态 */}
      {/* {
        node?.isPlaned ? <div
          style={ hasHoverListRef.current.includes(node?.id) ? {
            color: 'white',
          } : {}}
          className={styles.planBox}>
          <span
            style={ hasHoverListRef.current.includes(node?.id) ? {
              backgroundColor: 'white',
            } : {}}
            className={styles.line}></span>
          <span>已推荐</span>
        </div> : <></>
      } */}
    </div>
  </div>;
};
export default AddressMarker;
