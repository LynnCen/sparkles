import React, { useState, useRef } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import TableList from './components/TableList';
import Search from './components/Search';
import PlaceMngDrawer from '../placeMngDetail/Drawer';
import RecordDrawer from './components/Drawer';
import QrcodeModal from './components/QrcodeModal';
import { useMethods } from '@lhb/hook';
import { getPlaceList } from '@/common/api/locxx';
import { deepCopy } from '@lhb/func';



const ResourceManagement:React.FC = () => {
  const [mainHeight, setMainHeight] = useState(0);
  const [filters, setFilters] = useState([]);
  const [refreshCurrent, setRefreshCurrent] = useState<boolean>(false);// 是否需要当前页刷新
  const [visible, setVisible] = useState(false);
  const [qrcodeId, setQrcodeId] = useState<number>(); // 二维码id

  const placeMngDrawerRef: any = useRef();
  const RecordDrawerRef: any = useRef();

  const methods = useMethods({
    onSearch: (val:any) => {
      setFilters(val);
      setRefreshCurrent(false);
    },
    /**
     * @description 当前页重新加载
     */
    currentReload() {
      setRefreshCurrent(true);
      setFilters({ ...filters });
    },
    /**
         * @description 从1页重新加载
         */
    reload() {
      setRefreshCurrent(false);
      setFilters({ ...filters });
    },
    loadData: async (params: any) => {
      const _params = deepCopy(params);
      const cityIds: any = [];
      const commercialIds:any = [];
      if (_params.cityIds) {
        _params.cityIds.map(item => {
          cityIds.push(item[1]);
        });
      }
      if (_params.commercialIds) {
        _params.commercialIds.map(item => {
          commercialIds.push(item[1]);
        });
      }
      _params.cityIds = cityIds;
      _params.commercialIds = commercialIds;
      const { objectList, totalNum } = await getPlaceList(_params);
      return {
        dataSource: objectList,
        count: totalNum
      };
    },
    // 前往详情
    gotoDetail(id: number) {
      placeMngDrawerRef.current?.init(id);
    },
    // 前往记录详情
    gotoRecordDrawer(obj) {
      RecordDrawerRef.current?.init(obj);
    },
    // 打开二维码
    openCode(id:number) {
      setQrcodeId(id);
      setVisible(true);
    }

  });

  // 取消
  const hideModal = () => {
    setVisible(false);
  };

  return (
    <V2Container
      className={styles.container}
      emitMainHeight={(h) => setMainHeight(h)}
      style={{ height: 'calc(100vh - 88px)' }}
      extraContent={{
        top: <>
          <Search onSearch={methods.onSearch}/>
        </>
      }}>
      <TableList
        filters={filters}
        mainHeight={mainHeight}
        onFetch={methods.loadData}
        reload={methods.reload}
        currentReload={methods.currentReload}
        refreshCurrent={refreshCurrent}
        gotoDetail={methods.gotoDetail}
        gotoRecordDrawer={methods.gotoRecordDrawer}
        openCode={methods.openCode}
      />
      {/* 详情抽屉 */}
      <PlaceMngDrawer ref={placeMngDrawerRef} onRefresh={methods.currentReload}/>
      {/* 跟进记录抽屉 */}
      <RecordDrawer ref={RecordDrawerRef} gotoDetail={methods.gotoDetail}/>
      {/* 二维码弹出框 */}
      <QrcodeModal
        visible={visible}
        hideModal={hideModal}
        maskClosable={true}
        footer={false}
        id={qrcodeId}
      />
    </V2Container>
  );
};


export default ResourceManagement;

