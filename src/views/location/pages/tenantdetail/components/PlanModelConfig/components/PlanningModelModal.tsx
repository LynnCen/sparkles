/**
 * @Description 新增编辑弹框
 */
import { FC, useEffect, useMemo } from 'react';
import { Form, Modal } from 'antd';
import { post } from '@/common/request';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';


interface PlanningModelProps {
  planningModelData: PlanningModelValuesProps;
  setPlanningModelData: Function;
  onSearch: Function;
}
// 新增/编辑模型
export interface PlanningModelValuesProps {
  id?: number;
  /**
     * 名称
     */
  name?: string;
  /**
     * 租户 id
     */
  tenantId?: string|number;
  visible: boolean;
}


const PlanningModelModal: FC<PlanningModelProps> = ({
  planningModelData,
  setPlanningModelData,
  onSearch,
}) => {
  const [form] = Form.useForm();

  const modelTitle = useMemo(() => {
    return !planningModelData.id ? '新建规划模型' : '编辑规划模型';
  }, [planningModelData.id]);


  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 新增： https://yapi.lanhanba.com/project/289/interface/api/59695
      // 编辑： https://yapi.lanhanba.com/project/289/interface/api/59709
      const url = planningModelData.id ? '/tenant/data/planModel/update' : '/tenant/data/planModel/save';
      const params = planningModelData.id ? {
        ...values,
        tenantId: planningModelData.tenantId, // 不传tenantId报错
        id: planningModelData.id, // 编辑时需要传 id
      } : {
        ...values,
        tenantId: planningModelData.tenantId, // 新增时需要传 tenantId
      };
      post(url, params, { proxyApi: '/blaster' }).then(() => {
        onCancel();
        onSearch();
      });
    });
  };

  const onCancel = () => {
    setPlanningModelData({ visible: false });
  };


  useEffect(() => {
    if (planningModelData.visible) {
      if (planningModelData.id) {
        form.setFieldsValue({ ...planningModelData });
      } else {
        form.resetFields();
      }
    }
  }, [planningModelData.visible]);


  return (
    <>
      <Modal
        title={modelTitle}
        open={planningModelData.visible}
        onOk={onSubmit}
        width={336}
        onCancel={onCancel}
        getContainer={false}
      >
        <V2Form form={form}>
          <V2FormInput
            label='模型名称'
            name='modelName'
            rules={[{ required: true, message: '请输入模型名称' }]}
            maxLength={32}
          />
          <V2FormInput
            label='模型编号'
            name='modelCode'
            rules={[{ required: true, message: '请输入模型编号' }]}
            maxLength={50}
          />
        </V2Form>
      </Modal>
    </>
  );
};

export default PlanningModelModal;
