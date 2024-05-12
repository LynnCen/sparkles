import { Upload } from 'antd';
import React, { memo } from 'react';
import { FileOutlined } from '@ant-design/icons';

export interface DynamicFileProps {
  uid?: any;
  url?: any;
  name?: any;
}

const DynamicFile: React.FC<DynamicFileProps> = memo(({ uid, url, name }) => {
  return (
    <div className='mt-6'>
      <Upload
        fileList={[{
          uid,
          name,
          url,
          status: 'done',
        }]}
        maxCount={1}
        disabled
        listType='picture-card'
        isImageUrl={() => false}
        iconRender={() => <FileOutlined /> }
      >
      </Upload>
    </div>
  );
});
export default DynamicFile;
