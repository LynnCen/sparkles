import React, { useEffect, useState } from 'react';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { getDepartmentTreeList } from '@/common/api/system';
import { refactorSelection } from '@lhb/func';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { Cascader } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';

const Filter: React.FC<any> = ({ onSearch, form }) => {

  const [departmentOpts, setDepartmentOpts] = useState<any>([]);

  useEffect(() => {
    // 获取部门列表下拉项
    getDepartmentOptions();
  }, []);


  const getDepartmentOptions = async () => {
    const res = await getDepartmentTreeList();
    res && setDepartmentOpts(res);
  };

  const statusOptions = [
    { label: '在职', value: 3 },
    { label: '离职', value: 4 },
  ];

  return (
    <SearchForm labelLength={5}
      form={form}
      onSearch={onSearch}
    >
      <V2FormInput label='员工手机号' name='phone' />
      <V2FormInput label='员工姓名' name='name' />
      <V2FormSelect
        label='状态'
        name='jobStatus'
        options={statusOptions}
      />

      <V2FormCascader
        label='部门'
        name='departmentId'
        options={refactorSelection(departmentOpts)}
        config={{
          multiple: true,
          showCheckedStrategy: Cascader.SHOW_CHILD,
          maxTagCount: 'responsive',
        }}

      />
    </SearchForm>
  );
};

export default Filter;
