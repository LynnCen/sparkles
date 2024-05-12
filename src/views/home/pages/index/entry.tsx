import { FC } from 'react';
import Overview from './components/Overview';
import List from './components/List';
import styles from './entry.module.less';
import Card from './components/Card';
import RightCon from './components/RightCon';

const Home: FC<any> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftCon}>
        <Card />
        <Overview />
        <List />
      </div>
      <div className={styles.rightCon}>
        <RightCon />
      </div>
    </div>
  );
};

export default Home;
