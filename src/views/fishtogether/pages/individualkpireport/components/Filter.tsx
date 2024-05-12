import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import FormSelect from '@/common/components/Form/FormSelect';
import FormInput from '@/common/components/Form/FormInput';
import { downloadFile, refactorSelection } from '@/common/utils/ways';
import { useMethods } from '@lhb/hook';
import { deepCopy } from '@lhb/func';
import dayjs from 'dayjs';
import { postYNPersonExport, postYNSelectionList } from '@/common/api/fishtogether';

const Filter: React.FC<any> = ({ onSearch, searchForm }) => {
  const [selection, setSelection] = useState<any>({});
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
      postYNPersonExport(params).then(res => {
        if (res?.url) {
          downloadFile({
            name: '开发人员绩效报表.xlsx',
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
  useEffect(() => {
    postYNSelectionList().then((res) => {
      setSelection(res);
    });
  }, []);
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
      <FormSelect label='开发部' name='departmentId' options={refactorSelection(selection?.department)} config={{ allowClear: true }} />

      <FormInput label='姓名' name='name' config={{ allowClear: true }} />
      <FormRangePicker config={{ picker: 'month' }} label='统计月份' name='month' />
    </SearchForm>
  );
};

export default Filter;
