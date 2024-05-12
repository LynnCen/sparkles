import { FC, useState } from 'react';
import ContrastCharts from './components/ContrastCharts';
import NotFound from '@/common/components/NotFound';
import Filter from './components/Filter';
import styles from './entry.module.less';
import { ObjectProps } from './ts-config';
import { useMethods } from '@lhb/hook';

const Contrast: FC<any> = () => {
  const [result, setResult] = useState<ObjectProps>({});
  const [params, setParams] = useState<ObjectProps>({});

  const { onSearch, onResetForm } = useMethods({
    onSearch: (data: any, params: any) => {
      setParams(params);
      setResult(data);
    },
    onResetForm: () => {
      setResult({});
    },
  });

  return (
    <div className={styles.container}>
      <Filter onSearch={onSearch} onResetForm={onResetForm} />
      <div className={styles.result}>
        {result && Object.keys(result).length ? (
          <ContrastCharts params={params} result={result} />
        ) : (
          <NotFound text='请确定查询条件，点击查询按钮' />
        )}
      </div>
    </div>
  );
};

export default Contrast;
