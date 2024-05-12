/**
 * @Description  子表单的属性配置
 * 因为重复引用一个弹窗，有较多问题，重新搞一个
 */
import FormInput from '@/common/components/Form/FormInput';
import { useMethods } from '@lhb/hook';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';
import { SubFormPropertyConfigModalProps } from '../../../ts-config';
import DynamicControl from '../DynamicControl';
import V2FormSwitch from '@/common/components/Form/V2FormSwitch/V2FormSwitch';
import { isNotEmptyAny } from '@lhb/func';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};


const SubFormPropertyConfigModal: React.FC<SubFormPropertyConfigModalProps> = ({
  subFormPropertyConfigModalInfo,
  setSubFormPropertyConfigModalInfo,
  onSuccessCb = () => { }
}) => {

  const { templateRestriction, controlType } = subFormPropertyConfigModalInfo;
  const [form] = Form.useForm();

  const { onCancel, onOk } = useMethods({
    onCancel() {
      setSubFormPropertyConfigModalInfo({ ...subFormPropertyConfigModalInfo, visible: false });
    },
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          ...subFormPropertyConfigModalInfo,
          ...values,
          required: Number(values.required) ? 1 : 2,
          duplicate: Number(values.duplicate) ? 1 : 2,
          // h5CustomerDisplay: Number(values.h5CustomerDisplay) ? 1 : 2,
          templateRestriction: JSON.stringify(values.templateRestriction),
        };
        delete params.visible;
        delete params.permissions;

        onSuccessCb(params)

      });
    },
  });


  useEffect(() => {
    if (subFormPropertyConfigModalInfo.visible) {
      form.setFieldsValue({
        ...subFormPropertyConfigModalInfo,
        required: Number(subFormPropertyConfigModalInfo.required) === 1,
        duplicate: Number(subFormPropertyConfigModalInfo.duplicate) === 1,
        // h5CustomerDisplay: Number(subFormPropertyConfigModalInfo.h5CustomerDisplay) === 1,
      });

      if (isNotEmptyAny(templateRestriction)) {
        let tmpRestrictionObj = null;
        try {
          tmpRestrictionObj = JSON.parse(templateRestriction)
        } catch (error) {
          tmpRestrictionObj = templateRestriction
        }
        form.setFieldsValue({ templateRestriction: tmpRestrictionObj }); // 限制属性字段编辑回显
      }
    } else {
      form.resetFields();
    }

  }, [subFormPropertyConfigModalInfo.visible]);

  return (
    <Modal title='修改属性配置' open={subFormPropertyConfigModalInfo.visible} onOk={onOk} onCancel={onCancel} destroyOnClose>
      <Form {...layout} form={form}>
        <FormInput
          label='属性名称'
          name='name'
          config={{
            disabled: true
          }}
          rules={[{ required: true, message: '请输入属性名称' }]}
          maxLength={20}
        />
        <FormInput
          label='属性别名'
          name='anotherName'
          maxLength={20}
        />
        <V2FormSwitch
          label="是否必填"
          name="required"
          defaultChecked
        />
        <V2FormSwitch
          label="是否去重"
          name="duplicate"
          defaultChecked
        />
        {/* <V2FormSwitch
          label="是否展示给客户"
          name="h5CustomerDisplay"
          defaultChecked={false}
        /> */}
        <DynamicControl controlType={controlType} />
      </Form>
    </Modal>
  );
};
export default SubFormPropertyConfigModal;
