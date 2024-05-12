import { useState } from 'react';
import styles from './entry.module.less';
import { ObjectProps, ListResult, AddEmployeeRecordProps } from './ts-config';
import Filter from './components/Filter';
import List from './components/List';
import AddEmployeeModal from './components/Modal/AddEmployeeModal';
import { employeesList } from '@/common/api/employee';
import { useMethods } from '@lhb/hook';

const Manage = () => {
  const [params, setParams] = useState<ObjectProps>({});
  // 新增员工
  const [toAdd, setToAdd] = useState<AddEmployeeRecordProps>({
    name: '',
    mobile: '',
    visible: false
  });

  const onSearch = (values: any) => {
    setParams({
      ...params,
      ...values
    });
  };

  const loadData = async (params: any) => {
    const { meta, data }: ListResult = await employeesList(params);
    return {
      dataSource: data || [],
      count: meta?.total
    };
  };

  const { addEmployee } = useMethods({
    addEmployee: () => {
      setToAdd({
        ...toAdd,
        visible: true
      });
    }
  });

  return (
    <div className={styles.container}>
      <Filter onSearch={onSearch}/>
      <List
        params={params}
        loadData={loadData}
        addEmployee={addEmployee}
        onRefresh={onSearch}
      />
      <AddEmployeeModal record={toAdd} onClose={setToAdd} onOk={onSearch}/>
    </div>
  );
};

export default Manage;
