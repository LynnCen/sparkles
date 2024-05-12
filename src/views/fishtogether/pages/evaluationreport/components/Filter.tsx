import React, { useState } from 'react';
import { Button, message } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import { downloadFile } from '@/common/utils/ways';
import { useMethods } from '@lhb/hook';
import { deepCopy } from '@lhb/func';
import { postYNEvaluationPointExport } from '@/common/api/fishtogether';

const Filter: React.FC<any> = ({ onSearch, searchForm }) => {
  const [loading, setLoading] = useState(false);
  const methods = useMethods({
    async onExport() {
      setLoading(true);
      const params = deepCopy(searchForm.getFieldsValue());
      if (params.ssq?.length) {
        params.provinceId = params.ssq[0];
        params.cityId = params.ssq[1];
        params.districtId = params.ssq[2];
      }
      params.ssq = undefined;
      postYNEvaluationPointExport(params).then(res => {
        if (res?.url) {
          downloadFile({
            name: '测评点位列表.xlsx',
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
      labelLength={8}
      onSearch={onSearch}
      rightOperate={
        <Button type='primary' onClick={methods.onExport} className='mb-24' loading={loading}>
          导出报表
        </Button>
      }>
      <FormProvinceList config={{
        changeOnSelect: true
      }} label='所在城市' name='ssq' />
      <FormInput label='测评点位管理人员' name='developer' config={{ allowClear: true }} />
    </SearchForm>
  );
};

export default Filter;
