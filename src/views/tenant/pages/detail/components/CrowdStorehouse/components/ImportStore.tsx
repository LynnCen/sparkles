import { FC } from 'react';
import { Modal, Form, Row, Col, Button } from 'antd';
import { CrowdStorehouseImportProps } from '../../../ts-config';
import { downloadFile } from '@/common/utils/ways';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { storeImport } from '@/common/api/flow';
import FormRadio from '@/common/components/Form/FormRadio';
import FormUpload from '@/common/components/Form/FormUpload';

interface FormData {
  url: Array<any>;
  type: number;
}

const ImportStore: FC<CrowdStorehouseImportProps> = ({
  visible,
  tenantId,
  loadData,
  modalHandle
}) => {
  const [form] = Form.useForm();
  const options = [
    { label: '覆盖导入', value: 1 },
    { label: '继续导入', value: 2 }
  ];
  const submitHandle = () => {
    form.validateFields().then(async (values: FormData) => {
      const { url, type } = values;
      const params = {
        url: url[0].url,
        type,
        tenantId,
      };
      await storeImport(params);
      loadData();
      modalHandle(false);
    });
  };

  const downloadHandle = () => {
    downloadFile({
      name: '门店导入模版',
      url: `https://staticres.linhuiba.com/project-custom/custom-flow/file/门店导入模版.xlsx`
    });
  };

  return (
    <Modal
      title='导入门店'
      open={visible}
      destroyOnClose={true}
      onOk={submitHandle}
      onCancel={() => modalHandle(false)}
      className='importStoreModal'>
      <Form
        form={form}
        preserve={false}
        labelCol={{ span: 4 }}
        name='form'>
        <Form.Item label='第一步'>
          <span>下载门店信息模版</span>
          <span className='pl-12 pointer color-primary' onClick={downloadHandle}>门店导入模版</span>
        </Form.Item>
        <Form.Item label='第二步' className='mt-20'>
          导入门店数据在当前企业下已存在时
        </Form.Item>
        <Row>
          <Col span={4}>
          </Col>
          <Col span={20}>
            <FormRadio
              label=''
              name='type'
              initialValue={1}
              options={options}/>
          </Col>
        </Row>
        <FormUpload
          label='第三步'
          name='url'
          rules={[
            { required: true, message: '请上传文件' }
          ]}
          formItemConfig={{
            className: 'mt-20'
          }}
          config={{
            listType: 'text',
            maxCount: 1,
            size: 3,
            accept: '.xlsx, .xls',
            qiniuParams: {
              domain: bucketMappingDomain['linhuiba-file'],
              bucket: Bucket.File,
            },
            fileType: ['xlsx', 'xls']
            // fileType: ['vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.ms-excel']
          }}>
          <Button type='primary'>点击上传</Button>
        </FormUpload>
        <Row className='mt-10'>
          <Col span={4}>
          </Col>
          <Col span={20} className='fn-12 color-help'>
            只能上传 .xls/.xlsx 文件， 不超过 50 MB， 最多上传 1 个文件
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ImportStore;
