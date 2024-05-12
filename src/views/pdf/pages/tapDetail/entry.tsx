import { post } from '@/common/request';
import { urlParams } from '@lhb/func';
import { FC, useEffect, useState } from 'react';
import cs from 'classnames';
import styles from './entry.module.less';
import { shop } from './ts-config';
import Radar from '@/common/components/EChart/Radar';
import RevenueEstimate from './components/RevenueEstimate';
import ShopBasicInfoCard from './components/ShopBasicInfoCard';
import ShopInfoTab from './components/ShopInfoTab';
import BusinessEnvTab from './components/BusinessEnvTab';
import CustomerMatchTab from './components/CustomerMatchTab';
import CompeteEnvTab from './components/CompeteEnvTab';
import CommerceInfoTab from './components/CommerceInfoTab';
import IncomeTab from './components/IncomeTab';
import TabTitle from './components/TabTitle';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Space } from 'antd';
const TapDetail: FC<any> = () => {
  const id: number | string = urlParams(location.search)?.id || '';
  const [detail, setDetail] = useState<any>({});
  const [indicator, setIndicator] = useState<any>(null);
  const [radarData, setRadarData] = useState<any>(null);
  const [isOpen, setOpen] = useState<any>(false);

  useEffect(() => {
    +id && getDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDetail = async () => {
    const data = await post('/chancePoint/asics/detail', { id }, true);
    data && setDetail(data);
    setOpen(data.isOpenMall === 1);
    getRadarData(data);
  };
  const getRadarData = (data) => {
    const columns: any = [];
    const radarData: any = [];
    shop.forEach(item => {
      if (data.isOpenMall === 2 && item.name === '竞争环境') return;
      columns.push({ name: item.name, max: 100 });
      radarData.push(data[item.score]);
    });
    setIndicator(columns);
    setRadarData(radarData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pages}>
        <div className={styles.header}>{ `${detail.chancePointName}报告` }</div>
        <div className={styles.storeScoreWrap}>
          <div className={styles.left}>
            <div className={styles.storeScore}>店铺评分<span className={styles.score}>{ detail.shopScore && detail.shopScore.toFixed(2) }</span><span className={styles.scoreUnit}>分</span></div>
            <div className={cs(styles.suggest, 'mt-8 c-132 pl-16 fn-14')}>
              <div className={styles.triangle}></div>
              {detail.shopScoreConclusion}
            </div>
            { !!detail.earnEstimateAsics && <RevenueEstimate data={detail.earnEstimateAsics} paymentCost={detail.paymentCost} guaranteedSale={detail.guaranteedSale} /> }
          </div>
          <div className={styles.right}>
            <div className={styles.echarts}>
              {indicator && radarData && <Radar
                data={radarData}
                indicator={indicator}
                title={Math.round(detail.shopScore)}
                seriesInfo={{ animation: false }}
                titleLabel='总分'
                radius={70}
                axisNameFontSize={['14px', '18px']}
                titleTextFontSize={['24px', '18px']}
                height='100%' />}
            </div>
          </div>
        </div>
        { !!detail.shopInformationAsics && <ShopBasicInfoCard
          data={detail.shopInformationAsics}
          isOpen={isOpen}
          labels={detail.labels}
          responsibleName={detail.responsibleName}
          guaranteedSale={detail.guaranteedSale}
        /> }
        { !!detail.shopInformationAsics && <div className={styles.tabInfoContent}>
          <TabTitle name='店铺信息' />
          <TitleTips className={styles.secondTitle} name='店铺图片' showTips={false} />
          <Space className={styles.imagesContent}>
            { detail.shopInformationAsics.frontImageUrls && detail.shopInformationAsics.frontImageUrls.map((item, index) => (
              <img src={item} key={index} />
            )) }
          </Space>
        </div> }
      </div>
      { !!detail.shopInformationAsics && (
        <div className={styles.pages}>
          <ShopInfoTab data={detail.shopInformationAsics} isOpen={isOpen} />
        </div>
      ) }
      { (!!detail.operateEnvironmentAsics || !!detail.flowMatchAsics) && (
        <div className={styles.pages}>
          <BusinessEnvTab data={detail.operateEnvironmentAsics} isOpen={isOpen} />
          <CustomerMatchTab data={detail.flowMatchAsics} isOpen={isOpen} />
        </div>
      )
      }
      { (!!detail.competeEnvironmentAsics || !!detail.businessInformationAsics) && (
        <div className={styles.pages}>
          <CompeteEnvTab data={detail.competeEnvironmentAsics} isOpen={isOpen} />
          <CommerceInfoTab data={detail.businessInformationAsics} />
        </div>
      )
      }
      { !!detail.earnEstimateAsics && <div className={styles.pages}><IncomeTab data={detail.earnEstimateAsics} /></div> }
    </div>
  );
};

export default TapDetail;
