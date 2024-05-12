
import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import AMap from '@/common/components/AMap/index';
import { getDistrictBounds } from '@/common/utils/map';
import Top from './components/Top';
import LeftCon from './components/LeftCon';
import MapDrawer from '@/common/components/business/MapDrawer';
import RecommendSidebar from '@/common/components/business/RecommendSidebar';
import KeepAlive from 'react-activation';
import { useTenantType } from '@/common/hook/business/useTenantType';
import HeadAlert from '@/common/components/business/HeadAlert';

const Modal: FC<any> = () => {
  // const firstRef = useRef(true);
  const topRef:any = useRef(null);
  // tenantStatus 0:试用企业，1：正式企业； 默认1
  const { tenantStatus } = useTenantType(); // 租户类型
  const [id, setId] = useState<any>(0);
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [polygonsBounds, setPolygonsBounds] = useState<Array<any>>([]); // 行政区域边界范围
  const [region, setRegion] = useState<any>(); // 行政区域
  const [rightDrawerVisible, setRightDrawerVisible] = useState(true);
  const [model, setModel] = useState<any>({ modelName: '', address: '' });

  // 工具箱状态
  const handleRightDrawerBtn = () => {
    topRef?.current?.handleSelected((state) => rightDrawerVisible ? state + 1 : state - 1);
  };
  // 处理全屏状态
  const onChangeShow = () => {
    setRightDrawerVisible((state) => !state);
    handleRightDrawerBtn();
  };


  const amapCreated = (ins: any) => {
    setAmapIns(ins);
  };
  // 显示行政区域
  const targetBounds = async () => {
    const { name, level } = region;
    const bounds: any = await getDistrictBounds(
      {
        subdistrict: 0, // 获取边界不需要返回下级行政区
        extensions: 'all', // 返回行政区边界坐标组等具体信息
        level, // 查询行政级别为 市
      },
      name
    );

    polygonsBounds && amapIns && amapIns.remove(polygonsBounds); // 清除上次结果
    const polygons: Array<any> = [];
    for (let i = 0, l = bounds.length; i < l; i++) {
      // 生成行政区划polygon
      const polygon = new window.AMap.Polygon({
        strokeWeight: 1,
        path: bounds[i],
        fillOpacity: 0.2,
        fillColor: '#006aff',
        strokeColor: '#006aff',
      });
      polygons.push(polygon);
    }
    setPolygonsBounds(polygons);
    amapIns.add(polygons);
    amapIns.setFitView(polygons); // 视口自适应
  };
  // 获取当前地址
  const getCurrentAddress = () => {
    amapIns.getCity((val) => {
      setRegion({
        name: val.city || val.province, // 名称（城市名或区域名）直辖市没有city值
        level: 'city', // 行政级别（市、区）
      });
    });
  };

  useEffect(() => {
    if (!amapIns) return;
    getCurrentAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);

  useEffect(() => {
    region?.name && targetBounds(); // 行政区域范围
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region?.name]);

  // id改变的时候清空地图所有点
  useEffect(() => {
    if (!amapIns) return;
    amapIns.clearMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <>
      {
        tenantStatus === 0 && <HeadAlert />
      }
      <div className={styles.container}>

        <AMap
          loaded={amapCreated}
          plugins={[
            'AMap.DistrictSearch',
            'AMap.Geocoder',
            'AMap.RangingTool',
            'AMap.PlaceSearch',
            'AMap.HeatMap',
            'AMap.Driving', // 驾车
            'AMap.Riding', // 骑行
            'AMap.Walking' // 走路
          ]}>

          <Top
            change={setRegion}
            region={region}
            setId={setId}
            id={id}
            setRightDrawerVisible={setRightDrawerVisible}
            rightDrawerVisible={rightDrawerVisible}
            topRef={topRef}
            onChangeShow={onChangeShow}
          />

          {id ? <LeftCon
            id={id}
            setModel={setModel}
            model={model} /> : <></>}

        </AMap>
        {id &&
          <MapDrawer
            placement='right'
            mapDrawerStyle={{
              width: '240px',
              top: '50px',
              height: 'max-content', // 动态高度
              right: '40px',
              maxHeight: 'calc(100vh - 70px)', // 动态高度，70是根据UI稿
              transform:
                rightDrawerVisible ? 'translateX(0%)' : 'translateX(280px)'
            }}
            visible={rightDrawerVisible}
            setVisible={setRightDrawerVisible}
          >
            <RecommendSidebar amapIns={amapIns} model={model} />
          </MapDrawer>
        }
      </div>
    </>
  );
};

// export default Modal;

export default ({ location }) => (
  <KeepAlive saveScrollPosition='screen' name={location.pathname}>
    <Modal />
  </KeepAlive>
);
