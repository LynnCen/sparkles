import DetailInfo from '@/common/components/business/DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
// import { isArray } from '@lhb/func'; // downloadFile
import { Divider, Row, Tabs } from 'antd'; // Button List
import { FC, useMemo } from 'react';
import CompeteInfo from './CompeteInfo';
import OtherInfo from './OtherInfo';
import ShopInfo from './ShopInfo';
import styles from '../index.module.less';
// import DetailImage from '@/common/components/business/DetailImage';
import BaseInfo from './BaseInfo';
import AsicsBaseInfo from './Asics/AsicsBaseInfo';
import OperateEnv from './Asics/OperateEnv';
import FlowMatch from './Asics/FlowMatch';
import CompeteEnv from './Asics/CompeteEnv';

import TabEngineering from './TabEngineering'; // 工程条件
import TabTraffic from './TabTraffic'; // 交通条件
import TabFlow from './TabFlow';
import TabBusiness from './TabBusiness';
import AsicsTabBusiness from './Asics/TabBusiness';
import TabEarn from './TabEarn';
import AsicsTabEarn from './Asics/TabEarn';
import TabTakeout from './TabTakeout';
interface IProps {
  result: any;
  showTab?: boolean;
  // isBabyCare?: boolean;
  isFood?: boolean;
  isAsics?: boolean;
}

const TabInfo: FC<IProps> = ({
  result,
  showTab = false,
  // isBabyCare
  isFood,
  isAsics,
}) => {
  const parseDateRange = (start: any, end: any): string => {
    if (start && end) {
      return start + '-' + end;
    }
    return '-';
  };

  const parseUnit = (number: any, unit: any): string => {
    if (number && unit) {
      return number + unit;
    }
    return '-';
  };

  // 店铺类型-商场 shopCategory 1 商场 2街铺
  const isTargetShop = useMemo(
    () => result?.shopCategory === 1 || result?.shopInformation?.shopCategory === 1,
    [result]
  );
  return (
    <div className={styles.tabInfo}>
      {/* TODO tab内容抽离为组件 */}
      <Tabs defaultActiveKey='store' type='card' className={styles.top}>
        <Tabs.TabPane tab='店铺信息' key='store' className={styles.tab}>
          {isAsics ? <AsicsBaseInfo result={result} /> : <BaseInfo result={result} isFood={isFood} />}
        </Tabs.TabPane>
        {isFood ? (
          <>
            <Tabs.TabPane tab={isTargetShop ? '商场信息' : '商业条件'} key='shopInfo' className={styles.tab}>
              <ShopInfo result={result} isFood={isFood} isTargetShop={isTargetShop} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='工程条件' key='engineering' className={styles.tab}>
              <TabEngineering result={result} isFood={isFood} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='交通条件' key='traffic' className={styles.tab}>
              <TabTraffic result={result} isFood={isFood} isTargetShop={isTargetShop} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='客流信息' key='flow' className={styles.tab}>
              <TabFlow result={result} isFood={isFood} isTargetShop={isTargetShop} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='竞品信息' key='competitor' className={styles.tab}>
              <CompeteInfo result={result} isFood={isFood} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='商务信息' key='business' className={styles.tab}>
              <TabBusiness result={result} parseDateRange={parseDateRange} parseUnit={parseUnit} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='收益预估' key='earn' className={styles.tab}>
              <TabEarn result={result} />
            </Tabs.TabPane>
          </>
        ) : isAsics ? (
          <>
            <Tabs.TabPane tab='经营环境' key='businessenv' className={styles.tab}>
              <OperateEnv result={result} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='客群匹配度' key='flowmatch' className={styles.tab}>
              <FlowMatch result={result} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='竞争环境' key='flow' className={styles.tab}>
              <CompeteEnv result={result} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='商务信息' key='business' className={styles.tab}>
              <AsicsTabBusiness result={result} parseDateRange={parseDateRange} parseUnit={parseUnit} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='收益预估' key='earn' className={styles.tab}>
              <AsicsTabEarn result={result} isAsics={isAsics} />
            </Tabs.TabPane>
          </>
        ) : (
          <>
            <Tabs.TabPane tab='收益预估' key='item-1' className={styles.tab}>
              <TabEarn result={result} />
            </Tabs.TabPane>
            {isTargetShop ? (
              <Tabs.TabPane tab='商场信息' key='shopInfo' className={styles.tab}>
                <ShopInfo result={result} isTargetShop={isTargetShop} />
              </Tabs.TabPane>
            ) : null}
            {!isTargetShop ? (
              <Tabs.TabPane tab='工程条件' key='item-2' className={styles.tab}>
                <TabEngineering result={result} />
              </Tabs.TabPane>
            ) : null}
            {!isTargetShop ? (
              <Tabs.TabPane tab='周边设施' key='item-3' className={styles.tab}>
                <TitleTips name='可见行' showTips={false} />
                <Row>
                  <DetailInfo title='立地条件' value={result?.surroundFacility?.siteConditionName} />
                  <DetailInfo title='门前有无遮蔽' value={result?.surroundFacility?.hasCoverName} />
                  <DetailInfo title='对面可见性' value={result?.surroundFacility?.isOppositeVisibilityName} />
                  <DetailInfo title='同侧可见性' value={result?.surroundFacility?.isIpsilateralVisibilityName} />

                  <DetailInfo title='是否位于阳面' value={result?.surroundFacility?.isSunnySideName} />
                  <DetailInfo title='是否位于西晒' value={result?.surroundFacility?.isWestSunName} />
                  <DetailInfo title='是否位于同行聚集地' value={result?.surroundFacility?.isPeerGatheringPlaceName} />
                  <DetailInfo title='是否位于人流聚集地' value={result?.surroundFacility?.isFlowGatheringPlaceName} />
                </Row>
                <Divider style={{ marginTop: 14 }} />

                <TitleTips name='指引性' showTips={false} />
                <Row>
                  <DetailInfo title='门头侧招' value={result?.surroundFacility?.isSideTrickDoorName} />
                  <DetailInfo title='广告位或指引牌' value={result?.surroundFacility?.isAdvertisePlaceName} />
                </Row>
              </Tabs.TabPane>
            ) : null}
            <Tabs.TabPane tab='交通概况' key='item-4' className={styles.tab}>
              <TabTraffic result={result} isTargetShop={isTargetShop} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='客流信息' key='item-5' className={styles.tab}>
              <TabFlow result={result} isTargetShop={isTargetShop} />
            </Tabs.TabPane>
            {isTargetShop ? null : (
              <Tabs.TabPane tab='外卖氛围' key='item-5-1' className={styles.tab}>
                <TabTakeout result={result} />
              </Tabs.TabPane>
            )}

            <Tabs.TabPane tab='商务信息' key='item-6' className={styles.tab}>
              <TabBusiness result={result} parseDateRange={parseDateRange} parseUnit={parseUnit} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='竞品信息' key='item-7' className={styles.tab}>
              <CompeteInfo result={result} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='其他信息' key='item-8' className={styles.tab}>
              <OtherInfo result={result} />
            </Tabs.TabPane>

            {showTab ? (
              <>
                <Tabs.TabPane tab='合同签约' key='item-9' className={styles.tab}>
                  <TitleTips name='合同签约' showTips={false} />
                  <Row>
                    <DetailInfo title='实际交房时间' value={result?.handoverInformation?.handoverDate} />
                    <DetailInfo
                      title='合同实际期限'
                      value={parseDateRange(
                        result?.contractInformation?.contractDateStart,
                        result?.contractInformation?.contractDateEnd
                      )}
                    />
                    <DetailInfo title='装修免租期(天)' value={result?.contractInformation?.decorationFreeDays} />
                    <DetailInfo title='租金模式' value={result?.contractInformation?.rentalModelName} />
                    <DetailInfo title='首年租金(元)' value={result?.contractInformation?.firstYearRent} />
                    <DetailInfo title='年递增幅度(%)' value={result?.contractInformation?.increaseRate} />
                    <DetailInfo
                      title='物业费'
                      value={parseUnit(
                        result?.contractInformation?.propertyCost,
                        result?.contractInformation?.propertyPriceUnitName
                      )}
                    />
                    <DetailInfo title='押金保证金(元)' value={result?.contractInformation?.securityCost} />
                    <DetailInfo title='其他费用(元)' value={result?.contractInformation?.businessOtherCost} />
                    <DetailInfo title='发票类型' value={result?.contractInformation?.invoiceTypeName} />
                    <DetailInfo title='发票税率(%)' value={result?.contractInformation?.invoiceRate} />
                    <DetailInfo title='付款方式' value={result?.contractInformation?.paymentTypeName} />
                    <DetailInfo title='付款周期' value={result?.contractInformation?.paymentCycle} />
                    <DetailInfo title='备注' value={result?.contractInformation?.businessRemark} />
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab='门店交房' key='item-10' className={styles.tab}>
                  <TitleTips name='门店交房' showTips={false} />
                  <Row>
                    <DetailInfo title='实际交房时间' value={result?.handoverInformation?.handoverDate} />
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab='门店开业' key='item-11' className={styles.tab}>
                  <TitleTips name='门店开业' showTips={false} />
                  <Row>
                    <DetailInfo title='开业时间' value={result?.openDate} />
                    <DetailInfo title='开业状况简述' value={result?.openDateInformation?.remark} />
                  </Row>
                </Tabs.TabPane>
              </>
            ) : null}
          </>
        )}
      </Tabs>
    </div>
  );
};

export default TabInfo;
