import { FC } from 'react';
import { Modal, Form, message } from 'antd';
import FormUpload from '@/common/components/Form/FormUpload';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { post } from '@/common/request';
// import Upload from '@/common/components/Business/Templete/Upload';

interface IProps {
  visible: boolean;
  onCloseModal: () => void;
  onOkExport: () => void;
}

const ExportReview: FC<IProps> = ({ visible, onCloseModal, onOkExport }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then(async (values) => {
      // https://yapi.lanhanba.com/project/329/interface/api/34253
      await post('/checkSpot/review/import', { url: values.url[0].url }, {
        proxyApi: '/terra-api',
        needHint: true
      });
      message.success('导入成功');
      onCancel();
      onOkExport();
    });
  };

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  return (
    <>
      <Modal title='导入复核结果' open={visible} onOk={onOk} onCancel={onCancel}>
        <p className='fn-16 mb-10'>请选择要导入的文件：</p>
        <Form form={form}>
          <FormUpload
            name='url'
            valuePropName='fileList'
            rules={[{ required: true, message: '请导入复核结果' }]}
            config={{
              listType: 'picture-card',
              maxCount: 1,
              size: 3,
              qiniuParams: {
                domain: bucketMappingDomain['linhuiba-file'],
                bucket: Bucket.File,
              },
              showSuccessMessage: false,
              fileType: ['xlsx', 'xls'],
            }}
          >
          </FormUpload>
        </Form>
      </Modal>
    </>
  );
};

export default ExportReview;
