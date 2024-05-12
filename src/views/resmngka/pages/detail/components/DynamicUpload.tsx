import { useMethods } from '@lhb/hook';
import Upload from '@/common/components/Upload';
import React, { useMemo } from 'react';
import { DynamicUploadProps } from '../ts-config';
import { Bucket, bucketMappingDomain } from '@/common/enums/qiniu';
import { QiniuImageUrl } from '@/common/utils/qiniu';

const DynamicUpload: React.FC<DynamicUploadProps> = ({ value, onChange, restriction }) => {
  // 是否显示其他
  const accept = useMemo(() => {
    if (restriction?.accept) {
      const fileType = restriction.accept.map((item) => {
        return item.replace('.', '');
      });
      return fileType;
    }
    return [];
  }, [restriction]);
  const size = useMemo(() => {
    if (restriction?.size) {
      return restriction?.size;
    }
    return 20;
  }, [restriction]);
  const maxCount = useMemo(() => {
    if (restriction?.maxCount) {
      return restriction?.maxCount;
    }
    return 1;
  }, [restriction]);
  const fileList = useMemo(() => {
    return Array.isArray(value) ? value.map(itm => {
      itm.thumbUrl = QiniuImageUrl(itm.url);
      return itm;
    }) : [];
  }, [value]);
  const { onChangeFile } = useMethods({
    onChangeFile(files) {
      if (files) {
        onChange?.(files);
      }
    },
  });
  return (
    <div>
      <Upload
        onChange={onChangeFile}
        fileList={fileList}
        fileType={accept}
        qiniuParams = {{ domain: bucketMappingDomain['linhuiba-video'], bucket: Bucket.Video }}
        size={size}
        maxCount={maxCount}
      ></Upload>
    </div>
  );
};
export default DynamicUpload;
