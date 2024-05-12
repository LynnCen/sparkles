import { FC, useEffect } from 'react';
import { Modal, Form, message } from 'antd';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import { MOBILE_REG } from '@lhb/regexp';

const AddContacts: FC<{
  addContractsData: any,
  setAddContactsData: any,
  searchContent: any,
  addSuccessComplete: Function,
}> = ({
  addContractsData,
  setAddContactsData,
  searchContent, // 联系人搜索时输入的内容
  addSuccessComplete, // 添加联系人成功回调
}) => {
  const [form] = Form.useForm();
  const methods = useMethods({
    handleCancel() {
      setAddContactsData({
        ...addContractsData,
        visible: false
      });
    },
    handleOk() {
      form.validateFields().then((value) => {
        if (!addContractsData?.brandName) {
          message.warning('请选择品牌');
          return;
        }
        // 创建联系人
        // https://yapi.lanhanba.com/project/307/interface/api/58666
        post('/locxx/requirement/createContact', { mobile: value?.mobile || null, name: value?.name, brandName: addContractsData?.brandName }, { isMock: false, proxyApi: '/lcn-api' }).then(res => {
          message.success('添加成功~');
          addSuccessComplete(res);
          this.handleCancel();
        });
      });
    },
  });
  useEffect(() => {
    if (addContractsData.visible) {
      const addBrandName = searchContent || null;
      form.setFieldsValue({
        mobile: addBrandName,
        name: null
      });
    }
  }, [addContractsData.visible]);

  return (
    <Modal
      title='新增联系人'
      width='366px'
      open={addContractsData.visible}
      maskClosable={false}
      onOk={methods.handleOk}
      onCancel={methods.handleCancel}
      zIndex={1009}
    >
      <V2Form form={form}>
        <V2FormInputNumber
          label='手机号'
          name='mobile'
          placeholder='请输入手机号'
          precision={0}
          config={{
            controls: false,
            maxLength: 11
          }}
          rules={[{ required: true, message: '请输入11位手机号码' }, { pattern: MOBILE_REG, message: '输入的手机号码不合法' }]}
        />
        <V2FormInput
          label='姓名'
          name='name'
          placeholder='请输入姓名'
          maxLength={50}
          rules={[{ required: true, whitespace: true }]}
        />
      </V2Form>
    </Modal>
  );
};

export default AddContacts;
