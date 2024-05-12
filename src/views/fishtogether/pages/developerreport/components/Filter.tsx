import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import FormSelect from '@/common/components/Form/FormSelect';
import FormInput from '@/common/components/Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
// import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import { downloadFile, refactorSelection } from '@/common/utils/ways';
import { useMethods } from '@lhb/hook';
import { postYNEvaluationReportExport, postYNSelectionList } from '@/common/api/fishtogether';
import { deepCopy } from '@lhb/func';
import dayjs from 'dayjs';

const Filter: React.FC<any> = ({ onSearch, searchForm }) => {
  const [selection, setSelection] = useState<any>({});
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
      if (params.contractTime?.length) {
        params.contractStart = dayjs(params.contractTime[0]).format('YYYY-MM-DD');
        params.contractEnd = dayjs(params.contractTime[1]).format('YYYY-MM-DD');
      }
      params.contractTime = undefined;
      postYNEvaluationReportExport(params).then(res => {
        if (res?.url) {
          downloadFile({
            name: '提报明细列表.xlsx',
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
      labelLength={6}
      onSearch={onSearch}
      rightOperate={
        <Button type='primary' onClick={methods.onExport} className='mb-24' loading={loading}>
          导出报表
        </Button>
      }>
      <FormProvinceList config={{
        changeOnSelect: true
      }} label='所在城市' name='ssq' />
      <FormSelect label='所属开发部' name='departmentId' options={refactorSelection(selection?.department)} config={{ allowClear: true }} />
      <FormSelect label='开发人员职务' name='positionId' options={refactorSelection(selection?.position)} config={{ allowClear: true }} />
      <FormInput label='对接开发人员' name='developer' config={{ allowClear: true }} />
      <FormRangePicker label='回合同日期' name='contractTime' />
      {/* <FormInputNumberRange label='预计日均实收' min={0} max={10000000} name='income' addonAfter='元' /> */}
      <FormSelect label='初始类别' name='customerType' options={refactorSelection(selection?.customerType)} config={{ allowClear: true }} />
      <FormSelect label='店型' name='shopCategory' options={refactorSelection(selection?.shopCategory)} config={{ allowClear: true }} />
      <FormInput label='授权号' name='authNo' config={{ allowClear: true }} />
    </SearchForm>
  );
};

export default Filter;
