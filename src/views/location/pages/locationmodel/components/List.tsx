/**
 * @Description 列表
 */

import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import V2Operate from '@/common/components/Others/V2Operate';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';
import { deleteSiteModel, getSiteModelPage } from '@/common/api/location';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const operateList: any = [
  { event: 'update', name: '编辑', },
  { event: 'delete', name: '删除', }
];

const List: FC<any> = ({
  mainHeight,
  filters = {},
  setModalData,
  onSearch,
}) => {
  const methods = useMethods({
    handleDelete(record) {
      ConfirmModal({
        onSure: (modal) => {
          deleteSiteModel({ id: record.id }).then((res) => {
            if (res) {
              V2Message.success('删除成功');
              modal.destroy();
              onSearch();
            }
          });
        }
      });
    },
    handleUpdate(record) {
      setModalData({ visible: true, ...record });
    },
    async fetchData(params) {
      const { totalNum, objectList } = await getSiteModelPage(params);
      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    }
  });

  const columns = [
    { title: '模型名称', key: 'name', dragChecked: true },
    { title: '模型编号', key: 'code', dragChecked: true },
    { title: '创建时间', key: 'createdAt', dragChecked: true },
    {
      title: '操作',
      key: 'permissions',
      dragChecked: true,
      render: (_: any, record) => (
        <V2Operate
          operateList={refactorPermissions(operateList)}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      )
    },
  ];
  return (
    <V2Table
      rowKey='id'
      filters={filters}
      defaultColumns={columns}
      onFetch={methods.fetchData}
      hideColumnPlaceholder
      scroll={{ x: 'max-content', y: mainHeight - 80 - 42 }}
    />
  );
};

export default List;
