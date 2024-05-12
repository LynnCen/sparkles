/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑模板 */
import { FC, useEffect, useRef, useState } from 'react';
import { Modal, Form } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import { post } from '@/common/request';
import { StoreTemplateModalProps } from '../ts-config';
import FormResourceBrand from '@/common/components/FormBusiness/FormResourceBrand';
import FormTenantTemplate from '../FormTenantTemplate/FormTenantTemplate';
import FormSelect from '@/common/components/Form/FormSelect';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const StoreTemplateOperate: FC<StoreTemplateModalProps> = ({
  operateStoreTemplate,
  setOperateStoreTemplate,
  onSearch,
  tenantId,
}) => {
  const [form] = Form.useForm();
  const [shopCategoryOptions, setShopCategoryOptions] = useState<any>([]);
  const [flowOptions, setFlowOptions] = useState<any>([]);
  const brandRef: any = useRef();
  const tplRef: any = useRef();

  const loadShopCategoryOptions = async () => {
    // https://yapi.lanhanba.com/project/289/interface/api/48999
    const objectList = await post(
      '/dynamic/shopCategory/lists',
      { page: 1, size: 100, tenantId },
      {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    setShopCategoryOptions(objectList || []);
  };

  /**
   * @description 获取审批流下拉选项
   */
  const loadApprovalFlowOptions = async () => {
    // https://yapi.lanhanba.com/project/289/interface/api/55502
    const { objectList } = await post(
      '/flow/template/page',
      { page: 1, size: 100, tenantId },
      {
        isMock: false,
        mockId: 289,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    setFlowOptions(objectList || []);
  };

  const loadDetail = async () => {
    // https://yapi.lanhanba.com/project/289/interface/api/49027
    const detail = await post(
      '/dynamic/template/info/query',
      { id: operateStoreTemplate.id },
      {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    // 品牌联想输入框回填
    brandRef.current.setOptions([
      {
        id: detail.brandId,
        name: detail.brandName,
      },
    ]);

    if (detail.copyId && detail.copyName) {
      // 复制模板输入框回填
      tplRef.current.setOptions([
        {
          id: detail.copyId,
          templateName: detail.copyName,
        },
      ]);
    }
    form.setFieldsValue({ ...detail });
  };

  useEffect(() => {
    if (operateStoreTemplate.visible) {
      loadShopCategoryOptions();
      loadApprovalFlowOptions();
      if (operateStoreTemplate.id) {
        loadDetail();
      } else {
        form.resetFields();
        // 默认不支持提交审批，以免影响之前建立的模板
        form.setFieldValue('supportDirectApproval', 2);
      }
    }
  }, [operateStoreTemplate.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 创建-https://yapi.lanhanba.com/project/289/interface/api/49013
      // 更新-https://yapi.lanhanba.com/project/289/interface/api/49034
      const url = operateStoreTemplate.id ? '/dynamic/template/info/update' : '/dynamic/template/info/create';
      const params = {
        tenantId,
        ...values,
        ...(operateStoreTemplate.id && { id: operateStoreTemplate.id }),
      };
      post(url, params, { proxyApi: '/blaster' }).then(() => {
        onCancel();
        onSearch();
      });
    });
  };

  const onCancel = () => {
    setOperateStoreTemplate({ visible: false });
  };

  return (
    <>
      <Modal
        title={!operateStoreTemplate.id ? '新建模板' : '编辑模板'}
        open={operateStoreTemplate.visible}
        onOk={onSubmit}
        width={600}
        onCancel={onCancel}
        getContainer={false}
      >
        <Form {...layout} form={form}>
          <FormInput
            label='模版名'
            name='templateName'
            rules={[{ required: true, message: '请输入模板名' }]}
            maxLength={20}
          />
          <FormResourceBrand
            name='brandId'
            label='品牌'
            formRef={brandRef}
            rules={[{ required: true, message: '请选择品牌' }]}
          />
          <FormSelect
            label='类型'
            name='shopCategory'
            options={shopCategoryOptions}
            config={{
              fieldNames: { label: 'name', value: 'id' },
            }}
            rules={[{ required: true, message: '请选择类型' }]}
          />
          <FormSelect
            label='关联审批流程'
            name='approvalFlowId'
            options={flowOptions}
            config={{
              fieldNames: { label: 'name', value: 'id' },
            }}
          />
          <V2FormRadio
            label='直接提交审批'
            name='supportDirectApproval'
            options={[
              { label: '支持', value: 1 },
              { label: '不支持', value: 2 },
            ]}
          />
          <FormTenantTemplate
            name='copyId'
            label='参考模板'
            formRef={tplRef}
            rules={[{ required: false, message: '请选择参考模板' }]}
          />
        </Form>
      </Modal>
    </>
  );
};

export default StoreTemplateOperate;
