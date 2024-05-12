import { FC, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import styles from '../../entry.module.less';
import ConversionTable from './components/ConversionTable';
import CostTable from './components/CostTable';

const Analyse: FC<any> = ({
  searchParams,
  setVisible,
  setContent,
  tenantStatus
}) => {
  const [conversionParam, setConversionParam] = useState<any>({ ...searchParams, tab: 1 });
  const [costParam, setCostParam] = useState<any>({ ...searchParams, tab: 2 });
  const items = [
    { label: '转化分析', key: '1', children: <ConversionTable
      params={conversionParam}
      setVisible={setVisible}
      setContent={setContent}
      tenantStatus={tenantStatus}
    /> }, // 务必填写 key
    { label: '成本分析', key: '2', children: <CostTable
      setVisible={setVisible}
      setContent={setContent}
      tenantStatus={tenantStatus}
      params={costParam} /> },
  ];
  const onChange = () => {
    setConversionParam({ ...searchParams, tab: 1 });
    setCostParam({ ...searchParams, tab: 2 });
  };

  useEffect(() => {
    onChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return <Tabs items={items} className={styles.tabsCon} onChange={onChange} />;
};

export default Analyse;
