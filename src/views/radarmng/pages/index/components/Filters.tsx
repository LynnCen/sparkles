import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { FiltersProps, TaskStatus } from '../ts-config';

const selector = {
  status: [
    { label: '待执行', value: TaskStatus.WAIT },
    { label: '执行中', value: TaskStatus.PROCESSING },
    { label: '已挂起', value: TaskStatus.HANGUP },
    { label: '已完成', value: TaskStatus.COMPLETE },
    { label: '失败', value: TaskStatus.FAIL },
    { label: '已停止', value: TaskStatus.STOP },
  ]
};

const Filters: React.FC<FiltersProps> = ({ onSearch }) => {
  return (
    <FormSearch onSearch={onSearch}>
      <V2FormInput label='任务名称' name='name'/>
      <V2FormSelect label='状态' name='status' options={selector.status}/>
    </FormSearch>
  );
};

export default Filters;
