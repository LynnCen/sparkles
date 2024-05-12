import { FC, useEffect } from 'react';
import { Form, Modal } from 'antd';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { saveChancePointStaus, saveStoreStatus } from '@/common/api/location';
import { showInvalidFieldMsg } from '@/common/utils/ways';
import V2Form from '@/common/components/Form/V2Form';
import { enumTab } from '../../../ts-config';

interface Props {
  tenantId: string|number;
  showModal: boolean;
  setShowModal: Function;
  refresh:Function;
  type?:enumTab.CHANCEPOINT_STATUS_CONFIG|enumTab.STORE_STATUS_RENAME_CONFIG;
  record
}

const RenameModal: FC<Props> = ({
  tenantId,
  showModal,
  setShowModal,
  refresh,
  record,
  type = enumTab.CHANCEPOINT_STATUS_CONFIG
}) => {
  // 在这里编写组件的逻辑和渲染

  const [form] = Form.useForm();

  useEffect(() => {
    if (showModal) {
      form.setFieldsValue({ name: record.name, anotherName: record.anotherName });
    }
  }, [showModal]);

  const onCancel = () => {
    form.resetFields();
    setShowModal(false);
  };

  const onSubmit = () => {
    form.validateFields().then((values) => {
      const params = type === enumTab.CHANCEPOINT_STATUS_CONFIG ? {
        tenantId,
        data: [{
          ...record,
          ...values,
        }]
      } : {
        tenantId,
        status: record.status,
        alias: values.anotherName
      };
      const query = type === enumTab.CHANCEPOINT_STATUS_CONFIG ? saveChancePointStaus : saveStoreStatus;
      query(params).then(() => {
        form.resetFields();
        setShowModal(false);
        refresh();
      });
    }).catch((err) => {
      if (err && Array.isArray(err.errorFields) && err.errorFields.length && err.errorFields[0].errors) {
        showInvalidFieldMsg(err.errorFields, 1);
      }
    }); ;
  };

  return (
    <div>
      {/* 重命名弹窗 */}
      <Modal
        title={'状态重命名'}
        open={showModal}
        onCancel={onCancel}
        onOk={onSubmit}
        destroyOnClose={true}
      >
        <V2Form layout='horizontal' form={form}>
          <V2FormInput disabled label='状态名称' name='name' />
          <V2FormInput required label='重命名' name='anotherName'/>
        </V2Form>

      </Modal>
    </div>
  );
};

export default RenameModal;
