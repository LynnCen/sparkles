import { FC } from 'react';
import { Modal, Form, message } from 'antd';
import TemplateUpload from '@/common/components/Business/Templete/Upload';
import FormUpload from '@/common/components/Form/FormUpload';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { post } from '@/common/request';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { isArray } from '@lhb/func';

interface IProps {
  visible: boolean;
  onCloseModal: () => void;
  onOkExport: () => void;
  targetInfo: any;
}

const ImportReport: FC<IProps> = ({
  visible,
  onCloseModal,
  onOkExport,
  targetInfo
}) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then(async (values) => {
      const { url: urlArr } = values;
      let urlStr = ``;
      if (isArray(urlArr) && urlArr.length > 0) {
        const targetFile = urlArr[0] || {};
        const { url, name } = targetFile;
        urlStr = `${url}?attname=${name}`;
      }
      const params = {
        id: targetInfo.id,
        projectCode: targetInfo.projectCode,
        deliveryReportUrl: urlStr
      };
      // https://yapi.lanhanba.com/project/289/interface/api/40207
      await post('/checkSpot/project/importDeliveryReport', params, {
        proxyApi: '/blaster'
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
      <Modal title='导入交付报告' open={visible} onOk={onOk} onCancel={onCancel}>
        <p className='fn-16'>请选择要导入的文件：</p>
        <div className='color-warning mt-10 mb-10'>
          <ExclamationCircleOutlined />
          点击 “确定交付” 后将在租户端显示，务必仔细核对后上传
        </div>
        <Form form={form}>
          <FormUpload
            name='url'
            valuePropName='fileList'
            rules={[{ required: true, message: '请导入交付文件' }]}
            config={{
              listType: 'text',
              maxCount: 1,
              size: 20,
              accept: '.xlsx, .xls, .ppt, .pptx, .pdf',
              qiniuParams: {
                domain: bucketMappingDomain['linhuiba-file'],
                bucket: Bucket.File,
              },
              showSuccessMessage: false,
              fileType: ['xls', 'xlsx', 'pdf', 'pptx', 'ppt'],
            }}
          >
            <TemplateUpload text='选择文件' />
            <div className='color-bbc mt-5 fs-12'>只能上传excel、pdf、ppt文件  最多上传 1 个文件</div>
          </FormUpload>
        </Form>
      </Modal>
    </>
  );
};

export default ImportReport;
