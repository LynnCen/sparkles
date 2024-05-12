import { FC, useEffect, useState } from 'react';
import { Modal, Form, Radio, Space, RadioChangeEvent, message, Row } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { brandReviewReject } from '@/common/api/brand-center';
import FormSimilarBrand from '@/common/components/FormBusiness/FormSilimarBrand';
import { InfoCircleFilled } from '@ant-design/icons';

const RejectModal: FC<any> = ({
  reviewId,
  visible,
  setVisible,
  onOK,
}) => {
  const [form] = Form.useForm();
  const [typeValue, setTypeValue] = useState<any>();
  const brandId = Form.useWatch('brandId', form);

  useEffect(() => {
    if (visible) {
      setTypeValue(undefined);
    }
  }, [visible]);

  const methods = useMethods({
    onChangeType(e: RadioChangeEvent) {
      setTypeValue(e.target.value);
    },

    onChangeBrand(val) {
      if (val && typeValue !== 1) {
        setTypeValue(1);
      }
    },

    onCancel() {
      form.resetFields();
      setVisible?.(false);
    },

    onSubmit() {
      if (!typeValue) {
        message.warning('请选择拒绝原因');
        return;
      }
      form.validateFields().then((values) => {
        const params = {
          reviewId,
          brandId: typeValue === 1 ? values.brandId : undefined,
          reason: typeValue === 2 ? values.reason : undefined,
        };
        brandReviewReject(params).then(() => {
          message.success('审核拒绝');
          onOK?.();
          form.resetFields();
          setVisible?.(false);
        });
      });
    },
  });


  const rejectTips = () => {
    if (brandId) {
      return <div className={styles.rejectTips}>
        <InfoCircleFilled />
        <span>当前审批品牌中的联系人、门店图片、附件及其他字段值会新增到原有品牌，请核验准确后审批</span>

      </div>;
    }

    return null;
  };


  return (
    <Modal
      width={434}
      title='拒绝原因'
      open={visible}
      maskClosable={true}
      onCancel={methods.onCancel}
      onOk={methods.onSubmit}
    >
      <Form form={form} colon={false} className={styles.rejectForm}>
        <Radio.Group onChange={(e) => methods.onChangeType(e)} value={typeValue}>
          <Space direction='vertical'>
            <Row>
              <Radio value={1}>已有品牌</Radio>
              <FormSimilarBrand
                name='brandId'
                allowClear
                placeholder='请输入，并选择重复品牌'
                config={{
                  immediateOnce: false,
                  style: { width: 280 }
                }}
                rules={[{ required: typeValue === 1, message: '请选择一个已有品牌' }]}
                changeHandle={methods.onChangeBrand}
              />
            </Row>
            {rejectTips()}
            <Row>
              <Radio value={2}>无效品牌</Radio>
              <FormInput
                name='reason'
                placeholder='请输入原因'
                allowClear
                rules={[
                  { required: typeValue === 2, message: '请输入原因' },
                ]}
                maxLength={50}
                config={{
                  style: { width: 280 }
                }}/>
            </Row>
          </Space>
        </Radio.Group>
      </Form>
    </Modal>
  );
};

export default RejectModal;
