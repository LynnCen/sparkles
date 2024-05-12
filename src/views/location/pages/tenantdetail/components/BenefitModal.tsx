import { benefitRecharge, tenantSelectionByKey } from '@/common/api/location';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormRadio from '@/common/components/Form/FormRadio';
import FormSelect from '@/common/components/Form/FormSelect';
import FormTextArea from '@/common/components/Form/FormTextArea';
import { useMethods } from '@lhb/hook';
import { Form, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';

const BenefitModal: FC<any> = ({
  visible,
  onCloseModal,
  tenantId,
  refresh
}) => {
  const [form] = Form.useForm();
  const [selection, setSelection] = useState<any>({
    rechargeType: [],
    grantType: [],
    benefitType: []
  });
  const [lock, setLock] = useState<boolean>(false);
  useEffect(() => {
    if (!visible) return;
    getSelection();
  }, [visible]);
  const {
    onOk,
    getSelection,
    onCancel
  } = useMethods({
    onOk: async () => {
      form.validateFields().then(async (values) => {
        setLock(true);
        await benefitRecharge({
          ...values,
          expiredTime: values?.expiredTime && dayjs(values?.expiredTime).format('YYYY-MM-DD'),
          tenantId
        });
        message.success('发放权益成功！');
        refresh();
        onCancel();
      }).catch(() => {
        setLock(false);
      });
    },
    getSelection: async () => {
      const res = await tenantSelectionByKey({ keys: ['rechargeType', 'grantType', 'benefitType'] });
      setSelection(res);
    },
    onCancel: () => {
      lock && setLock(false);
      onCloseModal();
      form.resetFields();
    }
  });
  return <>
    <Modal
      title='发放权益'
      onCancel={onCancel}
      open={visible}
      confirmLoading={lock}
      onOk={onOk}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form} >
        <FormSelect
          rules={[{ required: true, message: '请选择权益类型' }]}
          config={{
            fieldNames: {
              label: 'name',
              value: 'id'
            }
          }}
          label='权益类型'
          name='benefitType'
          options={selection.benefitType}
          allowClear />
        <FormSelect
          rules={[{ required: true, message: '请选择发放类型' }]}
          config={{
            fieldNames: {
              label: 'name',
              value: 'id'
            }
          }}
          label='发放类型'
          name='rechargeType'
          options={selection.rechargeType}
          allowClear />
        <FormInputNumber
          rules={[{ required: true, message: '请填写发放数量' }]}
          label='发放数量'
          name='rechargeValue'
          min={1}
          precision={0}
          max={999999999}
          config={{
            style: { width: '100%' }
          }}
        />
        <FormRadio
          rules={[{ required: true, message: '请选择发放原因' }]}
          label='发放原因'
          name='grantType'
          options={selection.grantType?.map(item => {
            return {
              value: item.id,
              label: item.name
            };
          })}
        />
        <FormDatePicker
          rules={[{ required: true, message: '请选择有效期' }]}
          label='有效期截止至'
          name='expiredTime'
          config={{
            picker: 'date',
            style: { width: '100%' },
            disabledDate: (current) => current && current < dayjs().subtract(1, 'days')
          }}
        />
        <FormTextArea
          rules={[{ required: true, message: '请填写备注' }]}
          label='备注'
          name='rechargeRemark'
          maxLength={200}
        />
      </Form>
    </Modal>
  </>;
};

export default BenefitModal;
