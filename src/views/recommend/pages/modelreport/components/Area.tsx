import { FC, useEffect, useState } from 'react';
import { Table, Tooltip, Row, Col } from 'antd';
import styles from '../entry.module.less';
import AMap from '@/common/components/AMap/index';
// import Radar from './Radar';
import Radar from '@/common/components/EChart/Radar';
import { icon, rankIcon } from '../ts-config';
import { modelPOIList } from '@/common/api/recommend';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

function areEqual(prevProps, nextProps) {
  let flag = false;
  if (prevProps.area) {
    if (nextProps.area) {
      flag = true;
    } else {
      flag = false;
    }
  } else {
    if (nextProps.area) {
      flag = false;
    } else {
      flag = true;
    };
  };
  return flag;
}

const Point: FC<{
  area: any;
  rank: number;
  ind: number;
  id: any;
}> = ({
  area,
  rank,
  ind,
  id
}) => {
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [stores, setStores] = useState<any>([]);
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [indicator, setIndicator] = useState<any>(null);
  const [radarData, setRadarData] = useState<any>(null);
  useEffect(() => {
    if (area) {
      setShowLoading(false);
    } else {
      amapIns && amapIns.destroy();
      setAmapIns(null);
      setShowLoading(true);
    };
    handleRadarInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area]);
  useEffect(() => {
    if (!amapIns) return;
    if (area) {
      drawDomian();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);
  const drawDomian = async () => {
    if (!id) return;
    const list = await modelPOIList({
      id,
      labelId: area.labelId,
      clusterId: area.clusterId,
      areaCode: area.areaCode
    });
    setStores(list);
    // 添加点位标记
    list.forEach((point, ind) => {
      createPointMarker(point, ind);
    });
    const circle = new window.AMap.Circle({
      center: [area.lng, area.lat],
      radius: area.radius, // 半径
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
    // 缩放地图到合适的视野级别
    amapIns.setFitView([circle]);
  };
  const createPointMarker = (point, num): any => {
    // 创建一个 Marker 实例：
    new window.AMap.Marker({
      map: amapIns,
      icon: new window.AMap.Icon({
        image: rankIcon[num].url,
        size: [25, 28],
        imageSize: [25, 28]
      }),
      anchor: 'bottom-center',
      position: new window.AMap.LngLat(point.lng, point.lat),
    });
  };
  const loadedMapHandle = (map,) => {
    setAmapIns(map);
  };
  const handleRadarInfo = () => {
    if (!area?.scores?.length) return;
    const indicatorData: any = [];
    const radarData: any = [];
    area.scores.map((item) => {
      indicatorData.push({
        name: item.name,
        max: 100,
      });
      radarData.push(item.score);
    });
    setIndicator(indicatorData);
    setRadarData(radarData);
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'poiId',
      render: (_, __, index) => {
        const num = index + 1;
        if (num === 1) {
          return <span>
            {num}<span style={{ fontSize: '12px' }}>(最佳位置)</span>
          </span>;
        }
        return num;
      }
    },
    {
      title: '店铺名称',
      dataIndex: 'poiName',
      key: 'poiName',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: address => (
        <Tooltip placement='topLeft' title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: '实际得分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      render: (_) => <span>{Math.round(_)}</span>
    },
  ];
  return <div className={styles.point}>
    <div className='item'>
      <div className='title'>
        {!showLoading && area ? <>{ind < 3 && <img src={icon[ind].url} />}
          <span onClick={() => dispatchNavigate(`/recommend/detail?id=${id}&ind=${ind}`)}>NO.{rank}-{area.name}</span></>
          : <span></span>
        }
      </div>
      <div className='main'>
        {showLoading && (<div className='loading'><LoadingOutlined style={{ fontSize: '36px' }} /></div>)}
        {!showLoading && area ? <Row gutter={40}>
          <Col span={7}>
            {/* <Radar height={'100%'} data={area} /> */}
            <Radar
              data={radarData}
              indicator={indicator}
              title={Math.round(area?.totalScore)}
              titleLabel='总分'
              radius={70}
              // height='200px'
              // titleTextFontSize={['16px', '8px']}
              radarInfo={{
                rich: {
                  a: {
                    color: '#86909C',
                    lineHeight: 20,
                    fontSize: '12px',
                  },
                  b: {
                    color: '#656E85',
                    align: 'center',
                    fontWeight: 'bolder',
                    fontSize: '12px',
                  },
                },
              }}
            />
          </Col>
          <Col span={8} offset={0.4}>
            <span className='radius'>可选址范围：{(3.14 * area.radius * area.radius).toFixed(2)}m²</span>
            <AMap
              loaded={loadedMapHandle}
            />
          </Col>
          <Col span={9}>
            <Table rowKey='poiId' dataSource={stores} columns={columns} pagination={false} />
          </Col>
        </Row> : <div></div>}
      </div>
    </div>

  </div>;
};

export default React.memo(Point, areEqual);

