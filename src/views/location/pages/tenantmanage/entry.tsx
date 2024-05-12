import Filter from './components/Filter';
import TenantList from './components/TenantList';
import styles from './entry.module.less';
import { useState } from 'react';

const Review = () => {
  const [filter, setFilter] = useState<any>({});
  const onSearch = (values) => {
    setFilter({ ...values });
  };

  return (
    <div className={styles.container}>
      <Filter onSearch={onSearch} />
      <TenantList
        params={filter}
        onSearch={onSearch}/>
    </div>
  );
};

export default Review;
