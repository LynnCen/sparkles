import { FC, useState } from 'react';
import { Col, Popover, Row } from 'antd';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import DataBarChart from '../DataBarChart';
const Module3: FC<any> = ({
  featureMap,
  updateLabels,
  getLabel,
  getRangeRules,
  detail,
  form
}) => {
  const [popoverIsOpen, setPopoverIsOpen] = useState<boolean>(false);

  const onOpenChange = (fieldsArr, open: boolean) => {
    setPopoverIsOpen(open);
    updateLabels(fieldsArr, open);
  };

  return (
    <Row gutter={16}>
      {
        featureMap.country_rank && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['country_rank', 0], ['country_rank', 1]], open)}
              content={<DataBarChart
                name={[['country_rank', 0], ['country_rank', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.country_rank} enName='country_rank' detail={detail}/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('全国人口排名', 'country_rank')}
                  name={[['country_rank', 0], ['country_rank', 1]]}
                  min={0}
                  max={1000000}
                  precision={0}
                  // extra='%'
                  rules={[
                    getRangeRules([['country_rank', 0], ['country_rank', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.avg_house_price && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['avg_house_price', 0], ['avg_house_price', 1]], open)}
              content={<DataBarChart
                name={[['avg_house_price', 0], ['avg_house_price', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.avg_house_price} enName='avg_house_price' detail={detail}/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('城市平均房价', 'avg_house_price')}
                  name={[['avg_house_price', 0], ['avg_house_price', 1]]}
                  min={0}
                  max={1000000}
                  precision={0}
                  // extra='%'
                  rules={[
                    getRangeRules([['avg_house_price', 0], ['avg_house_price', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.gdp && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['gdp', 0], ['gdp', 1]], open)}
              content={<DataBarChart
                name={[['gdp', 0], ['gdp', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.gdp} enName='gdp' detail={detail}/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('地区生产总值排名', 'gdp')}
                  name={[['gdp', 0], ['gdp', 1]]}
                  min={0}
                  max={1000000}
                  precision={0}
                  // extra='%'
                  rules={[
                    getRangeRules([['gdp', 0], ['gdp', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.old && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['old', 0], ['old', 1]], open)}
              content={<DataBarChart
                name={[['old', 0], ['old', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={10000000}
                cutBin={featureMap.old} enName='old' detail={detail}/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('城镇老人数量排名', 'old')}
                  name={[['old', 0], ['old', 1]]}
                  min={0}
                  max={10000000}
                  precision={0}
                  // extra='%'
                  rules={[
                    getRangeRules([['old', 0], ['old', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.town_income && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['town_income', 0], ['town_income', 1]], open)}
              content={<DataBarChart
                name={[['town_income', 0], ['town_income', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.town_income} enName='town_income' detail={detail}/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('城镇居民人均可支配收入排名', 'town_income')}
                  name={[['town_income', 0], ['town_income', 1]]}
                  min={0}
                  max={1000000}
                  precision={0}
                  extra='元'
                  rules={[
                    getRangeRules([['town_income', 0], ['town_income', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
    </Row>
  );
};

export default Module3;
