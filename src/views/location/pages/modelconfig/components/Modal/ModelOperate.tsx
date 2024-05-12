/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑模型 */
import { FC, useEffect, useState } from 'react';
import { Modal, Form, Cascader } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import { get, post } from '@/common/request';
import { ModelModalProps } from '../../ts-config';
import FormTextArea from '@/common/components/Form/FormTextArea';
import FormCascader from '@/common/components/Form/FormCascader';
import FormSelect from '@/common/components/Form/FormSelect';
import { isArray } from '@lhb/func';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const ModelOperate: FC<ModelModalProps> = ({ operateModel, setOperateModel, onSearch }) => {
  const [form] = Form.useForm();

  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [industryOptions, setIndustryOptions] = useState<any>([]);
  const [scopeOptions, setScopeOptions] = useState<any>([]);

  const loadCategoryOptions = async () => {
    const data = await get(
      // https://yapi.lanhanba.com/project/462/interface/api/46339
      '/shop/model/selection',
      {},
      { needCancel: false, isMock: false, needHint: true, mockId: 462, proxyApi: '/blaster' }
    );
    const { shopCategory, shopModelScope } = data;
    if (isArray(shopCategory) && shopCategory.length) {
      setCategoryOptions(shopCategory.map((item) => ({ label: item.name, value: item.id })));
    }
    if (isArray(shopModelScope) && shopModelScope.length) {
      setScopeOptions(shopModelScope.map((item) => ({ label: item.name, value: item.id })));
    }
    // data.shopCategory &&
    //   data.shopCategory.length &&
    //   setCategoryOptions(data.shopCategory.map((item) => ({ label: item.name, value: item.id })));
  };

  const loadIndustryOptions = async () => {
    const data = await post(
      '/common/selection/tree',
      { key: 'MDHY' },
      { needCancel: false, isMock: false, needHint: true, mockId: 462, proxyApi: '/blaster' }
    );
    data && data.length && setIndustryOptions(data);
  };

  useEffect(() => {
    if (operateModel.visible) {
      loadCategoryOptions();
      loadIndustryOptions();
      if (operateModel.id) {
        form.setFieldsValue({ ...operateModel });
      } else {
        form.resetFields();
      }
    }
  }, [operateModel.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存-https://yapi.lanhanba.com/project/462/interface/api/45275
      const url = '/shop/model/save';
      const params = {
        ...values,
        ...(operateModel.id && { id: operateModel.id }),
        industryId: values.industryId[values.industryId.length - 1]
      };
      post(url, params, { proxyApi: '/blaster' }).then(() => {
        onCancel();
        onSearch();
      });
    });
  };

  const onCancel = () => {
    setOperateModel({ visible: false });
  };

  return (
    <>
      <Modal
        title={!operateModel.id ? '新建模型' : '编辑模型'}
        open={operateModel.visible}
        onOk={onSubmit}
        width={600}
        onCancel={onCancel}
        getContainer={false}
      >
        <Form {...layout} form={form}>
          <FormInput
            label='模型名称'
            name='name'
            rules={[{ required: true, message: '请输入模型名称' }]}
            maxLength={20}
          />
          <FormInput
            label='模型编号'
            name='code'
            rules={[{ required: true, message: '请输入模型编号' }]}
            maxLength={50}
          />
          <FormSelect
            label='店铺类型'
            name='categoryId'
            rules={[{ required: true, message: '请选择店铺类型' }]}
            options={categoryOptions}
          />
          <FormCascader
            label='所属行业'
            name='industryId'
            rules={[{ required: true, message: '请选择所属行业' }]}
            placeholder='选择所属行业'
            options={industryOptions}
            config={{
              multiple: false,
              changeOnSelect: true,
              showCheckedStrategy: Cascader.SHOW_CHILD,
              fieldNames: {
                label: 'name',
                value: 'id',
              },
            }}
          />
          <FormSelect
            label='查询范围'
            name='scope'
            rules={[{ required: true, message: '请选择查询范围' }]}
            options={scopeOptions}
          />
          <FormTextArea label='描述' name='description' placeholder='请输入描述' rules={[{ required: true, message: '请输入描述' }]}/>
        </Form>
      </Modal>
    </>
  );
};

export default ModelOperate;
