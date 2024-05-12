/* form上传 */
import { FC } from 'react';
import { Form } from 'antd';
import Upload from '@/common/components/Upload';
import { FormUploadProps } from './ts-config';

/**
 * 将七牛云文件类型归类
 * @param type 文件类型
 * @returns accept 属性
 */
export const fileTypeClassify = (type:string) => {
  let _type = `image/*`;
  switch (type) {
    case 'image/png':
    case 'png':
    case 'image/jpg':
    case 'jpg':
    case 'image/jpeg':
    case 'jpeg':
    case 'image/webp':
    case 'webp':
    case 'image/gif':
    case 'gif':
      _type = 'image/*';
      break;
    case 'video/mp4':
    case 'mp4':
    case 'video/mpeg':
    case 'mpeg':
    case 'video/quicktime':
    case 'quicktime':
      _type = 'video/*';
      break;
    case 'application/pdf':
    case 'pdf':
      _type = 'application/pdf';
      break;
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/vnd.ms-powerpoint':
    case 'ppt':
    case 'pptx':
      _type = 'application/vnd.ms-powerpoint';
      break;
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.ms-excel':
    case 'xls':
    case 'xlsx':
      _type = 'application/vnd.ms-excel';
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
    case 'doc':
    case 'docx':
      _type = 'application/msword';
      break;
  }
  return _type;
};

const FormUpload: FC<FormUploadProps> = ({
  label,
  name,
  rules,
  noStyle = false,
  initialValue,
  config,
  formItemConfig = {},
  children,
}) => {
  return (
    <Form.Item
      noStyle={noStyle}
      name={name}
      label={label}
      rules={rules}
      valuePropName='fileList'
      initialValue={initialValue}
      {...formItemConfig}
    >
      <Upload {...config}>{children}</Upload>
    </Form.Item>
  );
};

export default FormUpload;
