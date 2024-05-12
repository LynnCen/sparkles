import { FC, useState } from 'react';
import styles from './entry.module.less';
import { Button } from 'antd';
import { useMethods } from '@lhb/hook';
import { flowAppList } from '@/common/api/flow';
import Tables from '@/common/components/FilterTable';
import SetManager from './components/SetManager';

const Manager: FC<any> = () => {
  const [searchParams, setSearchParams] = useState<any>({});
  const [managerModalData, setManagerModalData] = useState<any>({
    visible: false,
    managers: [],
    id: ''
  });
  const columns = [
    {
      title: '应用名',
      key: 'name'
    },
    {
      title: '售后运维人员',
      key: 'maintainers',
      width: 250,
      render: (maintainers: any) => {
        return maintainers.map((manager: any) => manager.name || manager.mobile).join('、');
      }
    },
    {
      key: 'id',
      title: '操作',
      width: 200,
      // fixed: 'right',
      render: (value, record) => (
        <Button type='link' onClick={() => handleEdit(record)}>
          修改
        </Button>
      ),
    },
  ];

  const { loadData, handleEdit } = useMethods({
    loadData: async () => {
      const res = await flowAppList();
      return {
        dataSource: res
      };
    },
    handleEdit: (record: any) => {
      const { maintainers, id } = record;
      setManagerModalData({
        visible: true,
        managers: maintainers,
        id
      });
    }
  });
  return (
    <div className={styles.container}>
      <Tables
        columns={columns}
        filters={searchParams}
        onFetch={loadData}
        pagination={false}
        className='mt-20'
        rowKey='id'
        bordered={true}/>
      <SetManager
        modalData={managerModalData}
        modalHandle={() => setManagerModalData({
          visible: false,
          managers: [],
          id: ''
        })}
        loadData={() => setSearchParams({})}/>
    </div>
  );
};

export default Manager;
