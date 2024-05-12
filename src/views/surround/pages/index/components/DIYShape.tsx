/**
 * @Description 自定义形状
 */
import { FC, useEffect, useRef } from 'react';
import { diyShape, styleConfig } from '../ts-config';
import { getPolygonCenter } from '@/common/utils/map';
// import { codeToPCD } from '@/common/api/common';
import styles from './index.module.less';
import ReactDOM from 'react-dom';
import { v4 } from 'uuid';
import IconFont from '@/common/components/IconFont';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const DIYShape:FC<any> = ({
  mapIns,
  isDiyShapeRef,
  setIsDrawing,
  // 需要radius来re-render
  radius,
  // form,
  handleDelete,
  shapeInfoRef,
  // 定位
  // cityInfoRef,
  // setCityInfoValue,
  // setTargetName,
  // onChange,
  // setSearchValue,
  setChangePoint
}) => {
  const mouseToolRef = useRef<any>(null);// 绘制工具
  const shapeMarkerRef = useRef<any>(null);// 自定义形状覆盖物-表示绘制完成
  const graphEditorRef = useRef<any>(null);// 自定义形状编辑工具
  const deleteMarkerRef = useRef<any>(null);// 删除按钮
  const textHintMarkerRef = useRef<any>(null); // 绘制文字提示
  const isDrawingRef = useRef<any>(null);// 是否正在绘制中

  const drawFinish = (value) => {
    if (value?.getPath()?.length < 3) {
      V2Message.info(`请绘制至少3个点`);
      mapIns.remove(value);
      return;
    }
    shapeMarkerRef.current = value;
    textHintMarkerRef.current.hide();

    graphEditorRef.current = new window.AMap.PolygonEditor(mapIns, value, {
      editOptions: styleConfig,
    });
    graphEditorRef.current?.open(); // 让绘制的形状可编辑
    getPolygonInfo();
    // 调整后重新获取最新数据
    graphEditorRef.current?.on('adjust', getPolygonInfo);
    graphEditorRef.current?.on('addnode', getPolygonInfo);
    graphEditorRef.current?.on('removenode', getPolygonInfo);
    // 移动后重新获取最新数据
    graphEditorRef.current?.on('move', getPolygonInfo);

    mouseToolRef.current?.close();
  };
  // 在自定义绘制情况下，点击地图标记绘制中
  const handleClick = () => {
    isDiyShapeRef.current && setIsDrawing(true);
  };

  // 获取多边形相关数据
  const getPolygonInfo = () => {
    const path = shapeMarkerRef.current
      ?.getPath()
      ?.map((item) => [item.lng, item.lat]);
    const center:any = getPolygonCenter(path);
    const area = shapeMarkerRef.current?.getArea();

    shapeInfoRef.current = {
      borders: path,
      area,
      lng: center[0],
      lat: center[1],
    };

    deleteMarkerRef.current.show();
    deleteMarkerRef.current.setPosition(center);
    mapIns.setCenter(center);

    // 当前面积为xxkm²，超过最大面积80km²
    if (area > 80 * 1000 * 1000) {
      V2Message.error(`当前面积为${area / 1000 / 1000}km²，超过最大面积80km²`);
      return;
    }

    setChangePoint((state) => ({
      lnglat: {
        lng: center[0],
        lat: center[1]
      },
      update: state.update + 1
    }));
    // handlePoint(center);
  };

  // 此处处理方式参照src/views/surround/pages/index/components/POISearch.tsx的amapClickHandle
  // const handlePoint = async(center) => {
  //   const addressInfo: any = await getLngLatAddress(center, '', false).catch((err) => console.log(`根据经纬度查询具体地址失败：${err}`));
  //   const { formattedAddress, addressComponent } = addressInfo;
  //   const { adcode, city } = addressComponent || {};
  //   let pcdInfo: any = null;
  //   if (adcode) {
  //     // 通过adcode获取数据库里的城市信息
  //     pcdInfo = await codeToPCD({
  //       districtCode: adcode,
  //       cityName: city
  //     });
  //     // 同步限定的搜索城市和查询城市的省市
  //     cityInfoRef.current = pcdInfo;
  //     const { provinceId, cityId, cityName, provinceName } = pcdInfo || {};
  //     provinceId && cityId && setCityInfoValue([provinceId, cityId]);
  //     setTargetName(cityName || provinceName);
  //   }
  //   onChange && onChange({
  //     lng: center[0],
  //     lat: center[1],
  //     address: formattedAddress,
  //     cityId: pcdInfo?.cityId
  //   });
  //   setSearchValue(formattedAddress || '');
  //   form.setFieldValue('keyword', formattedAddress);
  // };

  const onDelete = () => {
    mouseToolRef?.current?.close(true); // 传true,关闭mouseTool的鼠标操作，并清除已绘制的图形
    graphEditorRef?.current?.close();
    setIsDrawing(false);
    deleteMarkerRef.current?.hide();
    textHintMarkerRef.current?.hide();
    isDrawingRef.current = false;
    shapeInfoRef.current = null;
  };
  const handleMouseMove = (e) => {
    if (isDrawingRef.current) {
      textHintMarkerRef.current.setPosition(e.lnglat);
    }
  };
  useEffect(() => {
    if (!mapIns) return;
    // 删除按钮
    const uuid = v4();
    deleteMarkerRef.current = new window.AMap.Marker({
      map: mapIns,
      content: `<div id="${uuid}"></div>`,
    });
    mapIns.add(deleteMarkerRef.current);
    deleteMarkerRef.current.hide();
    ReactDOM.render(<DeleteElement onDelete={handleDelete}/>, document.getElementById(uuid));


    // 绘制文字提示marker
    textHintMarkerRef.current = new window.AMap.Text({
      position: [0, 0],
      map: mapIns,
      text: '单击三点成面，双击编辑形状',
      offset: new window.AMap.Pixel(50, 50),
    });

    mouseToolRef.current = new window.AMap.MouseTool(mapIns); // 可进行鼠标画标记点、线、多边形、矩形、圆、距离量测、面积量测、拉框放大、拉框缩小等功能

    // 鼠标工具绘制覆盖物结束时触发此事件，obj对象为绘制出来的覆盖物对象。
    mouseToolRef.current.on('draw', ({ obj }) => drawFinish(obj));
    mapIns.on('click', handleClick);
    mapIns.on('mousemove', handleMouseMove);

    return () => {
      mapIns.off('click', handleClick);
      mapIns.on('mousemove', handleMouseMove);
    };
  }, [mapIns]);

  useEffect(() => {
    if (radius === diyShape) {
      isDrawingRef.current = true;
      textHintMarkerRef.current.show();
      mouseToolRef.current?.polygon(styleConfig);
    } else {
      // mouseToolRef.current?.close();
      onDelete();
    }
  }, [radius]);
  return <>

  </>;
};
export default DIYShape;

const DeleteElement = ({ onDelete }) => {
  return <div className={styles.deleteLabel} onClick={onDelete}>
    <span className={styles.deleteText}>删除该形状</span>
    <IconFont iconHref={'icondelete'}/>
  </div>;
};
