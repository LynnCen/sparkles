import { FC, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import SurroundDrawer from '@/common/components/business/SurroundDrawer';
import List from './components/List';
import styles from './entry.module.less';
import cs from 'classnames';
import { historyReports } from '@/common/api/surround';

const History: FC<any> = () => {
  const [currentId, setCurrentId] = useState<number>();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const loadData = async (params) => {
    const result: any = await historyReports(params);
    return { dataSource: result.objectList, count: result?.totalNum };
  };

  // 查看详情
  const viewDetail = async (record: any) => {
    setCurrentId(record.id);
    setDrawerVisible(true);
  };

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      <V2Container
        /*
          减去高度设置120 = 顶部条高度48 + main上下padding各16 + container上下padding各20；
          减去高度大于这个值，页面底部留白大于预期；
          减去高度小于这个值，页面底部留白小于预期，且页面右侧会出现不必要的滚动条；
        */
        style={{ height: 'calc(100vh - 120px)' }}
      >
        <List loadData={loadData} openDetail={viewDetail} />
        <SurroundDrawer
          id={currentId}
          open={drawerVisible}
          setOpen={setDrawerVisible}
          isSurround
        />
      </V2Container>
    </div>
  );
};

export default History;
