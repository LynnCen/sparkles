import { FC, useState } from 'react';
import { Col, Popover, Row } from 'antd';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import DataBarChart from '../DataBarChart';
const Module4: FC<any> = ({
  updateLabels,
  getLabel,
  getRangeRules,
  featureMap,
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
        featureMap.flow_population && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // trigger={['click', 'focus']}
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['flow_population', 0], ['flow_population', 1]], open)}
              content={<DataBarChart
                name={[['flow_population', 0], ['flow_population', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={-999999} max={999999}
                cutBin={featureMap.flow_population} enName='flow_population' detail={detail}/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('流动人口', 'flow_population')}
                  name={[['flow_population', 0], ['flow_population', 1]]}
                  min={-999999}
                  max={999999}
                  precision={1}
                  extra='万'
                  rules={[
                    getRangeRules([['flow_population', 0], ['flow_population', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.shopping_passenger_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['shopping_passenger_1000m', 0], ['shopping_passenger_1000m', 1]], open)}
              content={<DataBarChart
                name={[['shopping_passenger_1000m', 0], ['shopping_passenger_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.shopping_passenger_1000m} enName='shopping_passenger_1000m' detail={detail}/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('商圈客流量', 'shopping_passenger_1000m')}
                  name={[['shopping_passenger_1000m', 0], ['shopping_passenger_1000m', 1]]}
                  min={0}
                  max={1000000}
                  precision={0}
                  rules={[
                    getRangeRules([['shopping_passenger_1000m', 0], ['shopping_passenger_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.woman_population_proportion && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['woman_population_proportion', 0], ['woman_population_proportion', 1]], open)}
              content={<DataBarChart
                name={[['woman_population_proportion', 0], ['woman_population_proportion', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={100}
                cutBin={featureMap.woman_population_proportion} enName='woman_population_proportion' detail={detail}/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('女性人口占比', 'woman_population_proportion')}
                  name={[['woman_population_proportion', 0], ['woman_population_proportion', 1]]}
                  min={0}
                  max={100}
                  precision={1}
                  // extra='%'
                  rules={[
                    getRangeRules([['woman_population_proportion', 0], ['woman_population_proportion', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.woman_power_300m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['woman_power_300m', 0], ['woman_power_300m', 1]], open)}
              content={<DataBarChart
                name={[['woman_power_300m', 0], ['woman_power_300m', 1]]}
                isOpen={popoverIsOpen}
                form={form } min={0} max={1000000}
                cutBin={featureMap.woman_power_300m}
                enName='woman_power_300m'
                detail={detail}
                explainText='商圈周边300M女性人口热力'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边女性群体', 'woman_power_300m')}
                  name={[['woman_power_300m', 0], ['woman_power_300m', 1]]}
                  min={0}
                  max={1000000}
                  precision={1}
                  rules={[
                    getRangeRules([['woman_power_300m', 0], ['woman_power_300m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.young_power_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['young_power_1000m', 0], ['young_power_1000m', 1]], open)}
              content={<DataBarChart
                name={[['young_power_1000m', 0], ['young_power_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0}max={1000000}
                cutBin={featureMap.young_power_1000m}
                enName='young_power_1000m'
                detail={detail}
                explainText='商圈周边1000M年轻人群热力'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边年轻群体', 'young_power_1000m')}
                  name={[['young_power_1000m', 0], ['young_power_1000m', 1]]}
                  min={0}
                  max={1000000}
                  precision={1}
                  rules={[
                    getRangeRules([['young_power_1000m', 0], ['young_power_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.work_power_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['work_power_1000m', 0], ['work_power_1000m', 1]], open)}
              content={<DataBarChart
                name={[['work_power_1000m', 0], ['work_power_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.work_power_1000m}
                enName='work_power_1000m'
                detail={detail}
                explainText='商圈周边1KM工作人群热力值'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('工作人群热力', 'work_power_1000m')}
                  name={[['work_power_1000m', 0], ['work_power_1000m', 1]]}
                  min={0}
                  max={1000000}
                  precision={1}
                  rules={[
                    getRangeRules([['work_power_1000m', 0], ['work_power_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.high_consumption_power_300m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['high_consumption_power_300m', 0], ['high_consumption_power_300m', 1]], open)}
              content={<DataBarChart
                name={[['high_consumption_power_300m', 0], ['high_consumption_power_300m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.high_consumption_power_300m}
                enName='high_consumption_power_300m'
                detail={detail}
                explainText='周边300M高消费人群热力值'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边高消费人群热力', 'high_consumption_power_300m')}
                  name={[['high_consumption_power_300m', 0], ['high_consumption_power_300m', 1]]}
                  min={0}
                  max={1000000}
                  precision={1}
                  rules={[
                    getRangeRules([['high_consumption_power_300m', 0], ['high_consumption_power_300m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.high_house_price_power_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['high_house_price_power_1000m', 0], ['high_house_price_power_1000m', 1]], open)}
              content={<DataBarChart
                name={[['high_house_price_power_1000m', 0], ['high_house_price_power_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.high_house_price_power_1000m} enName='high_house_price_power_1000m'
                detail={detail}
                explainText='周边1KM高房价人群热力值'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边高房价人群热力', 'high_house_price_power_1000m')}
                  name={[['high_house_price_power_1000m', 0], ['high_house_price_power_1000m', 1]]}
                  min={0}
                  max={1000000}
                  precision={1}
                  rules={[
                    getRangeRules([['high_house_price_power_1000m', 0], ['high_house_price_power_1000m', 1]])
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

export default Module4;
