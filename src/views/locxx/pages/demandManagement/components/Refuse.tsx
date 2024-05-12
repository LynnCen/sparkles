import { Form, Modal, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';

// 交易平台-需求管理-拒绝弹窗
const Refuse:FC<{
  refuseData: any,
  setRefuseData: any,
  onRefresh: Function,
}> = ({ refuseData, setRefuseData, onRefresh }) => {
  const [form] = Form.useForm();
  const [id, setId] = useState(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (refuseData.visible) {
      setId(refuseData?.id);
      form.setFieldsValue(Object.assign({}, methods.getOriFromData()));
    }
  }, [refuseData.visible]);

  const methods = useMethods({
    submit() {
      form.validateFields().then(result => {
        const params = { id, reason: result?.reason };
        setRequesting(true);
        post('/locxx/requirement/reject', params, { proxyApi: '/lcn-api' }).then(() => {
          onRefresh?.();
          methods.cancel();
          message.warn('审核拒绝成功');
        }).finally(() => {
          setRequesting(false);
        });
      });
    },
    cancel() {
      setRefuseData(state => ({ ...state, visible: false }));
    },
    getOriFromData() {
      return {
        id: null,
        reason: null, // 拒绝原因
      };
    }
  });

  return <Modal
    title='拒绝原因'
    width={336}
    open={refuseData.visible}
    onOk={methods.submit}
    onCancel={methods.cancel}
    confirmLoading={requesting}
  >
    <V2Form form={form}>
      <V2FormTextArea
        label=''
        placeholder='请输入拒绝原因'
        name='reason'
        maxLength={200}
        rules={[{ required: true, whitespace: true, message: '请输入拒绝原因' }]}
        config={{ showCount: true }}
      />
    </V2Form>
  </Modal>;
};

export default Refuse;
