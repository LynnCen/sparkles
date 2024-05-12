import { FC, useEffect, useState } from 'react';
import { Modal, Form, Radio, Space, RadioChangeEvent, message } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import FormSimilarBrand from '@/common/components/FormBusiness/FormSilimarBrand';
import { InfoCircleFilled } from '@ant-design/icons';
import { post } from '@/common/request';

const DeleteModal: FC<any> = ({
  id,
  visible,
  setVisible,
  onOK,
}) => {
  const [form] = Form.useForm();
  const [typeValue, setTypeValue] = useState<any>();

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
        message.warning('请选择删除原因');
        return;
      }
      form.validateFields().then((values) => {
        const params = {
          id,
          relateId: typeValue === 1 ? values.relateId : undefined,
          reason: typeValue === 2 ? values.reason : undefined,
        };
        post('/brand/delete', params, {
          proxyApi: '/mdata-api',
          needHint: true
        }).then(() => {
          message.success('品牌已删除');
          onOK?.();
          form.resetFields();
          setVisible?.(false);
        });
      });
    },
  });

  return (
    <Modal
      width={434}
      title='删除原因'
      open={visible}
      maskClosable={true}
      onCancel={methods.onCancel}
      onOk={methods.onSubmit}
    >
      <Form form={form} colon={false} className={styles.deleteForm}>
        <Radio.Group onChange={(e) => methods.onChangeType(e)} value={typeValue}>
          <Space align='center' style={{ marginBottom: 24 }}>
            <Radio value={1}>已有品牌</Radio>
            <FormSimilarBrand
              name='relateId'
              allowClear
              placeholder='请输入，并选择重复品牌'
              config={{
                immediateOnce: false,
                style: { width: 280 }
              }}
              formItemConfig={{
                style: { marginBottom: 0 }
              }}
              rules={[{ required: typeValue === 1, message: '请选择一个已有品牌' }]}
              changeHandle={methods.onChangeBrand}
            />
          </Space>
          { typeValue === 1 && (
            <div className={styles.deleteTips}>
              <InfoCircleFilled />
              <span>当前删除品牌中的联系人、门店图片、附件及其他字段值会新增到原有品牌，请核验准确后删除</span>
            </div>
          ) }
          <Space align='center'>
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
              }}
              formItemConfig={{
                style: { marginBottom: 0 }
              }}
            />
          </Space>
        </Radio.Group>
      </Form>
    </Modal>
  );
};

export default DeleteModal;
