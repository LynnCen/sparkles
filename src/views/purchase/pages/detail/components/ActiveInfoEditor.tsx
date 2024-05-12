// 基本信息
import { FC, useEffect, useRef, useState } from 'react';
import { deepCopy, getKeysFromObjectArray } from '@lhb/func';
import { postPurchaseOrderUpdate } from '@/common/api/purchase';
import styles from '../entry.module.less';
import { Col, Row, Typography, Form, Button, message } from 'antd';
// import { Description, PageContainer } from '@/common/components';
import FormInput from 'src/common/components/Form/FormInput';
import FormResourceBrand from 'src/common/components/FormBusiness/FormResourceBrand';

const layout = {
  // labelCol: { span: 6 },
  // wrapperCol: { span: 16 },
};

interface ActiveInfoEditorProps {
  id: number, // 采购单id
  title: string, // 活动名称
  brands: Array<any>, // 品牌数组
  complete?: Function, // 保存后的回调函数
}

const Component:FC<ActiveInfoEditorProps> = ({ id, title, brands, complete }) => {

  const [form] = Form.useForm();
  const [requesting, setRequesting] = useState(false);

  const brandRef: any = useRef();

  useEffect(() => {
    form.setFieldsValue({ title, brandIds: getKeysFromObjectArray(brands, 'id') });
    // 品牌联想输入框回填
    brandRef.current.setOptions(brands);
  }, [title, brands]);

  // 确定
  const confirm = () => {
    form.validateFields().then((values) => {
      const params = Object.assign({ id }, deepCopy(values));
      console.log('params', params);
      setRequesting(true);
      postPurchaseOrderUpdate(params).then(() => {
        // dispatchNavigate('/purchase');
        message.success('编辑保存成功');
        complete && complete();
      }).finally(() => {
        setRequesting(false);
      });
    });
  };

  return (
    <>
      <Typography.Title level={5}>活动信息</Typography.Title>
      <Form {...layout} labelAlign='left' form={form} colon={true} className={styles['active-info-editor-form']} >
        <Row gutter={20}>
          <Col span={12}>
            <FormInput
              label='活动名称'
              name='title'
              maxLength={50}
              allowClear
              rules={[{ required: true, whitespace: true, message: '请输入活动名称' }]}
              placeholder='请输入活动名称'
            />
          </Col>
          <Col span={12}>
            <FormResourceBrand
              name='brandIds'
              label='品牌'
              formRef={brandRef}
              config={{
                mode: 'multiple',
                immediateOnce: false // 编辑时并且有选此数据时，不再立刻触发查询
              }}
              rules={[{ required: true, message: '请选择品牌' }]}
            />
          </Col>
        </Row>
        <div className={styles['btn-wrapper']}>
          <Button type='primary' disabled={requesting} onClick={confirm}>确定</Button>
        </div>
      </Form>

    </>);
};

export default Component;
