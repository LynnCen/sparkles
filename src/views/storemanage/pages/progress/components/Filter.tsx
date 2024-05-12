import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import { Button, Col, Row } from 'antd';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import dayjs from 'dayjs';
import { post } from '@/common/request';
import { downloadFile, refactorSelection } from '@/common/utils/ways';
import { chancePointSelection, chancePointAsicsSelection } from '@/common/api/storemanage';

interface IProps {
  onSearch: (values?: any) => void;
  params: any;
  isAsics: boolean;
}

const Filter: React.FC<IProps> = ({
  onSearch,
  params,
  isAsics
}) => {
  const [options, setOptions] = useState<{ locationShopCategory: any[] }>({
    locationShopCategory: [],
  });

  useEffect(() => {
    (async () => {
      // const result = await commonSelection({ keys: ['locationShopCategory'] });
      // setOptions({ locationShopCategory: result.locationShopCategory });
      const getSelection = isAsics ? chancePointAsicsSelection : chancePointSelection;
      const result = await getSelection({
        keys: ['shopCategory'],
      });
      setOptions({
        locationShopCategory: result.shopCategory,
        // locationShopProgress: result.shopStatus,
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
      ...((values?.statisticalStart && {
        createdAtMin: dayjs(values.statisticalStart[0]).format('YYYY-MM-DD'),
        createdAtMax: dayjs(values.statisticalStart[1]).format('YYYY-MM-DD'),
      }) || {
        createdAtMin: undefined,
        createdAtMax: undefined,
      }),
      ...((values.minOrder && { minOrder: values.minOrder.min, maxOrder: values.minOrder.max }) || {
        minOrder: undefined,
        maxOrder: undefined,
      }),
    };
    delete params.statisticalStart;
    onSearch(params);
  };

  const onExport = async () => {
    // https://yapi.lanhanba.com/project/353/interface/api/46150
    const apiUrl = isAsics ? '/expandShop/asics/task/progressStatistics/export' : '/expandShop/task/progressStatistics/export';
    const result = await post(apiUrl, params, true);
    downloadFile({
      name: '拓店进展统计报表.xlsx',
      url: result + '?attname=' + '拓店进展统计报表.xlsx',
    });
  };
  return (
    <Row>
      <Col span={22}>
        <FormSearch labelLength={6} onSearch={onFinish}>
          <V2FormProvinceList label='所在城市' name='cityId' type={2} />
          <V2FormSelect label='店铺类型' name='shopCategory' options={refactorSelection(options.locationShopCategory)}/>
          <V2FormRangePicker label='统计日期' name='statisticalStart' />
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
