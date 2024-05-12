/**
 * @Description 基础筛选
 */

import { FC, useMemo } from 'react';
import { Row, Col } from 'antd';
// import cs from 'classnames';
// import styles from './entry.module.less';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const Basic: FC<any> = ({
  districtData, // 区域数据
  commonSelectConfig,
  getRangeRules,
  pcdDataHandle, // 更改省市后，区的变化
  setDistrictData,
}) => {
  // 最多选择3项，其余禁用
  const districtOptions = useMemo(() => {
    const { data, ids } = districtData;
    if (ids?.length === 3) {
      return data?.map((item: any) => {
        const { id } = item;
        item.disabled = !ids.includes(id);
        return item;
      });
    }
    return data?.map((item: any) => {
      item.disabled = false;
      return item;
    });
  }, [districtData]);

  const provinceCityChange = async (value) => { // 省市的change事件
    pcdDataHandle && pcdDataHandle({
      provinceId: value?.[0],
      cityId: value?.[1],
      districtIds: []
    });
  };

  const districtChange = (values: any[]) => {
    setDistrictData((state) => ({ ...state, ids: values }));
  };
  return (
    <Row gutter={16}>
      <Col span={12}>
        <V2FormProvinceList
          label='省市'
          name='provinceCity'
          type={2}
          allowClear={false}
          config={{
            ...commonSelectConfig,
            onChange: provinceCityChange
          }}
        />
      </Col>
      <Col span={12}>
        <V2FormSelect
          label='城区'
          name='districtIds'
          options={districtOptions}
          mode='multiple'
          config={{
            ...commonSelectConfig,
            maxTagCount: 'responsive'
          }}
          onChange={districtChange}
        />
      </Col>
      <Col span={12}>
        <V2FormRangeInput
          label='行业评分'
          name={[['mainBrandsScore', 0], ['mainBrandsScore', 1]]}
          min={0}
          max={10000}
          precision={0}
          extra='分'
          rules={[
            getRangeRules([['mainBrandsScore', 0], ['mainBrandsScore', 1]])
          ]}
        />
      </Col>
    </Row>
  );
};

export default Basic;
