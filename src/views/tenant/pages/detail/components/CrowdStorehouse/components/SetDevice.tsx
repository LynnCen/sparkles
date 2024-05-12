// 设置摄像头
import { FC, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
// import { BatchDelManagerModalProps } from '../../../ts-config';
import { setDevice } from '@/common/api/flow';
import FormCheckboxGroup from '@/common/components/Form/FormCheckboxGroup';

const SetDevice: FC<any> = ({
  storeId,
  modalData,
  modalHandle,
  loadData
}) => {
  const [form] = Form.useForm();
  const { visible, devices: options } = modalData;
  const [checked, setChecked] = useState<number[]>([]);

  const submitHandle = () => {
    form.validateFields().then(async (values: any) => {
      const { ids } = values;
      const params = {
        id: storeId,
        deviceIds: ids
      };
      await setDevice(params);
      loadData();
      modalHandle(false);
    });
  };

  useEffect(() => {
    const selected = options.filter((option: any) => option.checked);
    setChecked(selected.map((item) => item.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const cancelHandle = () => {
    setChecked([]);
    modalHandle(false);
  };

  return (
    <>
      <Modal
        title='设置摄像头'
        open={visible}
        destroyOnClose={true}
        onOk={submitHandle}
        onCancel={cancelHandle}>
        <Form
          form={form}
          colon={false}
          preserve={false}
          name='form'>
          <FormCheckboxGroup
            label='请选择要显示监控的摄像头'
            name='ids'
            rules={[
              { required: true, message: '请选择要显示监控的摄像头' }
            ]}
            initialValue={checked as any}
            options={options}/>
        </Form>
      </Modal>
    </>
  );
};

export default SetDevice;

