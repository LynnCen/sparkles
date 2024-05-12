import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { FC, useState } from 'react';
import Cards from './components/Cards';
import Search from './components/Search';
import TaskList from './components/TaskList';
import styles from './entry.module.less';
// https://confluence.lanhanba.com/pages/viewpage.action?pageId=67518659
// 踩点数据面板

const Footprintingpanel: FC<any> = () => {
  const [searchParams, setSearchParams] = useState<any>({});

  const searchChange = (fieldsValue: Record<string, any>) => {
    setSearchParams(fieldsValue);
  };

  return (
    <div className={styles.container}>
      <TitleTips name='踩点概览' showTips={false} className={styles.topTitle}/>
      <Cards />
      <TitleTips name='踩点分析' showTips={false} />
      <Search change={searchChange} />
      <TaskList searchParams={searchParams} />
    </div>
  );
};

export default Footprintingpanel;
