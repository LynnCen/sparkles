import { FC } from 'react';
import styles from './entry.module.less';
import {
  Form,
  Row,
  Col
} from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';

const Comtest: FC<any> = () => {
  const [form] = Form.useForm();

  const validateUploadFileHandle = (file: any) => {
    return new Promise<string | boolean>((resolve) => {
      const { name } = file;
      resolve(/\s/.test(name) ? '文件名不能包含空格' : false);
    });
  };

  return (
    <div className={styles.container}>
      <div className='fs-30 bold'>
        表单相关组件
      </div>
      <V2Form
        form={form}>
        <Row className='mt-20'>
          <Col span={8}>
            <V2FormUpload
              label='测试上传时的自定义校验'
              name='paymentVoucher'
              uploadType='file'
              config={{
                size: 100,
                maxCount: 5,
                fileType: ['jpeg', 'png', 'jpg', 'bmp', 'ppt', 'pptx', 'pdf']
              }}
              extraVerified={validateUploadFileHandle}
            />
          </Col>
          <Col span={12}>
          </Col>
        </Row>
      </V2Form>
    </div>
  );
};

export default Comtest;
