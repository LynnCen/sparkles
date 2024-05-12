/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑模型 */
import { FC, useEffect, useState } from 'react';
import { Modal, Form } from 'antd';
import { get, post } from '@/common/request';
import FormSelect from '@/common/components/Form/FormSelect';

// 新增/编辑模型
export interface TenantModelModalValuesProps {
  visible: boolean;
  tenantId?: number;
}

export interface TenantModelModalProps {
  setOperateModel: Function;
  operateModel: TenantModelModalValuesProps;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const TenantModelOperate: FC<TenantModelModalProps> = ({ operateModel, setOperateModel }) => {
  const [form] = Form.useForm();

  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [searchOptions, setSearchOptions] = useState<any>([]);

  const loadCategoryOptions = async () => {
    const { objectList } = await get(
      '/shop/model/list',
      { page: 1, size: 100 },
      {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    if (objectList.length) {
      const ops = objectList.map((item) => ({ id: item.id, name: item.name + ' ' + item.code }));
      setCategoryOptions(ops);
      setSearchOptions(ops);
    }
  };

  const loadmodels = async () => {
    const data = await post(
      '/shop/model/search',
      { tenantId: operateModel.tenantId },
      {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    if (data && data.length) {
      form.setFieldsValue({ modelIds: data.map((item) => item.id) });
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    if (operateModel.visible) {
      loadCategoryOptions();
      loadmodels();
    }
  }, [operateModel.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存-https://yapi.lanhanba.com/project/462/interface/api/45107
      const url = '/shop/model/tenant/relate';
      const params = {
        tenantId: operateModel.tenantId,
        modelIds: values.modelIds,
      };
      post(url, params, { proxyApi: '/blaster' }).then(() => {
        onCancel();
      });
    });
  };

  const onCancel = () => {
    setOperateModel({ visible: false });
  };

  const onSearch = (keyword) => {
    setSearchOptions(categoryOptions.filter((item) => item.name.includes(keyword)));
  };

  return (
    <>
      <Modal
        title={'选择要配置的模型'}
        open={operateModel.visible}
        onOk={onSubmit}
        width={600}
        onCancel={onCancel}
        getContainer={false}
      >
        <Form {...layout} form={form}>
          <FormSelect
            label='推荐模型'
            mode='multiple'
            name='modelIds'
            rules={[{ required: true, message: '请选择店铺类型' }]}
            options={searchOptions}
            config={{
              allowClear: true,
              fieldNames: { label: 'name', value: 'id' },
              onSearch: onSearch,
              filterOption: false,
            }}
          />
          {/* TODO:接口及表单组件待联调 */}
          <FormSelect
            label='规划模型'
            mode='multiple'
            name='modelIds'
            options={searchOptions}
            config={{
              allowClear: true,
              fieldNames: { label: 'name', value: 'id' },
              onSearch: onSearch,
              filterOption: false,
            }}
          />
        </Form>
      </Modal>
    </>
  );
};

export default TenantModelOperate;
