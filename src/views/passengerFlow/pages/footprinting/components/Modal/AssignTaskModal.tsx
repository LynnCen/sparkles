import { Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import { footprintingManageSelection } from '@/common/api/footprinting';
import { MOBILE_REG } from '@lhb/regexp';
import IconFont from '@/common/components/IconFont';
import styles from './index.module.less';
import { AssignTaskModalProps } from '../../ts-config';
import { post } from '@/common/request';

interface IProps {
  assignTask: AssignTaskModalProps;
  setAssignTask: (values: AssignTaskModalProps) => void;
  onSearch: (type: string) => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

// const { Title} = Typography;

const AssignTaskModal: React.FC<IProps> = ({ assignTask, setAssignTask, onSearch }) => {
  const [form] = useForm();
  const [options, setOptions] = useState<any>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onCancel = () => {
    setAssignTask({ visible: false });
    form.resetFields();
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const params = {
        ...values,
        id: assignTask.id,
      };
      // https://yapi.lanhanba.com/project/462/interface/api/53934
      post('/checkSpot/project/allot', params, {
        proxyApi: '/blaster',
        needHint: true
      }).then(() => {
        message.success('下发成功');
        onCancel();
        onSearch('edit');
      });
    });
  };

  const getSelection = async () => {
    // https://yapi.lanhanba.com/project/329/interface/api/33893
    const params = {
      keys: ['checkWay'],
    };
    setConfirmLoading(true);
    const data = await footprintingManageSelection(params);
    setConfirmLoading(false);
    setOptions(data.checkWay.map((item) => ({ value: item.id, label: item.name })) || []);
  };

  useEffect(() => {
    // 监听列表传入的id
    assignTask.visible && getSelection();
    assignTask.checkerName && form.setFieldValue('checkerName', assignTask.checkerName);
    assignTask.checkerPhone && form.setFieldValue('checkerPhone', assignTask.checkerPhone);
    assignTask.checkWay && form.setFieldValue('checkWay', assignTask.checkWay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignTask.visible]);

  return (
    <Modal
      title={'指派踩点任务'}
      open={assignTask.visible}
      onCancel={onCancel}
      onOk={onSubmit}
      getContainer={false}
      destroyOnClose
      maskClosable={false}
      confirmLoading={confirmLoading}
    >
      <Form form={form} {...layout}>
        <FormSelect
          label='踩点方式'
          name='checkWay'
          options={options}
          config={{ allowClear: true }}
          rules={[{ required: true, message: '请选择踩点方式' }]}
        />
        <FormInput
          label='踩点人员'
          name='checkerName'
          maxLength={10}
          rules={[{ required: true, message: '请输入踩点人员姓名' }]}
          placeholder='请输入踩点人员姓名'
        />
        <FormInput
          label='手机号码'
          name='checkerPhone'
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: MOBILE_REG, message: '手机号格式错误' },
          ]}
        />
        <p className={styles.help}>
          <IconFont className={styles.icon} iconHref='icon-warning_o' />
          点击确定后系统将自动发送任务码至该手机号
        </p>
      </Form>
    </Modal>
  );
};
export default AssignTaskModal;
