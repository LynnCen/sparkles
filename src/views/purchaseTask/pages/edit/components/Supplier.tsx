// 供应商信息
import { FC, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Form } from 'antd';
import FormSupplier from 'src/common/components/FormBusiness/FormSupplier';
import FormSupplierContact from 'src/common/components/FormBusiness/FormSupplierContact';
import FormSupplierContract from '@/common/components/FormBusiness/FormSupplierContract';
import FormTextArea from 'src/common/components/Form/FormTextArea';
import { contrast, deepCopy } from '@lhb/func';

const Supplier:FC<any> = forwardRef(({
  form,
  updateExtraFormData
}, ref) => {
  // 抛出给 ref 事件
  useImperativeHandle(ref, () => ({
    getSubmitParams: (formData: any) => getSubmitParams(formData)
  }));

  const formSupplier: any = useRef();
  const formSupplierContact: any = useRef();

  // 选择供应商，重置并更新联系人列表
  const supplierId = Form.useWatch('supplyId', form);

  useEffect(() => {
    form.setFieldValue('contactId', null);
    formSupplierContact.current.reload();
  }, [supplierId]);

  const changeSupplier = (value) => {
    updateExtraFormData({ supplyName: formSupplier.current.getItem(value)?.supplierName });
  };

  // 选择供应商联系人
  const changeSupplierContact = (value) => {
    const item = formSupplierContact.current.getItem(value);
    updateExtraFormData({
      contactName: item?.contactName,
      contactMobile: item?.contactMobile,
    });
  };

  // 获取提交用表单数据
  const getSubmitParams = (formData: any) => {
    const values = deepCopy(formData);

    const params = {
      supplyId: contrast(values, 'supplyId'),
      contactId: contrast(values, 'contactId'),
      contractNum: contrast(values, 'contractNum'),
      mark: contrast(values, 'mark'),
    };
    return params;
  };

  return (
    <div>
      <div className='fn-14 lh-20 font-weight-500 mb-16'>1.供应商信息</div>
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
          extraParams={{ supplierId }}
          config={{ immediateOnce: false }}
          rules={[{ required: true, message: '请选择供应商联系人' }]}
          placeholder='请选择供应商联系人'
          changeHandle={changeSupplierContact}
        />
      </div>
      <div className='flex-row'>
        <FormSupplierContract
          name='contractNum'
          label='供应商合同'
          config={{ immediateOnce: true }}
          placeholder='搜索并选择已有供应商合同'
        />
      </div>
      <FormTextArea
        label='备注内容'
        name='mark'
        config={{ maxLength: 500 }}
        placeholder='可填写备注，上限500字'
      />
    </div>
  );
});

export default Supplier;
