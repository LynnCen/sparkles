/**
 * @Description 品牌设置
 */
import { FC, useEffect, useRef } from 'react';
import { Modal, Form, Row, Col, message } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { surroundAttributeUpdate } from '@/common/api/location';

const SetBrandModal: FC<any> = ({
  open, // 显示弹窗
  detail,
  close, // 关闭弹窗
  update
}) => {
  const [form] = Form.useForm();
  const lockRef: any = useRef(false); // 表单锁

  useEffect(() => {
    if (open && detail) {
      const { brandStr } = detail || {};
      brandStr && (form.setFieldValue('brand', brandStr));
    }
  }, [open, detail]);

  const onSubmit = () => { // 确定
    form.validateFields().then((values: any) => {
      if (lockRef.current) return;
      lockRef.current = true;
      const { brand } = values;
      const { modelId, propertyId } = detail;
      const params: any = {
        modelId,
        relationId: propertyId,
        relationType: 2,
        data: brand || null
      };
      surroundAttributeUpdate(params).then(() => {
        message.success('设置成功');
        update && update();
        onCancel();
      }).finally(() => {
        lockRef.current = false;
      });
    });
  };
  const onCancel = () => { // 取消
    form.resetFields();
    close && close();
  };

  return (
    <Modal
      title='品牌设置'
      open={open}
      onOk={onSubmit}
      width={640}
      onCancel={onCancel}
      forceRender
    >
      <V2Form form={form}>
        <Row>
          <Col span={24}>
            <V2FormTextArea
              label='重点关注品牌'
              maxLength={1000}
              name='brand'
              config={{
                showCount: true,
                autoSize: {
                  maxRows: 12,
                  minRows: 5,
                }
              }}/>
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default SetBrandModal;
