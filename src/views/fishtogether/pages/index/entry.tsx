// 鱼你的首页
import { FC, useState } from 'react';
import { Form } from 'antd';
import styles from './entry.module.less';
import FilterFields from './components/FilterFields';
import DataPanel from './components/DataPanel';
import Analyse from './components/Analyse';
import { useMethods } from '@lhb/hook';
import dayjs from 'dayjs';
import { get } from '@/common/request';

const JoinHome: FC<any> = () => {
  const [form] = Form.useForm();
  const [searchParams] = useState<any>({
    devDpt: 0,
    start: '',
    groupId: '',
  });
  const [funnelData, setFunnelData] = useState<any>({});
  const [statisticData, setStatisticData] = useState<any>([]);

  const loadData = async (params) => {
    // https://yapi.lanhanba.com/project/497/interface/api/51463
    const result: any = await get('/yn/franchisee/home/statistic', params, {
      isMock: false,
      mockId: 497,
      mockSuffix: '/api',
      isZeus: true,
    });
    setFunnelData(result);
    setStatisticData(result?.statisticList || []);
  };

  const methods = useMethods({
    onSearch(params) {
      if (params.openingDate && params.openingDate.length) {
        params.start = dayjs(params.openingDate[0]).startOf('month').format('YYYY-MM-DD');
        params.end = dayjs(params.openingDate[1]).endOf('month').format('YYYY-MM-DD');
      }
      delete params.openingDate;
      loadData(params);
    },
  });

  return (
    <div className={styles.container}>
      {/* 筛选项 */}
      <FilterFields form={form} onSearch={methods.onSearch} />
      {/* 漏斗图+地图展示+数据概览 */}
      <DataPanel searchParams={searchParams} funnelData={funnelData} />
      {/* 转化及成本分析 */}
      <Analyse searchParams={searchParams} statisticData={statisticData}/>
    </div>
  );
};

export default JoinHome;
