import { get } from '@/common/request';
import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
const Privacy: FC<any> = () => {
  const [main, setMain] = useState('');
  useEffect(() => {
    get('/loc/articles/show', {
      id: 205
    }, {
      needHint: true,
      isMock: false,
      mockId: 297,
      mockSuffix: '/api'
    }).then(res => {
      setMain(res.content);
    });
  }, []);
  return (
    <div className={styles.container} dangerouslySetInnerHTML={{
      __html: main
    }}>
    </div>
  );
};

export default Privacy;
