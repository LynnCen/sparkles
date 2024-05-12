/**
 * @Description 系统日志页面
 */
import { FC, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import PageTitle from '@/common/components/business/PageTitle';
import List from './components/List';
import Filter from './components/Filter';
import styles from './entry.module.less';

const Log: FC<any> = () => {
  const [filters, setFilters] = useState<any>({}); // 参数变化的时候会触发请求更新table表格
  const [mainHeight, setMainHeight] = useState<number>(0);

  /**
   * @description 点击搜索框模糊查询
   * @param fields 搜索框参数
   */
  const onSearch = (value) => {
    setFilters(value);
  };

  // const onRefresh = () => {
  //   setFilters({});
  // };

  return (
    <div className={styles.container}>
      <V2Container
        // 上下外padding各16px，上下内padding各20px，顶部标题height 48px
        style={{ height: 'calc(100vh - 40px - 32px - 48px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: (<>
            <PageTitle content='操作日志'/>
            <Filter onSearch={onSearch}/>
          </>)
        }}>
        <List mainHeight={mainHeight} filters={filters}/>
      </V2Container>
    </div>
  );
};

export default Log;
