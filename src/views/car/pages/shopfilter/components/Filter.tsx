import React, { useEffect } from 'react';

import ElasticSearchForm from '@/common/components/Form/ElasticSearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormSelect from '@/common/components/Form/FormSelect';
import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import { Button, Form } from 'antd';
import IconFont from '@/common/components/IconFont';
import { TargetChild } from '../ts-config';
import { formatSearchFormLabel } from './utils';
import { useSelector } from 'react-redux';
import styles from '../entry.module.less';
interface IProps {
  onSearch: (values?: any) => void;
  onSet: Function,
  selection: Array<TargetChild>
}
// 前端写死
const Options = {
  dateTypes: [
    { value: 1, label: '月日均' },
    { value: 2, label: '工作日日均' },
    { value: 3, label: '节假日日均' }
  ],
  industries: [
    { value: 352, label: '汽车' },
    { value: 359, label: '服饰鞋包' },
    { value: 357, label: '教育培训' },
    { value: 364, label: '新零售' },
    { value: 354, label: '食品酒饮' },
    { value: 356, label: '电子产品' },
  ]
};

const FixedFields = ['dateType', 'industryId', 'shopName', 'cityIds', 'aveFlow'];

const Filter: React.FC<IProps> = ({
  selection = [],
  onSearch,
  onSet
}) => {
  const [form] = Form.useForm();
  const provincesCities = useSelector((state: any) => state.common.provincesCities);

  useEffect(() => {
    form.setFieldValue('dateType', 1);
    form.setFieldValue('industryId', 352);
  }, [form]);
  const onReset = () => {
    form.setFieldValue('dateType', 1);
    form.setFieldValue('industryId', 352);
  };
  const generateCities = (ids: any) => {
    if (!ids) return [];
    const cityIds: number[] = [];
    ids.forEach((item) => {
      if (item.length === 1) {
        cityIds.push(...provincesCities[item[0] - 1].children.map((city) => city.id));
        return;
      }
      cityIds.push(item[1]);
    });
    return cityIds;
  };
  const onFinish = (values: Record<string, any>) => {
    const params: Record<string, any> = {};
    FixedFields.forEach(field => {
      if (field === 'cityIds') {
        params.cityIds = generateCities(values.cityIds);
      } else if (field === 'aveFlow') {
        // params.aveFlowMin = values.aveFlow ? values.aveFlow.min / 100 : undefined;
        // params.aveFlowMax = values.aveFlow ? values.aveFlow.max / 100 : undefined;
        // 不除100
        params.aveFlowMin = values.aveFlow ? +values.aveFlow.min : undefined;
        params.aveFlowMax = values.aveFlow ? +values.aveFlow.max : undefined;
      } else {
        params[field] = values[field] ? values[field] : undefined;
      }
    });
    const metaDatas: Array<any> = [];
    for (const [key, value] of Object.entries(values)) {
      if (FixedFields.indexOf(key) < 0) {
        metaDatas.push({
          metaCode: key,
          minIndex: value ? value.min / 100 : 0,
          maxIndex: value ? value.max / 100 : 1
        });
      }
    }
    params.metaDatas = metaDatas;
    onSearch(params);
  };
  const SelectBtn: React.FC<any> = () => {
    return (
      <Button
        type='link'
        onClick={() => onSet()}
        icon={<IconFont iconHref='iconicon_keliu' />}>
        指标选择({ selection ? selection.length : 0 })
      </Button>
    );
  };
  return (
    <ElasticSearchForm
      form={form}
      onCustomerReset={onReset}
      onSearch={onFinish}
      labelLength={9}
      isElastic
      extra={<SelectBtn />}>
      <FormSelect
        label='数据维度'
        name='dateType'
        options={Options.dateTypes}
      />
      <FormSelect
        label='关注行业'
        name='industryId'
        options={Options.industries}
      />
      <FormInput label='商场名称' name='shopName' />
      <FormProvinceList
        label='所在城市'
        config={{
          multiple: true,
          maxTagCount: 'responsive',
          changeOnSelect: true,
        }}
        name='cityIds'
        type={2} />
      <FormInputNumberRange
        label='日均客流指数'
        min={0}
        max={10000000}
        name='aveFlow'
        formItemConfig={{
          className: styles.rowFill
        }}/>
      {
        selection.length > 0 && selection.map((e) => (
          <FormInputNumberRange
            key={e.metaCode}
            label={formatSearchFormLabel(e)}
            min={0}
            max={100}
            name={e.metaCode}
            addonAfter='%'
          />
        ))
      }
    </ElasticSearchForm>
  );
};

export default Filter;
