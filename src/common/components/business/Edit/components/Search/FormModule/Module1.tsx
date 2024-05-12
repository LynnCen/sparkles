import { FC } from 'react';
import { Col, Row, Form } from 'antd';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import { refactorSelection } from '@lhb/func';
const Module1: FC<any> = ({
  getRangeRules,
  selections,
  searchMoreForm
}) => {
  // 筛选商圈类型时，不同商圈类型需匹配不同筛选条件
  const interiorBusinessSearchValue = Form.useWatch('secondLevelCategory', searchMoreForm);
  // 此时label已一级菜单文字匹配，产品已和数据提需求加id
  const handleShowSelect = (label) => {
    if (!interiorBusinessSearchValue || !interiorBusinessSearchValue?.length) return true;
    let flag = false;
    interiorBusinessSearchValue.map((item) => {
      if (item.includes(label)) flag = true;
    });
    return flag;
  };
  return (
    <Row gutter={16}>
      <Col span={12}>
        <V2FormSelect
          label='区县GDP排行'
          name='district_gdp_rank'
          mode='multiple'
          config={{ maxTagCount: 'responsive' }}
          options={refactorSelection(selections.districtGdpRank)}/>
      </Col>
      <Col span={12}>
        <V2FormSelect
          label='所在乡镇常住人口'
          name='street_stable_person'
          mode='multiple'
          config={{ maxTagCount: 'responsive' }}
          options={refactorSelection(selections.streetStablePerson)}/>
      </Col>
      {handleShowSelect('产业园') ? <Col span={12}>
        <V2FormRangeInput
          label='所在产业园区企业数'
          name={[['industrial_park_companies', 0], ['industrial_park_companies', 1]]}
          min={0}
          max={10000}
          precision={0}
          extra='个'
          rules={[
            getRangeRules([['industrial_park_companies', 0], ['industrial_park_companies', 1]])
          ]}
        />
      </Col> : <></>}
      {handleShowSelect('文教型') ? <Col span={12}>
        <V2FormSelect
          label='商圈内是否有小学'
          name='have_primary_school'
          options={refactorSelection(selections.havePrimarySchool)}/>
      </Col> : <></>}
      <Col span={12}>
        <V2FormRangeInput
          label='商圈内商场客流量'
          name={[['mall_flow', 0], ['mall_flow', 1]]}
          min={0}
          max={1000000}
          precision={0}
          extra='人'
          rules={[
            getRangeRules([['mall_flow', 0], ['mall_flow', 1]])
          ]}
        />
      </Col>
      {handleShowSelect('社区型') ? <Col span={12}>
        <V2FormRangeInput
          label='商圈内小区户数'
          name={[['households', 0], ['households', 1]]}
          min={0}
          max={1000000}
          precision={0}
          extra='户'
          rules={[
            getRangeRules([['households', 0], ['households', 1]])
          ]}
        />
      </Col> : <></>}
      {handleShowSelect('交通枢纽型') ? <Col span={12}>
        <V2FormSelect
          label='商圈内是否有汽车站'
          name='have_bus_station'
          options={refactorSelection(selections.haveBusStation)}/>
      </Col> : <></>}
      <Col span={12}>
        <V2FormSelect
          label='商圈内医院类型'
          name='hospital_type'
          options={refactorSelection(selections.hospitalType)}/>
      </Col>

      {handleShowSelect('景区') ? <Col span={12}>
        <V2FormSelect
          label='商圈内景区等级'
          name='scenic_spots_level'
          options={refactorSelection(selections.scenicSpotsLevel)}/>
      </Col> : <></>}
    </Row>
  );
};

export default Module1;
