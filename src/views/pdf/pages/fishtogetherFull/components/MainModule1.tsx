import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import V2Title from '@/common/components/Feedback/V2Title';
import AMap from '@/common/components/AMap';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import Item from './Base/Item';
import { floorKeep, replaceEmpty } from '@lhb/func';
import { useMethods } from '@lhb/hook';
const MainModule1: FC<any> = ({
  number,
  res = {},
  index,
}) => {
  const methods = useMethods({
    mapLoadedHandle(map) {
      const customIconSelf = new window.AMap.Icon({
        size: new window.AMap.Size(40, 47),
        image: 'https://staticres.linhuiba.com/project-custom/store-assistant-h5/shop_location@2x.png',
        imageSize: new window.AMap.Size(40, 47),
      });
      const customIconOther = new window.AMap.Icon({
        size: new window.AMap.Size(40, 40),
        image: 'https://staticres.linhuiba.com/project-custom/store-assistant-h5/fish/icon_fish_store_opened.png',
        imageSize: new window.AMap.Size(40, 40),
      });
      // 构造点标记
      const markers: any[] = [];
      res.surroundingShops?.forEach((item, index) => {
        const marker = new window.AMap.Marker({
          icon: index ? customIconOther : customIconSelf,
          position: [item.lng, item.lat],
          offset: new window.AMap.Pixel(-40 / 2, index ? -47 : -40)
        });
        markers.push(marker);
      });
      // 将以上覆盖物添加到地图上
      map.add(markers);
      map.setFitView(markers[0], true);
    }
  });

  const specialCom = () => {
    let end;
    let start;
    if (!index) {
      start = 0;
      end = 3;
    } else {
      const coefficients = floorKeep(index, 1, 1);
      const number = floorKeep(coefficients, 12, 3);
      start = floorKeep(number, 3, 2);
      end = floorKeep(start, 12, 2);
    }
    return <>
      <V2Title divider type='H3' text={`选址23不要检查情况：${res.forbidden23Num}项不符合标准`} style={{ marginBottom: '10px', marginTop: '6px' }}/>
      {
        res.forbidden23?.slice(start, end).map((item, index) => {
          return <Item key={`forbidden23-${index}`} className={cs(index !== res.forbidden23.length - 1 ? 'mb-10' : '', styles.module1Item)} label={item.label}>{item.value}</Item>;
        })
      }
    </>;
  };

  return (
    <div className={cs(styles.mainModule, styles.mainModule1)}>
      <TopTitle number={number}>一、项目综述</TopTitle>
      <div className={styles.mainModuleWrapper}>
        {
          !index ? <>
            <div className={styles.mainModuleTotal}>
              <div className={styles.moduleTotalItem}>
                <div className={styles.totalItemTop}>{replaceEmpty(res.checkBizEstimatedDailySales)}元</div>
                <div className={styles.totalItemBottom}>预计日均实收金额（含外卖）</div>
              </div>
              <div className={styles.moduleTotalItem}>
                <div className={styles.totalItemTop}>{replaceEmpty(res.checkBizDailyTakeawaySales)}元</div>
                <div className={styles.totalItemBottom}>日均外卖实收金额</div>
              </div>
              <div className={styles.moduleTotalItem}>
                <div className={styles.totalItemTop}>{replaceEmpty(res.finCalcInvstInvestmentReturnCycle)}个月</div>
                <div className={styles.totalItemBottom}>投资回报周期</div>
              </div>
              <div className={styles.moduleTotalItem}>
                <div className={styles.totalItemTop}>{replaceEmpty(res.checkBizDailyGuaranteedSalesRevenue)}元</div>
                <div className={styles.totalItemBottom}>日保本点</div>
              </div>
            </div>
            <div className={styles.mainModule1Con}>
              <div className={styles.conLeft}>
                <V2Title divider type='H3' text='项目情况' style={{ marginBottom: '10px' }}/>
                <div className='mb-10' style={{ display: 'flex' }}>
                  <Item label='项目周边200米范围历史开店情况' style={{ marginRight: '72px' }}>{res.ProjSubmitHistoryOpeningStore || '无'}</Item>
                  <Item label='加盟商风险认知'>{replaceEmpty(res.rptAnaFranchiseeRiskPerception)}</Item>
                </div>
                <Item className={cs('mb-10', styles.module1Item)} label='项目优势'>{replaceEmpty(res.rptAnaProjectAdvantages)}</Item>
                <Item className={cs('mb-10', styles.module1Item)} label='项目劣势分析'>{replaceEmpty(res.rptAnaProjectDisadvantages)}</Item>
                <Item className={cs('mb-10', styles.module1Item)} label='选址专员意见'>{replaceEmpty(res.rptAnaOpinionSiteSelectionSpecialist)}</Item>
                {
                  specialCom()
                }
              </div>
              <div className={styles.conRight}>
                {
                  res.longitude && res.latitude && <AMap loaded={methods.mapLoadedHandle} mapOpts={{
                    WebGLParams: { preserveDrawingBuffer: true }
                  }}/>
                }
              </div>
            </div>
          </> : specialCom()
        }
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule1;
