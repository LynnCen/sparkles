/**
 * 开发部绩效报表
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import { useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import { data } from './ts-config';

const DevDptKPIReport = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    setParams(values);
  };

  const loadData = async () => {
    return { dataSource: data, count: data.length };
  };

  const defaultColumns = [
    {
      title: '开发部',
      key: 'devDpt',
      fixed: true,
      width: 50,
    },
    {
      title: '新开店数',
      key: 'newCount',
      width: 80,
      render: (text, record) => (record.newCountRed ? <div className='c-f23'>{text}</div> : text),
    },
    {
      title: '落位计划完成率',
      key: 'locationPlanRate',
      width: 130,
      render: (text, record) => (record.locationPlanRateRed ? <div className='c-f23'>{text}</div> : text),
    },
    {
      title: '点位上报完成率',
      key: 'spotReportRate',
      width: 130,
      render: (text, record) => (record.spotReportRateRed ? <div className='c-f23'>{text}</div> : text),
    },
    {
      title: '落位',
      key: 'location',
      children: [
        {
          title: '总数',
          key: 'locationCount',
          width: 80,
          render: (text, record) => (record.locationCountRed ? <div className='c-f23'>{text}</div> : text),
        },
        {
          title: '签约率',
          key: 'locationRate',
          width: 80,
          render: (text, record) => (record.locationRateRed ? <div className='c-f23'>{text}</div> : text),
        },
      ],
      dragChecked: true
    },
    {
      title: '评估通过',
      key: 'pass',
      children: [
        {
          title: '总数',
          key: 'passCount',
          width: 80,
        },
        {
          title: '签约率',
          key: 'passRate',
          width: 80,
          render: (text, record) => (record.passRateRed ? <div className='c-f23'>{text}</div> : text),
        },
      ],
      dragChecked: true
    },
    {
      title: '选定点位',
      key: 'chooseSpot',
      children: [
        {
          title: '总数',
          key: 'chooseSpotCount',
          width: 80,
        },
        {
          title: '转化率',
          key: 'conversionRate',
          width: 80,
          render: (text, record) => (record.conversionRateRed ? <div className='c-f23'>{text}</div> : text),
        },
      ],
      dragChecked: true
    },
    {
      title: '新增加盟商',
      key: 'newJoinCount',
      width: 80,
    },
    {
      title: '新增点位数',
      key: 'newSpotCount',
      width: 80,
    },
    {
      title: '在库点位数',
      key: 'spotCount',
      width: 80,
    },
    {
      title: '平均落位周期',
      key: 'aveLocationDays',
      width: 110,
      render: (text, record) => (record.aveLocationDaysRed ? <div className='c-f23'>{text}</div> : text),
    },
  ];

  return (
    <V2Container
      className={cs(styles.container, 'bg-fff', 'pd-20')}
      style={{ height: 'calc(100vh - 84px)' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: <Filter onSearch={onSearch} />,
      }}
    >
      <V2Table
        onFetch={loadData}
        filters={params}
        defaultColumns={defaultColumns}
        hideColumnPlaceholder
        rowKey='id'
        // scroll={{ x: 'max-content', y: 250 }}
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 - 56 }}
      />
    </V2Container>
  );
};

export default DevDptKPIReport;
