/**
 * @Description 驳回到任意节点弹窗
 */

import { FC, useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'antd';
import { rebutApproval } from '@/common/api/expandStore/approveworkbench';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import Main from './components/Main';

const Rebuttal: FC<any> = ({
  modalData, // 弹窗数据
  close,
  success,
}) => {
  const { open, data } = modalData;
  const [form] = Form.useForm();
  const lockRef: any = useRef(false); // 锁
  const [refreshNodesFlag, setRefreshNodesFlag] = useState<number>(0);

  useEffect(() => {
    // 每次打开弹窗时触发请求
    modalData?.open && setRefreshNodesFlag(state => ++state);
  }, [modalData]);

  // 关闭弹窗
  const onCancel = () => {
    close && close();
    form.resetFields();
  };
  // 确定
  const submitHandle = () => {
    form.validateFields().then((values) => {
      if (lockRef.current) return;
      lockRef.current = true;
      const params = {
        ...values,
        // 接口要求传boolean值
        nodeSkip: values.nodeSkip === 2, // 2 直接到当前节点 1 按审批流依次审批
        ...data
      };

      rebutApproval(params).then(() => {
        V2Message.success('驳回成功');
        success && success();
        onCancel();
      }).finally(() => {
        lockRef.current = false;
      });
    });
  };

  return (
    <Modal
      title='驳回'
      open={open}
      width={648}
      onCancel={onCancel}
      onOk={submitHandle}
    >
      <Main
        form={form}
        id={data?.id}
        refreshNodesFlag={refreshNodesFlag}
      />
    </Modal>
  );
};

export default Rebuttal;
