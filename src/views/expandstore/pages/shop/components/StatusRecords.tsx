/**
 * @Description 门店状态记录
 */

import { FC } from 'react';
import { Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Table from '@/common/components/Data/V2Table';
import { shopStatusRecords } from '@/common/api/expandStore/shop';
import { isArray } from '@lhb/func';

interface Props {
  id: number // 门店id
  open: boolean, // 打开弹窗
  setOpen: Function // 控制是否打开弹窗
}

const StatusRecords : FC<Props> = ({
  id,
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
    async loadData() {
      const data = await shopStatusRecords({ id });
      return {
        dataSource: isArray(data) ? data : [],
        count: isArray(data) ? data.length : 0,
      };
    }
  });

  const defaultColumns = [{
    key: 'oldStatusName',
    title: '原状态',
    width: 120,
  }, {
    key: 'newStatusName',
    title: '变更状态',
    width: 120,
  }, {
    key: 'userName',
    title: '操作人',
    width: 120,
  }, {
    key: 'changeTypeName',
    title: '变更方式',
    width: 120,
  }, {
    key: 'date',
    title: '变更日期',
    width: 120,
  }];

  return (<>
    <Modal
      title='历史状态'
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
        pagination={false}
        hideColumnPlaceholder={true}
        scroll={{ x: 'max-content', y: 400 }}
      />
    </Modal>
  </>);
};
export default StatusRecords;
