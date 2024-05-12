// 跟进记录详情弹窗
import { useState, FC, forwardRef, useImperativeHandle } from 'react';
import { useMethods } from '@lhb/hook';
import { Modal, Timeline, Spin, Typography } from 'antd';
import { parseObjectArrayToString, replaceEmpty } from '@lhb/func';
import styles from '../entry.module.less';
import Empty from '@/common/components/Empty';
import { getRequirementFollowRecords, getSessionRecordFollowRecords } from '@/common/api/demand-management';
import dayjs from 'dayjs';
import IconFont from 'src/common/components/Base/IconFont/index';

const FollowRecordDetail:FC<{
  title?: string;
  /** 提供给：demand 需求（默认），sessionRecord 会话记录 */
  provideFor?: string;
  ref?: any
}> = forwardRef(({
  title = '跟进记录',
  provideFor = 'demand',
}, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const TYPE_DEMAND_FOLLOW = 1;// 需求跟进

  const methods = useMethods({
    init(id) {
      setVisible(true);
      methods.getFollowRecords(id || null);
    },
    getFollowRecords(id) {
      setLoading(true);
      const params: any = { };
      let api = getRequirementFollowRecords;
      if (provideFor === 'demand') {
        params.locxxRequirementId = id;
      } else if (provideFor === 'sessionRecord') {
        api = getSessionRecordFollowRecords;
        params.sessionId = id;
        params.type = TYPE_DEMAND_FOLLOW;
      }
      api(params).then(res => {
        setItems(res || []);
      }).finally(() => {
        setLoading(false);
      });
    },
    getCreateTime(val) {
      if (!val) return;
      return dayjs(val).format('M月D日 HH:mm');
    }
  });

  return (
    <Modal
      title={replaceEmpty(title)}
      width='600px'
      open={visible}
      maskClosable={false}
      onCancel={() => setVisible(false)}
      footer={null}
      className={styles.followRecordDetail}
    >
      <Spin spinning={loading}>
        <Timeline mode='left'>
          {Array.isArray(items) && items.length ? items.map((item, index) => (
            <Timeline.Item label={methods.getCreateTime(item.createTime)} key={index}>
              <div className={styles.content}>
                <Typography.Text style={{ width: 80 }} ellipsis={{ tooltip: replaceEmpty(item.creator) }} className='mr-5' >{replaceEmpty(item.creator)}</Typography.Text>
                <pre className={styles.pretext}>{replaceEmpty(item.content || item.visitContent)}</pre>
              </div>
              {(!!item.remindDate || (Array.isArray(item.remindUsers) && !!item.remindUsers.length)) && <div className={styles.remind}>
                {!!item.remindDate && <div className={styles.remindKeyword}>
                  <IconFont iconHref='icon-clock1' className='mr-4'/>
                  <span>{dayjs(item.remindDate).format('YYYY.MM.DD')}</span>
                </div>}
                {Array.isArray(item.remindUsers) && !!item.remindUsers.length && <div className={styles.remindKeyword}>
                  <IconFont iconHref='icon-ic_jiaose1' className='mr-4'/>
                  <span>{parseObjectArrayToString(item.remindUsers, 'name') || '-'}</span>
                </div>}
              </div>}
            </Timeline.Item>
          )) : <Empty/>}
        </Timeline>
      </Spin>
    </Modal>
  );
});

export default FollowRecordDetail;
