/**
 * @Description 品牌详情 - 影响力
 */

import { FC } from 'react';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col } from 'antd';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';

const Attention: FC<any> = ({
  info,
  style = {},
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}) => {
  return (
    <div className={styles.tabBasic} style={{
      height: mainHeight || 'auto',
      ...style
    }}>
      <V2Title type='H2' text='影响力' divider/>
      <V2DetailGroup block>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='品牌综合分' value={info.brandScore}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='参与榜单量' value={info.participateRank}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='好评率' value={info.commentRate}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='总得票数' value={info.voteCount}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='总分享量' value={info.shareCount}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='全网销量' value={info.saleCount}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='得票' value={info.gainVote}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='点赞' value={info.gainLike}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='商标信息（数量）' value={info.trademarkCount}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='专利信息（数量）' value={info.patentCount}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='关注度' value={info.attentionCount}/>
          </Col>
        </Row>
      </V2DetailGroup>
    </div>
  );
};

export default Attention;
