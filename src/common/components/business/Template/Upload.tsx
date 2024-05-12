import { FC } from 'react';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import cs from 'classnames';

interface Props {
  text?: string;
  classNames?: any;
}

const Upload: FC<Props> = ({
  text = '上传',
  classNames
}) => {
  return (
    <div className={cs(styles.upload, classNames)}>
      <div>
        <IconFont iconHref='icon-yunshangchuan' className={styles.iconSize}/>
      </div>
      <div className='mt-5'>
        {text}
      </div>
    </div>
  );
};

export default Upload;
