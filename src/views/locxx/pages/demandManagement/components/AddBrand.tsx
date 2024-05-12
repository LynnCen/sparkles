import { FC, useEffect } from 'react';
import { Modal, Form, message } from 'antd';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

const AddOtherBrand: FC<{
  addBrandsData: any,
  setAddBrandsData: any,
  searchContent: any,
  addSuccessComplete: Function,
}> = ({
  addBrandsData,
  setAddBrandsData,
  searchContent, // 品牌搜索时输入的内容
  addSuccessComplete, // 添加品牌成功回调
}) => {
  const [form] = Form.useForm();
  const methods = useMethods({
    handleCancel() {
      setAddBrandsData({
        visible: false
      });
    },
    handleOk() {
      form.validateFields().then((value) => {
        // 创建品牌
        // https://yapi.lanhanba.com/project/307/interface/api/58491
        post('/h5/locxx/requirement/brand/store', { name: value?.brandName || null }, { isMock: false, proxyApi: '/lcn-api' }).then(res => {
          message.success('添加成功~');
          addSuccessComplete(res);
          this.handleCancel();
        });
      });
    },
  });
  useEffect(() => {
    if (addBrandsData.visible) {
      const addBrandName = searchContent || null;
      form.setFieldsValue({
        brandName: addBrandName
      });
    }
  }, [addBrandsData.visible]);

  return (
    <Modal
      title='新增品牌'
      width='366px'
      open={addBrandsData.visible}
      maskClosable={false}
      onOk={methods.handleOk}
      onCancel={methods.handleCancel}
      zIndex={1009}
    >
      <V2Form form={form}>
        <V2FormInput
          label='品牌名称'
          name='brandName'
          placeholder='请输入品牌名称'
          maxLength={50}
          rules={[{ required: true, whitespace: true }]}
        />
      </V2Form>
    </Modal>
  );
};

export default AddOtherBrand;
