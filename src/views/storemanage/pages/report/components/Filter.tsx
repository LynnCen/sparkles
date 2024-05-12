import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import dayjs from 'dayjs';
import { post } from '@/common/request';
import { downloadFile, refactorSelection } from '@/common/utils/ways';
import { chancePointSelection, chancePointAsicsSelection } from '@/common/api/storemanage';
interface IProps {
  onSearch: (values?: any) => void;
  params: any;
  isAsics: boolean;
  // isBabyCare?: boolean;
}

const Filter: React.FC<IProps> = ({
  onSearch,
  params,
  isAsics
  // isBabyCare
}) => {
  const [options, setOptions] = useState<{ locationShopCategory: any[]; locationShopProgress: any[] }>({
    locationShopCategory: [],
    locationShopProgress: [],
  });

  useEffect(() => {
    (async () => {
      // const result = await chancePointSelection({
      //   keys: ['shopStatus', 'shopCategory'],
      // });
      // setOptions({
      //   locationShopCategory: result.shopCategory,
      //   locationShopProgress: result.shopStatus,
      // });
      const getSelection = isAsics ? chancePointAsicsSelection : chancePointSelection;
      const result = await getSelection({
        keys: ['shopStatus', 'shopCategory'],
      });
      setOptions({
        locationShopCategory: result.shopCategory,
        locationShopProgress: result.shopStatus,
      });
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values) => {
    const params = {
      ...values,
      ...((Array.isArray(values?.cityId) &&
        values?.cityId.length && { provinceId: values.cityId[0], cityId: values.cityId[1] }) || {
        provinceId: undefined,
        cityId: undefined,
      }),
      ...((values?.start && {
        createdAtMin: dayjs(values.start[0]).format('YYYY-MM-DD'),
        createdAtMax: dayjs(values.start[1]).format('YYYY-MM-DD'),
      }) || {
        createdAtMin: undefined,
        createdAtMax: undefined,
      }),
      ...((values.guaranteedSaleMin && {
        guaranteedSaleMin: values.guaranteedSaleMin.min,
        guaranteedSaleMax: values.guaranteedSaleMin.max,
      }) || {
        guaranteedSaleMin: undefined,
        guaranteedSaleMax: undefined,
      }),
      ...((values.flowWeekdayMin && { flowWeekdayMin: values.flowWeekdayMin.min, flowWeekdayMax: values.flowWeekdayMin.max }) || {
        flowWeekdayMin: undefined,
        flowWeekdayMax: undefined,
      }),
      ...((values.flowWeekendMin && { flowWeekendMin: values.flowWeekendMin.min, flowWeekendMax: values.flowWeekendMin.max }) || {
        flowWeekendMin: undefined,
        flowWeekendMax: undefined,
      }),
    };
    delete params.start;
    onSearch(params);
  };

  const onExport = async () => {
    // https://yapi.lanhanba.com/project/353/interface/api/46136
    const apiUrl = isAsics ? `/expandShop/detailReport/asics/export` : `/expandShop/detailReport/export`;
    // https://yapi.lanhanba.com/project/353/interface/api/34468
    const result = await post(apiUrl, params, true);
    downloadFile({
      name: '拓店明细报表.xlsx',
      url: result + '?attname=' + '拓店明细报表.xlsx',
    });
  };

  return (
    <Row>
      <Col span={22}>
        <FormSearch labelLength={7} onSearch={onFinish}>
          <V2FormProvinceList label='所在城市' name='cityId' type={2} />
          <V2FormSelect label='店铺类型' name='shopCategory' options={refactorSelection(options.locationShopCategory)}/>
          <V2FormSelect label='当前阶段' name='shopStatus' options={refactorSelection(options.locationShopProgress)}/>
          <V2FormInput label='责任人' name='responsibleName' />
          <V2FormInput label='店铺名称' name='keyword' />
          <V2FormRangePicker label='统计日期' name='start'/>
          {/* 未来请使用 V2FormRangeInput，而不是FormInputNumberRange */}
          <FormInputNumberRange label='保本销售额' min={0} max={10000000} name='guaranteedSaleMin' addonAfter='元' />
          {/* 未来请使用 V2FormRangeInput，而不是FormInputNumberRange */}
          <FormInputNumberRange label='工作日日均客流' min={0} max={10000000} name='flowWeekdayMin' addonAfter='人次' />
          {/* 未来请使用 V2FormRangeInput，而不是FormInputNumberRange */}
          <FormInputNumberRange label='节假日日均客流' min={0} max={10000000} name='flowWeekendMin' addonAfter='人次' />
        </FormSearch>
      </Col>
      <Col span={2} style={{ textAlign: 'right' }}>
        <Button type='primary' onClick={onExport}>
          导出报表
        </Button>
      </Col>
    </Row>
  );
};

export default Filter;
