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
import { debounce } from '@lhb/func';
import { BUSINESS_ZOOM } from '@/common/components/AMap/ts-config';
import { Form, message } from 'antd';
import { useSelector } from 'react-redux';
import { findDistrict } from '@/common/utils/ways';
import { addBusiness, graphType, styleConfig } from './ts-config';

// 绘制图形组件
const DrawShape: FC<any> = ({
  mapIns,
  isSelectToolBox, // 工具箱中的按钮是否激活
  setIsSelectToolBox, // 工具箱与新增商圈互斥，设置工具箱中的按钮是否激活
  setIsShape,
  expand,
  setIsDraw, // 是否已经绘制出图形信息，graphInfo有数据则为true
  setIsReset,
  setLeftDrawerVisible,
  setRightDrawerVisible,
  polygonData,
  firstLevelCategory
}) => {
  const [form] = Form.useForm();

  const cityForAMap = useSelector((state: any) => state.common.cityForAMap);

  const [value, setValue] = useState(null); // 绘制商圈形状选中的形状值
  const mouseToolRef = useRef<any>(null);
  const graphRef = useRef<any>(null); // 图形
  const graphInfo = useRef<any>(null); // 图形信息，用于外边判断是否已绘制
  const graphEditorRef = useRef<any>(null); // 图形编辑器
  const textHintMarkerRef = useRef<any>(null); // 绘制文字提示
  const deleteMarkerRef = useRef<any>(null); // 删除按钮
  const formMarkerRef = useRef<any>(null); // 新增商圈form表单 marker
  const valueRef = useRef<any>(null);
  const polygonDataRef = useRef<any>(null);// 存储最新的polygonData
  const firstLevelCategoryRef = useRef<any>([]);// 存储最新的firstLevelCategory
  const cityForAMapRef = useRef<any>(null);// 存储最新的cityForAMap

  // 控制两侧显示与否
  const controlSideShow = (status) => {
    setLeftDrawerVisible(status);
    setRightDrawerVisible(status);
  };
  const deleteClick = () => {
    // isDrawingRef.current = false;
    setIsDraw(false);
    graphInfo.current = null;
    drawGraph(valueRef.current);
  };
  // 绘制完成
  const drawFinish = (obj) => {

    graphRef.current = obj;

    if (obj.className === graphType.CIRCLE) {
      // 圆形编辑器
      graphEditorRef.current = new window.AMap.CircleEditor(mapIns, obj, {
        editOptions: styleConfig,
      });
      // 获取点位相关信息并存入graphInfo
      getCircleInfo();
    } else {
      // 多边形编辑器
      graphEditorRef.current = new window.AMap.PolygonEditor(mapIns, obj, {
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
    graphEditorRef.current?.on('addnode', () => {
      valueRef.current === graphType.CIRCLE ? getCircleInfo() : getPolygonInfo();
    });
    graphEditorRef.current?.on('removenode', () => {
      if (!graphRef.current.getPath()?.length) {
        formMarkerRef.current.setContent(` `);
        onClose();
      } else {
        valueRef.current === graphType.CIRCLE ? getCircleInfo() : getPolygonInfo();
      }
    });

    // 移动后重新获取最新数据
    graphEditorRef.current?.on('move', () => {
      valueRef.current === graphType.CIRCLE ? getCircleInfo() : getPolygonInfo();
    });

    // 绘制完后，关闭mouseToolRef工具，只可以绘制一个图形
    mouseToolRef.current?.close();
    // 绘制完后取消提示marker
    textHintMarkerRef.current && mapIns.remove(textHintMarkerRef.current);

  };

  // 处理选择圆形、不规则
  const onChange = (val) => {
    if (mapIns.getZoom() < BUSINESS_ZOOM) {
      V2Message.info('请缩放层级至显示商圈围栏');
      return;
    }

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
      controlSideShow(true);// 显示两侧
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
          (graphRef.current?.getRadius() > 500 || graphRef.current?.getRadius() < 100) ||
         (graphRef.current?.getArea() > 800000 || graphRef.current?.getArea() < 10000)
            ? '请先删除已有商圈形状'
            : '请先完成商圈信息填写'
        }`
      );
      return;
    }

    controlSideShow(false);// 隐藏两侧显示
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
  // 开启绘制图形
  const drawGraph = (type) => {
    if (!mapIns) return;
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
    mapIns.add(textHintMarkerRef.current);
  };
  // 设置提示marker位置和文案
  const setHintMessage = (e) => {
    if (!valueRef.current) return;
    textHintMarkerRef.current?.setPosition([e.lnglat.lng, e.lnglat.lat]);
    textHintMarkerRef.current?.setText(
      valueRef.current === graphType.CIRCLE
        ? '按住拖拽画图，松开结束画图'
        : '单击三点成面，双击编辑形状'
    );
  };
  // 删除marker
  const setDeleteMarker = () => {
    if (!(graphInfo.current?.lng && graphInfo.current?.lat)) return;
    deleteMarkerRef.current.setPosition([
      graphInfo.current?.lng,
      graphInfo.current?.lat,
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
    mapIns.setCenter([lng, lat], true);
    geocoder.getAddress([lng, lat], (status, res) => {
      if (status === 'complete') {
        const { province, city, district, adcode } = res?.regeocode?.addressComponent;
        const curMapInfo = findDistrict(cityForAMapRef.current, adcode);
        const radius = graphRef.current?.getRadius();

        setIsDraw(true);
        graphInfo.current = {
          radius,
          // area: graphRef.current?.getArea(),
          lng,
          lat,
          address: res?.regeocode?.formattedAddress,
          // province、city、district 从高德拿
          provinceName: province,
          cityName: city || province,
          districtName: district || city || province, // 某些市下面没有行政区，直接到镇级别
          // curMapInfo里面也是provinceName、cityName、districtName，来源是通过adcode去和服务端的数据库匹配
          // curMapInfo有数据，则使用curMapInfo,没有数据则通过以高德获取的数据保底
          ...curMapInfo
        };

        if (radius > 500 || radius < 100) {
          // 设置deleteMarker位置及信息
          V2Message.info(`当前半径为${radius}m，圆形半径需在100~500m之间`);
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
    mapIns.setCenter(center, true);
    geocoder.getAddress(center, (status, res) => {
      if (status === 'complete') {
        const { province, city, district, adcode } = res?.regeocode?.addressComponent;
        const curMapInfo = findDistrict(cityForAMapRef.current, adcode);
        const polygonArea = graphRef.current?.getArea();
        setIsDraw(true);
        // isDrawingRef.current = true;
        graphInfo.current = {
          // graphRef.current.getPath()是高德的lnglat格式
          polygon: graphRef.current.getPath()?.map((item) => ({ lng: item.lng, lat: item.lat })),
          // polygonArea,
          lng: center[0],
          lat: center[1],
          address: res?.regeocode?.formattedAddress,
          // province、city、district 从高德拿
          provinceName: province,
          cityName: city || province,
          districtName: district || city || province, // 某些市下面没有行政区，直接到镇级别
          // curMapInfo里面也是provinceName、cityName、districtName，来源是通过adcode去和服务端的数据库匹配
          // curMapInfo有数据，则使用curMapInfo,没有数据则通过以高德获取的数据保底
          ...curMapInfo
        };

        if (polygonArea >= 800000 || polygonArea <= 10000) {
          V2Message.info(
            `当前面积为${polygonArea}m²，面积需在10000㎡~800000㎡之间`
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
    // 编辑图形和绘制图形后，都需要更新formMarker的位置
    formMarkerRef.current.setPosition([
      +graphInfo.current?.lng,
      +graphInfo.current?.lat,
    ]);
    // 绘制图形后需要生成formMarker的内容
    const uid: any = v4();
    formMarkerRef.current.setContent(`<div id="${uid}"></div>`);
    ReactDOM.render(
      <AddForm
        marker={formMarkerRef}
        addressInfo={graphInfo}
        onClose={onClose}
        form={form}
        polygonDataRef={polygonDataRef}
        firstLevelCategoryRef={firstLevelCategoryRef}
      />,
      document.getElementById(uid)
    );
  };

  // form表单的删除按钮
  const onClose = () => {
    setIsDraw(false);
    graphInfo.current = null;
    drawGraph(valueRef.current);
    setIsReset((state) => state + 1);
    setValue(null);
    mouseToolRef.current.close(true); // 传true,关闭mouseTool的鼠标操作，并清除已绘制的图形
    textHintMarkerRef.current.hide(); // 隐藏提示
    setIsShape(false);
    // drawedRef.current = true;
    form.resetFields();
  };

  const handleZoom = debounce(() => {
    // 多保留0.2 zoom，避免难以或无法触发
    if (mapIns?.getZoom() <= BUSINESS_ZOOM + 0.2 && valueRef.current) {
      V2Message.info('新增商圈绘制中，请勿继续放大地图');
      message.config({ maxCount: 1 });
    }
  }, 300);

  // 当地图实例加载后，初始化MouseTool 初始化marker
  useEffect(() => {
    if (!mapIns) return;
    mouseToolRef.current = new window.AMap.MouseTool(mapIns); // 可进行鼠标画标记点、线、多边形、矩形、圆、距离量测、面积量测、拉框放大、拉框缩小等功能

    // 鼠标工具绘制覆盖物结束时触发此事件，obj对象为绘制出来的覆盖物对象。
    mouseToolRef.current.on('draw', ({ obj }) => drawFinish(obj));

    // 绘制文字提示marker
    textHintMarkerRef.current = new window.AMap.Text({
      offset: new window.AMap.Pixel(50, 50),
    });
    mapIns.on('mousemove', (e) => setHintMessage(e));

    // 删除按钮marker
    deleteMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      offset: new window.AMap.Pixel(10, 10),
    });
    deleteMarkerRef.current.on('click', deleteClick);
    mapIns.add(deleteMarkerRef.current);

    // form表单marker
    formMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      offset: new window.AMap.Pixel(250, -200),
      zIndex: 50,
    });
    mapIns.add(formMarkerRef.current);
    return () => {
      mapIns.off('mousemove', (e) => setHintMessage(e));
    };
  }, [mapIns]);

  useEffect(() => {
    if (!mapIns) return;
    valueRef.current = value;
    if (value) {
    // 被选中绘制时-地图不可缩放小于围栏层级,绑定提示事件
      mapIns.setZooms([BUSINESS_ZOOM, 20]);
      mapIns.on('zoomend', handleZoom);
    } else {
      // 恢复默认zooms
      mapIns.setZooms([3.5, 20]);
    }
    return () => {
      mapIns.off('zoomend', handleZoom);
    };
  }, [mapIns, value]);

  // 与工具箱操作互斥
  useEffect(() => {
    if (isSelectToolBox) {
      // 如果选了工具箱的工具，则取消绘制商圈形状的操作（不删除已绘制形状）
      setValue(null);
      textHintMarkerRef.current.hide();
      // 额外处理不规则形状绘制中状态
      if (!graphInfo.current) {
        mouseToolRef.current.close(true); // 清除已绘制
      }
    }
  }, [isSelectToolBox]);
  useEffect(() => {
    firstLevelCategoryRef.current = firstLevelCategory;
  }, [firstLevelCategory]);
  useEffect(() => {
    polygonDataRef.current = polygonData;
  }, [polygonData]);
  useEffect(() => {
    cityForAMapRef.current = cityForAMap;
  }, [cityForAMap]);

  // <div className={cs(styles.drawGraph, !leftDrawerVisible && styles.hideLeftDrawer, addBusiness)}>
  return <div className={cs(styles.drawGraph, addBusiness)}>
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

