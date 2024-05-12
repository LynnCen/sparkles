import React, { useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { Cascader, Form, Modal } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import { TaskModalProps } from '../ts-config';
import { radarAddressList, radarCategoryList, submitRadarTask } from '@/common/api/radar';
import FormCascader from '@/common/components/Form/FormCascader';
import { recursionEach } from '@lhb/func';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const channelList = [{ label: '高德', value: 'GAODE' }];

const TaskModal: React.FC<TaskModalProps> = ({ taskInfo, setTaskInfo, onSearch }) => {
  const [form] = Form.useForm();
  const { onSubmit, onCancel } = useMethods({
    onCancel() {
      setTaskInfo({ visible: false });
      onSearch();
    },
    onSubmit() {
      form
        .validateFields()
        .then((values: any) => {
          const params = {
            ...values,
            taskType: 'CATEGORY_TASK',
            addressCodeList: values.addressCodeList
              .map((item) => item[1] || item[0])
              .filter(Boolean),
            // categoryCodeList: values.categoryCodeList
            //   .map((item) => item[1] || item[0])
            //   .filter(Boolean),
          };
          submitRadarTask(params).then(() => {
            onCancel();
            onSearch();
          });
          onCancel();
          onSearch();
        })
        .catch((errorInfo: any) => {
          console.log('errorInfo', errorInfo);
        });
    },
  });

  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);

  const [addressOptions, setAddressOptions] = useState<any[]>([]);

  const categoriesList = async () => {
    const data = await radarCategoryList({ channel: 'GAODE' });
    if (Array.isArray(data)) {
      recursionEach(data, 'children', (item: any) => {
        item.label = item.categoryName;
        item.value = item.categoryCode;
      });
      setCategoryOptions(data);
    }
  };

  const addressList = async () => {
    const data = await radarAddressList({ channel: 'GAODE' });
    if (Array.isArray(data)) {
      recursionEach(data, 'children', (item: any) => {
        item.label = item.name;
        item.value = item.code;
      });
      setAddressOptions(data);
    }
  };

  useEffect(() => {
    form.resetFields();
    categoriesList();
    addressList();
  }, [taskInfo.visible]);

  return (
    <Modal
      title='创建指定类别任务'
      destroyOnClose
      open={taskInfo.visible}
      getContainer={false}
      onCancel={onCancel}
      onOk={onSubmit}
      forceRender
    >
      <Form {...layout} form={form}>
        <FormInput
          label='任务名称'
          name='name'
          placeholder='请输入任务名称'
          rules={[{ required: true, message: '请输入任务名称' }]}
          maxLength={20}
        />
        <FormSelect
          label='渠道'
          name='channel'
          placeholder='请选择渠道'
          options={channelList}
          rules={[{ required: true, message: '请选择渠道' }]}
        />
        <FormCascader
          label='所属城市'
          name='addressCodeList'
          placeholder='选择所属城市'
          options={addressOptions}
          rules={[{ required: true, message: '请选择所属城市' }]}
          config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD }}
        />
        {/* <FormCascader
          label='POI类别'
          name='categoryCodeList'
          placeholder='请选择POI类别'
          options={categoryOptions}
          rules={[{ required: true, message: '请选择高德地址分类' }]}
          config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD }}
        /> */}
        <FormSelect
          label='POI类别'
          name='categoryCodeList'
          placeholder='请选择品牌'
          allowClear
          options={categoryOptions}
          mode={'multiple'}
          rules={[{ required: true, message: '请选择高德地址分类' }]}
        />
      </Form>
    </Modal>
  );
};

export default TaskModal;
