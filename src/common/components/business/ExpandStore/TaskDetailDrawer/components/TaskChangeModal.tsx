/**
 * @Description 开发异动弹框
 */
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { createApproval } from '@/common/api/expandStore/approveworkbench';
import { isArray } from '@lhb/func';
import styles from '../index.module.less';

const TaskChangeModal: React.FC<any> = ({
  visible,
  setVisible,
  detail,
  onRefresh,
}) => {
  const [form] = Form.useForm();
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [isLock, setIsLock] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setTypeOptions((detail && isArray(detail.buttons)) ? detail.buttons.map(itm => ({ ...itm, label: itm.name, value: itm.value })) : []);
    } else {
      form.resetFields();
    }
  }, [visible]);

  const onCancel = () => {
    setVisible(false);
  };

  const onSuccess = () => {
    V2Message.success('开发异动申请成功');
    setVisible(false);
    onRefresh && onRefresh();
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 匹配选中的异动事件
      const targetEvent = typeOptions.find((itm: any) => itm.value === values.type);
      if (!targetEvent) return;

      if (isLock) return;
      setIsLock(true);

      const params = {
        id: detail.id,
        type: targetEvent.approvalType,
        typeValue: targetEvent.approvalTypeValue,
        reason: values.reason || undefined,
      };
      createApproval(params).then(() => {
        onSuccess();
      }).finally(() => {
        setIsLock(false);
      });
    });
  };

  return (
    <Modal
      title='开发异动'
      open={visible}
      width={480}
      okText='申请'
      onOk={onSubmit}
      onCancel={onCancel}
      className={styles.taskChange}>
      <Form form={form} layout='vertical'>
        <V2FormRadio
          label='异动类型'
          name='type'
          options={typeOptions}
          required
        />
        <V2FormTextArea
          label='申请理由'
          name='reason'
          maxLength={500}
          required
          config={{
            showCount: true
          }}
        />
      </Form>
    </Modal>
  );
};

export default TaskChangeModal;
