/**
 * @Description 新增商圈
 * @description 通过mouseToolRef绘制，通过graphEditorRef编辑
 */
import { useState, FC, useEffect, useRef } from 'react';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import { getPolygonCenter } from 'src/common/utils/map';
import cs from 'classnames';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { v4 } from 'uuid';
import ReactDOM from 'react-dom';
import AddForm from './AddForm';
import { debounce, isArray, isNotEmptyAny } from '@lhb/func';
import { BUSINESS_ZOOM } from '@/common/components/AMap/ts-config';
import { message } from 'antd';
import { addBusiness } from '../../../../ts-config';
import { getTreeSelection } from '@/common/api/networkplan';
import { useSelector } from 'react-redux';
import { findDistrict } from '@/common/utils/ways';
// import { getTreeSelection } from '@/common/api/networkplan';
export enum graphType { // 覆盖物类型
  CIRCLE = 'Overlay.Circle',
  POLYGON = 'Overlay.Polygon',
}

// 图形样式
const styleConfig = {
  strokeColor: '#0A9999',
  strokeOpacity: 1,
  strokeWeight: 2,
  strokeStyle: 'dashed',
  fillColor: '#07B4B4',
  fillOpacity: 0.2,
  color: '#006AFF',
};

// 绘制图形组件
const DrawShape: FC<any> = ({
  amapIns,
  isSelectToolBox,
  setIsSelectToolBox, // 工具箱与新增商圈互斥，设置工具箱中的按钮是否激活
  setIsShape,
  expand,
  leftDrawerVisible,
  setIsDraw, // 是否已经绘制出图形信息，graphInfo有数据则为true
  setIsReset,
  planId,
  branchCompanyId,
  drawedRef,
  setLeftDrawerVisible,
  setRightDrawerVisible,
  onRefresh,
  // companyParams
}) => {

  const cityForAMap = useSelector((state: any) => state.common.cityForAMap);

  // const {
  //   originPath, // 来源path,目前用于处理机会点跳转网规
  // } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const [value, setValue] = useState(null); // 绘制商圈形状选中的形状值
  // const [addressInfo, setAddressInfo] = useState<any>([]);// 所在分公司城市权限信息
  const mouseToolRef = useRef<any>(null);
  const graphRef = useRef<any>(null); // 图形
  const graphInfo = useRef<any>(null); // 图形信息，用于外边判断是否已绘制
  const graphEditorRef = useRef<any>(null); // 图形编辑器
  const textHintMarkerRef = useRef<any>(null); // 文字提示
  const deleteMarkerRef = useRef<any>(null); // 删除按钮
  const formMarkerRef = useRef<any>(null); // 新增商圈form表单 marker
  const valueRef = useRef<any>(null);
  const addressInfoRef = useRef<any>(null);
  const deleteClick = () => {
    // isDrawingRef.current = false;
    setIsDraw(false);
    graphInfo.current = null;
    drawGraph(valueRef.current);
  };
  const drawFinish = (obj) => {
    setLeftDrawerVisible(false);
    setRightDrawerVisible(false);
    graphRef.current = obj;

    if (obj.className === graphType.CIRCLE) {
      // 圆形编辑器
      graphEditorRef.current = new window.AMap.CircleEditor(amapIns, obj, {
        editOptions: styleConfig,
      });
      // 获取点位相关信息并存入graphInfo
      getCircleInfo();
    } else {
      // 多边形编辑器
      graphEditorRef.current = new window.AMap.PolygonEditor(amapIns, obj, {
        editOptions: styleConfig,
      });
      // 获取点位相关信息并存入graphInfo
      getPolygonInfo();
    }

    graphEditorRef.current?.open(); // 让绘制的形状可编辑

    // 调整后重新获取最新数据
    graphEditorRef.current?.on('adjust', () => {
      valueRef.current === graphType.CIRCLE ? getCircleInfo() : getPolygonInfo();
    });

    // 移动后重新获取最新数据
    graphEditorRef.current?.on('move', () => {
      valueRef.current === graphType.CIRCLE ? getCircleInfo() : getPolygonInfo();
    });

    // 绘制完后，关闭mouseToolRef工具，只可以绘制一个图形
    mouseToolRef.current?.close();
    // 绘制完后取消提示marker
    textHintMarkerRef.current && amapIns.remove(textHintMarkerRef.current);

    // 绘制删除marker,todo
    // setDeleteMarker();
  };

  const onChange = (val) => {
    setIsSelectToolBox(false);
    if (val === valueRef.current) {
      // 如果已经绘制
      if (graphInfo.current) return;
      // 再次点击的时候，取消当前选中项
      setValue(null);
      setIsShape(false);
      // 如果未绘制，且置地图上的形状为空（针对不规则形状的绘制中）
      graphRef.current?.remove(); // 移出图形
      graphEditorRef.current?.close(); // 关闭图形编辑器
      // deleteMarkerRef.current?.setContent(` `);// 去掉删除提示
      mouseToolRef.current.close(true); // 传true,关闭mouseTool的鼠标操作，并清除已绘制的图形
      textHintMarkerRef.current.hide(); // 隐藏提示
      return;
    }
    if (!graphInfo.current) {
      // 不存在的时候可能是没存绘制
      // 关闭当前鼠标操作。参数arg设为true时，鼠标操作关闭的同时清除地图上绘制的所有覆盖物对象
      mouseToolRef.current.close(true);
    } else {
      // 存在已绘制的形状，需要提示先删除在绘制
      // V2Message.warning('请先删除已有商圈形状');
      V2Message.warning(
        `${
          graphRef.current?.getRadius() > 1000 ||
          graphRef.current?.getArea() > 1000 * 1000
            ? '请先删除已有商圈形状'
            : '请先完成商圈信息填写'
        }`
      );
      return;
    }
    if (amapIns.getZoom() < BUSINESS_ZOOM) {
      V2Message.info('请缩放层级至显示商圈围栏');
      return;
    }
    textHintMarkerRef.current.show();
    textHintMarkerRef.current?.setText(
      val === graphType.CIRCLE
        ? '按住拖拽画图，松开结束画图'
        : '单击三点成面，双击编辑形状'
    );
    setValue(val);
    setIsShape(true);
    drawGraph(val);
  };
  // 绘制图形
  const drawGraph = (type) => {
    if (!amapIns) return;
    // 去掉之前绘制的
    graphRef.current?.remove();
    graphRef.current = null;
    graphEditorRef.current?.close();
    graphEditorRef.current = null;
    deleteMarkerRef.current?.setContent(` `);
    // 设置绘制相关配置（mouseTool自动监听鼠标点击，开始绘制操作）
    type === graphType.CIRCLE && mouseToolRef.current.circle(styleConfig);
    type === graphType.POLYGON && mouseToolRef.current.polygon(styleConfig);

    // 设置 textHintMarkerRef 提示marker
    amapIns.add(textHintMarkerRef.current);
    amapIns.on('mousemove', (e) => {
      setHintMessage(e, type);
    });
  };
  // 设置提示marker位置和文案
  const setHintMessage = (e, type) => {
    textHintMarkerRef.current?.setPosition([e.lnglat.lng, e.lnglat.lat]);
    textHintMarkerRef.current?.setText(
      type === null
        ? ``
        : type === graphType.CIRCLE
          ? '按住拖拽画图，松开结束画图'
          : '单击三点成面，双击编辑形状'
    );
  };
  // 删除marker
  const setDeleteMarker = () => {
    if (!(graphInfo.current?.centerLng && graphInfo.current?.centerLat)) return;
    deleteMarkerRef.current.setPosition([
      graphInfo.current?.centerLng,
      graphInfo.current?.centerLat,
    ]);
    deleteMarkerRef.current.setContent(`
      <div class="deleteLabel">
        <span class="deleteText">删除该形状</span>
        <svg style='width: 10px; height: 10px;' aria-hidden>
        <use xlink:href='#icondelete' style='fill:#132144 '/>
        </svg>
      </div>`);
  };
  // 获取圆形相关数据
  const getCircleInfo = () => {
    const geocoder = new window.AMap.Geocoder(); // 用于地址描述与经纬度坐标之间的转换
    const { lat, lng } = graphRef.current?.getCenter();
    amapIns.setCenter([lng, lat]);
    geocoder.getAddress([lng, lat], (status, res) => {
      if (status === 'complete') {
        const { province, city, district, adcode } = res?.regeocode?.addressComponent;
        // 判断有无权限
        if (!checkPermission(adcode)) {
          V2Message.warning(`您当前暂无该城市权限`);
          deleteClick();
          return;
        };
        // isDrawingRef.current = true;
        setIsDraw(true);

        const curMapInfo = findDistrict(cityForAMap, adcode);

        if (curMapInfo?.provinceName && curMapInfo?.cityName && curMapInfo?.districtName) {
          graphInfo.current = {
            radius: graphRef.current?.getRadius(),
            area: graphRef.current?.getArea(),
            centerLng: lng,
            centerLat: lat,
            ...curMapInfo
            // provinceName: province,
            // cityName: city || province,
            // 某些市下面没有行政区，直接到镇级别
            // districtName: district || city || province,
          };
        } else {
          graphInfo.current = {
            radius: graphRef.current?.getRadius(),
            area: graphRef.current?.getArea(),
            centerLng: lng,
            centerLat: lat,
            provinceName: province,
            cityName: city || province,
            // 某些市下面没有行政区，直接到镇级别
            districtName: district || city || province,
          };
        }
        if (graphRef.current?.getRadius() > 1000) {
          // 设置deleteMarker位置及信息
          V2Message.info(`圆形商圈半径最多为1km,当前面积为${graphRef.current?.getRadius()}`);
          setDeleteMarker();
          formMarkerRef.current.setContent(` `);
        } else {
          // 显示新增商圈form
          showAddForm();
          deleteMarkerRef.current.setContent(` `);
        }
      }
    });
  };
  // 获取多边形相关数据
  const getPolygonInfo = () => {
    const geocoder = new window.AMap.Geocoder(); // 用于地址描述与经纬度坐标之间的转换
    const path = graphRef.current
      ?.getPath()
      ?.map((item) => [item.lng, item.lat]);
    const center = getPolygonCenter(path);
    amapIns.setCenter(center);
    geocoder.getAddress(center, (status, res) => {
      if (status === 'complete') {
        const { province, city, district, adcode } = res?.regeocode?.addressComponent;
        if (!checkPermission(adcode)) {
          V2Message.warning(`您当前暂无该城市权限`);
          deleteClick();
          return;
        };
        setIsDraw(true);
        // isDrawingRef.current = true;
        graphInfo.current = {
          polygon: path,
          polygonArea: graphRef.current?.getArea(),
          centerLng: center[0],
          centerLat: center[1],
          provinceName: province,
          cityName: city || province,
          // 某些市下面没有行政区，直接到镇级别
          districtName: district || city || province,
        };
        if (graphRef.current?.getArea() > 1000 * 1000) {
          V2Message.info(
            `不规则商圈面积最多为1000000㎡,当前面积为${graphRef.current?.getArea()}`
          );
          // 设置deleteMarker位置及信息
          setDeleteMarker();
          formMarkerRef.current.setContent(` `);
        } else {
          // 显示新增商圈form
          showAddForm();
          deleteMarkerRef.current.setContent(` `);
        }
      }
    });
  };

  // 绘制新增商圈
  const showAddForm = () => {
    // 如果存在则移动
    if (isNotEmptyAny(formMarkerRef.current.getContent().trim())) {
      formMarkerRef.current.setPosition([
        +graphInfo.current?.centerLng,
        +graphInfo.current?.centerLat,
      ]);
    } else {
      const uid: any = v4();
      formMarkerRef.current.setPosition([
        +graphInfo.current?.centerLng,
        +graphInfo.current?.centerLat,
      ]);
      formMarkerRef.current.setContent(`<div id="${uid}"></div>`);
      ReactDOM.render(
        <AddForm
          planId={planId}
          branchCompanyId={branchCompanyId}
          marker={formMarkerRef}
          addressInfo={graphInfo}
          onClose={onClose}
          onRefresh={onRefresh}
        />,
        document.getElementById(uid)
      );
    }
  };
  // const _onChange = useCallback(() => {
  //   graphInfo.current = null;
  //   drawGraph(valueRef);
  // }, [value]);

  const onClose = () => {
    setIsDraw(false);
    graphInfo.current = null;
    drawGraph(valueRef.current);
    setIsReset((state) => !state);
    setValue(null);
    mouseToolRef.current.close(true); // 传true,关闭mouseTool的鼠标操作，并清除已绘制的图形
    textHintMarkerRef.current.hide(); // 隐藏提示
    setIsShape(false);
    drawedRef.current = true;
  };

  const handleZoom = debounce(() => {
    // 多保留0.2 zoom，避免难以或无法触发
    if (amapIns?.getZoom() <= BUSINESS_ZOOM + 0.2 && valueRef.current) {
      V2Message.info('新增商圈绘制中，请勿继续放大地图');
      message.config({ maxCount: 1 });
    }
  }, 300);
  const getAddressPermissions = async() => {
    const address = await getTreeSelection({ planId, type: 1, childCompanyId: branchCompanyId });
    addressInfoRef.current = address;
  };
  const checkPermission = (adcode) => {
    const allDistrictCode:any = [];
    const traverseArr = (arr) => {
      arr?.map((item) => {
        if (item.code && !allDistrictCode.includes(item.code)) {
          allDistrictCode.push(item.code);
        }
        isArray(item.child) && item.child && traverseArr(item.child);
      });
    };
    traverseArr(addressInfoRef.current);
    return allDistrictCode.includes(adcode);
  };
  useEffect(() => {
    if (!amapIns) return;
    valueRef.current = value;
    if (value) {
      // 地图不可缩放小于围栏层级
      amapIns.setZooms([BUSINESS_ZOOM, 20]);

      amapIns.on('zoomend', () => {
        handleZoom();
      });
    } else {
      // 恢复默认zooms
      amapIns.setZooms([3.5, 20]);
    }
  }, [amapIns, value]);

  useEffect(() => {
    // 如果选了工具箱的工具，则取消绘制商圈形状的操作（不删除已绘制形状）
    if (isSelectToolBox) {
      setValue(null);
      // graphEditorRef.current?.close();// 关闭绘制
      // deleteMarkerRef.current?.hide();
      // mouseToolRef.current.close(true);
      textHintMarkerRef.current.hide();
      // 处理不规则形状绘制中状态
      if (!graphInfo.current) {
        mouseToolRef.current.close(true); // 清除已绘制
      }
    }
  }, [isSelectToolBox]);

  // 初始化MouseTool
  useEffect(() => {
    if (!amapIns) return;
    mouseToolRef.current = new window.AMap.MouseTool(amapIns); // 可进行鼠标画标记点、线、多边形、矩形、圆、距离量测、面积量测、拉框放大、拉框缩小等功能

    // 鼠标工具绘制覆盖物结束时触发此事件，obj对象为绘制出来的覆盖物对象。
    mouseToolRef.current.on('draw', ({ obj }) => drawFinish(obj));
  }, [amapIns]);

  // 初始化marker
  useEffect(() => {
    if (!amapIns) return;

    textHintMarkerRef.current = new window.AMap.Text({
      offset: new window.AMap.Pixel(50, 50),
    });

    deleteMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      offset: new window.AMap.Pixel(10, 10),
    });
    deleteMarkerRef.current.on('click', deleteClick);
    amapIns.add(deleteMarkerRef.current);

    formMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      offset: new window.AMap.Pixel(250, -200),
      zIndex: 50,
    });
    amapIns.add(formMarkerRef.current);
  }, [amapIns]);
  // useEffect(() => {
  //   if (!deleteMarkerRef.current) return;
  //   deleteMarkerRef.current.on('click',
  //     deleteClick
  //   );
  //   return () => {
  //     deleteMarkerRef.current.off('click',
  //       deleteClick
  //     );
  //   };
  // }, [value]);
  useEffect(() => {
    // if (originPath === 'chancepoint' && !companyParams) return;// 从机会点跳转网规地图
    getAddressPermissions();
  }, []);

  return <div className={cs(styles.drawGraph, !leftDrawerVisible && styles.hideLeftDrawer, addBusiness)}>
    <div style={{ display: !expand ? 'none' : '' }} className={styles.content}>
      <div
        className={cs(styles.card, value === graphType.CIRCLE ? styles.active : '')}
        onClick={() => onChange(graphType.CIRCLE)}>
        <IconFont iconHref='iconic_yuanxing' className='fs-16 inline-block mr-8'/>
        圆形
      </div>
      <div
        className={cs(styles.card, value === graphType.POLYGON ? styles.active : '')}
        onClick={() => onChange(graphType.POLYGON)}>
        <IconFont iconHref='iconic_buguize' className='fs-16 inline-block mr-8'/>
        不规则
      </div>
    </div>
  </div>;
};

export default DrawShape;
