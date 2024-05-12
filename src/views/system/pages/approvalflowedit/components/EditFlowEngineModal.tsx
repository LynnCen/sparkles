/**
 * @Description 新增/编辑工作流模版弹窗
 */

import { FC, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Modal, Row } from 'antd';
import { useMethods } from '@lhb/hook';
// import { debounce } from '@lhb/func';
import { v4 } from 'uuid'; // 用来生成不重复的key
import { editApprovalFlowTemplate } from '@/common/api/approvalflow';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

const EditFlowEngineModal: FC<any> = ({
  form,
  modalData,
  setModalData,
}) => {
  const navigate = useNavigate();
  const lockRef = useRef(false);

  const methods = useMethods({
    closeModal() {
      setModalData({
        ...modalData,
        visible: false
      });
      form.resetFields();
    },
    handleOk() {
      form.validateFields().then((values:any) => {
        if (lockRef.current) return;
        lockRef.current = true;
        const params = {
          code: v4().substring(0, 8), // 截取8位
          ...modalData.data,
          name: values.name,
        };
        editApprovalFlowTemplate(params).then(() => {
          methods.closeModal();
          navigate(-1);
        }).finally(() => {
          lockRef.current = false;
        });
      });
    }
  });


  return (
    <Modal
      title='编辑模板'
      open={modalData.visible}
      onOk={methods.handleOk}
      onCancel={() => methods.closeModal()}>
      <V2Form form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <V2FormInput
              required
              label='名称'
              name='name' />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='编码'
              placeholder='编码系统自动生成'
              name='code'
              disabled/>
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};


export default EditFlowEngineModal;


