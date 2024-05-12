import { Button } from 'antd';
import { FilePptFilled
} from '@ant-design/icons';
import { FC } from 'react';
import styles from './index.module.less';

interface FilePreviewProps {
  filename?: string;
  url?: string
  onClick?: () => void;
}

const FilePreview: FC<FilePreviewProps> = ({ filename, onClick, url }) => {
  const prefixCls = 'file-preview';
  const wrapper = `${prefixCls}-wrapper`;
  const handleClick = () => {
    onClick?.();
  };
  return (
    <div className={styles[wrapper]}>
      <div className={styles[prefixCls]}>
        <div className={styles.filename}><FilePptFilled style={{ color: 'red' }} />
          {filename}
        </div>
        <Button
          type='link'
          size='large'
          href={filename ? `${url}?attname=${filename}` : url }
          download={filename}
          onClick={handleClick}>
          下载
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;
