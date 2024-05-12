import { FC } from 'react';
import styles from '../index.module.less';
import cs from 'classnames';
import { UploadOutlined } from '@ant-design/icons';

interface Props {
  text?: string;
  classNames?: any;
}

const TemplateUpload: FC<Props> = ({
  text = '上传',
  classNames
}) => {
  return (
    <div className={cs(styles.upload, classNames)}>
      <div>
        {/* <IconFont iconHref='icon-yunshangchuan' className={styles.iconSize}/> */}
        <UploadOutlined />
      </div>
      <div className='mt-5'>
        {text}
      </div>
    </div>
  );
};

export default TemplateUpload;
