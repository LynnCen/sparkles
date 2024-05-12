/**
 * @Description 富文本编辑器
 */
import { Bucket, bucketMappingActionUrl, bucketMappingDomain } from '@/common/enums/qiniu';
import { get } from '@/common/request';
import { useMethods } from '@lhb/hook';
import { Form } from 'antd';
import axios from 'axios';
import { FC } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './index.module.less';
import { FormEditorProps } from './ts-config';
import { Editor } from '@wangeditor/editor-for-react';

const FormEditor: FC<FormEditorProps> = ({
  label,
  name,
  rules = [],
  formItemConfig = {},
  config = {}, // 文档地址 https://jpuri.github.io/react-draft-wysiwyg/#/
  placeholder = `请输入${label}`
}) => {
  const methods = useMethods({
    async uploadImage(file) {
      const qiniuToken = await get('/qiniu/token', { bucket: Bucket.Certs }, { needCancel: false, proxyApi: '/mirage' });
      // 将token添加到上传入参中
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', qiniuToken?.token);
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      // 上传链接
      const upUrl = bucketMappingActionUrl[Bucket.Certs];
      const { data: { key } } = await axios.post(upUrl, formData, config);
      return { data: { link: `${bucketMappingDomain[Bucket.Certs]}${key}` } };
    }
  });

  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName='editorState'
      trigger='onEditorStateChange'
      className={styles.fromEditorWrapper}
      // 如果传入有规则，则默认添加字符串不能为空格的规则
      rules={rules}
      {...formItemConfig}
    >
      <Editor
        localization={{ locale: 'zh' }}
        placeholder={placeholder}
        toolbar={{
          image: {
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: false,
            uploadCallback: methods.uploadImage,
            previewImage: true,
            inputAccept: 'image/*',
          }
        }}
        { ...config }
      />
    </Form.Item>
  );
};

export default FormEditor;

