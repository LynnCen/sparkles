/**
 * @Description 集客点信息
 */

import V2Tabs from '@/common/components/Data/V2Tabs';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Anchor from '@/common/components/Others/V2Anchor';
import { beautifyThePrice, isArray } from '@lhb/func';
import { Row, Col, Anchor } from 'antd';
import styles from '../index.module.less';
import { FC, useMemo, useRef } from 'react';
import LinesInfo from './LinesInfo';

interface Props {
  detail; // 集客点详情
}

const { Link } = Anchor;

const CollectionPointInfo: FC<Props> = ({ detail }) => {

  const collectionPointInfo: any = useRef(null);

  const anchorItems = [{
    id: 'planSpotInfo',
    title: '集客点信息'
  }, {
    id: 'competitorsInfo',
    title: '竞品分析'
  }, {
    id: 'landlordsInfo',
    title: '店铺房东信息'
  }];
  // 构建children
  const ConstructChildren = (index, key) => {
    //
    const { index: i } = index; // 组件的传值是对象的形式
    const data = detail?.planSpots[i];
    return (
      <div key={key} className={styles.collectionPointInfo}>
        <div className={styles.spotInfo}>
          <PlanSpotInfo info={data} />
        </div>
        <div className={styles.link}>
          <V2Anchor
            getContainer={() => {
              const target: any = collectionPointInfo.current || document.body;
              return target;
            }}
          >
            {/* <Link href='#planSpotInfo' title='集客点信息' />
            <Link href='#competitorsInfo' title='竞品分析' />
            <Link href='#landlordsInfo' title='店铺房东信息' /> */}

            {anchorItems.map(item => <Link key={item.title} href={`#${item.id}`} title={item.title} />)}
          </V2Anchor>
        </div>
      </div>
    );
  };

  // 构建集客点信息
  const PlanSpotInfo = (info) => {
    const { info: data } = info;
    const { competitors, landlords } = data; // 竞品信息，房东店铺信息
    return (
      <div className={styles.planSpotConatiner}>
        <V2Title id='planSpotInfo' divider type='H2' text='集客点信息' />
        <LinesInfo detail={detail} />
        {/* 集客点信息 */}
        <div>
          <V2DetailGroup block>
            <Row gutter={24}>
              <Col span={12}>
                <V2DetailItem label='集客点名称' value={data?.name} />
              </Col>
              <Col span={12}>
                <V2DetailItem label='动线始末' value={data?.editDescription} />
              </Col>
              <Col span={12}>
                <V2DetailItem label='集客A类点' value={data?.pointName} />
              </Col>
              <Col span={12}>
                <V2DetailItem
                  label='租金单价'
                  value={data.rent ? beautifyThePrice(data.rent, ',', 2) + '元' : '-'}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <V2DetailItem
                  label='转让费'
                  value={data.assignmentFee ? beautifyThePrice(data.assignmentFee, ',', 2) + '元' : '-'} />
              </Col>
              <Col span={12}>
                <V2DetailItem type='videos' label='A类视频讲解' assets={data?.videoUrls} />
              </Col>
              <Col span={12}>
                <V2DetailItem
                  label='预估日均金额'
                  value={data.estimatedDailyAmount ? beautifyThePrice(data.estimatedDailyAmount, ',', 2) + '元' : '-'}
                />
              </Col>
              <Col span={12}>
                <V2DetailItem label='视频备注' value={data?.videoRemark} />
              </Col>
            </Row>
          </V2DetailGroup>
        </div>

        <V2Title id='competitorsInfo' divider type='H2' text='竞品信息' />
        {/* 竞品信息 */}

        {competitors ? (
          <V2DetailGroup block>
            {competitors.map((item, index) => (
              <div
                key={item.competitorName + index}
              >
                <Row gutter={20}>
                  <Col span={10}>
                    <V2DetailItem label={`竞品分析${index + 1}`} value={item?.competitorName} />
                  </Col>
                  <Col span={10}>
                    <V2DetailItem
                      label='日均估值'
                      value={
                        item.aveEstimatedSale
                          ? beautifyThePrice(item.aveEstimatedSale, ',', 2) + '元'
                          : '-'
                      }
                    />
                  </Col>
                </Row>
              </div>
            ))}
          </V2DetailGroup>
        ) : <></>}

        {/* 店铺房东信息 */}
        <V2Title id='landlordsInfo' divider type='H2' text='店铺房东信息' />
        {landlords ? (
          <V2DetailGroup>
            {landlords.map((item, index) => (
              <div
                key={item.landlordShopName + index}
              >
                <Row gutter={20}>
                  <Col span={10}>
                    <V2DetailItem label='店铺名称' value={item?.landlordShopName} />
                  </Col>
                  <Col span={10}>
                    <V2DetailItem label='房东姓名' value={item.landlordName} />
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={10}>
                    <V2DetailItem label='房东电话' value={item?.landlordMobile} />
                  </Col>
                </Row>
              </div>
            ))}
          </V2DetailGroup>
        ) : <></>}
      </div>
    );
  };

  // 一级菜单
  const tabs = useMemo(() => {
    if (!Object.keys(detail).length) return [];
    const { planSpots } = detail;
    if (isArray(planSpots) && planSpots.length) {
      return planSpots.map((item: any, index) => ({
        label: `集客点${index + 1}`,
        key: `${item.id}`, // tabs组件的activeKey是string类型
        children: (
          <ConstructChildren key={item.name + index} index={index} />
        ),
      }));
    }
    return [];
  }, [detail]);

  return (
    <div
      ref={collectionPointInfo}
      className={styles.plantInfoContainer}>
      {/* 在这里放置你的组件内容 */}
      <V2Tabs items={tabs} />
    </div>
  );
};

export default CollectionPointInfo;
