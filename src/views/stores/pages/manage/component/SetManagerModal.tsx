import React, { useEffect } from 'react';
import { Form, message, Modal } from 'antd';
import FormEmployees from '@/common/components/FormBusiness/FormEmployees';
import { postStoreManagers } from '@/common/api/store';
import { SetManagerProps } from '../ts-config';
import V2Form from '@/common/components/Form/V2Form';

const SetManagerModal: React.FC<SetManagerProps> = ({ record, onClose, onOk }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record.visible) {
      // 最新数据同步到弹框上
      form.setFieldsValue({ account_ids: record.account_ids });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.visible]);

  const onCancel = () => {
    onClose({ ...record, visible: false });
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then((value: any) => {

        const managerIds = value.account_ids && Array.isArray(value.account_ids) ? value.account_ids : [];
        const params = {
          id: record.store_id,
          managerIds,
          type: 1 // 1:门店管理员 2:门店对接人
        };
        postStoreManagers(params).then(() => {
          message.success('设置管理员成功');
          onClose({ ...record, visible: false });
          onOk();
        });
      });
  };

  return (
    <Modal
      title='设置管理员'
      open={record.visible}
      width={500}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <V2Form form={form}>
        <FormEmployees
          label='选择员工'
          name='account_ids'
          allowClear={false}
          config={{
            mode: 'multiple',
          }}
          rules={[{ required: true, message: '管理员不能为空' }]}
          placeholder='请输入员工姓名'
        />
      </V2Form>
    </Modal>
  );
};

export default SetManagerModal;
