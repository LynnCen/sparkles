/**
 * @Description 审批工作台-筛选项
 */

import { FC, useEffect, useState } from 'react';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { isArray, refactorSelection } from '@lhb/func';
import { approvalSelection } from '@/common/api/expandStore/approveworkbench';

interface Props {
  form: any;
  onSearch: Function, // 搜索函数
}

const Filter: FC<Props> = ({
  form,
  onSearch
}) => {
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);

  useEffect(() => {
    getSelection();
  }, []);

  const getSelection = async () => {
    const data = await approvalSelection({});
    isArray(data.typeValueList) && setTypeOptions(refactorSelection(data.typeValueList));
    isArray(data.statusList) && setStatusOptions(refactorSelection(data.statusList));
  };

  /**
   * @description 查询时处理
   * @param value 参数
   * @return
   */
  const handleSearch = () => {
    onSearch && onSearch();
  };

  return (
    <div>
      <SearchForm
        onOkText='搜索'
        form={form}
        labelLength={4}
        onSearch={handleSearch}
        style={{ marginBottom: 10 }}
        className='mb-10'
      >
        <V2FormInput label='名称搜索' name='keyword'/>
        <V2FormSelect
          label='申请类型'
          name='typeValueIdList'
          options={typeOptions}
          config={{
            mode: 'multiple',
            maxTagCount: 'responsive',
            showSearch: true,
            filterOption: false,
          }}/>
        <V2FormSelect
          label='审批状态'
          name='statusIdList'
          options={statusOptions}
          config={{
            mode: 'multiple',
            maxTagCount: 'responsive',
            showSearch: true,
            filterOption: false,
          }}/>
      </SearchForm>
    </div>
  );
};

export default Filter;
