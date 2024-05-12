/**
 * @Description Table列表
 */

import { FC } from 'react';
import { useMethods } from '@lhb/hook';
import { approvalFlowTemplate } from '@/common/api/approvalflow';
import { refactorPermissions } from '@lhb/func';
import { useNavigate } from 'react-router-dom';
// import cs from 'classnames';
// import styles from '../entry.module.less';
import V2Table from '@/common/components/Data/V2Table';
import V2Operate from '@/common/components/Others/V2Operate';

const Table: FC<any> = ({
  mainHeight
}) => {
  const navigate = useNavigate();
  const defaultColumns = [
    { key: 'id', title: 'ID', width: 100, dragChecked: true },
    { key: 'name', title: '名称', width: 200, dragChecked: true },
    { key: 'code', title: '编码', width: 200, dragChecked: true },
    // { key: 'formUri', title: '关联的表单地址', width: 100, dragChecked: true },
    { key: 'permission', title: '操作', dragChecked: true, dragDisabled: false, render: (_:any, record:any) => <V2Operate
      operateList={refactorPermissions([
        {
          name: '编辑', // 必填
          event: 'edit', // 必填
          func: 'handleEdit',
        },
      ])}
      onClick={(btns: { func: string }) => methods[btns.func](record)}/> },
  ];

  const methods = useMethods({
    loadData: async (params) => {
      const result: any = await approvalFlowTemplate({
        ...params
      });
      return {
        dataSource: result?.objectList || [],
        count: result.totalNum || 0,
      };
    },
    handleEdit: (record: any) => { // 编辑
      const { id } = record;
      navigate(`/system/approvalflowedit?id=${id}`);
    }
  });

  return (
    <V2Table
      rowKey='id'
      defaultColumns={defaultColumns}
      hideColumnPlaceholder
      scroll={{ y: mainHeight - 48 - 32 - 40 }}
      onFetch={methods.loadData}
    />
  );
};

export default Table;
