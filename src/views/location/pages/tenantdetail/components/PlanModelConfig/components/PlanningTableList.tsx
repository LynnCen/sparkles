/**
 * @Description 规划模型列表
 */
import { FC } from 'react';
import cs from 'classnames';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import Operate from '@/common/components/Operate';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import V2Table from '@/common/components/Data/V2Table';
import { message } from 'antd';
import { refactorPermissions } from '@lhb/func';
const PlanningTableList: FC<any> = ({
  params = {},
  setPlanningModelData,
  onSearch,
  mainHeight,
  tenantId
}) => {
  /* methods */
  const methods = useMethods({
    async fetchData(params) {
      // https://yapi.lanhanba.com/project/289/interface/api/59702
      const { objectList = [], totalNum = 0 } = await post(
        '/tenant/data/planModel/list',
        { tenantId, ...params },
        { proxyApi: '/blaster' }
      );
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
    handleDelete(record) {
      ConfirmModal({
        onSure: (modal) => {
          post('/tenant/data/planModel/delete', { id: record.id }, { proxyApi: '/blaster' }).then(() => {
            message.success('删除成功');
            modal.destroy();
            onSearch();
          });
        },
      });
    },
    handleUpdate(record) {
      setPlanningModelData({ visible: true, ...record });
    },
  });
  const columns = [
    { title: '模型名称', key: 'modelName' },
    { title: '模型编号', key: 'modelCode' },
    { title: '创建时间', key: 'createTime' },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      width: 200,
      render: (value: any, record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: any) => {
            methods[btn.func](record);
          }}
        />
      ),
    },
  ];
  return (
    <>
      <V2Table
        defaultColumns={columns}
        onFetch={methods.fetchData}
        className={cs('mt-20')}
        scroll={{ y: mainHeight - 64 - 84 - 22 }}
        filters={params}
        rowKey='createTime'
      />
    </>
  );
};
export default PlanningTableList;
