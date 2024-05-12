/* 上传 */
import { Bucket, bucketMappingActionUrl, bucketMappingDomain } from '@/common/enums/qiniu';
import { QiniuImageUrl } from '@/common/utils/qiniu';
import { get } from '@/common/request';
import { PlusOutlined } from '@ant-design/icons';
import { Image, message, Upload } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CombineUploadProps } from './ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// 图片的格式
const ImageType = ['png', 'jpg', 'gif', 'jpeg', 'bmp'];

const CustomerUpload: React.FC<CombineUploadProps> = ({
  listType = 'picture-card', // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
  maxCount, // maxCount为1时后面上传的会覆盖前面上传的
  multiple = false, // 是否开启多选，默认为false
  openFileDialogOnClick = true, // 点击打开文件对话框
  name,
  size = 10, // 上传大小 单位 M
  fileType = ImageType, // 可以上传的类型-默认为图片
  previewFile, // 自定义预览事件
  onPreview, // 点击文件链接或预览图标时的回调
  isPreviewImage = false,
  qiniuParams = {
    domain: bucketMappingDomain['linhuiba-certs'],
    bucket: Bucket.Certs,
  },
  children,
  extraVerified,
  ...props
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [prevImage, setPrevImage] = useState<any>({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  });

  useEffect(() => {
    props?.fileList && Array.isArray(props.fileList) && setFileList(props.fileList);
  }, [props.fileList]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  // 上传前限制
  const beforeUpload = async (file) => {
    if (extraVerified) {
      const errorText = await extraVerified(file);
      if (errorText) {
        V2Message.error(errorText);
        return Upload.LIST_IGNORE;
      }
    }
    // const type = file.name.split('.')[1].toLowerCase();
    // 注意文件有会有多个.的场景（自定义文件名）
    const splitResult = file.name.split('.');
    const len = splitResult.length;
    const type = splitResult[len - 1].toLowerCase();
    const isCanUpload = fileType.includes('*') ? true : fileType.includes(type);
    if (!isCanUpload) {
      message.error('不支持的文件类型，请重新上传');
      // 返回false依旧会触发onChange事件，将不符合条件的文件上传，返回Upload.LIST_IGNORE则不会
      return Upload.LIST_IGNORE;
    }
    const isLimitSize = file.size / 1024 / 1024 < size;
    if (!isLimitSize) {
      message.error(`超出最大文件限制${size}M的大小`);
      return Upload.LIST_IGNORE;
    }
    return isCanUpload && isLimitSize;
  };

  // 上传状态改变
  const onChange = (file) => {
    setFileList(file.fileList);
    props?.onChange?.(file.fileList);
    // 上传中
    // if (file.file.status !== 'uploading') {
    // }
    if (file.file.status === 'done') {
      // 上传成功
      message.success(`${file.file.name} 上传成功`);
      const arr = file.fileList.map((item: any) => ({
        ...item,
        name: item.name,
        uid: item.uid,
        status: 'done',
        url: item.url || `${item.response && item.response.key ? (qiniuParams.domain + item.response.key) : ''}`,
      }));
      setFileList(arr);
      props?.onChange?.(arr);
    } else if (file.file.status === 'error') {
      // 上传失败
      message.error(`${file.file.name} 上传失败.`);
      //   if (contrast(file.file, 'error.response.data.error_code') === 'BadToken') {
      //   message.error('七牛 token 过期，请重新尝试上传');
      // } else {
      //   message.error(`${file.file.name} 上传失败.`);
      // }

      // const arr = file.fileList.filter(item => item.url);
      // setFileList(arr);
      // props?.onChange?.(arr);
    } else if (file.file.status === 'removed') {
      // 移除图片
      props?.onChange?.(file.fileList);
    }
  };


  // 自定义上传事件
  const customRequest = async ({ onError, onSuccess, onProgress, file, withCredentials, headers }: any) => {
    const formData = new FormData();
    formData.append('file', file);
    // 获取七牛token
    const result = await get('/qiniu/token', { bucket: qiniuParams.bucket }, {
      proxyApi: '/mirage',
      needHint: true,
      needCancel: false,
    });

    if (!result.token) return;
    // 将token添加到上传入参中
    formData.append('token', result.token);
    const config = {
      withCredentials,
      headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      onUploadProgress: ({ total, loaded }) => {
        onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
      },
    };
    // 上传链接
    const upUrl = bucketMappingActionUrl[qiniuParams.bucket];
    axios
      .post(upUrl, formData, config)
      .then(({ data }) => {
        onSuccess(data, file);
      })
      .catch(onError);
    return {
      abort() {
        console.log('upload progress is aborted.');
      },
    };
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    if (isPreviewImage) {
      setPrevImage({
        previewImage: QiniuImageUrl(file.url) || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    } else {
      window.open(QiniuImageUrl(file.url) || file.preview);
    }
  };

  const handleCancel = () => {
    setPrevImage({ previewVisible: false });
  };

  return (
    <>
      <Upload
        {...props}
        listType={listType}
        maxCount={maxCount}
        multiple={multiple}
        name={name}
        openFileDialogOnClick={openFileDialogOnClick}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        previewFile={previewFile}
        onPreview={onPreview || handlePreview}
        onChange={onChange}
      >
        {/* 超过最大上传数量限制时不显示上传按钮 */}
        {/* {maxCount && fileList.length >= maxCount ? null : uploadButton} */}
        {children || (maxCount && fileList.length >= maxCount ? null : uploadButton)}
      </Upload>
      {prevImage.previewVisible && (
        <Image
          width={200}
          style={{ display: 'none' }}
          preview={{
            visible: prevImage.previewVisible,
            src: prevImage.previewImage,
            onVisibleChange: () => {
              handleCancel();
            },
          }}
        />
      )}
    </>
  );
};

export default CustomerUpload;
