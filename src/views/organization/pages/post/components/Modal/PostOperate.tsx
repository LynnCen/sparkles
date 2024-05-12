/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑岗位 */
import { FC, useEffect } from 'react';
import { Modal, Form, message, Row, Col } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { post } from '@/common/request';
import { PostModalProps } from '../../ts-config';

const DepartmentInfo: FC<PostModalProps> = ({ setOperatePost, operatePost, onSearch }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (operatePost.visible) {
      if (operatePost.id) {
        form.setFieldsValue({ ...operatePost });
      } else {
        form.resetFields();
      }
    }
  }, [operatePost.visible]);

  // 确定
  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 修改-http://yapi.lanhanba.com/project/289/interface/api/33072
      // 创建-http://yapi.lanhanba.com/project/289/interface/api/33071
      const url = operatePost.id ? '/position/update' : '/position/create';
      const params = {
        ...values,
        ...(operatePost.id && { id: operatePost.id }),
      };
      post(url, params, {
        needHint: true,
        proxyApi: '/mirage'
      }).then(() => {
        message.success(`${operatePost.id ? '编辑' : '新建'}岗位成功`);
        onCancel();
        onSearch();
      });
    });
  };

  const onCancel = () => {
    setOperatePost({ visible: false });
  };

  return (
    <>
      <Modal
        title={!operatePost.id ? '新建岗位' : '编辑岗位'}
        open={operatePost.visible}
        onOk={onSubmit}
        width={640}
        onCancel={onCancel}
        getContainer={false}
      >
        <V2Form form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <V2FormInput label='岗位名称' name='name' required maxLength={50}/>
              <V2FormTextArea label='岗位说明' name='desc' maxLength={500} config={{ showCount: true }}/>
            </Col>
            <Col span={12}>
              <V2FormInput label='岗位编码' name='encode' required maxLength={50}/>
            </Col>
          </Row>
        </V2Form>
      </Modal>
    </>
  );
};

export default DepartmentInfo;
