/**
 * @description 设置可见人员弹窗
 */

import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import { post } from '@/common/request';
import { useEffect } from 'react';

const SetCanShowUserModal = ({ modal, setModal, onRefresh }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (modal.visible && modal.ids?.length) {
      form.setFieldsValue({
        accountIds: modal.ids,
      });
    }
  }, [modal]);

  const methods = useMethods({
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          storeId: modal.storeId,
          tenantId: modal.tenantId,
          ...values,
        };
        // https://yapi.lanhanba.com/project/434/interface/api/68298
        post('/admin/store/setAccounts', params, {
          needHint: true,
          proxyApi: '/passenger-flow'
        }).then(() => {
          V2Message.success('设置成功');
          onRefresh();
          methods.onCancel();
        });
      });
    },
    onCancel() {
      form.resetFields();
      setModal({
        ...modal,
        visible: false,
      });
    },

  });
  return (
    <>
      <Modal
        title='设置可见人员'
        open={modal.visible}
        onOk={methods.onOk}
        // 两列弹窗要求336px
        width={336}
        onCancel={methods.onCancel}
        forceRender
      >
        <Form form={form}>
          <FormUserList
            label='选择员工'
            name='accountIds'
            form={form}
            allowClear={true}
            immediateOnce={false}
            extraParams={{
              tenantId: modal.tenantId
            }}
            rules={[{
              required: true,
              message: '请选择选择员工'
            }]}
            config={{
              mode: 'multiple',
            }}
            needTenantLink={true}
            placeholder='请输入员工姓名/手机号关键词搜索'
          />
        </Form>
      </Modal>
    </>
  );
};
export default SetCanShowUserModal;
