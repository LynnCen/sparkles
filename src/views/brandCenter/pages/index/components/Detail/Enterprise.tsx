/**
 * @Description 品牌详情 - 影响力
 */

import { FC } from 'react';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col, message } from 'antd';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import IconFont from '@/common/components/IconFont';
import copy from 'copy-to-clipboard';

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
      <V2Title type='H2' text='品牌所属公司信息' divider/>
      <V2DetailGroup>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='公司名称' value={info.companyName}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='登记状态' value={info.companyRegistrationStatus}/>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='企业电话' value={info.companyPhone} rightSlot={info.companyPhone ? {
              icon: <IconFont iconHref='pc-common-icon-ic_copy'/>,
              onIconClick: () => {
                message.success('已复制');
                copy(info.companyPhone);
              }
            } : undefined}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='注册资本' value={info.companyRegisteredCapital}/>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='注册地址' value={info.companyRegisteredAddress}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='统一社会信用代码' value={info.unifiedSocialCreditCode} rightSlot={ info.unifiedSocialCreditCode ? {
              icon: <IconFont iconHref='pc-common-icon-ic_copy'/>,
              onIconClick: () => {
                message.success('已复制');
                copy(info.unifiedSocialCreditCode);
              }
            } : undefined}/>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='成立时间' value={info.companyEstablishTime}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='企业官网' value={info.companyOfficialWebsite} type='link' onClick={() => {
              window.open(info.companyOfficialWebsite);
            }}/>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <V2DetailItem label='经营范围' value={info.companyBusinessScope} type='textarea' textAreaRows={20}/>
          </Col>
        </Row>
      </V2DetailGroup>
    </div>
  );
};

export default Attention;
