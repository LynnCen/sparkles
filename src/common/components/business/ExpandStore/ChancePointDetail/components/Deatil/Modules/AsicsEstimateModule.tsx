/**
 * @Description 亚瑟士定制模块 --评估预测
 */
import TopItem from '@/common/components/business/StoreDetail/components/TopItem';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { FC } from 'react';
import cs from 'classnames';
import styles from '../index.module.less';
import { Row, Col } from 'antd';
import { ModuleDetailsType } from '../type';

/** 亚瑟士定制组件传参类型 */
interface AsicsEstimateModuleProps {
  data:ModuleDetailsType;
  [p: string]: any;
}

/** 亚瑟士定制组件-评估预测 */
const AsicsEstimateModule: FC<AsicsEstimateModuleProps> = ({
  data
}) => {

  return (
    <div>
      <TitleTips name={data?.moduleTypeName} showTips={false} />
      <div className={cs(styles.fieldItemModule, 'mt-16')}>
        <Row gutter={24}>
          <Col span='6'>
            <TopItem title='客群质量评分' count={data.asicsEstimateModule?.flowMatchIndex} explain={data.asicsEstimateModule?.flowMatchExplanation}/>
          </Col>
          <Col span='6'>
            <TopItem title='预计销售额（元/天）' count={data.asicsEstimateModule?.sales} />
          </Col>
          <Col span='6'>
            <TopItem title='年坪效（元）' count={data.asicsEstimateModule?.yearAreaSales} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AsicsEstimateModule;
