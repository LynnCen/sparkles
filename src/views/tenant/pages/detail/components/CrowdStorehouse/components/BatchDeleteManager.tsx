import { FC } from 'react';
import { Form, Modal } from 'antd';
import { BatchDelManagerModalProps } from '../../../ts-config';
import { batchDeleteManager } from '@/common/api/flow';
import FormCheckboxGroup from '@/common/components/Form/FormCheckboxGroup';

const BatchDeleteManager: FC<BatchDelManagerModalProps> = ({
  storeIds,
  modalData,
  modalHandle,
  loadData
}) => {
  const [form] = Form.useForm();
  const { visible, managers: options } = modalData;

  const submitHandle = () => {
    form.validateFields().then(async (values: any) => {
      const { ids } = values;
      const params = {
        ids: storeIds as number[],
        managerIds: ids
      };
      await batchDeleteManager(params);
      loadData();
      modalHandle(false);
    });
  };

  return (
    <>
      <Modal
        title='删除管理员'
        open={visible}
        destroyOnClose={true}
        onOk={submitHandle}
        onCancel={() => modalHandle(false)}>
        <Form
          form={form}
          preserve={false}
          name='form'>
          <FormCheckboxGroup
            label='请选择要删除的管理员：'
            name='ids'
            rules={[
              { required: true, message: '请选择要删除的管理员' }
            ]}
            options={options}/>
        </Form>
      </Modal>
    </>
  );
};

export default BatchDeleteManager;
