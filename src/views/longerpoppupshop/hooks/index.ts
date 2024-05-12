/*
 * @Author: xiangshangzhi
 * @Date: 2023-06-01 08:52:03
 * @FilePath: \console-pc\src\views\longerpoppupshop\hooks\Filter.tsx
 * @Description: 场地筛选/备选地址管理公共hooks
 */
import { useState, useEffect } from 'react';

import { post } from '@/common/request';

type BaseOption = {
  id: number;
  name: string;
};

/* 获取下拉选项返回结构 */
type OptionsResponse = {
  flowWeekdaySelectId: BaseOption[];
  flowWeekendSelectId: BaseOption[];
  reportCycle: BaseOption[];
};

type Options = {
  label: string;
  value: number;
};
const generateOptions = (rowSelections: { id: number; name: string }[]) => {
  return rowSelections.map((item) => ({
    value: item.id,
    label: item.name,
  }));
};

/* 获取所有的下拉选项 */
export const useOptions = () => {
  const [options, setOptions] = useState({
    flowWeekdaySelectId: [] as Options[],
    flowWeekendSelectId: [] as Options[],
    /* 当前状态 */
    reportCycle: [] as Options[],
  });

  useEffect(() => {
    (async () => {
      // https://yapi.lanhanba.com/project/353/interface/api/52478
      const result: OptionsResponse = await post('/zm/selection');
      setOptions({
        flowWeekdaySelectId: generateOptions(result.flowWeekdaySelectId),
        flowWeekendSelectId: generateOptions(result.flowWeekendSelectId),
        reportCycle: generateOptions(result.reportCycle),
      });
    })();
  }, []);
  return options;
};
