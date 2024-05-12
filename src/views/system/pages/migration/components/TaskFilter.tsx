import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormSelect from '@/common/components/Form/FormSelect';
import { get } from '@/common/request';

const TaskFilter: React.FC<any> = ({ onSearch }) => {
  const [typeOptions, setTypeOptions] = useState<any>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);

  const onFinish = (values) => {
    onSearch(values);
  };

  const loadTypeOptions = async () => {
    // https://yapi.lanhanba.com/project/497/interface/api/51701
    const result: any = await get(
      '/yn/task/transfer/selection',
      { selectionType: 1 },
      {
        isMock: false,
        mockId: 497,
        mockSuffix: '/api',
        needCancel: false,
      }
    );
    setTypeOptions(result || []);
  };

  const loadStatusOptions = async () => {
    // https://yapi.lanhanba.com/project/497/interface/api/51701
    const result: any = await get(
      '/yn/task/transfer/selection',
      { selectionType: 2 },
      {
        isMock: false,
        mockId: 497,
        mockSuffix: '/api',
        needCancel: false,
      }
    );
    setStatusOptions(result || []);
  };

  useEffect(() => {
    loadTypeOptions();
    loadStatusOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormSearch labelLength={4} onSearch={onFinish} labelAlign='left' colon={false}>
      <FormSelect
        label='任务类型'
        name='taskType'
        allowClear
        config={{ fieldNames: { label: 'name', value: 'id' }, allowClear: true }}
        options={typeOptions}
      />
      <FormSelect
        label='任务状态'
        name='taskStatus'
        allowClear
        config={{ fieldNames: { label: 'name', value: 'id' }, allowClear: true }}
        options={statusOptions}
      />
    </FormSearch>
  );
};

export default TaskFilter;
