/**
 * @Author Pull
 * @Date 2021-09-16 14:21
 * @project useMsgAnalysis
 */
import { useCallback, useEffect, useState } from 'react';
import { getPreview, PreviewItem, getChart } from './services';
import { useIntl } from 'umi';
import { QueryProps } from './component/RangePicker';

interface TabsItem {
  title: string;
  count: number;
  percent: number;
  status: number;
  ratio: number;
}

const titleFormat = {
  yesterdayQuantity: 'yesterdayQuantity',
  todayQuantity: 'todayQuantity',
  yesterdayMediaMsgCount: 'yesterdayMediaMsgCount',
  todayMediaMsgCount: 'todayMediaMsgCount',
};

export const useMsgAnalysis = () => {
  const { formatMessage } = useIntl();
  const [tabs, setTabs] = useState<TabsItem[]>([]);
  const [query, setQuery] = useState<QueryProps>({
    startTime: '',
    endTime: '',
    timeSize: '',
  });
  const [chartData, setChartData] = useState<any[]>([]);

  const handlePreviewData = useCallback(
    (data: PreviewItem[]) =>
      data.map((item) => ({
        title: formatMessage({ id: titleFormat[item.key] }),
        count: item.count,
        percent: item.percent,
        status: item.status,
        ratio: item.ratio,
      })),
    [],
  );

  const handleChartQuery = useCallback(
    (q: QueryProps) => {
      setQuery({ ...query, ...q });
    },
    [query],
  );
  useEffect(() => {
    getPreview().then((list) => {
      setTabs(handlePreviewData(list));
    });
  }, []);

  useEffect(() => {
    const { startTime, endTime, timeSize } = query;
    if (startTime && endTime && timeSize) {
      getChart(startTime, endTime, timeSize).then((res) => {
        setChartData(res);
      });
    }
  }, [query]);

  return {
    tabs,
    query,
    handleQuery: handleChartQuery,
    chartData,
  };
};
