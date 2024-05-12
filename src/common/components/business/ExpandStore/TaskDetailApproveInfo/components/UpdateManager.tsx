/**
 * @Description 更换责任人modal
 */
import React, { FC, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2Table from '@/common/components/Data/V2Table';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { getEmployeeList } from '@/common/api/common';
interface Props {
  companyId?: number | null; // 分公司id
  open: boolean; // 打开弹窗
  setOpen: Function; // 控制是否打开弹窗
  selManager: any; // 当前选中的责任人
  onConfirm: Function; // 确定选择
}

const UpdateManager : FC<Props> = ({
  companyId,
  open,
  setOpen,
  selManager,
  onConfirm,
}) => {

  const [form] = Form.useForm(); // 表单参数
  const [filters, setFilters] = useState<any>(); // 筛选参数
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // 选择的员工ids
  const [selectedRows, setSelectedRows] = useState<any[]>([]); // 选择的员工

  useEffect(() => {
    if (open && isNotEmptyAny(selManager)) {
      setSelectedRowKeys([selManager.id]);
      setSelectedRows([selManager]);
    }
  }, [open]);

  const methods = useMethods({
    /**
     * @description 点击-取消，或者确认后关闭当前弹框
     */
    onClose() {
      setSelectedRowKeys([]); // 清空选择
      setSelectedRows([]);
      setOpen(false); // 关闭弹窗
      setFilters({});
      form.resetFields(); // 重置表单
    },

    /**
     * @description 点击确认
     */
    onOk() {
      if (!selectedRowKeys.length) {
        V2Message.warning('请选择责任人');
        return;
      }
      onConfirm && onConfirm(selectedRows.length ? selectedRows[0] : null);
      this.onClose();
    },

    /**
     * @description 搜索
     * @param params 搜索关键词
     */
    onSearch(params) {
      const _params = form.getFieldsValue();
      setFilters({
        ..._params,
        ...params
      });
    },

    /**
     * @description 加载表格数据，接口能够按keyword过滤返回
     * @param params 搜索参数
     * @return 表格数据
     */
    async loadData(params) {
      const { objectList, totalNum } = await getEmployeeList({
        ...params,
        companyId,
      });
      return {
        dataSource: isArray(objectList) ? objectList : [],
        count: totalNum || 0,
      };
    }
  });

  const defaultColumns = [{
    key: 'name',
    title: '员工名称',
    width: '150px',
    dragChecked: true,
    dragDisabled: true
  }, {
    key: 'position',
    title: '员工岗位',
    width: '150px',
    dragChecked: true,
    dragDisabled: true
  }, {
    key: 'mobile',
    title: '员工手机号',
    width: '150px',
    dragChecked: true,
    dragDisabled: true
  }
  ];

  /** V2Table中多选配置项*/
  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    preserveSelectedRowKeys: true, // 保留上一次选择参数，不设置会丢失之前的多选参数
    onChange: (newSelectedRowKeys: React.Key[], selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  return (
    <>
      <Modal
        title='更换责任人'
        open={open}
        width={680}
        onOk={methods.onOk}
        onCancel={methods.onClose}
        destroyOnClose
      >
        <SearchForm
          onOkText='搜索'
          form={form}
          labelLength={5}
          showResetBtn
          onSearch={methods.onSearch}
        >
          <V2FormInput label='' name='keyword' placeholder='请输入员工姓名/手机号'/>
        </SearchForm>

        <V2Table
          rowKey='id'
          defaultColumns={defaultColumns}
          onFetch={methods.loadData}
          pagination={false}
          hideColumnPlaceholder={true}
          filters={filters}
          rowSelection={rowSelection}
          scroll={{ x: 'max-content', y: 368 }}
        />

      </Modal>
    </>
  );
};
export default UpdateManager;
