import React, { useState } from 'react';
import {
  Drawer,
  Space
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  DrawerTableProps,
  inDrawerDictionaryFormData,
  InDrawerDictionaryFormDataType,
  InDrawerManageModal
} from '../../../ts-config';
import { FormattingPermission } from '@/common/components/Operate/ts-config';
import { useMethods } from '@lhb/hook';
import styles from '../../../entry.module.less';
import TableList from './TableList';
import ModalForm from './ModalForm';
import Operate from '@/common/components/Operate';
import { refactorPermissions } from '@lhb/func';

const DrawerTable: React.FC<DrawerTableProps> = ({
  visible,
  drawerClose,
  loadData,
  tablePermissions
}) => {
  const [dictionaryModalData, setDictionaryModalData] = useState<InDrawerManageModal>({
    visible: false,
    formData: inDrawerDictionaryFormData
  });

  const { showModalHandle, editHandle, operateBtns, ...methods } = useMethods({
    // 新建字典分类管理
    handleCreate: () => {
      // 重置formData
      setDictionaryModalData({ visible: true, formData: inDrawerDictionaryFormData });
    },
    showModalHandle: (val: boolean) => {
      setDictionaryModalData((state) => ({ ...state, visible: val }));
    },
    editHandle: (id: number) => {
      setDictionaryModalData(({ formData }: { formData: InDrawerDictionaryFormDataType }) => ({ formData: {
        ...formData,
        id
      }, visible: true }));
    },
    operateBtns: () => {
      return refactorPermissions(tablePermissions).map((permission: FormattingPermission) => ({
        ...permission,
        type: 'primary'
      }));
    }
  });

  return (
    <Drawer
      title='字典分类管理'
      placement='right'
      open={visible}
      bodyStyle={{ padding: 0 }}
      width='600'
      closable={false}
      onClose={() => drawerClose(false)}
      extra={
        <Space>
          <CloseOutlined onClick={() => drawerClose(false)}/>
        </Space>
      }
      className={styles.drawerBodyHead}>
      <div className={styles.bodyHead}>
        <Operate
          operateList={operateBtns()}
          onClick={(btn: FormattingPermission) => methods[btn.func]()} />
      </div>
      <TableList edit={editHandle} loadData={loadData}/>
      <ModalForm
        modalData={dictionaryModalData}
        modalHandle={showModalHandle}
        loadData={loadData}/>
    </Drawer>
  );
};

export default DrawerTable;
