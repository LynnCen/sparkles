
import React, { useMemo, useRef, useState } from 'react';
import { Col, Row } from 'antd';
import { PageLayout } from '../Layout';
import styles from './index.module.less';
import PoiMap from './PoiMap';
import V2Table from '@/common/components/Data/V2Table';
// import PoiMap from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer/Category/components/PoiMap';
// import { getSourroundPoiCount2Level } from '@/common/api/surround';
// import { isArray } from '@lhb/func';
// import PoiTable from '@/common/components/business/SurroundDrawer/components/Category/components/PoiTable';
// import { useMethods } from '@lhb/hook';
interface SurroundingItemProps{
  [k:string]:any;
  categoryIds: number[];
  categoryId: number; // 类目id
  lat?: number;
  lng?: number;
  radius?: number; // 半径（米）
  poiSearchType?:1|2;// 1为圆形、2为多边形
  borders?:any// 围栏
  cityName?:string // 城市名称
  setCategoryCounts?: Function; // 各category的poi数统计回调
}

const SurroundingItem:React.FC<SurroundingItemProps> = (props) => {
  const {
    totalNum,
    // categoryIds,
    objectList,
    lat,
    lng,
    // radius = 500,
    poiSearchType = 1,
    borders,
    // cityName,
    // setCategoryCounts,
    name,
    targetChildClass,
    homeData,
    // moduleMapCount
  } = props;

  const poiMapRef = useRef<any>();
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  // const [activePoiTypeList, setActivePoiTypeList] = useState<any>([]); // 当前二级tab信息
  const dataSource = useMemo(() => {
    return objectList.map((item, index) => ({
      idx: index + 1,
      name: item.name,
      distance: `${item.distance}m`
    }));
  }, [objectList]);
  const defaultColumns = [
    {
      key: 'idx',
      title: '序号',
      render: (value) => `${value ? `${value}` : '-'}`,
    },
    {
      key: 'name',
      title: '名称',
      width: 324,
      render: (value) => value || '-',
    },
    {
      key: 'distance',
      title: '距离',
      render: (value) => value || '-',
    },
  ];
  return <PageLayout
    logo={homeData?.tenantLogo}
    title={`周边配套-${name}`}
    // moduleCount={Number(moduleMapCount?.surroundingFacilities)}
    // totalPage={32}
    // currentPage={Number('04')}
    childClass={targetChildClass}
  >
    <Row gutter={[16, 16]}>
      <Col span={24} style={{ height: 300 }}>
        <PoiMap
          ref={poiMapRef}
          poiTypeList={{
            list: objectList,
            icon: objectList[0]?.icon
          }}
          lat={lat}
          lng={lng}
          radius={500}
          amapIns={amapIns}
          setAmapIns={setAmapIns}
          poiSearchType={poiSearchType}
          borders={borders}
        />
      </Col>
      <Col span={24}>
        <div className={styles.desc}>{`周边500米有${totalNum}个${name}`}</div>
      </Col>
      <Col span={24}>
        <V2Table
          // filters={params}
          rowKey='idx' // 设置一个每一行数据唯一的键值
          defaultColumns={defaultColumns}
          hideColumnPlaceholder
          onFetch={() => ({
            dataSource
          })}
          pagination={false}
        />
      </Col>
    </Row>
  </PageLayout>;
};

export default SurroundingItem;
