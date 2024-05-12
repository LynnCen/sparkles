import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import { Card, Avatar, Image } from 'antd';
import AMap from '@/common/components/AMap/index';
import { icon as leftIcon, areaIcon } from '../ts-config';
import { modelPOIList } from '@/common/api/recommend';

const { Meta } = Card;

const Overview: FC<{
  reportData: any;
  areaList: any;
  id: any;
  showMap: boolean;
}> = ({
  reportData,
  areaList,
  id,
  showMap
}) => {
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [pluginIsLoaded, setPluginIsLoaded] = useState<boolean>(false);
  const [areaData, setAreaData] = useState<any>([]);
  useEffect(() => {
    if (!showMap) {
      amapIns && amapIns.destroy();
      setAmapIns(null);
      setPluginIsLoaded(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap]);
  useEffect(() => {
    dealAreaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaList]);
  useEffect(() => {
    pluginIsLoaded && drawDomian();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pluginIsLoaded, areaData]);
  const dealAreaData = async () => {
    const data = areaList.slice(0, 3);
    for (let i = 0; i < data.length; i++) {
      if (!id) return;
      const list = await modelPOIList({
        id,
        labelId: data[i].labelId,
        clusterId: data[i].clusterId,
        areaCode: data[i].areaCode
      });
      data[i].stores = list;
    };
    setAreaData(data);
  };
  const drawDomian = () => {
    // const circleList:any = [];
    // 绘制圆形区域
    areaData.forEach((val, ind) => {
      // 添加圆圈
      const circle = new window.AMap.Circle({
        center: [val.lng, val.lat],
        radius: val.radius, // 半径
        strokeColor: '#006AFF',
        strokeWeight: 2,
        strokeOpacity: 1,
        fillOpacity: 0.2,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        // 线样式还支持 'dashed'
        fillColor: '#006AFF',
        zIndex: 50,
      });
      circle.setMap(amapIns);
      createElasticMarker(val.lng, val.lat, areaIcon[ind].url, true);
      // 缩放地图到合适的视野级别
      ind === 0 && amapIns.setFitView([circle]);
    });
    // // 缩放地图到合适的视野级别
    // circleList.length && amapIns.setFitView(circleList);
  };
    //
  const createElasticMarker = (lng, lat, icon: string, visible: boolean, label?: any,): any => {
    return new window.AMap.ElasticMarker({
      map: amapIns,
      position: [lng, lat],
      zooms: [13, 20],
      styles: [{
        icon: {
          img: icon,
          size: [32, 32], // 可见区域的大小
          anchor: 'bottom-center', // 锚点
          imageSize: [32, 32],
          fitZoom: 16, // 最合适的级别
          scaleFactor: 2, // 地图放大一级的缩放比例系数
          maxScale: 1, // 最大放大比例
          minScale: 0.7 // 最小放大比例
        },
        label: label ? {
          content: label,
          position: 'BR',
          offset: [-20, 0]
        } : null
      }],
      zoomStyleMapping: {
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: 0
      },
      visible: visible
    });
  };
  const loadedMapHandle = (map,) => {
    setAmapIns(map);
    window.AMap.plugin(['AMap.ElasticMarker'], function () {
      setPluginIsLoaded(true);
    });
  };
  return (
    <div className={styles.overview}>
      <div className='top'>
        <Image
          width={80}
          height={80}
          src={reportData.logo}
          fallback='https://staticres.linhuiba.com/project-custom/locationpc/img_placeholder.png'/>
        <span>{reportData.address}开店区域推荐报告</span>
      </div>
      <div>
        <p className='description'>根据{reportData.modelName}推荐以下三个最佳开店区：</p>
        <div className='content'>
          {showMap ? <AMap
            width='500px'
            height='300px'
            loaded={loadedMapHandle}
          /> : <div className='space'></div>}
          <div className='list'>
            {areaData.map((val, ind) => <Card
              key={val.name}
              bordered={false}
              bodyStyle={{ padding: '0 0 27px', }}
            >
              <Meta
                className={styles.meta}
                avatar={<Avatar shape='square' size={20} src={leftIcon[ind].url} />}
                title={`NO.${ind + 1}-${val.name}`}
                description={`最佳推荐位置为：${val.stores[0] ? val.stores[0].poiName : ''}`}
              />
              <div className='bottomDes'>
                <p><span>区域评分：{Math.round(val.totalScore)}</span> <span>可选址范围：{(3.14 * val.radius * val.radius).toFixed(2) }m²</span></p>
              </div>
            </Card>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
