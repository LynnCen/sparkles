/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑租户 */
import React, { useEffect } from 'react';
import { Modal, Form, message, Row, Col } from 'antd';

import { MOBILE_REG } from '@lhb/regexp';
import { contrast, isObject } from '@lhb/func';
import { get, post } from '@/common/request';

import { OperateTenantProps, ModalStatus } from '../../ts-config';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';

const OperateTenant: React.FC<OperateTenantProps> = ({ operateTenant, onClose, onOk }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (operateTenant.visible) {
      (async () => {
        const record: any = operateTenant.record;
        if (record.id) {
          const tenantResult = await get('/tenant/detail', { id: record.id }, {
            proxyApi: '/mirage',
            needHint: true
          });

          let licenses = contrast(tenantResult, 'licenses', []);
          licenses = licenses.map((item) => {
            return isObject(item) ? item : { url: item, status: 'done' };
          });

          const { logo } = tenantResult || { };

          const result: any = {
            ...tenantResult,
            // fix： 修复antd回显数据的bug
            logo: logo ? [{ url: logo, status: 'done' }] : [],
            licenses: licenses, // 营业执照
            enterprise: contrast(tenantResult, 'enterprise'), // 企业名称
            regNum: contrast(tenantResult, 'regNum'), // 组织机构代码
            name: contrast(tenantResult, 'name'), // 租户简称
            connector: contrast(tenantResult, 'connector'), // 联系人姓名
            connectorMobile: contrast(tenantResult, 'connectorMobile'), // 联系人手机号
          };
          form.setFieldsValue({ ...result });
        }
      })();
    } else {
      form.resetFields();
    }
  }, [operateTenant.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const { logo } = values;
      console.log(logo, '555');
      // https://yapi.lanhanba.com/project/289/interface/api/33084
      let url = '/tenant/update'; // 编辑
      if (operateTenant.type === ModalStatus.ADD) {
        // 创建-https://yapi.lanhanba.com/project/289/interface/api/33083
        url = '/tenant/create';
      }
      const params = {
        ...values,
        licenses:
          (Array.isArray(values.licenses) &&
            values.licenses.length &&
            values.licenses.map((item) => {
              return item.url;
            })) ||
          [],
        logo: logo && logo[0] ? logo[0].url : '',
        ...(operateTenant?.record?.id && { id: operateTenant.record.id }),
      };
      post(url, params, {
        needHint: true,
        proxyApi: '/mirage'
      }).then(() => {
        message.success(`租户${operateTenant?.record?.id ? '编辑' : '新建'}成功`);
        onCancel();
        onOk();
      });
    });
  };

  // 关闭
  const onCancel = () => {
    onClose({ ...operateTenant, visible: false });
  };

  return (
    <Modal
      title={operateTenant.type === ModalStatus.ADD ? '新增租户' : '编辑租户'}
      open={operateTenant.visible}
      onOk={onSubmit}
      width={640}
      getContainer={false}
      onCancel={onCancel}
      forceRender
    >
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput
              label='租户名称'
              name='name'
              required
              maxLength={20}
            />
            <V2FormUpload
              label='企业logo'
              name='logo'
              config={{
                maxCount: 1,
                size: 10
              }}
              uploadType='image' />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='联系人姓名'
              name='connector'
              required
              maxLength={20}
            />
            <V2FormInput
              label='联系人手机号'
              name='connectorMobile'
              rules={[
                { required: true, message: '请输入联系人手机号' },
                { pattern: MOBILE_REG, message: '手机号格式错误' },
              ]}
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default OperateTenant;
