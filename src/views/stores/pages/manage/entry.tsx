import { useState } from 'react';
import { getStoreList } from '@/common/api/store';
import Filter from './component/Filter';
import List from './component/List';
import styles from './entry.module.less';
import { ObjectProps, ListResult, ListRecordProps, SetManagerModalProps } from './ts-config';
import SetManagerModal from './component/SetManagerModal';
import dayjs from 'dayjs';
import SetMaintainer from './component/SetMaintainer';
import { useMethods } from '@lhb/hook';
import V2Container from '@/common/components/Data/V2Container';

const StoreManage = () => {
  const [params, setParams] = useState<ObjectProps>({
    keyword: '',
    status: '',
    start: '',
    end: '',
    // businessDate: '',
    deviceStatus: ''
  });

  // 设置管理员的门店
  const [currentRecord, setCurrentRecord] = useState<SetManagerModalProps>({
    store_id: 0,
    account_ids: [],
    visible: false,
  });
  // 设置对接人
  const [managerModalData, setManagerModalData] = useState<any>({
    visible: false,
    managers: [],
    id: ''
  });

  const { loadData, onSearch, setManager } = useMethods({
    loadData: async (params: any) => {
      const { objectList, totalNum }: ListResult = await getStoreList(params);
      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },

    onSearch: (values: any) => {
      const { keyword, status, businessDate, deviceStatus } = values;
      const params: any = {
        keyword,
        status,
        start: '',
        end: '',
        deviceStatus
      };
      if (businessDate) {
        params.start = dayjs(businessDate[0]).format('YYYY-MM-DD');
        params.end = dayjs(businessDate[1]).format('YYYY-MM-DD');
      }
      setParams(params);
    },

    setManager: (record: ListRecordProps) => {
      const account_ids = record.managers && Array.isArray(record.managers) ? record.managers.map((itm) => itm.id) : [];
      setCurrentRecord({
        store_id: record.id,
        account_ids,
        visible: true,
      });
    },
  });

  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 120px)' }}
        extraContent={{
          top: <Filter onSearch={onSearch} />
        }}
      >
        <List
          params={params}
          loadData={loadData}
          setManager={setManager}
          setCounterpart={setManagerModalData}/>
      </V2Container>
      <SetManagerModal
        record={currentRecord}
        onClose={setCurrentRecord}
        onOk={() => setParams({})}/>
      <SetMaintainer
        modalData={managerModalData}
        modalHandle={() => setManagerModalData({
          visible: false,
          managers: [],
          id: ''
        })}
        loadData={() => setParams({})}/>
    </div>
  );
};

export default StoreManage;
