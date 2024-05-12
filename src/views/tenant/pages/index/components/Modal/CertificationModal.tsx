/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑租户 */
import React, { useEffect } from 'react';
import { Modal, Form, Image, message } from 'antd';

import FormInput from '@/common/components/Form/FormInput';
import FormUpload from '@/common/components/Form/FormUpload';

import { get, post } from '@/common/request';

import { CertificationModalProps } from '../../ts-config';
import styles from './index.module.less';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const CertificationModal: React.FC<CertificationModalProps> = ({ certification, onClose, onOk }) => {
  const [form] = Form.useForm();

  const licenses = Form.useWatch('licenses', form);
  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const params = {
        ...values,
        id: certification.id,
        licenses:
        (Array.isArray(values.licenses) &&
        values.licenses.length &&
        values.licenses.map((item) => {
          return item.url;
        })) ||
        [],
      };
      // https://yapi.lanhanba.com/project/289/interface/api/34915
      post('/tenant/certificate', params, { needHint: true, proxyApi: '/mirage' }).then(() => {
        message.success(`企业认证成功~`);
        onCancel();
        onOk();
      });
    });
  };

  // 关闭
  const onCancel = () => {
    onClose({ visible: false });
    form.resetFields();
  };

  useEffect(() => {
    licenses && licenses[0]?.status === 'done' && licenses.map(item => {
      get('/tenant/ocr', { uri: item.url }, {
        proxyApi: '/mirage',
        needHint: true
      })
        .then((res) => {
          form.setFieldsValue({
            enterprise: res.enterprise,
            regNum: res.regNum
          });
        });
    });
  }, [licenses]);
  useEffect(() => {

  }, [certification.visible]);
  return (
    <Modal
      title={'认证企业'}
      open={certification.visible}
      onOk={onSubmit}
      width={640}
      getContainer={false}
      onCancel={onCancel}
    >
      <Form className={styles.operateTenant} {...layout} form={form}>
        <Form.Item
          label='营业执照'
          help='只能上传 .png/.jpg/.jpeg/.bmp/.gif，最多1个文件，最多10M'
          className={styles.uploadWrap}
        >
          <FormUpload
            name='licenses'
            noStyle
            config={{
              maxCount: 1,
              isPreviewImage: true,
            }}
          />
          <div className={styles.uploadExample}>
            <Image width={102} src='https://cert.linhuiba.com/FkSc1YTgAi5X3FnwMAAJp6hcFYA3' />
            <p className={styles.text}>示例图</p>
          </div>
        </Form.Item>
        <FormInput
          label='企业名称'
          name='enterprise'
          rules={[{ required: true, message: '请输入企业名称' }]}
          maxLength={20}
        />
        <FormInput
          label='组织机构代码'
          name='regNum'
          rules={[{ required: true, whitespace: true }, { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '组织机构代码格式不对' }]}
          maxLength={18}
        />
      </Form>
    </Modal>
  );
};

export default CertificationModal;
