/*
* 跟进记录列表
*/
import { FC, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import styles from '../entry.module.less';
import V2LogRecord from '@/common/components/SpecialBusiness/V2LogRecord';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Empty from '@/common/components/Data/V2Empty';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
// import { Button } from 'antd';
import { useMethods } from '@lhb/hook';
import { getRecordList } from '@/common/api/locxx';
import { Spin } from 'antd';

interface FollowRecordListProps{
  title?:any
  id?:any
  tenantId?:any
  ref?:any
  gotoDetail?:Function
}

const FollowRecordList:FC<FollowRecordListProps> = forwardRef(({
  title,
  id,
  tenantId,
  gotoDetail
}, ref) => {
  useImperativeHandle(ref, () => ({
    init
  }));
  const [recordList, setRecordList] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const init = () => {
    methods.getRecords();
  };
  const methods = useMethods({
    async getRecords() {
      setLoading(true);
      const params = { tenantPlaceId: Number(id), tenantPlaceTntId: tenantId, page: 1, size: 20 };
      let result = await getRecordList(params);
      result = result.objectList.map((item) => {
        return {
          ...item,
          id: item.id,
          name: <V2DetailGroup direction='vertical' moduleType='easy'>
            <V2DetailItem noStyle value={item.crtorName} className={styles.crtorName}/>
          </V2DetailGroup>,
          description: item.content,
          time: item.gmtCreate,
          status: 'finish',
          ...(title === '供应商跟进记录' && {
            middleExtra: <V2DetailGroup direction='vertical' moduleType='easy'>
              <V2DetailItem type='link' noStyle onClick={() => { gotoDetail?.(item.tenantPlaceId); }} value={item.tenantPlaceName}/>
            </V2DetailGroup>
          }),
        };
      });
      if (result) {
        setLoading(false);
      }
      setRecordList(result);
    }
  });
  useEffect(() => {
    init();
  }, [id, tenantId]);
  return (
    <Spin tip='数据正在加载中请稍等......' spinning={loading}>
      <div className={styles.placeContainer}>
        {title !== '' && <V2Title style={{ fontWeight: '500' }}>{ title }</V2Title>}
        {
          recordList && recordList.length
            ? <V2LogRecord items={recordList}></V2LogRecord>
            : <V2Empty/>
        }
      </div>
    </Spin>
  );
});

export default FollowRecordList;
