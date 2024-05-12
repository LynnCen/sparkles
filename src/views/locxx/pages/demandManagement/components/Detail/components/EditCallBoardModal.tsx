/**
 * @Description 编辑需求公告
 */
import { FC, useEffect } from 'react';
import { Modal, Form } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { post } from '@/common/request';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const EditCallBoardModal: FC<any> = ({
  visible,
  setCallBoardVisible,
  onRefresh,
  data
}) => {
  const [form] = Form.useForm();
  const methods = useMethods({
    close() {

      setCallBoardVisible(false);
    },
    handleOk() {
      form.validateFields().then((values) => {
        post('/locxx/requirement/updateNotice', {
          locxxRequirementId: data.id,
          notice: values.notice,
        }, { proxyApi: '/lcn-api' }).then(() => {
          setCallBoardVisible(false);
          onRefresh && onRefresh();
          V2Message.success('保存成功');
        });
      });
    }
  });
  useEffect(() => {
    if (visible) {
      form.setFieldValue('notice', data.notice);
    }
  }, [visible]);
  return (
    <Modal
      title='编辑需求公告'
      width='610px'
      open={visible}
      maskClosable={false}
      forceRender
      onOk={methods.handleOk}
      onCancel={methods.close}
      okText='确认'
    >
      <V2Form form={form}>
        <V2FormTextArea
          maxLength={500}
          label='需求公告'
          placeholder='填写需求重点关注信息，防止遗漏，不超过500字。'
          name='notice'
          config={{ showCount: true }}
        />
      </V2Form>
    </Modal>
  );
};

export default EditCallBoardModal;
