/**
 * @Description 机会点详情关联拓店任务弹窗
 */

import React, { useState } from 'react';
import { Form, Modal, message } from 'antd';
import styles from './index.module.less';
import V2Table from '@/common/components/Data/V2Table';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { associatedTask, getAssociatedTaskList } from '@/common/api/fishtogether';

const AssociatedExtensionTasksModal: React.FC<any> = ({
  id, // 机会点id
  visible,
  updateList, // 刷新列表
  setVisible,
  updateHandle
}) => {
  const [searchForm] = Form.useForm();
  const [taskId, setTaskId] = useState<any>(); // 选中的任务id
  const [params, setParams] = useState<any>({}); // 搜索参数

  /**
   * @description 关键词搜索
   * @param data
   */
  const onSearch = (data: any) => {
    // 为了让查询动态化
    const _params = searchForm.getFieldsValue();
    setParams({
      ..._params,
      ...data,
    });
  };
  /**
   * @description 取消选择
   */
  const onCancel = () => {
    setVisible(false);
    setParams({});
    setTaskId(null);
    searchForm.resetFields();
  };

  /**
   * @description 关联机会点和拓店任务
   */
  const onSubmit = () => {
    if (taskId && id) {
      try {
        associatedTask({ taskId, id }).then(() => {
          message.success('关联成功');
          onCancel();
          updateHandle(); // 手动刷新机会点详情
          updateList(); // 刷新机会点列表
        });
      } catch (error) {
        message.error('关联失败');
      }
    } else {
      message.warning('请先选择需要关联的拓店任务。');
    }
  };
  /**
   * @description 加载拓店任务表格数据
   */
  const loadData = async (params) => {
    const result: any = await getAssociatedTaskList({
      ...params,
      chancePointId: id
    });
    return {
      dataSource: result?.objectList || [],
      count: result.totalNum || 0,
    };
  };

  /**
   * @description 拓店任务选择项发生变化
   * @param selectedRowKeys 选择的id
   */
  const selectChange = (selectedRowKeys) => {
    if (selectedRowKeys && selectedRowKeys.length) {
      setTaskId(selectedRowKeys[0]);
    }
  };

  /** 表格表头项 */
  const defaultColumns = [
    {
      title: '拓店任务',
      key: 'name',
    },
  ];

  return (
    <Modal
      title='关联拓店任务'
      open={visible}
      width={414}
      onOk={onSubmit} // 点击确定
      onCancel={onCancel} // 点击取消
      destroyOnClose// 关闭时销毁 Modal 里的子元素
      wrapClassName={styles.associatedExtensionTasksModal}
    >
      <SearchForm
        form={searchForm}
        labelLength={4}
        onSearch={onSearch}>
        <V2FormInput
          label=''
          maxLength={200}
          name='keyword'
          placeholder='请输入拓店任务名称'
          config={{ allowClear: true, style: { width: 300 } }}
          className={styles.taskInput}
        />
      </SearchForm>
      <V2Table
        onFetch={loadData}
        filters={params}
        defaultColumns={defaultColumns}
        className={styles.taskTable}
        rowKey='id'
        // 64是分页模块的总大小， 62是table头部
        scroll={{ y: 228 }}
        hideColumnPlaceholder
        rowSelection={{
          type: 'radio',
          onChange: (selectedRowKeys) => selectChange(selectedRowKeys),
        }}
      />
    </Modal>
  );
};

export default AssociatedExtensionTasksModal;
