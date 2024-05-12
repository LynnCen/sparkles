/**
 * @Description 集客点报表-明细-筛选项
 */

import { FC, useEffect, useState } from 'react';
import { Form } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import { isArray } from '@lhb/func';
import styles from './index.module.less';
import { getSelectionCompany } from '@/common/api/yhtang';
import dayjs from 'dayjs';
interface FilterProps {
  onSearch: Function, // 搜索函数
  setDetailedParams: any,
  type?:string // 查询类型
}

const Filter: FC<FilterProps> = ({
  onSearch,
  setDetailedParams,
  type
}) => {
  const [form] = Form.useForm();
  const branchCompanyId = Form.useWatch('branchCompanyId', form);
  const dateRange = Form.useWatch('dateRange', form);

  const [companyOptions, setCompanyOptions] = useState<any[]>([]);

  useEffect(() => {
    getCompanies();
  }, []);

  // 分公司筛选下拉选项
  const getCompanies = () => {
    getSelectionCompany().then((data) => {
      isArray(data) && data.length && setCompanyOptions(data);
    });
  };

  useEffect(() => {
    const hasDate = isArray(dateRange) && dateRange.length === 2;
    const params = {
      branchCompanyId,
      spotCreatedAtStart: hasDate ? dayjs(dateRange[0]).format('YYYY-MM-DD') : null,
      spotCreatedAtEnd: hasDate ? dayjs(dateRange[1]).format('YYYY-MM-DD') : null,
    };
    // 集客点列表表头
    if (type === 'planSpot') {
      setDetailedParams((state) => ({
        ...state,
        planSpot: params
      }));
    }
    setDetailedParams((state) => ({
      ...state,
      detailed: params
    })); ;
    // console.log('setDetailedParams', params);
  }, [branchCompanyId, dateRange]);

  /**
   * @description 查询时部分参数特殊处理
   * @param value 参数
   */
  const handleSearch = (value: any) => {
    const { dateRange } = value;
    // 时间参数处理
    if (isArray(dateRange) && dateRange.length === 2) {
      value.spotCreatedAtStart = dayjs(dateRange[0]).format('YYYY-MM-DD');
      value.spotCreatedAtEnd = dayjs(dateRange[1]).format('YYYY-MM-DD');
    } else {
      value.spotCreatedAtStart = undefined;
      value.spotCreatedAtEnd = undefined;
    }

    const _params = form.getFieldsValue();// 为了让查询动态化
    const params = {
      ..._params,
      ...value
    };
    delete params.dateRange;

    onSearch && onSearch(params);
  };

  return (
    <div>
      <SearchForm
        form={form}
        labelLength={6}
        onSearch={handleSearch}
        className={styles.searchFromCon}
      >
        <V2FormSelect
          name='branchCompanyId'
          label='分公司筛选'
          options={companyOptions}
          config={{
            fieldNames: {
              label: 'name',
              value: 'id',
            }
          }}
          required
        />
        <V2FormRangePicker
          label='录入时间'
          name='dateRange'
        />
      </SearchForm>
    </div>
  );
};

export default Filter;
