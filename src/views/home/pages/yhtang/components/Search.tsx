/**
 * @Description 搜索部分
 */
import { FC, useEffect, useState } from 'react';
import { Affix, Form, Cascader } from 'antd';
import { getSelectionArea } from '@/common/api/yhtang';
import { isArray } from '@lhb/func';
import { defaultTimeType, timeOptions, disabledTimeType } from '../ts-config';
import styles from '../entry.module.less';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { getSelectionCompany } from '@/common/api/yhtang';
// 引入季度插件
dayjs.extend(quarterOfYear);

const Search: FC<any> = ({
  setSearchParams
}) => {
  const [searchForm] = Form.useForm();
  const companyIds = Form.useWatch('companyIds', searchForm);

  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [areaReady, setAreaReady] = useState<boolean>(false);
  const [companyReady, setCompanyReady] = useState<boolean>(false);

  const [rangeIsDisabled, setRangeIsDisabled] = useState<boolean>(!!disabledTimeType.find((item:any) => item.value === defaultTimeType.value)); // 时间范围组件是否禁用
  // 为了让查询动态化
  const onSearch = (data: any) => {
    // 为了让查询动态化
    const formValues = searchForm.getFieldsValue();
    const obj: any = {
      ...formValues,
      ...data
    };
    const { cityIds, dateRange, companyIds } = obj;
    const params: any = {};
    if (isArray(dateRange) && dateRange.length) {
      params.start = dateRange[0].format('YYYY-MM-DD');
      params.end = dateRange[1].format('YYYY-MM-DD');
    }
    if (isArray(cityIds) && cityIds.length) {
      // console.log(`cityIds`, cityIds);
      const ids: number[] = [];
      cityIds.forEach((item: number[]) => {
        ids.push(item[1]);
      });
      params.cityIds = ids;
    }
    if (isArray(companyIds) && companyIds.length) {
      params.companyIds = companyIds;
    }
    // console.log(`筛选参数`, params);
    setSearchParams(params);
  };

  useEffect(() => {
    getAreas();
    getCompanies();
  }, []);

  useEffect(() => {
    if (areaReady && companyReady) {
      // 初次完成区域和分公司的筛选项获取，执行默认处理
      defaultHandle();
    }
  }, [areaReady, companyReady]);

  useEffect(() => {
    // 分公司变动重新获取分公司对应的区域选项、并清空之前区域设置
    searchForm.setFieldValue('cityIds', null);
    getAreas();
  }, [companyIds]);

  // 区域筛选下拉选项
  const getAreas = () => {
    getSelectionArea({ companyIds }).then((data) => {
      isArray(data) && data.length && setAreaOptions(data);
      // 自动选择城市
      if (isArray(companyIds) && companyIds.length) {
        const citadels:any[] = [];
        data.forEach((pro) => {
          const ci = pro.cities ? pro.cities.map((city) => [pro.id, city.id]) : [pro.id];
          citadels.push(...ci);
        });
        companyIds && searchForm.setFieldValue('cityIds', citadels);
      }
    }).finally(() => {
      setAreaReady(true);
    });
  };
  // 分公司筛选下拉选项
  const getCompanies = () => {
    getSelectionCompany().then((data) => {
      isArray(data) && data.length && setCompanyOptions(data);
    }).finally(() => {
      setCompanyReady(true);
    });
  };

  const defaultHandle = () => {
    // 赋值默认值
    if (searchForm) {
      searchForm.setFieldValue('timeType', defaultTimeType.value); // 默认本年
      changeHandle(defaultTimeType.value, defaultTimeType);
    }
    onSearch({});
  };
  // 统计时间change事件
  const changeHandle = (val: number, option: any) => {
    const { mapVal } = option;
    const isDisabled = !!disabledTimeType.find((item:any) => item.value === option.value);
    setRangeIsDisabled(isDisabled);
    const start = dayjs().startOf(mapVal); // .format('YYYY-MM-DD');
    const end = dayjs().endOf(mapVal); // .format('YYYY-MM-DD');
    if (isDisabled) {
      searchForm.setFieldValue('dateRange', [start, end]);
      return;
    }
    // searchForm.setFieldValue('dateRange', '');
  };

  return (
    <Affix offsetTop={0}>
      <SearchForm
        form={searchForm}
        onSearch={onSearch}
        className={styles.searchCon}
        labelLength={5}
        onOkText='搜索'
        onCustomerReset={defaultHandle}>
        <V2FormSelect
          label='统计时间'
          name='timeType'
          options={timeOptions}
          allowClear={false}
          config={{
            onChange: changeHandle,
            getPopupContainer: (node) => node.parentNode,
          }}
        />
        <V2FormRangePicker
          name='dateRange'
          disabled={rangeIsDisabled}
          config={{
            getPopupContainer: (node) => node.parentNode as HTMLDivElement,
          }}
        />
        <V2FormSelect
          name='companyIds'
          label='分公司筛选'
          options={companyOptions}
          config={{
            mode: 'multiple',
            maxTagCount: 'responsive',
            fieldNames: {
              label: 'name',
              value: 'id',
            }
          }}
        />
        <V2FormCascader
          label='区域筛选'
          name='cityIds'
          options={areaOptions}
          placeholder='全部'
          onChange={() => {
            const m = searchForm.getFieldValue('cityIds');
            console.log('m', m);
          }}
          config={{
            multiple: true,
            fieldNames: {
              label: 'name',
              value: 'id',
              children: 'cities'
            },
            showCheckedStrategy: Cascader.SHOW_CHILD,
            maxTagCount: 'responsive',
            getPopupContainer: (node) => node.parentNode,
          }}
        />
      </SearchForm>
    </Affix>
  );
};

export default Search;

