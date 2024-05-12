import React, { useState } from 'react';
import { Button, message } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import { deepCopy, downloadFile } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import dayjs from 'dayjs';
import { postYNDepartmentExport } from '@/common/api/fishtogether';

const Filter: React.FC<any> = ({
  onSearch,
  searchForm
}) => {
  const [loading, setLoading] = useState(false);
  const methods = useMethods({
    async onExport() {
      setLoading(true);
      const params = deepCopy(searchForm.getFieldsValue());
      if (params.month?.length) {
        params.monthStart = dayjs(params.month[0]).format('YYYY-MM');
        params.monthEnd = dayjs(params.month[1]).format('YYYY-MM');
      }
      params.month = undefined;
      postYNDepartmentExport(params).then(res => {
        if (res?.url) {
          downloadFile({
            name: '开发部绩效报表.xlsx',
            url: res.url
          });
        } else {
          message.warning('表格数据异常或无数据');
        }
      }).finally(() => {
        setLoading(false);
      });
    }
  });

  return (
    <SearchForm
      form={searchForm}
      labelLength={4}
      onSearch={onSearch}
      rightOperate={
        <Button type='primary' onClick={methods.onExport} className='mb-24' loading={loading}>
          导出报表
        </Button>
      }>
      <FormRangePicker config={{ picker: 'month' }} label='统计月份' name='month' />
    </SearchForm>
  );
};

export default Filter;
