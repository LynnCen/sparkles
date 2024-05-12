import FormInput from '@/common/components/Form/FormInput';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Form, message, Modal } from 'antd';
import React, { useEffect } from 'react';
import { GroupModalProps, GroupType } from '../../ts-config';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const GroupModal: React.FC<GroupModalProps> = ({ groupModalInfo, setGroupModalInfo, onSearch }) => {
  const [form] = Form.useForm();
  const { parseTitle, onCancel, onOk } = useMethods({
    parseTitle() {
      return groupModalInfo.id ? '编辑分组' : '新增分组';
    },
    onCancel() {
      setGroupModalInfo({ ...groupModalInfo, visible: false });
      form.resetFields();
    },
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          ...groupModalInfo,
          ...values,
        };
        delete params.visible;
        var url = groupModalInfo.id ? '/propertyGroup/update' : '/propertyGroup/create';
        if(groupModalInfo.groupType === GroupType.LABEL){
          url = groupModalInfo.id ? '/labelGroup/update' : '/labelGroup/create';
        }
        post(url, params, true).then(() => {
          message.success(`${groupModalInfo.id ? '编辑' : '新建'}分组成功`);
          onCancel();
          onSearch();
        });
      });
    },
  });

  useEffect(() => {
    if (groupModalInfo.visible && groupModalInfo.id) {
      form.setFieldsValue(groupModalInfo);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [groupModalInfo.visible]);

  return (
    <Modal title={parseTitle()} open={groupModalInfo.visible} onOk={onOk} onCancel={onCancel}>
      <Form {...layout} form={form}>
        <FormInput
          label='分组名称'
          name='name'
          maxLength={32}
          placeholder='请输入分组名称'
          rules={[{ required: true, message: '请输入分组名称' }]}
        />
      </Form>
    </Modal>
  );
};
export default GroupModal;
