/**
 * @Description
 */
import { FC, useEffect } from 'react';

import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import Modal from '@/common/components/Modal/Modal';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import { Form } from 'antd';
import { useMethods } from '@lhb/hook';
import { postCheckSpotDeviceSave } from '@/common/api/flow';
import { devicesEnableOptions } from '../entry';
import dayjs from 'dayjs';

interface EditModalProps {
  modalData: {
    visible: boolean;
    data:any;
    id: number;
  },
  setModalData: (data:any) => void
  successCb: (values:any) => void
};


const EditModal:FC<EditModalProps> = ({
  modalData,
  setModalData,
  successCb
}) => {
  const [form] = Form.useForm();

  const methods = useMethods({
    onCancel() {
      setModalData({
        ...modalData,
        visible: false
      });
    },
    onOk() {
      form.validateFields().then((values) => {
        const params = {
          ...values,
          id: modalData.id,
          purchaseDate: dayjs(values.purchaseDate).format('YYYY-MM-DD')
        };
        postCheckSpotDeviceSave(params).then(() => {
          successCb({});
          methods.onCancel();
        });
      });
    }
  });

  useEffect(() => {
    if (modalData.visible) {
      form.setFieldsValue({
        ...(modalData.data),
        purchaseDate: dayjs(modalData.data.purchaseDate),
      });
    } else {
      form.resetFields();
    }

  }, [modalData.visible]);

  return <>
    <Modal
      title='编辑设备'
      open={modalData.visible}
      onOk={methods.onOk}
      // 两列弹窗要求336px
      width={336}
      onCancel={methods.onCancel}
      forceRender
    >
      <V2Form form={form}>
        <V2FormInput
          disabled
          label='设备源码'
          name='sourceCode' />
        <V2FormInput
          disabled
          label='location加密码'
          name='encryptCode' />
        <V2FormInput
          disabled
          label='location设备码'
          name='serialNum' />
        <V2FormDatePicker
          required
          label='采购日期'
          name='purchaseDate' />
        <V2FormSelect
          required
          label='是否可用'
          name='enable'
          options={devicesEnableOptions} />
      </V2Form>

    </Modal>
  </>;
};

export default EditModal;
