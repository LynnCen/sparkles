/*
 * @Author: 姚阳子 yaoyangzi@linhuiba.com
 * @Date: 2023-07-07 15:40:42
 * @LastEditors: 姚阳子 yaoyangzi@linhuiba.com
 * @LastEditTime: 2023-07-07 16:41:35
 * @FilePath: /saas-manage/src/views/pms/pages/companyManage/components/ImportModal.tsx
 * @Description: 正铺供给导入弹框
 */
import { FC } from 'react';
import styles from '../entry.module.less';
import { Form, message, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import FormUpload from '@/common/components/Form/FormUpload';
import TemplateUpload from '@/common/components/ImgCrop/components/TemplateUpload';
import { bucketMappingDomain, Bucket } from '@/common/enums/qiniu';
import { post } from '@/common/request';
import { isArray } from '@lhb/func';


const ImportModal:FC<any> = ({ showModal, setShowModal, onOkImport }) => {
  const [form] = Form.useForm();

  const methods = useMethods({
    submit() {
      form.validateFields().then(async (values) => {
        const { url: urlArr } = values;
        let urlStr = ``;
        if (isArray(urlArr) && urlArr.length > 0) {
          const targetFile = urlArr[0] || {};
          const { url, name } = targetFile;
          urlStr = `${url}?attname=${name}`;
        }
        const params = {
          url: urlStr
        };
        // https://yapi.lanhanba.com/project/399/interface/api/55208
        await post('/tenant/import/importTntBunkSpot', params, true);
        message.success('导入成功');
        setShowModal(false);
        onOkImport();
      });
    },
    cancel() {
      setShowModal(false);
    },
    resetState() {
      form.resetFields();
    }
  });
  return (
    <Modal
      className={styles['business-modal']}
      open={showModal}
      title='正铺供给导入'
      getContainer={false}
      onOk={methods.submit}
      onCancel={methods.cancel}
      afterClose={methods.resetState}
      destroyOnClose
    >
      <p className='fn-16'>第一步：请按照导入模版整理文件
        <a href='https://staticres.linhuiba.com/project-custom/pms/excel/正铺导入模板.xlsx' className='ml-10'>
          <span>下载《正铺导入模版》</span>
        </a></p>
      <p className='fn-16'>第二步：请选择要导入的文件：</p>
      <Form form={form} className='mt-10'>
        <FormUpload
          name='url'
          valuePropName='fileList'
          rules={[{ required: true, message: '请导入文件' }]}
          config={{
            listType: 'text',
            maxCount: 1,
            size: 20,
            accept: '.xlsx, .xls',
            qiniuParams: {
              domain: bucketMappingDomain['linhuiba-file'],
              bucket: Bucket.File,
            },
            showSuccessMessage: false,
            fileType: ['xls', 'xlsx', 'pdf', 'pptx', 'ppt'],
          }}
        >
          <TemplateUpload text='选择文件' />
          <div className='color-bbc mt-5 fs-12'>只能上传excel文件  最多上传 1 个文件</div>
        </FormUpload>
      </Form>
    </Modal>
  );
};

export default ImportModal;
