/**
 * @Description 拓店任务详情Drawer-沟通记录
 */
import { FC } from 'react';
import { Col, Row } from 'antd';
import { v4 } from 'uuid'; // 用来生成不重复的key
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import Empty from '@/common/components/Empty';
import styles from '../index.module.less';

const Meet: FC<any> = ({
  meetList,
}) => {
  const buildAssets = (fileList) => {
    if (Array.isArray(fileList) && fileList.length) {
      return fileList.map((item) => ({
        url: item,
        name: '',
      }));
    }
    return [];
  };

  return (
    <div className={styles.communication}>
      <div className={styles.title}>沟通记录</div>

      {meetList.length > 0 ? (
        meetList.map((item, index) => (
          <Row gutter={16} key={index}>
            <Col span={8} key={v4()}>
              <V2DetailItem label={item.name} value={item.meetAt} />
            </Col>
            <Col span={8} key={v4()}>
              <V2DetailItem label={'沟通内容'} value={item.content} />
            </Col>
            <Col span={8} key={v4()}>
              <V2DetailItem label={'相关凭证'} type={'images'} assets={buildAssets(item.fileList)} />
            </Col>
          </Row>
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
};
export default Meet;
