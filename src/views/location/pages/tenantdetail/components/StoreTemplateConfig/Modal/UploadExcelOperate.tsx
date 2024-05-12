/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑租户 */
import React, { useEffect } from 'react';
import { Modal, Form, message } from 'antd';
import FormUpload from '@/common/components/Form/FormUpload';
import { post } from '@/common/request';

import { UploadExcelProps } from '../ts-config';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const UploadExcelOperate: React.FC<UploadExcelProps> = ({ operateUploadExcel, setOperateUploadExcel, onSearch }) => {
  const [form] = Form.useForm();

  const onCancel = () => {
    setOperateUploadExcel({ visible: false });
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const { excel } = values;
      console.log(excel, '555');
      // https://yapi.lanhanba.com/project/289/interface/api/52863
      const url = '/dynamic/template/url/upload'; // 编辑
      const params = {
        id: operateUploadExcel.id,
        url: excel[0].url + '?attname=' + excel[0].name
      };
      post(url, params, {
        needHint: true,
        proxyApi: '/blaster'
      }).then(() => {
        message.success(`上传Excel成功`);
        onCancel();
        onSearch();
      });
    });
  };

  useEffect(() => {
    form.resetFields();
  }, [operateUploadExcel]);

  return (
    <Modal
      title={'上传模版Excel'}
      open={operateUploadExcel.visible}
      onOk={onSubmit}
      width={500}
      getContainer={false}
      onCancel={onCancel}
      forceRender
      destroyOnClose
    >
      <Form {...layout} form={form}>
        <Form.Item
          label='模板Excel'
          help='只能上传 .xlsx, .xls，最多1个文件，最多10M'
        >
          <FormUpload
            name='excel'
            noStyle
            rules={[{ required: true, message: '请导入文件' }]}
            config={{
              maxCount: 1,
              isPreviewImage: true,
              accept: '.xlsx, .xls',
              fileType: ['xls', 'xlsx'],
              extraVerified: (file: any) => {
                return new Promise<string | boolean>((resolve) => {
                  const { name } = file;
                  resolve(/\s/.test(name) ? '文件名不能包含空格' : false);
                });
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UploadExcelOperate;
