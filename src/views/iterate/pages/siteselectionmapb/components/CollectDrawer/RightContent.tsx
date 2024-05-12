/**
 * @Description 收藏列表右侧内容
 */
import V2Table from '@/common/components/Data/V2Table';
import styles from './index.module.less';
import V2Tabs from '@/common/components/Data/V2Tabs';
import { Button, Tag, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import SpotListModal from './SpotListModal';
import { post } from '@/common/request';
import { useMethods } from '@lhb/hook';
import AreaDetailDrawer from '../../../siteselectionmap/components/AreaDetailDrawer';
import PointDetailDrawer from '../RightCon/PointDetailDrawer';
import { isResetContext } from '../../ts-config';

const RightContent = ({ leftKey, folderNum, setRefresh }) => {
  const { setCollectList }: any = useContext(isResetContext);

  const [filters, setFilters] = useState<any>({});
  const [activeKey, setActiveKey] = useState('1');
  const [items, setItems] = useState<any>([]);
  const [modalData, setModalData] = useState<any>({
    visible: false,
    // size: 20,
    modelClusterId: '',
  });
  const [businessCircleData, setBusinessCircleData] = useState({
    id: '',
    open: false,
  });
  const [pointDrawerData, setPointDrawerData] = useState<any>({
    open: false,
    businessId: null,
    pointId: null
  });// 点位详情抽屉
  const [businessColumns, setBusinessColumns] = useState<any>([]);
  const defaultColumns: any = [
    { key: 'name', title: '商圈名称', width: 220, whiteTooltip: true, render(val, record) {
      return <span className={styles.businessName} onClick={() => setBusinessCircleData({ id: record.id, open: true })}>{ val }</span>;
    } },
    { key: 'cityName', title: '城市', width: 'auto' },
    { key: 'districtName', title: '城区', width: 120 },
    { key: 'passFlow', title: '客流量', width: 120, render(val) {
      return <span>{ val || '-' }</span>;
    } },
    {
      title: '操作',
      key: 'operate',
      width: 100,
      render: (_, record) => (
        <Button type='link' style={{ paddingLeft: 0 }} onClick={() => methods.cancelCollect(record.id, null)}>取消收藏</Button>
      ),
      whiteTooltip: true,
      dragChecked: true
    }
  ];

  useEffect(() => {
    setItems([
      { label: `商圈 ${folderNum.clusterNum}`, value: 'businessCircle', key: '1' },
      folderNum.siteLocationFlag && { label: `场地点位 ${folderNum.siteLocationNum}`, value: 'place', key: '2' }
    ]);
    if (!folderNum.siteLocationFlag) {
      setBusinessColumns(defaultColumns);
    } else {
      defaultColumns.splice(4, 0, { key: 'siteLocationNum', title: '场地点位', width: 100, render(val, record) {
        return val ? <span className={styles.collectSpot} onClick={() => {
          setModalData({ ...modalData, visible: true, modelClusterId: record.id, size: record.siteLocationNum });
        }}>{ val }</span> : <span>0</span>;
      } });
      setBusinessColumns(defaultColumns);
    }
  }, [folderNum]);

  useEffect(() => {
    if (leftKey) {
      setFilters({ ...filters, favourFolderId: leftKey });
    }
  }, [leftKey]);

  useEffect(() => {
    const { open } = businessCircleData;
    if (!open) { // 关闭时,更新列表
      setFilters((state) => ({ ...state }));
      setRefresh(true);
    }
  }, [businessCircleData]);

  useEffect(() => {
    const { open } = pointDrawerData;
    if (!open) { // 关闭时,更新列表
      setFilters((state) => ({ ...state }));
      setRefresh(true);
    }
  }, [pointDrawerData]);

  const placeDefaultColumns = [
    { key: 'spotName', title: '点位名称', width: 220, whiteTooltip: true, render(val, record) {
      if (record.offShelf) {
        return (
          <div
            className={styles.offlineBusiness}>
            <Typography.Text className={styles.offlineBusinessName} ellipsis={{ tooltip: val }}>{ val }</Typography.Text>
            <Tag className={styles.offlineTag}>已下架</Tag>
          </div>
        );
      }
      return <span className={styles.businessName} onClick={() => setPointDrawerData({ ...pointDrawerData, open: true, businessId: record.clusterId, pointId: record.id })}>{ val }</span>;
    } },
    { key: 'locationType', title: '位置类型', width: 110, render(val) {
      return <span>{ val || '-' }</span>;
    } },
    { key: 'floor', title: '所在楼层', width: 110, render(val) {
      return <span>{ val || '-' }</span>;
    } },
    { key: 'area', title: '展位面积', width: 110, render(val) {
      return <span>{ val || '-' }</span>;
    } },
    { key: 'openTime', title: '经营时间', width: 180, render(val) {
      return <span>{ val || '-' }</span>;
    } },
    {
      title: '操作',
      key: 'operate',
      width: 100,
      render: (_, record) => (
        <Button type='link' style={{ paddingLeft: 0 }} onClick={() => methods.cancelCollect(null, record.id)}>取消收藏</Button>
      ),
      whiteTooltip: true,
      dragChecked: true
    }
  ];

  const methods = useMethods({
    cancelCollect: (clusterId, locationId) => {
      // https://yapi.lanhanba.com/project/546/interface/api/70188
      post('/clusterLocationFavor/build', { clusterId, locationId, build: false, favourFolders: [leftKey] }).then(() => {
        V2Message.success('取消收藏成功');
        setFilters({ ...filters });
        // setIsReset((state) => state + 1);
        if (clusterId) {
          setCollectList((state) => state?.filter((item) => item !== clusterId));
        }
        setRefresh(true);
      });
    },
  });


  // filter变化的时候执行请求接口的操作
  const loadData = async (params) => {
    const url = activeKey === '1' ? '/clusterLocationFavor/clusterPage' : '/clusterLocationFavor/locationPage';
    const data = await post(url, params);
    return {
      dataSource: data.objectList || [],
      count: data.totalNum || 0,
    };
  };

  return (
    <div className={styles.right}>
      <V2Tabs className={styles.collectTabs} items={items} activeKey={activeKey} onChange={setActiveKey} />
      { activeKey === '1' && !!businessColumns?.length && (
        <V2Table
          className={styles.collectTable}
          rowKey='id'
          hideColumnPlaceholder
          filters={filters}
          defaultColumns={businessColumns}
          onFetch={loadData}
          scroll={{ x: 'max-content', y: window.innerHeight - 218 }} // calc(100vh - 218px) tabs:52 + title:60 + 分页:64 + table头部:42
        />
      )}
      { activeKey === '2' && (
        <V2Table
          className={styles.collectTable}
          rowKey='id'
          hideColumnPlaceholder
          filters={filters}
          defaultColumns={placeDefaultColumns}
          onFetch={loadData}
          scroll={{ x: 'max-content', y: window.innerHeight - 218 }} // tabs:52 + title:60 + 分页:64 + table头部:42
        />
      )}
      <SpotListModal modalData={modalData} setModalData={setModalData} setPointDrawerData={setPointDrawerData} />
      {/* 商圈详情抽屉 */}
      <AreaDetailDrawer
        drawerData={businessCircleData}
        setDrawerData={setBusinessCircleData}
        pointDrawerData={pointDrawerData}
        setPointDrawerData={setPointDrawerData}
        viewChanceDetail={false}
      />
      {/* 点位详情抽屉 */}
      <PointDetailDrawer
        pointDrawerData={pointDrawerData}
        setPointDrawerData={setPointDrawerData}
        setDrawerData={setBusinessCircleData}
        drawerData={businessCircleData}
      />
    </div>
  );
};

export default RightContent;
