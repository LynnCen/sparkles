/**
 * @Description 上传组件
 */

import { FC } from 'react';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { isArray } from '@lhb/func';

const Upload: FC<any> = ({
  propertyItem,
  disabled,
  required,
}) => {
  const label = propertyItem.anotherName || propertyItem.name || '';

  const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};

  const placeholder = restriction.placeholder ? restriction.placeholder : `请上传${label || ''}`;
  const extraTips = restriction.extraTips || ''; // 提示语
  const rules = [
    { required, message: placeholder },
  ];

  const acceptFile = restriction.accept?.some(val => ['.ppt', '.pptx', '.pdf', 'ppt', 'pptx', 'pdf', 'dwg', '.dwg'].includes(val));
  const acceptVideo = restriction.accept?.some(val => ['.mp4', '.3gp', '.m3u8', '.mov', '.avi', 'mp4', '3gp', 'm3u8', 'mov', 'avi'].includes(val));

  // 决定上传类型，文件/视频/图片
  const uploadType = acceptFile ? 'file' : acceptVideo ? (restriction.maxCount > 1 ? 'file' : 'video') : 'image';

  // 内部组件能通过格式检查的后缀，注意需要将接口返回的类型去掉前缀点'.' ex ['.mov', '.mp4'] => ['mov','mp4']
  const fileType = Array.isArray(restriction.accept) && restriction.accept.length ? restriction.accept.map(itm => (itm && itm.substring(0, 1) === '.') ? itm.substring(1, itm.length) : itm
  ) : undefined;

  let qiniuParams: any = {};
  if (uploadType === 'file') {
    qiniuParams = {
      domain: bucketMappingDomain['linhuiba-file'],
      bucket: Bucket.File,
    };
  } else if (uploadType === 'video') {
    qiniuParams = {
      domain: bucketMappingDomain['linhuiba-video'],
      bucket: Bucket.Video,
    };
  } else if (uploadType === 'image') {
    qiniuParams = {
      domain: bucketMappingDomain['linhuiba-certs'],
      bucket: Bucket.Certs,
    };
  }

  const textValue = propertyItem.textValue ? JSON.parse(propertyItem.textValue) : [];

  return (
    <V2FormUpload
      label={label}
      name={propertyItem.identification}
      uploadType={uploadType}
      verticalMiddleHelp={extraTips
        ? <div className='fs-12 c-999 mb-8'>
          {extraTips}
        </div> : <></>}
      config={{
        qiniuParams,
        size: restriction.size,
        maxCount: restriction.maxCount,
        fileType,
        accept: Array.isArray(restriction.accept) ? restriction.accept : undefined,
        disabled,
        onRemove: disabled ? () => false : undefined
      }}
      rules={rules}
      required={required}
    >
      {/* 禁用且无数据时优化展示'-' ，其他情况下无影响
      样式修改时结合文件 src/common/components/business/DynamicComponent/index.module.less  */}
      {disabled && (!isArray(textValue) || !textValue.length) ? <span className='c-222' style={{ visibility: 'visible' }}>-</span> : undefined}
    </V2FormUpload>
  );
};

export default Upload;
