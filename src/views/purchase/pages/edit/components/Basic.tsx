// 基本信息
import { FC, useRef } from 'react';
import { Form } from 'antd';
// import FormSelect from 'src/common/components/Form/FormSelect';
import FormInput from 'src/common/components/Form/FormInput';
import FormTextArea from 'src/common/components/Form/FormTextArea';

import FormResourceBrand from 'src/common/components/FormBusiness/FormResourceBrand';
import FormSupplier from 'src/common/components/FormBusiness/FormSupplier';
import FormSupplierContact from 'src/common/components/FormBusiness/FormSupplierContact';

// 参考 src/views/resmng/pages/detail/components/Modal/ChannelDescModal.tsx

const Basic:FC<{form: any, updateExtraFormData: Function}> = ({ form, updateExtraFormData }) => {
  // 资源品牌-监听数据
  const formResourceBrand: any = useRef();
  const formSupplier: any = useRef();
  const formSupplierContact: any = useRef();

  // 选择供应商，重置并更新联系人列表
  const supplyId = Form.useWatch('supplyId', form);
  const changeSupplier = (value) => {
    updateExtraFormData({ supplyName: formSupplier.current.getItem(value)?.supplierName });
    form.setFieldValue('contactId', null);
    formSupplierContact.current.reload();
  };
  // 选择供应商联系人
  const changeSupplierContact = (value) => {
    const item = formSupplierContact.current.getItem(value);
    updateExtraFormData({
      contactName: item?.contactName, // 联系人名称
      contactMobile: item?.contactMobile, // 联系人手机号
    });
  };

  return <div>
    <div className='fn-16 lh-22 font-weight-500 mb-16'>基础信息</div>

    <div className='flex-row'>
      <FormSupplier
        formRef={formSupplier}
        name='supplyId'
        label='供应商'
        rules={[{ required: true, message: '请选择下单供应商' }]}
        formItemConfig={{ className: 'mr-20' }}
        placeholder='请选择下单供应商'
        changeHandle={changeSupplier}
      />
      <FormSupplierContact
        formRef={formSupplierContact}
        name='contactId'
        label='联系人'
        extraParams={{ supplierId: supplyId }}
        config={{ immediateOnce: false }}
        rules={[{ required: true, message: '请选择供应商联系人' }]}
        placeholder='请选择供应商联系人'
        changeHandle={changeSupplierContact}
      />
    </div>
    <div className='flex-row'>
      <FormInput
        label='活动名称'
        name='title'
        maxLength={50}
        allowClear
        rules={[{ required: true, whitespace: true, message: '请输入活动名称' }]}
        formItemConfig={{ className: 'mr-20' }}
        placeholder='请输入活动名称'
      />
      <FormResourceBrand
        formRef={formResourceBrand}
        name='brandIds'
        label='品牌'
        config={{ mode: 'multiple' }}
      />
    </div>

    <FormTextArea
      label='备注内容'
      name='mark'
      config={{ maxLength: 500, showCount: true }}
      placeholder='请输入备注内容（不超过500字）'
    />

  </div>;
};

export default Basic;
