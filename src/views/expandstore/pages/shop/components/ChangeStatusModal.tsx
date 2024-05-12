/**
 * @Description 变更状态弹框
 */
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { shopStatusList, updateShopStatus } from '@/common/api/expandStore/shop';
import { isArray, refactorSelection } from '@lhb/func';
import dayjs from 'dayjs';
import styles from './index.module.less';
import { StoreStatus } from '@/common/components/business/ExpandStore/ts-config';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const ChangeStatusModal: React.FC<any> = ({
  visible,
  setVisible,
  record,
  onRefresh,
}) => {
  const [form] = Form.useForm();
  const [statuses, setStatuses] = useState<any[]>([]);
  const [isLock, setIsLock] = useState<boolean>(false);
  const status = Form.useWatch('status', form);

  useEffect(() => {
    if (visible) {
      form.setFieldValue('currentStatus', record.statusName || '-');
      getSelection();
    } else {
      form.resetFields();
    }
  }, [visible]);

  /**
   * @description 获取下拉选项（与当前门店状态相关）
   */
  const getSelection = async () => {
    const data = await shopStatusList({ id: record.id });
    isArray(data) && setStatuses(refactorSelection(data));
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onSuccess = () => {
    V2Message.success('变更成功');
    setVisible(false);
    onRefresh && onRefresh();
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      if (isLock) return;
      setIsLock(true);

      // 日期参数处理
      const houseDeliveryDate = values.houseDeliveryDate ? dayjs(values.houseDeliveryDate).format('YYYY-MM-DD') : undefined;
      const openDate = values.openDate ? dayjs(values.openDate).format('YYYY-MM-DD') : undefined;
      const closeDate = values.closeDate ? dayjs(values.closeDate).format('YYYY-MM-DD') : undefined;

      const params = {
        id: record.id,
        status: values.status,
        houseDeliveryDate,
        openDate,
        closeDate,
        closeReason: values.closeReason || undefined,
      };
      updateShopStatus(params).then(() => {
        onSuccess();
      }).finally(() => {
        setIsLock(false);
      });
    });
  };

  return (
    <Modal title='变更状态' open={visible} width={480} onOk={onSubmit} onCancel={onCancel} className={styles.changeStatus}>
      <Form {...layout} form={form}>
        <V2FormInput
          label='当前状态'
          name='currentStatus'
          disabled
        />
        <V2FormSelect
          label='变更状态'
          name='status'
          options={statuses}
          required/>
        { status === StoreStatus.HouseDelivered ? <V2FormDatePicker
          label='交房日期'
          name='houseDeliveryDate'
          required/> : <></>}
        { status === StoreStatus.Opened ? <V2FormDatePicker
          label='开业日期'
          name='openDate'
          required/> : <></>}
        { status === StoreStatus.Closed ? <>
          <V2FormDatePicker
            label='闭店时间'
            name='closeDate'
            required/>
          <V2FormTextArea label='闭店原因' name='closeReason' maxLength={500}/>
        </> : <></>}
      </Form>
    </Modal>
  );
};

export default ChangeStatusModal;
