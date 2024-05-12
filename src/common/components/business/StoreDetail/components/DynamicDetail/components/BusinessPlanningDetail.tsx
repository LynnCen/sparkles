/**
 * @Description 机会点详情-商圈规划详情
 */
import { FC, useEffect, useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { beautifyThePrice, isDef } from '@lhb/func';
import IconFont from '@/common/components/IconFont';
import { getSpotRelationDetail } from '@/common/api/expandStore/chancepoint';
import V2Tabs from '@/common/components/Data/V2Tabs';
import SpotRelationDetail from './SpotRelationDetail';

import styles from '../index.module.less';
import { tenantCheck } from '@/common/api/common';

const BusinessPlanningDetail: FC<any> = ({
  info = {},
  detailInfoConfig = { span: 12 },
}) => {
  const [planSpotTabs, setPlanSpotTabs] = useState<any[]>([]);
  const [isYiHeTang, setIsYiHeTang] = useState<boolean>(false); /** 是否为益禾堂租户 */
  /**
   * @description 展示最近商圈距离机会点
   */
  const showDistance = useMemo(() => {
    const val = '';
    if (info && info.distance) {
      const dist = info.distance;
      return dist > 100 ? beautifyThePrice(dist / 1000.0, ',', 1) + 'km' : `${dist}m`;
    }
    return val;
  }, [info]);

  const renderPlanSpot = () => {
    if (info.planClusterId && info?.planSpotId && isYiHeTang) {

      return <V2Tabs items={planSpotTabs}/>;
    }
    return <></>;
  };

  useEffect(() => {
    tenantCheck().then(({ isYiHeTang }) => {
      setIsYiHeTang(!!isYiHeTang);
    });
  }, []);

  useEffect(() => {
    if (info?.planClusterId && info?.planSpotId) {
      getSpotRelationDetail({ planClusterId: info.planClusterId }).then(({ planSpots }) => {
        const items = planSpots.map(item => {
          if (item.id === info.planSpotId) {
            return {
              key: item.id,
              label: item.name,
              children: <SpotRelationDetail info={item} detailInfoConfig={detailInfoConfig} />
            };
          }
          return;
        });
        setPlanSpotTabs(items);
      });
    }
  }, [info.planClusterId, info.planSpotId]);


  /* method */

  if (!info) {
    // 未选择地址
    return (<Row gutter={24}>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='所属商圈' value='选择详细地址后获取'/>
      </Col>
    </Row>);
  } else if (!isDef(info.isInCluster)) {
    // 无商圈数据
    return (<Row gutter={24}>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='所属商圈' value='该机会点不在规划商圈中'/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='商圈类型' value={info?.manualTypeName}/>
      </Col>
    </Row>);
  } else if (info.isInCluster) {
    const urlParams = {
      planClusterId: info?.planClusterId,
      lng: info?.lng,
      lat: info?.lat,
      originPath: 'chancepoint',
      isBranch: true,
      isActive: true,
    };
    // 有所属商圈
    return (<>
      <Row gutter={24}>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='所属商圈' value={info.clusterName} rightSlot={{
            icon: <IconFont iconHref='iconic_next_black_seven'/>,
            onIconClick() {
              window.open(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
            }
          }}/>
        </Col>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='商圈类型' value={info.clusterTypeName}/>
        </Col>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='商圈评分' value={info.clusterScore}/>
        </Col>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='所在集客点' value={info.planSpotName}/>
        </Col>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='规划门店数量' value={info.planStores}/>
        </Col>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='已开门店数量' value={info.openStores}/>
        </Col>
      </Row>
      <div className={styles.spotRelationDetail}>
        {renderPlanSpot()}
      </div>
    </>);
  } else {
    const urlParams = {
      planClusterId: info?.planClusterId,
      lng: info?.lng,
      lat: info?.lat,
      originPath: 'chancepoint',
      isBranch: true,
      isActive: true,
    };

    // 附近有商圈
    return (<Row gutter={24}>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='所属商圈' value='该机会点不在规划商圈中' />
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='10km最近商圈' value={info.clusterName} rightSlot={{
          icon: <IconFont iconHref='iconic_next_black_seven'/>,
          onIconClick() {
            window.open(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
          }
        }}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='距离当前机会点' value={showDistance}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='商圈类型' value={info?.manualTypeName}/>
      </Col>
    </Row>);
  }
};

export default BusinessPlanningDetail;
