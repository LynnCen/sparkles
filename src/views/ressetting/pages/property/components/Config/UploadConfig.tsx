import { uploadTypeOptions } from '@/views/ressetting/pages/property/ts-config';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import React from 'react';

// const options = [
//   { label: '.png', value:  '.png'},
//   { label: '.jpg', value: '.jpg' },
//   { label: '.jpeg', value: '.jpeg' },
//   { label: '.bmp', value: '.bmp' },
//   { label: '.gif', value: '.gif' },
//   { label: '.ppt', value: '.ppt' },
//   { label: '.pptx', value: '.pptx' },
//   { label: '.pdf', value: '.pdf' },
//   { label: '.rm', value: '.rm' },
//   { label: '.rmvb', value: '.rmvb' },
//   { label: '.mpeg-1', value: '.mpeg-1' },
//   { label: '.mpeg-2', value: '.mpeg-2' },
//   { label: '.mpeg-3', value: '.mpeg-3' },
//   { label: '.mpeg-4', value: '.mpeg-4' },
//   { label: '.mov', value: '.mov' },
//   { label: '.mtv', value: '.mtv' },
//   { label: '.dat', value: '.dat' },
//   { label: '.wmv', value: '.wmv' },
//   { label: '.avi', value: '.avi' },
//   { label: '.3gp', value: '.3gp' },
//   { label: '.amv', value: '.amv' },
//   { label: '.dmv', value: '.dmv' },
//   { label: '.flv', value: '.flv' },
//   { label: '.mp4', value: '.mp4' },
// ];
const UploadConfig: React.FC<{ csName: string }> = ({ csName }) => {
  return (
    <>
      <V2FormSelect
        label="文件支持格式"
        name={[csName, 'accept']}
        options={uploadTypeOptions}
        config={{ showSearch: true, allowClear: true, mode: 'multiple' }}
      />
      <V2FormInputNumber
        label="限制文件个数"
        placeholder='请输入最多可上传文件个数'
        name={[csName, 'maxCount']}
        min={0}
        config={{ addonAfter: '个', precision: 0 }}
      />
      <V2FormInputNumber
        label="单个文件大小"
        placeholder='请输入单个文件大小限制'
        name={[csName, 'size']}
        min={0}
        config={{ addonAfter: 'MB', precision: 0 }}
      />
      <V2FormInput
        label="提示语句内容"
        name={[csName, 'extraTips']}
      />
    </>
  );
};
export default UploadConfig;
