/**
 * @Description 集客点 画板
 */
import AMap from '@/common/components/AMap';
import { FC, useEffect, useRef } from 'react';
import styles from './index.module.less';
import { LineColor, tabsKeys } from '../../ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import IconFont from '@/common/components/IconFont';
import { v4 } from 'uuid';
import ReactDOM from 'react-dom';
const color = ['#549BFF', '#FFC28E', '#7FCCB1'];
const defaultZIndex = 20;

const DrawingBoard:FC<any> = ({
  tabItems,
  keyName,
  lineInfo,
  setLineInfo,
  mapIns,
  setMapIns,
  relationDetail,
  value,
  // visible
}) => {
  const mouseToolRef = useRef<any>(null);// 绘制工具ref
  const drawHintMarkerRef = useRef<any>(null);// 绘制提示marker
  const polygonRef = useRef<any>(null);// 当前商圈的围栏
  const curLineInfoRef = useRef<any>(null);// lineInfo对应[keyName]的数据，
  const lineInfoRef = useRef<any>(null);// lineInfo对应[keyName]的数据，
  const tabItemsRef = useRef<any>(null);// tabItems对应的ref，解决闭包问题
  const keyNameRef = useRef<tabsKeys>(tabsKeys.firstTabKey);// keyName对应的ref，解决闭包问题
  const hoveringRef = useRef<boolean>(false);// 是否hover了线的label

  // 线条样式
  const polyline = {
    strokeColor: LineColor[keyNameRef?.current]?.color,
    strokeOpacity: 1,
    strokeWeight: 6,
    strokeStyle: 'solid',
    lineJoin: 'round', // 折线拐点
    lineCap: 'round', // 折线两端
    showDir: true,
    zIndex: 20
  };

  const mapLoadedHandle = (ins: any) => {
    ins && setMapIns(ins);
  };

  // 绘制提示marker初始化
  const drawHint = () => {
    const marker = new window.AMap.Marker({
      position: [0, 0],
      offset: [-60, 20],
      content: `<div class="drawHint">单击绘制，双击或右键结束</div>`
    });
    mapIns.add(marker);
    drawHintMarkerRef.current = marker;
  };
  // 鼠标在地图上移动
  const mousemove = (e) => {
    if (curLineInfoRef.current?.marker.length >= 2 || hoveringRef.current) {
      drawHintMarkerRef.current.hide();
      return;
    }
    drawHintMarkerRef.current.show();
    drawHintMarkerRef.current.setPosition(e.lnglat);
  };

  // 鼠标移出地图
  const mouseout = () => {
    drawHintMarkerRef.current.hide();
  };

  const mapClick = (e) => {
    // 绘制到商圈外
    if (polygonRef.current && !polygonRef.current.contains(e.lnglat) && !hoveringRef.current) {
      V2Message.error('请在商圈内绘制集客点');
    }
  };

  // 绘制当前商圈的围栏
  const drawPolygon = () => {
    if (value?.radius) {
      const circle = new window.AMap.Circle({
        center: [value?.lng, value?.lat],
        radius: value?.radius, // 半径（米）
        strokeColor: '#006AFF',
        strokeWeight: 2,
        strokeOpacity: 1,
        fillOpacity: 0.2,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        fillColor: '#006AFF',
        zIndex: 10,
      });
      polygonRef.current = circle;
      mapIns.add(circle);
      mapIns.setFitView(circle, true);
      // ui觉得setFitView放大后的比例不合适，要在放大一级别
      setTimeout(() => {
        mapIns.zoomIn();
      }, 100);

      return;
    }
    if (value?.polygon) {
      const polygon = new window.AMap.Polygon({
        path: value?.polygon?.map((item) => {
          return [+item.lng, +item.lat];
        }),
        fillColor: '#006AFF',
        strokeOpacity: 1,
        fillOpacity: 0.1,
        strokeColor: '#006AFF',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        zIndex: 20,
        anchor: 'bottom-center',
        bubble: true,
      });
      polygonRef.current = polygon;
      mapIns.add(polygon);
      mapIns.setFitView(polygon, true);
      // ui觉得setFitView放大后的比例不合适，要在放大一级别
      setTimeout(() => {
        mapIns.zoomIn();
      }, 100);
      return;
    }
  };
  // 处理绘制结束,(后面两个参数是回显的时候调用的，地图的方法并不提供)
  const handleDraw = ({ obj }, keyName:any = null, lineName:any = null) => {
    obj.setExtData({
      keyName: keyName || keyNameRef.current
    });
    const path = obj.getPath()?.map(item => [item.lng, item.lat]);
    if (path.length < 2) return;
    const marker = new window.AMap.Marker({
      offset: [30, 30],
      position: [0, 0],
    });
    mapIns.add(marker);
    const uuid = v4();
    let name;
    tabItemsRef.current.forEach((item, index) => {
      if (item.key === (keyName || keyNameRef.current)) {
        name = `集客点${index + 1}`;
      }
    });
    marker.setContent(`<div id="${uuid}"></div>`);
    ReactDOM.render(<LineNameLabel
      name={lineName || name}
      lineMarker={obj}
      labelMarker={marker}
      // curLineInfoRef={curLineInfoRef}
      setLineInfo={setLineInfo}
      keyName={keyName || keyNameRef.current}
      mapIns={mapIns}
    />, document.getElementById(uuid));

    // hover绘制的线
    obj.on('mouseover', (e) => {
      // 隐藏绘制提示
      drawHintMarkerRef.current.hide();
      // 设置线label的经纬度
      marker.setPosition(e.lnglat);
      // 展示线label
      marker.show();
      obj.setOptions({
        strokeColor: LineColor[obj.getExtData()?.keyName].hoverColor,
        zIndex: defaultZIndex + 1,
      });
    });
    setLineInfo((state) => (
      {
        ...state,
        [keyName || keyNameRef.current]: {
          marker: [...state?.[keyName || keyNameRef.current]?.marker || [], obj],
          // path: [...state?.[keyNameRef.current]?.path || [], path]
        }
      }
    ));
  };

  // ref绑定..
  useEffect(() => {
    keyNameRef.current = keyName;
    lineInfoRef.current = lineInfo;
    curLineInfoRef.current = lineInfo?.[keyName];
    tabItemsRef.current = tabItems;
  }, [lineInfo, keyName, tabItems]);

  useEffect(() => {
    if (!mapIns) return;
    // 绘制当前商圈的围栏
    drawPolygon();

    // 初始化 ，加载mouseTool
    // 可进行鼠标画标记点、线、多边形、矩形、圆、距离量测、面积量测、拉框放大、拉框缩小等功能
    mouseToolRef.current = new window.AMap.MouseTool(mapIns);
    // 初始化绘制提示
    drawHint();

    // 进入绘制线段模式
    mouseToolRef?.current?.polyline(polyline);

    // 绑定绘制完毕事件
    mouseToolRef.current.on('draw', handleDraw);

    // 绑定鼠标移入地图、移出地图、点击地图事件
    mapIns.on('mousemove', mousemove);
    mapIns.on('mouseout', mouseout);
    mapIns.on('click', mapClick);
    return () => {
      // 对应事件解绑
      mapIns.off('mousemove', mousemove);
      mapIns.off('mouseout', mouseout);
      mapIns.off('click', mapClick);
      mouseToolRef.current && mouseToolRef.current.off('draw', handleDraw);
    };
  }, [mapIns, value?.planClusterId]);

  useEffect(() => {
    if (!mapIns) return;
    // keyName改变，判断curLineInfoRef中是否已经存在两个marker，即已经绘制两条线
    if (curLineInfoRef.current?.marker?.length >= 2) {
      mouseToolRef.current?.close();// 关闭隐藏
    } else {
      mouseToolRef?.current?.polyline({
        ...polyline,
        strokeColor: LineColor[keyName].color,
      });
    }
  }, [keyName]);

  useEffect(() => {
    // lineInfo改变，判断curLineInfoRef中是否已经存在两个marker，即已经绘制两条线
    if (lineInfo?.[keyName]?.marker?.length >= 2) {
      V2Message.info('一个集客点最多绘制2条动线');// 提示
      drawHintMarkerRef.current?.hide();// 隐藏提示
      mouseToolRef.current?.close();// 关闭绘制工具
    } else {
      drawHintMarkerRef.current?.show();// 显示提示
      mouseToolRef.current?.polyline(polyline);
    }
  }, [lineInfo]);


  useEffect(() => {
    // 已经通过的，数据回显
    if (relationDetail?.planSpots?.length) {
      let lineData:any = null;
      const drawLine = (moveLineList, index) => {
        const lineMarker = new window.AMap.Polyline({
          path: moveLineList.map((item) => [item?.lng, item?.lat]),
          ...polyline,
          strokeColor: color[index],
        });
        mapIns.add(lineMarker);
        handleDraw({ obj: lineMarker }, Object.keys(tabsKeys)[index], `集客点${index + 1}`);
        lineData = {
          ...lineData,
          [Object.keys(tabsKeys)[index]]: {
            marker: [...lineData?.[Object.keys(tabsKeys)[index]]?.marker || [], lineMarker]
          }
        };

      };

      relationDetail?.planSpots?.map((spot, index) => {
        spot?.moveLineList?.map((moveLineList) => {
          drawLine(moveLineList, index);
        });
      });
      setLineInfo(lineData);
    }
  }, [relationDetail]);



  // 线条label
  const LineNameLabel = ({
    name,
    lineMarker,
    labelMarker,
    // curLineInfoRef,
    setLineInfo,
    keyName,
    mapIns,
  }) => {
    const handleMouseOut = () => {
      setTimeout(() => {
        if (!hoveringRef.current) {
          labelMarker.hide();
          hoveringRef.current = false;
          lineMarker.setOptions({
            strokeColor: LineColor[lineMarker.getExtData()?.keyName].color,
            zIndex: defaultZIndex,
          });
        }
      }, 300);
    };
    const handleDelete = () => {
      mouseToolRef.current.close();

      setLineInfo((state) => ({
        ...state,
        [keyName]: {
          marker: lineInfoRef.current[lineMarker?.getExtData()?.keyName].marker?.filter((marker) => marker !== lineMarker)
        }
      }));
      mapIns.remove(lineMarker);
    };
    useEffect(() => {
      lineMarker.on('mouseout', handleMouseOut);
      return () => {
        lineMarker.off('mouseout', handleMouseOut);
      };
    }, []);
    return <div
      className={styles.lineName}
      onMouseEnter={() => {
        hoveringRef.current = true;
        lineMarker.setOptions({
          strokeColor: LineColor[lineMarker.getExtData()?.keyName].hoverColor,
        });
      }}
      onMouseLeave={() => {
        hoveringRef.current = false;
        labelMarker.hide();
        lineMarker.setOptions({
          strokeColor: LineColor[lineMarker.getExtData()?.keyName].color,
        });
      }}
    >
      {name}
      <IconFont iconHref={'iconic_fail'} className='ml-4' onClick={handleDelete}/>
    </div>;
  };



  return <div className={styles.drawingBoard}>
    <div className={styles.required}>动线始末</div>
    <div
      onClick={() => {
        mapIns.setFitView(polygonRef.current, true);
        // ui觉得setFitView放大后的比例不合适，要在放大一级别
        setTimeout(() => {
          mapIns.zoomIn();
        }, 100);
      }}
      className={styles.back}>回到商圈</div>
    <AMap
      loaded={mapLoadedHandle}
      plugins={[
        'AMap.MouseTool',
        'AMap.PolylineEditor',
      ]}
    >
    </AMap>
  </div>;
};



export default DrawingBoard;
