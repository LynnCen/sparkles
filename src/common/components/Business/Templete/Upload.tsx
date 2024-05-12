import { FC } from 'react';
import { CloudUploadOutlined } from '@ant-design/icons';
import styles from './index.module.less';
// import IconFont from '@/common/components/IconFont';

interface Props {
  text?: string;
}

const Upload: FC<Props> = ({
  text = '上传'
}) => {
  return (
    <div className={styles.upload}>
      <div>
        <CloudUploadOutlined className='fs-28'/>
      </div>
      <div className='mt-5'>
        {text}
      </div>
    </div>
  );
};

export default Upload;
