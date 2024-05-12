import dayjs from 'dayjs';
import { useState } from 'react';
import Filter from './components/Filter';
import ReportList from './components/ReportList';
import styles from './entry.module.less';

const Report = () => {
  const [filters, setFilters] = useState<any>({});

  const onSearch = (values: any) => {
    setFilters({
      ...values,
      checkDate: values?.checkDate && dayjs(values?.checkDate).format('YYYY-MM-DD'),
    });
  };

  return (
    <div className={styles.container}>
      <Filter onSearch={onSearch} />
      <ReportList filters={filters} />
    </div>
  );
};

export default Report;
