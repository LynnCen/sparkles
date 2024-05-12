import { FC } from 'react';
import { Form, Modal, message } from 'antd';
import { useMethods } from '@lhb/hook';
import { rejectTask } from '@/common/api/purchaseTask';
import FormTextArea from '@/common/components/Form/FormTextArea';

export interface RejectModalData {
  visible: boolean;
  id: number;
}

export interface RejectModalProps {
  data: RejectModalData,
  setData: Function;
  onComplete: Function;
}

const RejectModal: FC<RejectModalProps> = ({
  data,
  setData,
  onComplete,
}) => {
  const [form] = Form.useForm();

  const methods = useMethods({
    submit() {
      const { id } = data;
      const mark = form.getFieldValue('mark');
      const params = { id, mark };
      rejectTask(params).then(() => {
        message.success('提交成功');
        setData({
          ...data,
          visible: false,
        });
        onComplete && onComplete();
      });
    },
  });

  return (
    <Modal
      title='拒绝采购任务'
      width='428px'
      open={data.visible}
      onOk={methods.submit}
      maskClosable={false}
      onCancel={() => setData({ ...data, visible: false, })}>
      <Form form={form} labelWrap={true} labelCol={{ span: 6 }}>
        <FormTextArea
          label='备注'
          name='mark'
          placeholder='请填写备注，最多可输入200字'
          config={{ maxLength: 200, showCount: true }}
        />
      </Form>
    </Modal>
  );
};

export default RejectModal;
