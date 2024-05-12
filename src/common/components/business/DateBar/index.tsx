/* 时间选择tab */
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { DateProps } from './ts-config';
import dayjs from 'dayjs';
import styles from './index.module.less';

const { TabPane } = Tabs;

const dateOptions = [
  { name: '今日', value: 'today' },
  { name: '昨日', value: 'yesterday' },
  { name: '近7日', value: 'sevenDay' },
  { name: '近1个月', value: 'oneMonth' },
  { name: '近3个月', value: 'threeMonth' },
  { name: '近6个月', value: 'sixMonth' },
  { name: '近1年', value: 'oneyear' },
  { name: '自定义', value: 'customer' },
];

// 日期对应的维度type
enum DateScope {
  Hour = 1,
  Day = 2,
  Month = 3,
}

const timeFormat = 'YYYY-MM-DD';

// 维度判断-自定义范围,若相隔天数大于 90 天,则按月维度,若为同一天,则按小时维度,其余为天维度
export const changeDateScope = (start: string, end: string) => {
  const range = dayjs(end).diff(dayjs(start), 'days');
  if (range === 0) {
    return DateScope.Hour;
  } else if (range < 90) {
    return DateScope.Day;
  } else {
    return DateScope.Month;
  }
};

const DateBar: React.FC<DateProps> = ({
  children,
  handleChangeTime,
  hasToday = false,
  hasYesterday = false,
  defaultTab,
}) => {
  const [checkTab, setCheckTab] = useState<string>(defaultTab || 'sevenDay'); // 默认选中近7天

  useEffect(() => {
    handleChangeTabToTime(checkTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeTab = (key: string) => {
    setCheckTab(key);
    handleChangeTabToTime(key);
  };

  // 切换tab时间的改变
  const handleChangeTabToTime = (key: string) => {
    let start = '';
    let end = dayjs().format(timeFormat);
    let dateScope = 0;
    switch (key) {
      case 'today':
        start = end;
        dateScope = DateScope.Hour;
        break;
      case 'yesterday':
        end = dayjs().subtract(1, 'days').format(timeFormat);
        start = end;
        dateScope = DateScope.Hour;
        break;
      case 'sevenDay':
        start = dayjs().subtract(6, 'days').format(timeFormat);
        dateScope = DateScope.Day;
        break;
      case 'oneMonth':
        start = dayjs().subtract(1, 'month').format(timeFormat);
        dateScope = DateScope.Day;
        break;
      case 'threeMonth':
        start = dayjs().subtract(2, 'month').format(timeFormat);
        dateScope = DateScope.Month;
        break;
      case 'sixMonth':
        start = dayjs().subtract(5, 'month').format(timeFormat);
        dateScope = DateScope.Month;
        break;
      case 'oneyear':
        start = dayjs().subtract(1, 'year').format(timeFormat);
        dateScope = DateScope.Month;
        break;
      default:
        start = '';
        end = '';
    }
    handleChangeTime(start, end, dateScope, key);
  };

  return (
    <div className={styles.container}>
      <Tabs onChange={changeTab} activeKey={checkTab} destroyInactiveTabPane>
        {dateOptions.map((item) => {
          if (!hasToday && item.value === 'today') return null;
          if (!hasYesterday && item.value === 'yesterday') return null;
          return (
            <TabPane tab={item.name} key={item.value} />
          );
        })}
      </Tabs>
      {children}
    </div>
  );
};

export default DateBar;
