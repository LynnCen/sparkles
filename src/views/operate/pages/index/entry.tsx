import { useState } from 'react';
import { Tabs } from 'antd';
import Filters from './components/Filters';
import LogList from './components/LogList';
import { ObjectProps, ListResult } from './ts-config';
import { getSystemLog } from '@/common/api/system';
import styles from './entry.module.less';
import dayjs from 'dayjs';
import { KeepAlive } from 'react-activation';

const OperateIndex = () => {
  const [params, setParams] = useState<ObjectProps>({});

  const onSearch = (values: any) => {
    if (values.ranges && Array.isArray(values.ranges) && values.ranges.length === 2) {
      values.start = dayjs(values.ranges[0]).format('YYYY-MM-DD');
      values.end = dayjs(values.ranges[1]).format('YYYY-MM-DD');
    } else {
      values.start = '';
      values.end = '';
    }
    delete values.ranges;

    setParams({
      ...params,
      ...values
    });
  };

  const loadData = async (params: any) => {
    const { totalNum, objectList }:ListResult = await getSystemLog(params);
    return {
      dataSource: objectList || [],
      count: totalNum,
    };
  };

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <Filters onSearch={onSearch}/>
        <Tabs defaultActiveKey='1' items={[
          { label: '请求日志', key: '1', children: <LogList params={params} loadData={loadData}/> }
        ]}/>
      </div>
    </KeepAlive>
  );
};

export default OperateIndex;
