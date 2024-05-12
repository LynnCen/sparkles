import { FC, useState } from 'react';
import { Col, Popover, Row } from 'antd';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import DataBarChart from '../DataBarChart';
const Module5: FC<any> = ({
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
        featureMap.beauty_brands_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['beauty_brands_1000m', 0], ['beauty_brands_1000m', 1]], open)}
              content={<DataBarChart
                name={[['beauty_brands_1000m', 0], ['beauty_brands_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={10000}
                cutBin={featureMap.beauty_brands_1000m}
                enName='beauty_brands_1000m'
                detail={detail}
                explainText='商圈周边1KM的护肤品牌数'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边美妆品牌数量', 'beauty_brands_1000m')}
                  name={[['beauty_brands_1000m', 0], ['beauty_brands_1000m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['beauty_brands_1000m', 0], ['beauty_brands_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.leisure_food_brands_300m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['leisure_food_brands_300m', 0], ['leisure_food_brands_300m', 1]], open)}
              content={<DataBarChart
                name={[['leisure_food_brands_300m', 0], ['leisure_food_brands_300m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={10000}
                cutBin={featureMap.leisure_food_brands_300m} enName='leisure_food_brands_300m' detail={detail}
                explainText='商圈周边300M的品牌数'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边餐饮品牌数量', 'leisure_food_brands_300m')}
                  name={[['leisure_food_brands_300m', 0], ['leisure_food_brands_300m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['leisure_food_brands_300m', 0], ['leisure_food_brands_300m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.house_stores_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // //destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['house_stores_1000m', 0], ['house_stores_1000m', 1]], open)}
              content={<DataBarChart
                name={[['house_stores_1000m', 0], ['house_stores_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={10000}
                cutBin={featureMap.house_stores_1000m} enName='house_stores_1000m' detail={detail}
                explainText='商圈周边1KM小区数量'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边小区门店数量', 'house_stores_1000m')}
                  name={[['house_stores_1000m', 0], ['house_stores_1000m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['house_stores_1000m', 0], ['house_stores_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.house_price_300m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['house_price_300m', 0], ['house_price_300m', 1]], open)}
              content={<DataBarChart
                name={[['house_price_300m', 0], ['house_price_300m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.house_price_300m} enName='house_price_300m' detail={detail}
                explainText='商圈周边300M小区均价'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边300m小区房价', 'house_price_300m')}
                  name={[['house_price_300m', 0], ['house_price_300m', 1]]}
                  min={0}
                  max={1000000}
                  precision={0}
                  extra='元/㎡'
                  rules={[
                    getRangeRules([['house_price_300m', 0], ['house_price_300m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.house_price_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // //destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['house_price_1000m', 0], ['house_price_1000m', 1]], open)}
              content={<DataBarChart
                name={[['house_price_1000m', 0], ['house_price_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.house_price_1000m} enName='house_price_1000m' detail={detail}
                explainText='商圈周边1KM小区均价'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边1km小区房价', 'house_price_1000m')}
                  name={[['house_price_1000m', 0], ['house_price_1000m', 1]]}
                  min={0}
                  max={1000000}
                  precision={0}
                  extra='元/㎡'
                  rules={[
                    getRangeRules([['house_price_1000m', 0], ['house_price_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.medical_price_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['medical_price_1000m', 0], ['medical_price_1000m', 1]], open)}
              content={<DataBarChart
                name={[['medical_price_1000m', 0], ['medical_price_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000000}
                cutBin={featureMap.medical_price_1000m} enName='medical_price_1000m' detail={detail}
                explainText='电影院年度票房'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('电影院票房排行', 'medical_price_1000m')}
                  name={[['medical_price_1000m', 0], ['medical_price_1000m', 1]]}
                  min={0}
                  max={1000000000}
                  precision={0}
                  extra='亿'
                  rules={[
                    getRangeRules([['medical_price_1000m', 0], ['medical_price_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.life_customer_price_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['life_customer_price_1000m', 0], ['life_customer_price_1000m', 1]], open)}
              content={<DataBarChart
                name={[['life_customer_price_1000m', 0], ['life_customer_price_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.life_customer_price_1000m} enName='life_customer_price_1000m' detail={detail}
                explainText='商圈周边1KM生活服务客单价'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边生活服务客单价', 'life_customer_price_1000m')}
                  name={[['life_customer_price_1000m', 0], ['life_customer_price_1000m', 1]]}
                  min={0}
                  max={1000000}
                  precision={1}
                  extra='元'
                  rules={[
                    getRangeRules([['life_customer_price_1000m', 0], ['life_customer_price_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.apartment_customer_price_300m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['apartment_customer_price_300m', 0], ['apartment_customer_price_300m', 1]], open)}
              content={<DataBarChart
                name={[['apartment_customer_price_300m', 0], ['apartment_customer_price_300m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={1000000}
                cutBin={featureMap.apartment_customer_price_300m} enName='apartment_customer_price_300m' detail={detail}
                explainText='商圈周边300M商务住宅平均房价'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边商务住宅房价', 'apartment_customer_price_300m')}
                  name={[['apartment_customer_price_300m', 0], ['apartment_customer_price_300m', 1]]}
                  min={0}
                  max={1000000}
                  precision={1}
                  extra='元'
                  rules={[
                    getRangeRules([['apartment_customer_price_300m', 0], ['apartment_customer_price_300m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.shopping_stores_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['shopping_stores_1000m', 0], ['shopping_stores_1000m', 1]], open)}
              content={<DataBarChart
                name={[['shopping_stores_1000m', 0], ['shopping_stores_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form} min={0} max={10000}
                cutBin={featureMap.shopping_stores_1000m} enName='shopping_stores_1000m' detail={detail}
                explainText='商圈周边1KM购物服务数量'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边购物服务数量', 'shopping_stores_1000m')}
                  name={[['shopping_stores_1000m', 0], ['shopping_stores_1000m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['shopping_stores_1000m', 0], ['shopping_stores_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.leisure_stores_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['leisure_stores_1000m', 0], ['leisure_stores_1000m', 1]], open)}
              content={<DataBarChart
                name={[['leisure_stores_1000m', 0], ['leisure_stores_1000m', 1]]}
                isOpen={popoverIsOpen}
                form={form}
                min={0}
                max={10000}
                cutBin={featureMap.leisure_stores_1000m} enName='leisure_stores_1000m' detail={detail}
                explainText='商圈周边1KM休闲服务数量'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边休闲服务数量', 'leisure_stores_1000m')}
                  name={[['leisure_stores_1000m', 0], ['leisure_stores_1000m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['leisure_stores_1000m', 0], ['leisure_stores_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.food_number_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['food_number_1000m', 0], ['food_number_1000m', 1]], open)}
              content={<DataBarChart
                name={[['food_number_1000m', 0], ['food_number_1000m', 1]]}
                isOpen={popoverIsOpen}
                min={0}
                max={10000}
                form={form}
                cutBin={featureMap.food_number_1000m} enName='food_number_1000m' detail={detail}
                explainText='商圈周边300M内餐饮服务数量'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边餐饮数量', 'food_number_1000m')}
                  name={[['food_number_1000m', 0], ['food_number_1000m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['food_number_1000m', 0], ['food_number_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.university_stores_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['university_stores_1000m', 0], ['university_stores_1000m', 1]], open)}
              content={<DataBarChart
                name={[['university_stores_1000m', 0], ['university_stores_1000m', 1]]}
                isOpen={popoverIsOpen}
                min={0}
                max={10000}
                form={form}
                cutBin={featureMap.university_stores_1000m} enName='university_stores_1000m' detail={detail}
                explainText='商圈周边1KM大学数量'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边大学数量', 'university_stores_1000m')}
                  name={[['university_stores_1000m', 0], ['university_stores_1000m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['university_stores_1000m', 0], ['university_stores_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.office_stores_300m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['office_stores_300m', 0], ['office_stores_300m', 1]], open)}
              content={<DataBarChart
                name={[['office_stores_300m', 0], ['office_stores_300m', 1]]}
                isOpen={popoverIsOpen}
                min={0}
                max={10000}
                form={form}
                cutBin={featureMap.office_stores_300m} enName='office_stores_300m' detail={detail}
                explainText='商圈周边300M写字楼数量'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边写字楼数量', 'office_stores_300m')}
                  name={[['office_stores_300m', 0], ['office_stores_300m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['office_stores_300m', 0], ['office_stores_300m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.house_number_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['house_number_1000m', 0], ['house_number_1000m', 1]], open)}
              content={<DataBarChart
                name={[['house_number_1000m', 0], ['house_number_1000m', 1]]}
                isOpen={popoverIsOpen}
                min={0}
                max={10000}
                form={form}
                cutBin={featureMap.house_number_1000m} enName='house_number_1000m' detail={detail}
                explainText='商圈周边1KM小区数量'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边小区数量', 'house_number_1000m')}
                  name={[['house_number_1000m', 0], ['house_number_1000m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['house_number_1000m', 0], ['house_number_1000m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.leisure_min_distance_300m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['leisure_min_distance_300m', 0], ['leisure_min_distance_300m', 1]], open)}
              content={<DataBarChart
                name={[['leisure_min_distance_300m', 0], ['leisure_min_distance_300m', 1]]}
                isOpen={popoverIsOpen}
                min={0}
                max={10000}
                form={form}
                cutBin={featureMap.leisure_min_distance_300m} enName='leisure_min_distance_300m' detail={detail}
                explainText='商圈周边300M休闲服务数量'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边体育休闲服务数量', 'leisure_min_distance_300m')}
                  name={[['leisure_min_distance_300m', 0], ['leisure_min_distance_300m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['leisure_min_distance_300m', 0], ['leisure_min_distance_300m', 1]])
                  ]}
                />
              </>
            </Popover>
          </Col>
        )
      }
      {
        featureMap.scenic_1000m && (
          <Col span={12}>
            <Popover
              placement='topLeft'
              trigger='click'
              // destroyTooltipOnHide
              onOpenChange={(open) => onOpenChange([['scenic_1000m', 0], ['scenic_1000m', 1]], open)}
              content={<DataBarChart
                name={[['scenic_1000m', 0], ['scenic_1000m', 1]]}
                isOpen={popoverIsOpen}
                min={0}
                max={10000}
                form={form}
                cutBin={featureMap.scenic_1000m} enName='scenic_1000m' detail={detail}
                explainText='周边1KM内风景名胜数量'/>}>
              <>
                <V2FormRangeInput
                  label={getLabel('周边景区数量', 'scenic_1000m')}
                  name={[['scenic_1000m', 0], ['scenic_1000m', 1]]}
                  min={0}
                  max={10000}
                  precision={0}
                  extra='个'
                  rules={[
                    getRangeRules([['scenic_1000m', 0], ['scenic_1000m', 1]])
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

export default Module5;
