import { Col, Form, Modal, Row } from 'antd';
import { FC, useState, useEffect } from 'react';
import TemplateUpload from '@/common/components/business/Template/Upload';
import TemplateFile from '@/common/components/business/Template/TemplateFile';
import FormUpload from '@/common/components/Form/FormUpload';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import styles from './index.module.less';
import { ImportModalProps } from './ts-config';
import { isFunction } from '@lhb/func';
interface FormData {
  url: Array<any>;
}
const ImportModal: FC<ImportModalProps> = ({
  visible, // 控制上传Modal的显示
  closeHandle, // 关闭弹窗,并刷新列表
  onSuccess,
  importFile, // 上传文件接口
  title, // Modal标题
  fileName = '信息模版', // excel模版数据
  extraParams, // 接口的特殊参数
  importCheck,
  maxCount = 1,
  size = 3,
  children,
  customFunc,
  accept = '.xlsx, .xls',
  tips,
  url = null
}) => {
  const [form] = Form.useForm();
  // const [visibleHint, setVisibleHint] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(false);

  const submitHandle = () => {
    form.validateFields().then(async (values: FormData) => {
      if (isLock) return;
      setIsLock(true);
      const { url: urlArr } = values;
      const target = urlArr[0] || {};
      const { url, name } = target;
      const urlStr = `${url}?attname=${name}`;

      try {
        if (importCheck) {
          await importCheck(urlStr, form);
        }
        importFile && isFunction(importFile) && (await importFile({ url: urlStr, ...extraParams }));
      } catch (e) {
        setIsLock(false);
        return;
      }
      // babyCare demo -> 路由system/industryMap/ -> 客群信息
      // 在demo中,由于是自定义数据,所以定义此方法向父级抛出七牛所返回name和urlStr
      customFunc && isFunction(customFunc) && customFunc({ url: name, urlAddress: urlStr });

      setIsLock(false);
      closeHandle();
      onSuccess && onSuccess();
    });
  };
  const cancelHandle = () => {
    closeHandle();
  };
  // const onChangeFile = (val) => {
  //   const len = val.length;
  //   setVisibleHint(!len);
  // };

  useEffect(() => {
    form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      forceRender
      title={title}
      open={visible}
      destroyOnClose={true}
      onOk={submitHandle}
      wrapClassName={styles.exportModal}
      onCancel={cancelHandle}>
      <Form
        form={form}
        name='form'
        colon={false}
        labelCol={{ span: 4 }}>
        <Form.Item label='第一步：'>
          请根据导入模版的格式整理需要导入的数据
        </Form.Item>
        <Row>
          <Col span={4}>
          </Col>
          <Col span={14}>
            {
              url
                ? <TemplateFile url={url} fileName={`${fileName}`} />
                : <TemplateFile url={`https://staticres.linhuiba.com/project-custom/locationpc/file/${fileName}`} fileName={`${fileName}`} />
            }
          </Col>
        </Row>
        <Form.Item label='第二步：'>
          请上传要导入的文件
        </Form.Item>
        <Row>
          <Col span={4}>
          </Col>
          <Col span={20} className='mb-5 color-warning'>
            {children}
          </Col>
        </Row>
        <FormUpload
          label=' '
          name='url'
          valuePropName='fileList'
          rules={[
            { required: true, message: '请上传要导入的文件' }
          ]}
          config={{
            listType: 'text',
            maxCount,
            // onChange: onChangeFile,
            size,
            accept: accept,
            qiniuParams: {
              domain: bucketMappingDomain['linhuiba-file'],
              bucket: Bucket.File,
            },
            fileType: ['vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.ms-excel']
          }}>
          <TemplateUpload text='上传文件' />
        </FormUpload>
        {/* <Row>
          <Col span={4}>
          </Col>
          <Col span={20} >
            {
              visibleHint && (
                <div className='c-f23 fn-14 mt-5'>
                  请上传要导入的文件
                </div>
              )
            }
          </Col>
        </Row> */}
        <Row>
          <Col span={4}>
          </Col>
          <Col span={20} className='fn-12 c-bbc mt-5'>
            {tips}
            只能上传{accept.replaceAll('.', '')}文件 不超过 {size} MB 最多上传 {maxCount} 个文件
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default ImportModal;
