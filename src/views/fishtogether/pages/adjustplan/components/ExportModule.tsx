import { Row, Col, Form, message } from 'antd';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import cs from 'classnames';
import styles from './index.module.less';
import TemplateFile from '@/common/components/business/Template/TemplateFile';
import TemplateUpload from '@/common/components/business/Template/Upload';
import FormUpload from '@/common/components/Form/FormUpload';
import { post } from '@/common/request';

const ExportModule: any = ({ setLoading, onSearch }) => {
  const [form] = Form.useForm();

  const upload = (url) => {
    setLoading(true);
    // https://yapi.lanhanba.com/project/497/interface/api/51498
    post(
      '/yn/franchisee/plan/import',
      { url },
      {
        isMock: false,
        mockId: 497,
        mockSuffix: '/api',
        isZeus: true,
      }
    )
      .then(() => {
        message.success('文件上传成功');
        onSearch();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangeFile = (files) => {
    if (files && files.length) {
      const { status, url } = files[0];
      if (status === 'done' && url) {
        upload(url);
      }
    }
  };

  return (
    <div className={cs(styles.exportModule, 'mt-16')}>
      <div className='fs-20 bold'>调整开店计划</div>
      <Form form={form} name='form'>
        <Row gutter={32}>
          <Col span={8}>
            <div className='mt-12'>
              第一步：请根据导入模版的格式整理需要导入的数据
              <div className={cs('mt-20', styles.mlLarger)}>
                <TemplateFile
                  url={`https://staticres.linhuiba.com/project-custom/locationpc/file/开店计划导入模板.xlsx`}
                  fileName='开店计划导入模板'
                />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='mt-12'>
              第二步：请上传要导入的文件
              <span className='fs-12 c-959 pl-12'>(只能上传xlsx、xls文件 不超过3MB 最多上传1个文件)</span>
              <div className={cs('mt-20', styles.mlLarger)}>
                {/* <div className='fs-12 c-959'>
                  只能上传xlsx、xls文件 不超过3MB 最多上传1个文件
                </div> */}
                <FormUpload
                  label=''
                  name='url'
                  valuePropName='fileList'
                  config={{
                    listType: 'text',
                    maxCount: 1,
                    onChange: onChangeFile,
                    size: 3,
                    accept: '.xlsx, .xls',
                    qiniuParams: {
                      domain: bucketMappingDomain['linhuiba-file'],
                      bucket: Bucket.File,
                    },
                    fileType: ['vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.ms-excel'],
                    showSuccessMessage: false,
                  }}
                >
                  <TemplateUpload text='上传文件' />
                </FormUpload>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ExportModule;
