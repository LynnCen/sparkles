/**
 * 筛选条件---基础筛选
 */
import { FC, useState } from 'react';
import { Cascader, Col, Popover, Row } from 'antd';
import { refactorSelection } from '@lhb/func';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import SliderBarSelect from './SliderBarSelect';
const SearchFrom: FC<any> = ({
  getRangeRules,
  selections,
  // isBranch, // 是否是分公司
  form,
  // detail, // 实时查询数据 参数
}) => {
  const [probaVal, setProbaVal] = useState<number[]>([]);
  const minChange = (val: any) => {
    const targetVal = [val, probaVal[1]];
    setProbaVal(targetVal);
  };
  const maxChange = (val: any) => {
    const targetVal = [probaVal[0], val];
    setProbaVal(targetVal);
  };
  return (
    <Row gutter={16}>
      <Col span={12}>
        <V2FormCascader
          label='规划区域'
          name='districtIdList'
          options={refactorSelection(selections?.cities, { children: 'children' })}
          config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD, maxTagCount: 'responsive' }}
        />
      </Col>

      <Col span={12}>
        <Popover
          placement='bottomLeft'
          trigger='click'
          // destroyTooltipOnHide
          content={
            <SliderBarSelect
              form={form}
              // detail={detail}
              selections={selections}
              value={probaVal}
            />
          }>
          <>
            <V2FormRangeInput
              label='品牌适合度'
              name={[['proba', 0], ['proba', 1]]}
              min={0}
              extra='%'
              max={100}
              precision={0}
              minConfig={{
                onChange: minChange
              }}
              maxConfig={{
                onChange: maxChange
              }}
              rules={[
                getRangeRules([['proba', 0], ['proba', 1]])
              ]}
            />
          </>
        </Popover>
      </Col>

      {/* 商圈类型放在页面左侧信息中选择，筛选框中去除 */}
      {/* <Col span={12}>
        <V2FormCascader
          label='规划商圈'
          name='secondLevelCategory'
          options={refactorSelection(selections.businesses, { children: 'child' })}
          config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD, maxTagCount: 'responsive' }}
        />
      </Col> */}

      <Col span={12}>
        <V2FormRangeInput
          label='奶茶行业适合度'
          name={[['main_brands_proba', 0], ['main_brands_proba', 1]]}
          min={0}
          extra='%'
          max={100}
          precision={0}
          rules={[
            getRangeRules([['main_brands_proba', 0], ['main_brands_proba', 1]])
          ]}
        />
      </Col>
      <Col span={12}>
        <V2FormSelect
          label='是否已开店'
          name='isOpenStore'
          options={refactorSelection(selections?.isOpenStore)}/>
      </Col>
      {/* <Col span={12}>
        <V2FormSelect
          label={`${isBranch ? '规划状态' : '总部推荐状态'}`}
          name='isPlanned'
          // planStatus为'xx规划' isPlanned为'xx推荐'
          options={refactorSelection(isBranch ? selections.planStatus : selections.isPlanned)}/>
      </Col> */}
      {/* {
        isBranch ? <></> : <Col span={12}>
          <V2FormSelect
            label='分公司是否已规划'
            name='branchCompanyPlanStatus'
            options={refactorSelection(selections.planStatus)}/>
        </Col>
      } */}
      <Col span={12}>
        <V2FormSelect
          label='推荐开店数'
          name='recommend_stores'
          mode='multiple'
          config={{ maxTagCount: 'responsive' }}
          options={refactorSelection(selections?.recommendStores)}/>
      </Col>
      <Col span={12}>
        <V2FormRangeInput
          label='奶茶行业评分'
          name={[['main_brands_score', 0], ['main_brands_score', 1]]}
          min={0}
          max={10000}
          precision={0}
          extra='分'
          rules={[
            getRangeRules([['main_brands_score', 0], ['main_brands_score', 1]])
          ]}
        />
      </Col>
      <Col span={12}>
        <V2FormRangeInput
          label='预测日营业额'
          name={[['sales_amount_predict', 0], ['sales_amount_predict', 1]]}
          min={0}
          max={1000000}
          precision={0}
          extra='元'
          rules={[
            getRangeRules([['sales_amount_predict', 0], ['sales_amount_predict', 1]])
          ]}
        />
      </Col>
    </Row>

  );
};

export default SearchFrom;
