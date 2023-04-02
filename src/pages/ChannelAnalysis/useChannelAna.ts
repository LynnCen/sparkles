import React, { useCallback, useEffect, useState } from 'react';

export default () => {
  const [query, setQuery] = useState({});
  const [chartData, setChartData] = useState<any[]>([]);

  const handleQuery = useCallback(
    (data: { [attr: string]: any }) => {
      setQuery({ ...query, ...data });
    },
    [query],
  );

  useEffect(() => {
    // todo: quest
    const data = [
      { year: '1991', count: 12, value: 3 },
      { year: '1992', count: 3, value: 4 },
      { year: '1993', count: 9, value: 3.5 },
      { year: '1994', count: 3, value: 5 },
      { year: '1995', count: 45, value: 4.9 },
      { year: '1996', count: 12, value: 6 },
      { year: '1997', count: 11, value: 7 },
      { year: '1998', count: 23, value: 9 },
      { year: '1999', count: 8, value: 13 },
    ];

    setChartData([data, data]);
  }, [query]);

  return {
    query,
    handleQuery,
    chartData,
  };
};
