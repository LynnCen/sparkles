import { getModelReportPOI } from '@/common/api/recommend';
import Amap from '@/common/components/AMap';
import ShowMore from '@/common/components/FilterTable/ShowMore';
import { LoadingOutlined } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';
import { Select, Skeleton, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FC, useEffect, useRef, useState } from 'react';
import styles from '../entry.module.less';
import {
  itemDataType,
  reference,
  selectOptions,
} from '../ts-config';
import cs from 'classnames';

const itemColumns: ColumnsType<itemDataType> = [
  { title: '序号', width: 120, render: (_, record, index) => index + 1 },
  {
    title: '名称',
    width: 250,
    dataIndex: 'name',
    render: (text) => <ShowMore maxWidth='180px' text={text} />,
  },
  {
    title: '地址',
    dataIndex: 'address',
    render: (text) => <ShowMore maxWidth='240px' text={text} />,
  },
];

const Report: FC<any> = ({ checkVal, areaData, selectVal, setSelectVal, id }) => {
  const labelRef = useRef<any>(null);
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [poiTypeList, setPoiTypeLIst] = useState<any>([]);
  const [poiCount, setPoiCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    if (areaData.lat) methods.getPOIList();
    amapIns && amapIns.clearMap();
    setPoiTypeLIst([]);
    setPoiCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaData, checkVal, selectVal]);
  useEffect(() => {
    if (!amapIns) return;
    methods.drawArea(poiTypeList);
    const option = {
      map: amapIns,
      content: ' ',
      zIndex: 13,
      offset: [17, 30]
    };
    const textIns = new window.AMap.Marker(option);
    labelRef.current = textIns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poiTypeList, amapIns]);
  const methods = useMethods({
    getPOIList: async () => {
      try {
        if (!checkVal?.id) return;
        const res = await getModelReportPOI({
          categoryId: checkVal?.id,
          lng: areaData.lng,
          lat: areaData.lat,
          radius: selectVal,
          reportId: id
        });
        setLoading(false);
        setPoiTypeLIst(res);
        let count = 0;
        res.forEach((poi) => {
          count += poi.pointNum;
        });
        setPoiCount(count);
      } catch (error) {}
    },
    loadedMapHandle: (map) => {
      setAmapIns(map);
    },
    drawArea: (point) => {
      // 添加点位标记
      point.forEach((item) => {
        item.pointNum > 0 && methods.createPointMarker(item);
      });
      const circle = new window.AMap.Circle({
        center: [areaData.lng, areaData.lat],
        radius: selectVal, // 半径
        strokeColor: '#006AFF',
        strokeWeight: 2,
        strokeOpacity: 1,
        fillOpacity: 0.2,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        fillColor: '#006AFF',
        zIndex: 50,
      });
      circle.setMap(amapIns);
      // 缩放地图到合适的视野级别
      amapIns.setFitView([circle]);
    },
    createPointMarker: (val): any => {
      // 创建一个 Marker 实例：
      const data:any = [];
      val.pointList.map((item) => {
        data.push({
          ...item,
          lnglat: [+item.lng, +item.lat]
        });
      });
      const mass = new window.AMap.MassMarks(data, {
        style: {
          url: val.icon,
          size: [25, 28]
        }
      });

      mass.on('mouseover', function (e) {
        const { data } = e;
        labelRef.current.setPosition([data.lng, data.lat]);
        labelRef.current.setContent(
          `<div class='icon-label'><div class='trangle'></div><span class='text-name'>${data.name}</span><br/><span class='text-address'>${data.address}</span></div>`
        );
      });
      mass.on('mouseout', function () {
        labelRef.current.setContent(` `);
      });

      mass.setMap(amapIns);



      // const marker = new window.AMap.Marker({
      //   map: amapIns,
      //   icon: new window.AMap.Icon({
      //     image: icon,
      //     size: [25, 28],
      //     imageSize: [25, 28],
      //   }),
      //   anchor: 'bottom-center',
      //   position: new window.AMap.LngLat(point.lng, point.lat),
      // });
      // marker.on('mouseover', function () {
      //   labelRef.current.setPosition([point.lng, point.lat]);
      //   labelRef.current.setContent(
      //     `<div class='icon-label'><div class='trangle'></div><span class='text-name'>${point.name}</span><br/><span class='text-address'>${point.address}</span></div>`
      //   );
      // });
      // marker.on('mouseout', function () {
      //   labelRef.current.setContent(` `);
      // });
    },

  });

  return (
    <>
      <div className={styles.report}>
        <div className={styles.mapBox}>
          <span className={styles.radius}>
            可选址范围：{(3.14 * selectVal * selectVal).toFixed(2)}
            m²
          </span>
          <div className={cs(styles.radiusSelect, 'bg-fff c-132 pl-10')}>
            POI统计范围半径：
            <Select
              bordered={false}
              style={{ width: 100 }}
              value={selectVal}
              onChange={(val) => setSelectVal(val)}
              options={selectOptions}
              // placement='topLeft'
            />
          </div>
          {loading ? (
            <div className={styles.loading}>
              <LoadingOutlined style={{ fontSize: '36px' }} />
            </div>
          ) : (
            <Amap loaded={methods.loadedMapHandle} isMemoryClean={false}/>
          )}
          <div className={styles.iconList}>
            {
              poiTypeList.map((item, index) =>
                item.pointNum > 0
                  ? <div key={index} className={styles.icon}>
                    <span>
                      <img src={item.icon}/>
                      {item.attributeName}
                    </span>
                  </div> : null
              )
            }


          </div>
        </div>
        <div className={styles.rightTableCon}>
          <div className={styles.poiTitle}>
            <Skeleton loading={loading} active={true} paragraph={{ rows: 1 }}>
              <p className={styles.poiNum}>
                <span>POI点位</span>
                <span>{poiCount}</span>
                <span>个</span>
              </p>
              <p>(参考因素：{reference[checkVal?.value]})</p>
            </Skeleton>
          </div>

          {poiTypeList.length > 0
            ? <Tabs defaultActiveKey={`${+poiTypeList[0].code}`}>
              {
                poiTypeList.map((item) =>
                  item.pointNum > 0
                    ? <Tabs.TabPane tab={`${item.attributeName} ${item.pointNum}`} key={`${+item.code}`}>
                      <Table
                        pagination={false}
                        columns={itemColumns}
                        dataSource={item.pointList}
                        // scroll={{ y: 315 }}
                        scroll={{ y: 345 }}
                        rowKey={'categoryName'}
                      />
                    </Tabs.TabPane> : null
                )
              }
            </Tabs>
            : null}

        </div>
      </div>
    </>
  );
};

export default Report;
