/**
 * @Description 选择分公司modal
 */
import React, { FC, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import { isArray, isNotEmptyAny } from '@lhb/func';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2Table from '@/common/components/Data/V2Table';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { getCompanyList } from '@/common/api/common';

interface Props {
  open:boolean; // 打开弹窗
  setOpen: Function; // 控制是否打开弹窗
  selOffice: any; // 当前选中的分公司
  onConfirm: Function; // 确定选择
}

const UpdateOffice : FC<Props> = ({
  open,
  setOpen,
  selOffice,
  onConfirm,
}) => {

  const [form] = Form.useForm(); // 表单参数
  const [filters, setFilters] = useState<any>(); // 筛选参数
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // 选择的分公司ids
  const [selectedRows, setSelectedRows] = useState<any[]>([]); // 选择的分公司

  useEffect(() => {
    if (open && isNotEmptyAny(selOffice)) {
      setSelectedRowKeys([selOffice.id]);
      setSelectedRows([selOffice]);
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
        V2Message.warning('请选择分公司');
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
     * @description 加载表格数据，输入关键字时由前端过滤
     * @param params 搜索参数
     * @return 表格数据
     */
    async loadData(params) {
      const data = await getCompanyList();

      const keyword = params.name;
      const dataSource = isArray(data) ? data.filter((itm: any) => !keyword || itm.name.includes(keyword)) : [];
      return {
        dataSource,
        count: dataSource.length,
      };
    }
  });

  const defaultColumns = [{
    key: 'name',
    title: '分公司名称',
    width: '500px',
    dragChecked: true,
    dragDisabled: true
  }];

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
        title='更换分公司'
        open={open}
        onOk={methods.onOk}
        width={680}
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
          <V2FormInput label='' name='name' placeholder='请输入分公司名称'/>
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
export default UpdateOffice;
