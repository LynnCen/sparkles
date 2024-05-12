import { FC, useState } from 'react';
import styles from './entry.module.less';
import { Button } from 'antd';
import TableList from './components/TableList';
import EditModal from './components/EditModal';
import { useMethods } from '@lhb/hook';
const SystemStore: FC<any> = () => {
  const [operateId, setOperateId] = useState<number|string|null>();
  const [params, setParams] = useState({});
  const [editData, setEditData] = useState<any>({
    visible: false,
    data: {}
  });

  const methods = useMethods({
    onSearch() {
      setParams({});
    },
    showEdit(visible = false, data: any = {}) {
      setEditData({
        ...editData,
        visible,
        data
      });
    },
    addHandle() {
      setOperateId(null);
      methods.showEdit(true);
    }
  });
  return (
    <div className={styles.container}>
      <div className={styles.title}>基本信息</div>
      <Button type='primary' size='large' onClick={methods.addHandle}>新增模型</Button>
      <EditModal
        id={operateId}
        editData={editData}
        showEdit={methods.showEdit}
        onSuccess={() => {
          methods.onSearch();
        }}/>
      <TableList add = {methods.addHandle} onSuccess={() => { methods.onSearch(); }} params={params} setOperateId={setOperateId} showEdit={methods.showEdit}></TableList>
    </div>
  );
};

export default SystemStore;
