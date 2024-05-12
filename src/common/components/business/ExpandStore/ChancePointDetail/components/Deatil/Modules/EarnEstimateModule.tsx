/**
 * @Description 收益预估组件
 */
import TopItem from '@/common/components/business/StoreDetail/components/TopItem';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { FC } from 'react';
import cs from 'classnames';
import styles from '../index.module.less';
import { isArray } from '@lhb/func';
import { Col, Row } from 'antd';
import { decodeTextValue } from '@/common/components/business/StoreDetail/components/DynamicDetail/config';
import V2Empty from '@/common/components/Data/V2Empty';
import { ModuleDetailsType } from '../type';

/** 收益预估组件传参类型 */
interface EarnEstimateModuleProps {
  data: ModuleDetailsType
  detailInfoConfig?;
  [p: string]: any;
}
/** 收益预估组件 */
const EarnEstimateModule: FC<EarnEstimateModuleProps> = ({
  data,
  detailInfoConfig = { span: 6 },
}) => {

  /** 收益预估每个item组件--当前只会返回controlType为7的数字类型*/
  const FieldItem = ({ item, className }) => {
    const textValue = decodeTextValue(item?.controlType, item?.textValue);
    const count = textValue?.value; // 数字
    const unit = textValue?.suffix || ''; // 单位
    const name = item.anotherName || item.name; // 衡量名称

    return (
      <div className={className}>
        <TopItem title={name} count={count} unit={unit} />
      </div>);
  };

  return (
    <div>
      <TitleTips name={data.moduleTypeName} showTips={false} />
      {isArray(data.earnEstimateModule) && (
        <div className={cs(styles.fieldItemModule, 'mt-16')}>
          {data.earnEstimateModule.length ? (
            <Row gutter={24}>
              {data.earnEstimateModule.map((field) => (
                <Col key={field.id} {...detailInfoConfig}>
                  <FieldItem
                    item={field}
                    key={field.id}
                    className={styles.fieldItem}/>
                </Col>
              ))}
            </Row>)
            : <V2Empty/>}
        </div>
      )}
    </div>
  );
};

export default EarnEstimateModule;
