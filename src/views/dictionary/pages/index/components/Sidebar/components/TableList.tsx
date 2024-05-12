import React, { useContext, useEffect, useRef } from 'react';
import { useMethods } from '@lhb/hook';
import { DictionaryListItem } from '../../../ts-config';
import { Permission, FormattingPermission } from '@/common/components/Operate/ts-config';
import { delDictionaryType } from '../../../api';
import DictionaryDataContext from '../../../context';
import Operate from '@/common/components/Operate';
import Table from '@/common/components/FilterTable';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { refactorPermissions } from '@lhb/func';

const TableList: React.FC<{
  edit: (id: number) => void;
  loadData: () => void
}> = ({ edit, loadData }) => {
  const dictionaryData: Array<DictionaryListItem> = useContext(DictionaryDataContext);
  const tableRef = useRef();
  const columns = [
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
      title: '操作',
      key: 'permissions',
      width: 160,
      render: (val: Permission[], record: DictionaryListItem) => (
        <Operate
          operateList={refactorPermissions(val)}
          onClick={(btn: FormattingPermission) => methods[btn.func](record.id)} />
      ),
    }
  ];

  // methods
  const { fetchData, ...methods } = useMethods({
    handleUpdate: (id: number) => {
      id && edit(id);
    },
    handleDelete: (id: number) => {
      V2Confirm({
        title: '提示',
        content: '此操作将永久删除该数据, 是否继续？',
        onSure(modal: any) {
          delDictionaryType({ id }).then(() => {
            modal.destroy();
            loadData();
          });
        }
      });
    },
    fetchData: () => {
      return new Promise((resolve) => {
        resolve({
          dataSource: dictionaryData
        });
      });
    }
  });

  useEffect(() => {
    // 更新table
    (tableRef as any).current.onload();
  }, [dictionaryData]);

  return (
    <Table
      ref={tableRef}
      columns={columns}
      onFetch={fetchData}
      bordered
      pagination={false}
      size='small'
      className='mt-20'
      rowKey='id'>
    </Table>
  );
};

export default TableList;
