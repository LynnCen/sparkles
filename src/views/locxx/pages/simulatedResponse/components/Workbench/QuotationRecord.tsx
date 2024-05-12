import { FC, forwardRef, useImperativeHandle, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { beautifyThePrice, isNotEmpty } from '@lhb/func';
import { postPropertyQuoteList } from '@/common/api/demand-management';

import styles from './index.module.less';
import { Col, Row, Spin } from 'antd';
import V2Title from 'src/common/components/Feedback/V2Title/index';
import V2LogRecord from 'src/common/components/SpecialBusiness/V2LogRecord/index';
import V2Empty from 'src/common/components/Data/V2Empty/index';
import V2DetailGroup from 'src/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from 'src/common/components/Feedback/V2DetailItem/index';

// 报价记录内容项
const RecordItemContent:FC<{
  placeName: string, // 场地名称
  spotName: string, // 点位名称
  schedule: string, // 档期
  area: string, // 面积
  fee: string, // 场地费
  deposit: string, // 押金
}> = ({ placeName, spotName, schedule, area, fee, deposit }) => <>
  <V2DetailGroup moduleType='easy' direction='horizontal' className={styles.recordItemContent}>
    <div className='pt-10 bold'>{[placeName, spotName].filter(item => isNotEmpty(item)).join('-')}</div>
    <Row gutter={16}>
      <Col span={12}>
        <V2DetailItem label='档期：' value={schedule} className='detailItem' />
      </Col>
      <Col span={12}>
        <V2DetailItem label='面积：' value={area} className='detailItem' />
      </Col>
      <Col span={12}>
        <V2DetailItem label='场地费：' value={`¥${beautifyThePrice(fee)}`} className='detailItem' />
      </Col>
      <Col span={12}>
        <V2DetailItem label='押金：' value={`¥${beautifyThePrice(deposit)}`} className='detailItem' />
      </Col>
    </Row>
  </V2DetailGroup>
</>;

// 报价记录
const Component: FC< { ref?: any }> = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.loadData
  }));

  /* state */
  const [requesting, setRequesting] = useState(false);
  const [listData, setListData]: any[] = useState([]);

  /* hooks */
  // useEffect(() => {
  //   methods.loadData();
  // }, []);

  /* methods */
  const methods = useMethods({
    /**
     * @description 更新数据
     * @param {*} requirementId 需求ID
     * @return {*}
     * @example
     */
    loadData(requirementId) {
      if (!requirementId) {
        setListData([]);
        return;
      }

      const params = {
        page: 1, // 分页
        size: 999, // 每页长度
        sort: 'desc', // 排序方式
        requirementId, // 报价需求id
        // quoteUserId: null, // 报价人id
      };
      setRequesting(true);
      postPropertyQuoteList(params).then((response) => {
        const { objectList = [] } = response || {};
        setListData(Array.isArray(objectList) ? objectList.map(item => ({
          name: item.userName,
          time: item.gmtCreate,
          description: <RecordItemContent placeName={item.placeName} spotName={item.spotName} schedule={item.schedule} area={item.specifications} fee={item.placePrice} deposit={item.deposit}/>,
          status: 'finish'
        })) : []);
      }).finally(() => {
        setRequesting(false);
      });
    }
  });

  return (<div className={styles.quotationRecord}>
    <V2Title type='H2' text='报价记录'/>

    <Spin spinning={requesting}>
      {Array.isArray(listData) && !!listData.length ? <V2LogRecord items={listData}/> : <V2Empty />}
    </Spin>

  </div>);
});

export default Component;
