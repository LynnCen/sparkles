/*
* 详情主体
*/
import { FC, useEffect } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Flex from '@/common/components/Feedback/V2Flex';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
// import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
// import V2LogRecord from '@/common/components/SpecialBusiness/V2LogRecord';
import FollowRecord from './FollowRecord';
import { Row, Col } from 'antd';
import styles from './entry.module.less';

import { useMethods } from '@lhb/hook';
import { getQiniuFileOriSuffix } from '@/common/utils/qiniu';


interface TopProps{
  placeInfo:any
  onRefresh: () => void
}

const PlaceMngInfo:FC<TopProps> = ({ placeInfo, onRefresh }) => {

  const methods = useMethods({
    init() {
    },
    // 认证图片处理展示
    onCertImageShow(val) {
      return val?.map(item => {
        item.url = item.url + getQiniuFileOriSuffix(item.url);
        return item;
      });
    }
  });

  useEffect(() => {
    methods.init();
  }, []);

  return (
    <>
      <V2Flex>
        <div style={{ width: '70%' }} className={styles.left}>
          <V2Title type='H2' text='供应商信息' divider/>
          <V2DetailGroup>
            <Row gutter={20}>
              <Col span={12}>
                <V2DetailItem label='公司' value={placeInfo.companyName}/>
              </Col>
              <Col span={12}>
                <V2DetailItem label='岗位' value={placeInfo.position}/>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <V2DetailItem label='姓名' value={placeInfo.userName}/>
              </Col>
              <Col span={12}>
                <V2DetailItem label='手机号' value={placeInfo.userMobile}/>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <V2DetailItem label='认证凭证' type='images' assets={methods.onCertImageShow(placeInfo.applyFiles)}/>
              </Col>
            </Row>
          </V2DetailGroup>
        </div>
        <div className={styles.right}>
          <V2Title type='H2' text='跟进记录'/>
          <V2DetailGroup style={{ paddingTop: '15px' }}>
            <FollowRecord tenantPlaceId={placeInfo.tenantPlaceId} tenantId={placeInfo.id} onRefresh={onRefresh}></FollowRecord>
          </V2DetailGroup>
        </div>
      </V2Flex>
    </>
  );
};


export default PlaceMngInfo;
