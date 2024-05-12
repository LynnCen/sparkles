import { FC, useEffect, useState, useMemo } from 'react';
import { Table } from 'antd';
import styles from '../../entry.module.less';
import Header from '../../Header';
import ModuleInfoWrapper from '../../ModuleInfoWrapper';
import RowItem from '../../RowItem';
import ColItem from '../../ColItem';
import DoubleCircle from '../../DoubleCircle';
import cs from 'classnames';


const Shopping: FC<any> = ({
  shopping,
  mallList,
  type,
  isIntegration
}) => {
  const [rankingMall, setRankingMall] = useState<Array<any>>([]);

  useEffect(() => {
    if (Array.isArray(mallList) && mallList.length) {
      const targetList = mallList.filter((item, index) => index < 5).map((item, index) => ({ ...item, index: index + 1 }));
      setRankingMall(targetList);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mallList]);

  const targetStr = useMemo(() => {
    if (Array.isArray(mallList) && mallList.length && type === 1) {
      return `${mallList[0].name}距离目标点位最近(${mallList[0].distance}m),可带来大量潜在客源`;
    }
    return '';
  }, [mallList, type]);

  const columns = useMemo(() => {
    if (type === 1) { // 圆形
      return [
        { title: '序号', dataIndex: 'index' },
        { title: '商场名称', dataIndex: 'name' },
        { title: '距离(m)', dataIndex: 'distance' },
      ];
    } else if (type === 2) { // 自定义区域
      return [
        { title: '序号', dataIndex: 'index' },
        { title: '商场名称', dataIndex: 'name' }
      ];
    }
    return [];
  }, [type]);

  return (
    <div className={cs(styles.shoppingCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='03'
        name='商业氛围评估-购物业态'/>
      <div className={styles.flexCon}>
        { rankingMall.length > 0 && (
          <div className={styles.sectionLeftCon}>
            <div className='fs-19 bold'>
              商场信息
            </div>
            {
              targetStr && <div className={styles.summaryStrCon}>
                {targetStr}
              </div>
            }
            <Table
              rowKey='name'
              dataSource={rankingMall}
              columns={columns}
              pagination={false}
              className='mt-20'/>
          </div>
        )
        }
        <div className={styles.sectionRightCon}>
          <ModuleInfoWrapper hasDivider={false}>
            <RowItem className='mt-20'>
              <ColItem label='商场' labelVal={shopping.mallCount} unit='家'/>
              <ColItem label='超市' labelVal={shopping.supermarketCount} unit='家'/>
              <ColItem label='便利店' labelVal={shopping.storeCount} unit='家'/>
            </RowItem>
            <RowItem className='mt-20'>
              <ColItem label='服饰鞋帽' labelVal={shopping.clothesShopCount} unit='家'/>
              <ColItem label='家电数码' labelVal={shopping.digitalShopCount} unit='家'/>
              <ColItem label='其他集市' labelVal={shopping.otherMarketCount} unit='家'/>
            </RowItem>
          </ModuleInfoWrapper>
        </div>
      </div>
      <DoubleCircle/>
    </div>
  );
};

export default Shopping;
