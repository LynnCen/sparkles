// import { Radio, Space } from 'antd';
import { useState, FC, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from '../index.module.less';
import { useMethods } from '@lhb/hook';
import IconFont from '@/common/components/IconFont';
import { getPolygonCenter } from 'src/common/utils/map';
import cs from 'classnames';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { useSelector } from 'react-redux';
import { findDistrict } from '@/common/utils/ways';
export enum graphType { // 覆盖物类型
    CIRCLE = 'Overlay.Circle',
    POLYGON = 'Overlay.Polygon'
}

// 图形样式
const styleConfig = {
  strokeColor: '#0A9999',
  strokeOpacity: 1,
  strokeWeight: 2,
  strokeStyle: 'dashed',
  fillColor: '#07B4B4',
  fillOpacity: 0.2,
  color: '#006AFF'
};

// 绘制图形组件
const DrawGraph:FC<any & { ref?: any }> = forwardRef(({
  _mapIns,
  onDraw,
  isSelectToolBox,
  setIsSelectToolBox,
  setIsShape,
  setExpand,
  expand
}, ref) => {

  useImperativeHandle(ref, () => ({
    getGraphInfo: methods.getGraphInfo
  }));

  const cityForAMap = useSelector((state: any) => state.common.cityForAMap);

  const [value, setValue] = useState(null);// 绘制商圈形状选中的形状值
  const mouseToolRef = useRef<any>(null);
  const graphRef = useRef<any>(null); // 图形
  const graphInfo = useRef<any>(null); // 图形信息，用于外边判断是否已绘制
  const graphEditorRef = useRef<any>(null); // 图形编辑器
  const textHintMarkerRef = useRef<any>(null); // 文字提示
  const deleteMarkerRef = useRef<any>(null);// 删除按钮
  useEffect(() => {
    if (!_mapIns) return;
    mouseToolRef.current = new window.AMap.MouseTool(_mapIns);// 可进行鼠标画标记点、线、多边形、矩形、圆、距离量测、面积量测、拉框放大、拉框缩小等功能
    mouseToolRef.current.on('draw', function({ obj }) {
      graphRef.current = obj;

      const geocoder = new window.AMap.Geocoder();// 用于地址描述与经纬度坐标之间的转换
      if (obj.className === graphType.CIRCLE) {
        graphEditorRef.current = new window.AMap.CircleEditor(_mapIns, obj, { editOptions: styleConfig });// 圆形编辑器
        methods.getCircleInfo(geocoder);
      } else {
        graphEditorRef.current = new window.AMap.PolygonEditor(_mapIns, obj, { editOptions: styleConfig });
        // 多边形编辑器
        methods.getPolygonInfo(geocoder);
      }
      graphEditorRef.current?.open();// 让绘制的形状可编辑
      mouseToolRef.current?.close();// 关闭，只可以绘制一个
      // 调整后重新获取最新数据
      graphEditorRef.current?.on('adjust', () => {
        value === graphType.CIRCLE ? methods.getCircleInfo(geocoder)
          : methods.getPolygonInfo(geocoder);
      });

      // 移动后重新获取最新数据
      graphEditorRef.current?.on('move', () => {
        value === graphType.CIRCLE ? methods.getCircleInfo(geocoder)
          : methods.getPolygonInfo(geocoder);
      });
      // 绘制完后取消提示marker
      textHintMarkerRef.current && _mapIns.remove(textHintMarkerRef.current);
      methods.deleteMarker();
    });

  }, [_mapIns]);

  const methods = useMethods({
    onChange(val) {
      setIsSelectToolBox(false);
      if (val === value) {
        // 再次点击的时候，取消当前选中项
        setValue(null);
        setIsShape(false);
        if (graphInfo.current) {
          return;
        }
        // 如果未绘制，且置地图上的形状为空（针对不规则形状的绘制中）
        graphRef.current?.remove();
        graphEditorRef.current?.close();
        deleteMarkerRef.current?.setContent(` `);
        mouseToolRef.current.close(true);
        textHintMarkerRef.current.hide();
        return;
      }
      if (!graphInfo.current) {
        // 不存在的时候可能是没存绘制
        // 关闭当前鼠标操作。参数arg设为true时，鼠标操作关闭的同时清除地图上绘制的所有覆盖物对象
        mouseToolRef.current.close(true);
      } else {
        // 存在已绘制的形状，需要提示先删除在绘制
        V2Message.warning('请先删除已有商圈形状');
        return;
      }
      textHintMarkerRef.current?.setText(val === graphType.CIRCLE ? '按住拖拽画图，松开结束画图' : '单击三点成面，双击编辑形状');
      setValue(val);
      setIsShape(true);
      methods.drawGraph(val);
    },
    // 绘制图形
    drawGraph(type) {
      if (!_mapIns) return;
      // 去掉之前绘制的
      graphRef.current?.remove();
      graphRef.current = null;
      graphEditorRef.current?.close();
      graphEditorRef.current = null;
      deleteMarkerRef.current?.setContent(` `);
      type === graphType.CIRCLE && mouseToolRef.current.circle(styleConfig);
      type === graphType.POLYGON && mouseToolRef.current.polygon(styleConfig);


      _mapIns.add(textHintMarkerRef.current);
      _mapIns.on('mousemove', (e) => {
        methods.setHintMessage(e, type);
      });

    },
    // 获取图形数值
    getGraphInfo() {
      return graphInfo.current;
    },
    // 设置提示marker位置和文案
    setHintMessage(e, type) {
      textHintMarkerRef.current?.setPosition([e.lnglat.lng, e.lnglat.lat]);
      textHintMarkerRef.current?.setText(type === null ? `` : (type === graphType.CIRCLE ? '按住拖拽画图，松开结束画图' : '单击三点成面，双击编辑形状'));
    },
    // 删除marker
    deleteMarker() {
      if (!(graphInfo.current?.centerLng && graphInfo.current?.centerLat)) return;
      deleteMarkerRef.current.setPosition([graphInfo.current?.centerLng, graphInfo.current?.centerLat]);
      deleteMarkerRef.current.setContent(`<div class="deleteLabel"><span class="deleteText">删除该形状</span><svg style='width: 10px; height: 10px;' aria-hidden>
      <use xlink:href='#icondelete' style='fill:#132144 '/>
      </svg></div>`);
      // _mapIns.remove(deleteMarkerRef.current);
      // _mapIns.add(deleteMarkerRef.current);
    },
    // 获取圆形相关数据
    getCircleInfo(geocoder) {
      const { lat, lng } = graphRef.current?.getCenter();
      geocoder.getAddress([lng, lat], (status, res) => {
        const { province, city, district, adcode } = res?.regeocode?.addressComponent;
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
        onDraw && onDraw(`${province || '-'}/${city || province || '-'}/${district || city || province || '-'}`);
        methods.deleteMarker();
      });
    },
    // 获取多边形相关数据
    getPolygonInfo(geocoder) {
      const path = graphRef.current?.getPath()?.map(item => [item.lng, item.lat]);
      const center = getPolygonCenter(path);
      geocoder.getAddress(center, (status, res) => {
        const { province, city, district, adcode } = res?.regeocode?.addressComponent;
        graphInfo.current = {
          polygon: path,
          polygonArea: graphRef.current?.getArea(),
          centerLng: center[0],
          centerLat: center[1],
          provinceName: province,
          cityName: city || province,
          // 某些市下面没有行政区，直接到镇级别
          districtName: district || city || province,
          adcode
        };
        onDraw && onDraw(`${province || '-'}/${city || province || '-'}/${district || '-'}`);
        methods.deleteMarker();
      });
    }
  });
  useEffect(() => {
    // 如果选了工具箱的工具，则取消绘制商圈形状的操作（不删除已绘制形状）
    if (isSelectToolBox) {
      setValue(null);
      // graphEditorRef.current?.close();// 关闭绘制
      // deleteMarkerRef.current?.hide();
      // mouseToolRef.current.close(true);
      textHintMarkerRef.current.hide();
      if (!graphInfo.current) {
        mouseToolRef.current.close(true);// 清除已绘制
      }
    }
  }, [isSelectToolBox]);
  const deleteClick = () => {
    graphInfo.current = null;
    methods.drawGraph(value);
  };
  // 初始化marker
  useEffect(() => {
    if (!_mapIns) return;

    const textHintMarker = new window.AMap.Text({
      offset: new window.AMap.Pixel(50, 50)
    });
    textHintMarkerRef.current = textHintMarker;


    const deleteMarker = new window.AMap.Marker({
      content: ' ',
      offset: new window.AMap.Pixel(10, 10)
    });

    deleteMarkerRef.current = deleteMarker;
    _mapIns.add(deleteMarker);

  }, [_mapIns]);
  useEffect(() => {
    if (!deleteMarkerRef.current) return;
    deleteMarkerRef.current.on('click',
      deleteClick
    );
    return () => {
      deleteMarkerRef.current.off('click',
        deleteClick
      );
    };
  }, [value]);

  return <div className={styles.drawGraph}>
    {/* <div className={`expand ${expand && 'is-expanded'}`} onClick={() => setExpand(!expand)}> */}
    <div className={cs(styles.expand, expand ? styles.isExpanded : '')} onClick={() => setExpand(!expand)}>
      <div className={styles.title}>绘制商圈形状</div>
      <IconFont iconHref='iconarrow-down' className={styles.expandIcon}/>
    </div>
    <div style={{ display: !expand ? 'none' : '' }} className={styles.content}>
      <div
        className={cs(styles.card, value === graphType.CIRCLE ? styles.active : '')}
        onClick={() => methods.onChange(graphType.CIRCLE)}>
        <IconFont iconHref='iconic_yuanxing' className='fs-16 inline-block mr-5'/>
        圆形
      </div>
      <div
        className={cs(styles.card, value === graphType.POLYGON ? styles.active : '')}
        onClick={() => methods.onChange(graphType.POLYGON)}>
        <IconFont iconHref='iconic_buguize' className='fs-16 inline-block mr-5'/>
        不规则形状
      </div>
    </div>
  </div>;
});

export default DrawGraph;
