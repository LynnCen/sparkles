/**
 * @Description 加签弹窗
 */
import { FC, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import styles from '../../../entry.module.less';
import { userList } from '@/common/api/brief';
interface ApprovalDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSubmit?: (reason: any) => void; // 提交
}
// 加签方式 1:在我之前 2:在我之后
const typeOptions = [
  { label: '在我之前', value: 1 },
  { label: '在我之后', value: 2 },
];
const ApprovalDialog: FC<ApprovalDialogProps> = ({
  visible,
  setVisible,
  // event,
  onSubmit,
}) => {

  const [form] = Form.useForm();
  const [options, setOptions] = useState<any>([]);

  const methods = useMethods({
    handleCancel() {
      form.resetFields();
      setVisible(false);
    },
    handleOk() {
      form.validateFields().then(async (values: any) => {
        setVisible(false);
        onSubmit && onSubmit({
          remark: values?.remark,
          approver: values.approver,
          type: values.type
        });
        form.resetFields();
      });
    }
  });
  const getUserList = async() => {
    const data = await userList();
    const res = data.objectList.map((item) => {
      return {
        label: `${item.name || null}-${item.mobile || null}`,
        value: item.id,
      };
    });
    setOptions(res);
  };
  useEffect(() => {
    if (visible) {
      getUserList();
    }
  }, [visible]);
  return (
    <Modal
      title='加签'
      open={visible}
      destroyOnClose={true}
      width={648}
      onCancel={methods.handleCancel}
      onOk={methods.handleOk}>
      <V2Form form={form}>
        <V2FormSelect
          config={{ mode: 'multiple', optionFilterProp: 'label' }}
          required name='approver' label='加签审批人' options={options}
          className={styles.popupClassName}
        />
        <V2FormRadio form={form} required label='加签方式' name='type' options={typeOptions} />

        <V2FormTextArea
          label='加签意见'
          name='remark'
          maxLength={50}
          placeholder='请输入加签意见，最多输入50字'
        />
      </V2Form>
    </Modal>
  );
};
export default ApprovalDialog;
