import { useMethods } from '@lhb/hook';
import { Form, Modal, message } from 'antd';
import { useState, FC, forwardRef, useImperativeHandle } from 'react';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import V2Form from '@/common/components/Form/V2Form';
import { post } from '@/common/request';

// 转交弹窗
const Component:FC<any& { ref?: any }> = forwardRef(({ onConfirm }, ref) => {
  useImperativeHandle(ref, () => ({
    init: methods.init
  }));
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [id, setId] = useState(null);
  const [requesting, setRequesting] = useState(false);


  const methods = useMethods({
    init(id) {
      setVisible(true);
      setId(id);
      form.resetFields();
    },
    confirm() {
      form.validateFields().then((values) => {
        setRequesting(true);
        post('/saas/advice/transfer', { id, ...values }, { proxyApi: '/lcn-api' }).then(() => {
          message.success('转交成功！');
          onConfirm && onConfirm();
          setVisible(false);
        }).finally(() => {
          setRequesting(false);
        });
      });
    }
  });

  return <Modal
    open={visible}
    onCancel={() => setVisible(false)}
    title='提示'
    confirmLoading={requesting}
    onOk={methods.confirm}
  >
    <V2Form form={form}>
      <FormUserList
        label='转交对象'
        name='transferToId'
        placeholder='请选择转交对象'
        allowClear={true}
        formItemConfig={{ rules: [{ required: true, message: '请选择转交对象' }], }}
        form={form}
      />
    </V2Form>
  </Modal>;
});

export default Component;
