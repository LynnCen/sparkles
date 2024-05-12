import V2Drawer from '@/common/components/Feedback/V2Drawer';
import { FC, useEffect, useState } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import { Col, Row, Typography } from 'antd';
import styles from './index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import FeedbackModal from './FeedbackModal';

const { Link } = Typography;

const TaskDrawer: FC<any> = ({ open, setOpen, curInfo }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [progressInfo, setProgressInfo] = useState<any>([]);

  const onClick = () => {
    setVisible(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      console.log(curInfo);
      setProgressInfo([
        { time: '2023-07-01', desc: '门店现场实际情况沟通确认' },
        { time: '2023-07-04', desc: '图纸设计完成60%' },
        { time: '2023-07-08', desc: '图纸初稿完成' },
        { time: '2023-07-12', desc: '方案上会，方案调整' },
      ]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curInfo, open]);

  return (
    <div>
      <V2Drawer open={open} onClose={onClose} destroyOnClose>
        <>
          <V2Title>
            <span className='fn-20'>{curInfo?.name || '杭州9号'}</span>
          </V2Title>
          <div className={styles.baseInfo}>
            <Row gutter={16}>
              <Col span={8}>
                <V2DetailItem label='当前状态' value='进行中' />
              </Col>
              <Col span={8}>
                <V2DetailItem label='责任人' value={curInfo.personInCharge} />
              </Col>
              <Col span={8}>
                <V2DetailItem label='实际开始时间' value='2023-06-30' />
              </Col>
              <Col span={8}>
                <V2DetailItem label='实际结束时间' value='-' />
              </Col>
            </Row>
          </div>
          <V2Title divider className=' mt-24'>
            <span className='fn-16 font-weight-500'>{'具体工作进度'}</span>
          </V2Title>

          <div className='mt-16'></div>
          {progressInfo.map((item, idx) => (
            <div className={styles.progress}>
              <div key={idx} className={styles.item}>
                <div className={styles.point}></div>
                <div className={styles.time}>{item.time}</div>
                <div className={styles.desc}>{item.desc}</div>
              </div>
              {idx < progressInfo.length - 1 && <div className={styles.separator}></div>}
            </div>
          ))}
          <div className='mt-16'>
            <Link onClick={onClick} className='fn-14'>
              新增进度反馈
            </Link>
          </div>
        </>
      </V2Drawer>
      <FeedbackModal visible={visible} setVisible={setVisible} />
    </div>
  );
};
export default TaskDrawer;
