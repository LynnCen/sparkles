/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑角色 */
import { FC, useEffect } from 'react';
import { Modal, Form, Row, Col } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { post } from '@/common/request';
import { RoleModalProps, OperateRoleParams } from '../../ts-config';

const RoleOperate: FC<RoleModalProps> = ({ operateRole, setOperateRole, onSearch }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (operateRole.visible) {
      if (operateRole.id) {
        form.setFieldsValue({ ...operateRole });
      } else {
        form.resetFields();
      }
    }
  }, [operateRole.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: OperateRoleParams) => {
      // 修改-http://yapi.lanhanba.com/project/289/interface/api/33078
      // 创建-http://yapi.lanhanba.com/project/289/interface/api/33077
      const url = operateRole.id ? '/role/update' : '/role/create';
      const params = {
        ...values,
        ...(operateRole.id && { id: operateRole.id }),
      };
      post(url, params, {
        needHint: true,
        proxyApi: '/mirage'
      }).then(() => {
        onCancel();
        onSearch();
      });
    });
  };

  const onCancel = () => {
    setOperateRole({ visible: false });
  };

  return (
    <>
      <Modal
        title={!operateRole.id ? '新建角色' : '编辑角色'}
        open={operateRole.visible}
        onOk={onSubmit}
        width={640}
        onCancel={onCancel}
        getContainer={false}
      >
        <V2Form form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormInput label='角色名称' name='name' required maxLength={20}/>
              <V2FormTextArea label='角色说明' name='desc' maxLength={500} config={{ showCount: true }}/>
            </Col>
            <Col span={12}>
              <V2FormInput label='角色编码' name='encode' required maxLength={20}/>
            </Col>
          </Row>
        </V2Form>
      </Modal>
    </>
  );
};

export default RoleOperate;
