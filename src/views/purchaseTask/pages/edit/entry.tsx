import { FC, useEffect, useState } from 'react';
import { Divider, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageContainer } from '@/common/components';
import { useLocation } from 'react-router-dom';
import { urlParams } from '@lhb/func';
import { detail } from '@/common/api/purchaseTask';
import BusinessInfo from '@/views/purchaseTask/components/BusinessInfo';
import ActivityInfo from '@/views/purchaseTask/components/ActivityInfo';
import TaskForm from './components/TaskForm';
import styles from './entry.module.less';
import { valueFormat } from '@/common/utils/ways';

const Edit: FC<any> = () => {
  const [info, setInfo] = useState<any>({});
  const [expand, setExpand] = useState(true);
  const { search } = useLocation();
  const { id } = urlParams(search) as any as { id?: string };
  const {
    spot = {},
    business = {},
    activity = {},
  } = info;

  const getInfo = async (id: number) => {
    const result = await detail(id);
    if (result) {
      setInfo(result);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    getInfo(id as any);
  }, [id]);

  const items = [
    { title: '场地点位', value: spot ? `${spot.placeName}-${spot.spotName}` : '-' },
    { title: '商家名称', value: business.busName || '-' },
    { title: '活动名称', value: activity.title || '-' },
    { title: '活动日期', value: Array.isArray(activity.dates) ? activity.dates.join(',') : '-' },
  ];

  return (
    <div className={styles.container}>
      <PageContainer noMargin wrapStyle={{ paddingTop: 20, paddingBottom: 32 }}>
        <div className={styles.basicTitleRow}>
          <span className={styles.title}>采购任务</span>
          <Button onClick={() => setExpand(!expand)}>
            {expand ? '收起全部信息' : '展开全部信息'} {expand ? <UpOutlined/> : <DownOutlined/>}
          </Button>
        </div>
        <div className={styles.itemsWrapper}>
          {
            Array.isArray(items) && items.map((itm:any, index: number) => (
              <div className={styles.item} key={index}>
                <div className={styles.itemTitle}>{itm.title}</div>
                <div className={styles.itemValue} >{valueFormat(itm.value)}</div>
              </div>
            ))
          }
        </div>

        {expand && (<>
          <Divider></Divider>
          {!!business && <BusinessInfo business={business}/>}
          {!!activity && <ActivityInfo activity={activity}/>}
        </>)}
      </PageContainer>

      <PageContainer noMargin wrapStyle={{ marginTop: 16, paddingTop: 20, paddingBottom: 32 }}>
        <TaskForm info={info}/>
      </PageContainer>
    </div>
  );
};

export default Edit;
