import React, { useEffect, useMemo, useState } from 'react';
import { Button, Space, message } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import FormSelect from '@/common/components/Form/FormSelect';
import FormInput from '@/common/components/Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
// import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import { downloadFile, refactorSelection } from '@/common/utils/ways';
import { useMethods } from '@lhb/hook';
import { postYNSelectionList, postYNTaskPointExport } from '@/common/api/fishtogether';
import { deepCopy } from '@lhb/func';
import dayjs from 'dayjs';

const Filter: React.FC<any> = ({
  onSearch,
  searchForm,
  setVisible,
  permissions
}) => {
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
      if (params.orderTime?.length) {
        params.orderStart = dayjs(params.orderTime[0]).format('YYYY-MM-DD');
        params.orderEnd = dayjs(params.orderTime[1]).format('YYYY-MM-DD');
      }
      params.orderTime = undefined;
      postYNTaskPointExport(params)
        .then((res) => {
          if (res?.url) {
            downloadFile({
              name: '落位记录明细表.xlsx',
              url: res.url,
            });
          } else {
            message.warning('表格数据异常或无数据');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    onImport() {
      setVisible(true);
    },
  });
  useEffect(() => {
    postYNSelectionList().then((res) => {
      setSelection(res);
    });
  }, []);
  // 是否有导出的按钮权限 //
  const hasExportPermission = useMemo(() => {
    return !!permissions.find((item: any) => item.event === 'ynPoint:import');
  }, [permissions]);
  return (
    <SearchForm
      form={searchForm}
      labelLength={6}
      onSearch={onSearch}
      rightOperate={
        <Space>
          <Button type='primary' onClick={methods.onExport} className='mb-24' loading={loading}>
            导出报表
          </Button>
          {
            hasExportPermission ? <Button type='primary' onClick={methods.onImport} className='mb-24' loading={loading}>
            导入
            </Button> : null
          }
        </Space>
      }
    >
      <FormProvinceList
        config={{
          changeOnSelect: true,
        }}
        label='所在城市'
        name='ssq'
      />
      <FormSelect
        label='所属开发部'
        name='departmentId'
        options={refactorSelection(selection?.department)}
        config={{ allowClear: true }}
      />
      <FormInput label='加盟商姓名' name='franchiseeName' config={{ allowClear: true }} />
      <FormInput label='对接开发人员' name='developer' config={{ allowClear: true }} />
      <FormRangePicker label='接单日期' name='orderTime' />
      {/* <FormInputNumberRange label='预计日均实收' min={0} max={10000000} name='income' addonAfter='元' /> */}
      <FormSelect
        label='初始类别'
        name='customerType'
        options={refactorSelection(selection?.customerType)}
        config={{ allowClear: true }}
      />
      <FormSelect
        label='店型'
        name='shopCategory'
        options={refactorSelection(selection?.shopCategory)}
        config={{ allowClear: true }}
      />
      <FormInput label='授权号' name='authNo' config={{ allowClear: true }} />
    </SearchForm>
  );
};

export default Filter;
