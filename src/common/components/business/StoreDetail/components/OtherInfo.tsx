import DetailInfo from '@/common/components/business/DetailInfo';
import { post } from '@/common/request';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Col, Divider, Row, Table } from 'antd';
import { FC, useEffect, useState } from 'react';
// import { Map, Marker, Polygon } from 'react-amap';
import AMap from '@/common/components/AMap/index';
import { isArray } from '@lhb/func';

interface IProps {
  result: any;
}

const OtherInfo: FC<IProps> = ({ result }) => {
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [city, setCity] = useState<any>({});
  const [mall, setMall] = useState<any>({});

  useEffect(() => {
    if (!amapIns) return;
    (async () => {
      const { cityId, mallId } = result;
      // https://yapi.lanhanba.com/project/353/interface/api/36518
      const { cityInfo, mallInfo } = await post('/chancePoint/locationQuery', { cityId, mallId }, true);
      cityInfo && setCity(cityInfo);
      cityInfo && creatOverlay(cityInfo);
      mallInfo && setMall(mallInfo);
    })();
    const { lat, lng } = result;
    if (lat && lng) {
      amapIns.setZoomAndCenter(10, [lng, lat]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);
  const creatOverlay = (city: any) => {
    const overlays:any = [];
    isArray(city.circles) && city.circles.forEach(circle => {
      const data = circle.coordinate.map(_ => [_.longitude, _.latitude]);
      const polygon = new window.AMap.Polygon({
        path: data
      });
      const marker = new window.AMap.Marker({
        map: amapIns,
        position: circle.gaoDeLatitude && circle.gaoDeLongitude ? [circle.gaoDeLongitude, circle.gaoDeLatitude] : data[0], // 有中心点用中心点坐标显示名称，没有用商圈第一个坐标,
        anchor: 'bottom-center',
        content: renderMarker(circle.name)
      });
      overlays.push(polygon, marker);
    });
    amapIns.add(overlays);
  };
  const columns = [
    {
      title: '商圈名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '商圈客流排名',
      dataIndex: 'rankOfCity',
      key: 'rankOfCity',
    },
  ];

  const renderMarker = (text: string) => {
    return `<div class='color-primary' style="width: max-content;">
      ${text}
    </div>`;
  };
  const loadedMapHandle = (map) => {
    setAmapIns(map);
  };
  return (
    <>
      <TitleTips name='城市信息' showTips={false} />
      <Row>
        <DetailInfo title='城市名称' value={city.name} />
        <DetailInfo title='城市级别' value={city.levelName} />
        <DetailInfo title='城市类别' value={city.categoryName} />
        <DetailInfo title='城市面积(k㎡)' value={city.area} />
        <DetailInfo title='常驻人口数(万人)' value={city.population} />
        <DetailInfo title='流动人口数（万人）' value={city.flowPopulation} />
        <DetailInfo title='城市GDP（亿元）' value={city.gdp} />
        <DetailInfo title='人均GDP（万元）' value={city.avgGdp} />
        <DetailInfo title='GDP增速（%）' value={city.gdpGrowthRate} />
        <DetailInfo title='机场（个）' value={city.airportNum} />
        <DetailInfo title='购物中心数量（个）' value={city.shoppingCenterCount} />
        <DetailInfo title='购物中心总面积（万方）' value={city.totalMallArea} />
      </Row>
      <Row>
        <Col span={12}>
          <div style={{ width: '550px', height: '404px' }}>
            <AMap
              loaded={loadedMapHandle}
              config={{}}
            />
          </div>
        </Col>
        <Col span={12}>
          <Table dataSource={city.circles || []} columns={columns} pagination={false} scroll={{ y: 345 }} rowKey='id' />
        </Col>
      </Row>
      <Divider />

      <TitleTips name='场地信息' showTips={false} />
      <Row>
        <DetailInfo title='详细地址' value={mall.mallAddress} />
        <DetailInfo title='开业时间' value={mall.openingDate} />
        <DetailInfo title='建筑面积' value={mall.builtArea} />
        <DetailInfo title='场地楼层' value={mall.floor} />
        <DetailInfo title='日均客流（人次）' value={mall.passengerFlowVolume} />
        <DetailInfo title='工作日日均客流（人次）' value={mall.weekdayFlow} />
        <DetailInfo title='节假日日均客流（人次）' value={mall.weekendFlow} />
        <DetailInfo title='地铁站' value={mall.subwayNum} />
        <DetailInfo title='公交站' value={mall.busStationNum} />
      </Row>
    </>
  );
};

export default OtherInfo;
