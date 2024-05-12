import { circleList } from '@/common/api/circle';
import { useMethods } from '@lhb/hook';
import { Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

const DynamicBusinessCircle: React.FC<any> = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const { loadData } = useMethods({
    loadData: async () => {
      const result = await circleList({});
      const ops = result.businessCircleResponseList.map((item) => ({ label: item.name, value: item.id }));
      setOptions(ops);
    },
  });
  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = useMemo(() => {
    return (options.length && value) ? Number(value) : null;
  }, [options, value]);

  return (
    <div>
      <Select allowClear placeholder='请选择所属商圈' options={options} onChange={onChange} value={selected} />
    </div>
  );
};
export default DynamicBusinessCircle;
