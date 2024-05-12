/**
 * @Description Item
 */
import { FC } from 'react';
import { Row, Col } from 'antd';
import { colorStatus } from '../../../ts-config';
import { isNotEmpty } from '@lhb/func';
import cs from 'classnames';
import styles from '../index.module.less';
import { amountStr } from '@/common/utils/ways';

const ListItem: FC<any> = ({
  item,
}) => {
  return (
    <div className={styles.listItemCon}>
      <div className={styles.rightInfo}>
        <Row align='middle' justify='space-between'>
          <div
            style={{
              width: 276
            }}
            className={cs('c-222', styles.titCon)}>
            {item.areaName}
          </div>
        </Row>
        <div
          className={cs('fs-12 mt-10', styles.labelCon)}
          style={{
            color: colorStatus[item.firstLevelCategoryId].color,
          }}>
          <span>{item.firstLevelCategory}</span>
          <span className='pl-4 pr-4'>|</span>
          <span>{item.secondLevelCategory}</span>
        </div>
        <Row className='mt-10 ff-normal' justify='center'>
          <Col span={8}>
            <div className='c-666 fs-12'>
            奶茶行业评分
            </div>
            <div className='c-222 font-weight-500 ff-medium mt-4'>
              {isNotEmpty(item?.mainBrandsScore) ? item.mainBrandsScore : '-'}
            </div>
          </Col>
          <Col span={8}>
            <div className='c-666 fs-12'>
            益禾堂评分
            </div>
            <div className='c-222 font-weight-500 ff-medium mt-4'>
              {isNotEmpty(item?.totalScore) ? item.totalScore : '-'}
            </div>
          </Col>
          <Col span={8}>
            <div className='c-666 fs-12'>
            预测日营业额
            </div>
            <div className='c-222 font-weight-500 ff-medium mt-4'>
              {
                isNotEmpty(item?.lowSalesAmountPredict) && isNotEmpty(item?.upSalesAmountPredict) ? <>
                  {amountStr(item?.lowSalesAmountPredict)}-{amountStr(item?.upSalesAmountPredict)}
                </> : <>
                  {isNotEmpty(item?.lowSalesAmountPredict) ? amountStr(item?.lowSalesAmountPredict) : ''}
                  {
                    !isNotEmpty(item?.lowSalesAmountPredict) && !isNotEmpty(item?.upSalesAmountPredict) ? '-' : ''
                  }
                  {isNotEmpty(item?.upSalesAmountPredict) ? amountStr(item?.upSalesAmountPredict) : ''}
                </>
              }
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ListItem;
