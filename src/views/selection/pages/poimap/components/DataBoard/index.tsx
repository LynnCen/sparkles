import { FC } from 'react';
import { Tabs } from 'antd';
import { clothingIndustry, carIndustry, cateringIndustry, IndustryId } from '../../ts-config';
import cs from 'classnames';
import styles from '../../entry.module.less';
import Introduction from './components/Introduction';
import Revenue from './components/Revenue';
import BrandDistribution from './components/BrandDistribution';
import MarketShares from './components/MarketShares';

const DataBoard: FC<any> = ({
  targetTabs = []
}) => {

  // const tabChange = () => {
  //   // console.log(`activeactive`, active);
  // };

  // 指定的行业数据
  const targetIndustry = (industryId: number) => {
    let targetIndustryInfo: any = {};
    switch (industryId) {
      case IndustryId.Clothing: // 服装行业
        targetIndustryInfo = clothingIndustry;
        break;
      case IndustryId.Catering: // 餐饮行业
        targetIndustryInfo = cateringIndustry;
        break;
      case IndustryId.Car: // 汽车行业
        targetIndustryInfo = carIndustry;
        break;
    }
    return targetIndustryInfo;
  };

  return (
    <div className={styles.dataBoardCon}>
      <div className={cs('fs-16 bold', styles.headCon)}>
        数据分析看板
      </div>
      <div className={styles.tabsCon}>
        <Tabs>
          {
            targetTabs.map((itemTab: any) => (
              <Tabs.TabPane tab={itemTab.name} key={itemTab.id}>
                {/* 行业简介 */}
                <Introduction info={itemTab} targetIndustryFun={targetIndustry}/>
                {/* 行业营收 Top 10 */}
                <Revenue info={itemTab} targetIndustryFun={targetIndustry}/>
                {/* 品牌分布 */}
                <BrandDistribution info={itemTab} targetIndustryFun={targetIndustry}/>
                {/* 上年市场份额(万元) */}
                <MarketShares info={itemTab} targetIndustryFun={targetIndustry}/>
              </Tabs.TabPane>
            ))
          }
        </Tabs>
      </div>
    </div>
  );
};

export default DataBoard;
