/**
 * @Description 拓店任务类型变更记录
 */

import { FC } from 'react';
import { Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Table from '@/common/components/Data/V2Table';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { taskTypeChangeRecords } from '@/common/api/expandStore/expansiontask';

interface Props {
  taskId: number,
  open: boolean, // 打开弹窗
  setOpen: Function // 控制是否打开弹窗
}

const TypeRecordsModal : FC<Props> = ({
  taskId,
  open,
  setOpen,
}) => {
  const methods = useMethods({
    /**
     * @description 点击-取消
     */
    onCancel() {
      setOpen(false); // 关闭弹窗
    },

    /**
     * @description 加载表格数据
     * @returns 表格数据
     */
    async loadData(params: any) {
      const { objectList, totalNum } = await taskTypeChangeRecords({ ...params, taskId });
      return {
        dataSource: isArray(objectList) ? objectList : [],
        count: totalNum || 0,
      };
    }
  });

  const defaultColumns = [{
    key: 'changeTime',
    title: '变更时间',
    width: 150,
    render: (value) => isNotEmptyAny(value) ? value : '-',
  }, {
    key: 'oldTypeName',
    title: '原任务类型',
    width: 150,
  }, {
    key: 'newTypeName',
    title: '现任务类型',
    width: 150,
  }, {
    key: 'changeName',
    title: '变更人',
    width: 150,
  }];

  return (<>
    <Modal
      title='任务类型变更记录'
      open={open}
      width={680}
      onCancel={methods.onCancel}
      destroyOnClose
      footer={null}
    >
      <V2Table
        rowKey='id'
        defaultColumns={defaultColumns}
        onFetch={methods.loadData}
        // pagination={false}
        hideColumnPlaceholder={true}
        scroll={{ x: 'max-content', y: 400 }}
      />
    </Modal>
  </>);
};
export default TypeRecordsModal;
