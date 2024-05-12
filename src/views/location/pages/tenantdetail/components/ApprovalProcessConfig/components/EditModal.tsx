/**
 * @Description 编辑流程弹窗
 */

import { getApprovalFlowOptions, saveApprovalProceeTemplate } from '@/common/api/location';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormSwitch from '@/common/components/Form/V2FormSwitch/V2FormSwitch';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { showInvalidFieldMsg } from '@/common/utils/ways';
import { Form, Modal } from 'antd';
import { FC, useEffect, useState } from 'react';

interface Props {
  // 在这里定义组件的属性（props）
  // 例如：title: string;
  tenantId: string|number;
  showModal: boolean;
  record;
  setShowModal: Function;
  refresh:Function;
}

const EditModal: FC<Props> = ({
  showModal,
  setShowModal,
  record,
  tenantId,
  refresh,
}) => {
  const [form] = Form.useForm();
  const [flowOptions, setFlowOptions] = useState<any>();
  const [isFlowRequired, setIsFlowRequired] = useState<boolean>(true);// 是否必须关联流程

  useEffect(() => {
    if (showModal) {
      const { name, aliaName, approvalFlowId, enable, typeValue } = record;
      form.setFieldsValue({ name, aliaName, approvalFlowId, enable: !!enable });
      loadApprovalFlowOptions();

      // 合同、交房、开店、闭店时，目前可以不关联流程，其他类型时必填
      setIsFlowRequired(![11, 12, 13, 14].includes(typeValue));
    }
  }, [showModal]);


  /**
   * @description 获取审批流下拉选项
   */
  const loadApprovalFlowOptions = async () => {
    const params = { page: 1, size: 100, tenantId };
    const { objectList } = await getApprovalFlowOptions(params);
    setFlowOptions(objectList || []);
  };

  /**
   * @description 提交更改
   */
  const onSubmit = async () => {
    form.validateFields().then((values) => {
      const params = {
        tenantId,
        ...record,
        ...values,
        enable: Number(values.enable)
      };
      saveApprovalProceeTemplate(params).then(() => {
        form.resetFields();
        setShowModal(false);
        refresh();
      });
    }).catch((err) => {
      if (err && Array.isArray(err.errorFields) && err.errorFields.length && err.errorFields[0].errors) {
        showInvalidFieldMsg(err.errorFields, 1);
      }
    }); ;
  };

  const onCancel = () => {
    form.resetFields();
    setShowModal(false);
  };

  // 在这里编写组件的逻辑和渲染
  return (
    <div>
      <Modal
        title={'编辑流程'}
        open={showModal}
        onCancel={onCancel}
        onOk={onSubmit}
        destroyOnClose={true}
        width={400}
      >
        <V2Form
          layout='horizontal'
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          form={form}
        >
          <V2FormInput disabled label='流程名称' name='name'/>
          <V2FormInput required label='流程别名' name='aliaName' />
          <V2FormSwitch required label='是否启用' name='enable' />
          <V2FormSelect required={isFlowRequired} label='关联审批流' name='approvalFlowId' options={flowOptions}
            config={{
              fieldNames: { label: 'name', value: 'id' },
            }} />
          <V2FormTextArea required label='修改原因' name='reason'
            maxLength={50}
            config={{
              showCount: true }}/>
        </V2Form>
      </Modal>
      {/* 在这里放置你的组件内容 */}
    </div>
  );
};

export default EditModal;
