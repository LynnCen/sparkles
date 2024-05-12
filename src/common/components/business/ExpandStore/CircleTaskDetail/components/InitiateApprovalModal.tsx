import { FC, useRef } from 'react';
import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Form from '@/common/components/Form/V2Form';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { contractApply, createApproval } from '@/common/api/expandStore/approveworkbench'; // 提交审批
import { ApprovalType, ApprovalTypeValue } from '@/common/components/business/ExpandStore/ts-config';

interface Props {
	approvalModal;
	setApprovalModal;
  refresh
}

const InitiateApprovalModal: FC<Props> = ({
  approvalModal,
  setApprovalModal,
  refresh
}) => {
  const [form] = Form.useForm(); // 表单参数
  const isLockRef = useRef<boolean>(false);
  const methods = useMethods({
    /** 提交审批 */
    onOk() {
      form
        .validateFields()
        .then(async (values: any) => {
          if (isLockRef.current) return;
          const { id, type, typeValue } = approvalModal;

          const isContractType = (type === ApprovalType.Contract && typeValue === ApprovalTypeValue.Contract); // 是否合同申请，发起合同时目前暂时会做特殊处理，不走审批流程
          const api = isContractType ? contractApply : createApproval;
          isLockRef.current = true;
          await api({
            id,
            type,
            typeValue,
            reason: values.reason,
          });
        })
        .then(() => {
          V2Message.success('提交审批成功');
          form.resetFields();
          setApprovalModal({
            show: false,
            id: undefined,
            type: undefined,
            typeValue: undefined,
          });
          refresh();
        })
        .catch((error) => {
          console.error('提交审批失败:', error);
        })
        .finally(() => {
          isLockRef.current = false;
        });
    },

    /** 点击取消 */
    onCancel() {
      form.resetFields();
      setApprovalModal({
        show: false,
        id: undefined,
        type: undefined,
        typeValue: undefined,
      });
    },
  });
  return (
    <>
      <Modal
        title='提交审批'
        open={approvalModal.show}
        onOk={methods.onOk}
        // 两列弹窗要求336px
        width={336}
        onCancel={methods.onCancel}
        forceRender
      >
        <V2Form form={form}>
          <V2FormTextArea
            required
            maxLength={500}
            label='发起理由'
            name='reason'
            config={{ showCount: true }}
          />
        </V2Form>
      </Modal>
    </>
  );
};
export default InitiateApprovalModal;
