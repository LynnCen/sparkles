/**
 * @description 添加可见人员弹窗
 */

import { Empty, Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import FormTenant from '@/common/components/FormBusiness/FormTenant';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import { useEffect } from 'react';
import { post } from '@/common/request';

const CanShowUserModal = ({ storeIds, visible, setVisible, onRefresh }) => {
  const [form] = Form.useForm();
  const watchTenantId = Form.useWatch('tenantId', form);

  useEffect(() => {
    if (!watchTenantId) {
      form.resetFields();
    }
  }, [watchTenantId]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  const methods = useMethods({
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          storeIds,
          ...values,
        };
        // https://yapi.lanhanba.com/project/434/interface/api/68319
        post('/admin/store/batchAttachAccounts', params, {
          needHint: true,
          proxyApi: '/passenger-flow'
        }).then(() => {
          V2Message.success('添加成功');
          onRefresh();
          setVisible(false);
        });
      });
    },
    onCancel() {
      setVisible(false);
    },

  });
  return (
    <>
      <Modal
        title='添加可见人员'
        open={visible}
        onOk={methods.onOk}
        // 两列弹窗要求336px
        width={336}
        onCancel={methods.onCancel}
        forceRender
      >
        <Form form={form}>
          <FormTenant
            label='租户名称'
            name='tenantId'
            allowClear={true}
            placeholder='请输入租户名称搜索'
            enableNotFoundNode={false}
            rules={[{
              required: true,
              message: '请选择租户'
            }]}
            config={{
              getPopupContainer: (node) => node.parentNode,
            }}
          />
          <FormUserList
            label='选择员工'
            name='accountIds'
            form={form}
            allowClear={true}
            immediateOnce={false}
            extraParams={{
              tenantId: watchTenantId
            }}
            rules={[{
              required: true,
              message: '请选择选择员工'
            }]}
            renderEmptyReactNode={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'请先选择租户'} />}
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
export default CanShowUserModal;
