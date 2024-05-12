import React, { useState, useEffect, useRef } from 'react';
import { delDictionaryData } from '../../../api';
import {
  DictionaryDataTableProps,
  DictionaryDataListItem,
  DictionaryModalData
} from '../../../ts-config';
import { Permission, FormattingPermission } from '@/common/components/Operate/ts-config';
import { useMethods } from '@lhb/hook';
import styles from '../../../entry.module.less';
import Operate from '@/common/components/Operate';
import ModalForm from './ModalForm';
import Table from '@/common/components/FilterTable';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { refactorPermissions } from '@lhb/func';

const TableList: React.FC<DictionaryDataTableProps> = ({
  listData,
  dictionaryId,
  mainBtnPermissions,
  loadData
}) => {
  const [mainModalData, setMainModalData] = useState<DictionaryModalData>({
    visible: false,
    id: 0, // 编辑id
    dictionaryId
  });
  const btnDisabled = !dictionaryId;
  const tableRef = useRef();

  useEffect(() => {
    (tableRef as any).current.onload();
  }, [listData]);

  const columns = [
    {
      title: '序号',
      key: 'id',
      render: (text: string, record: DictionaryDataListItem, index: number) => (index + 1),
    },
    {
      title: '名称',
      key: 'name',
    },
    {
      title: '编码',
      key: 'encode',
    },
    {
      title: '排序',
      key: 'sortNum',
    },
    {
      title: '配置值',
      key: 'value',
    },
    {
      title: '操作',
      key: 'permissions',

      render: (val: Permission[], record: DictionaryDataListItem) => {
        const permissions = val?.map((item) => {
          const eventArr = item.event.split('_');
          return { ...item, event: eventArr[eventArr.length - 1] };
        });
        return (
          <Operate
            operateList={refactorPermissions(permissions)}
            onClick={(btn: any) => methods[btn.func](record.id)} />
        );
      },
    },
  ];

  const { operateBtns, showModalHandle, fetchData, ...methods } = useMethods({
    handleCreate: () => {
      setMainModalData({
        visible: true,
        id: 0,
        dictionaryId
      });
    },
    handleUpdate: (id: number) => {
      setMainModalData({
        dictionaryId,
        id,
        visible: true
      });
    },
    handleDelete: (id: number) => {
      V2Confirm({
        content: '此操作将永久删除该数据, 是否继续？',
        onSure(modal: any) {
          delDictionaryData({ id }).then(() => {
            modal.destroy();
            loadData();
          });
        }
      });
    },
    showModalHandle: (val: boolean) => {
      setMainModalData((state) => ({ ...state, visible: val, dictionaryId }));
    },
    operateBtns: () => {
      const permissions = mainBtnPermissions?.map((item) => {
        const eventArr = item.event.split('_');
        return { ...item, event: eventArr[eventArr.length - 1] };
      });
      return refactorPermissions(permissions).map((permission: FormattingPermission) => ({
        ...permission,
        disabled: btnDisabled,
        type: 'primary'
      }));
    },
    fetchData: () => {
      return new Promise((resolve) => {
        resolve({
          dataSource: listData
        });
      });
    }
  });

  return (
    <>
      <div className={styles.tableCon}>
        <div className='pl-12 pt-12'>
          <Operate
            operateList={operateBtns()}
            onClick={(btn: FormattingPermission) => methods[btn.func]()} />
        </div>

        <Table
          columns={columns}
          onFetch={fetchData}
          bordered
          pagination={false}
          size='small'
          className='mt-20'
          rowKey='id'
          ref={tableRef}/>
      </div>
      <ModalForm
        modalData={mainModalData}
        modalHandle={showModalHandle}
        loadData={loadData}/>
    </>
  );
};

export default TableList;
