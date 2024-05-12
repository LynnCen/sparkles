/**
 * @Description
 */

import { FC, useState } from 'react';
import { Tooltip } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import cs from 'classnames';
import styles from './index.module.less';
import PickFolderModal from '../CollectDrawer/PickFolderModal';
import { bigdataBtn } from '@/common/utils/bigdata';

const Entrance: FC<any> = ({
  clusterId, // 商圈ID
  spotId, // 点位ID
  collectStatus, // 是否已收藏
  setCollectStatus, // 更新收藏/取消收藏状态
  eventId, // 埋点事件id
  wrapperClassName,
  iconClassName,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.spaceCon} onClick={(e) => { e.stopPropagation(); }}>
      <Tooltip title={collectStatus ? '已收藏' : '收藏'}>
        <div className={cs(styles.favoriteBtnWrapper, wrapperClassName)} onClick={() => {
          if (eventId) {
            bigdataBtn(eventId, '选址地图', '收藏', '收藏');
          }
          setOpen(true);
        }}>
          {
            collectStatus
              ? <StarFilled
                className={cs('fs-12', styles.starIcon, styles.active, iconClassName)}
              />
              : <StarOutlined
                className={cs('fs-12', styles.starIcon, iconClassName)}
              />
          }
        </div>
      </Tooltip>
      {/* 收藏/取消收藏弹窗 */}
      <PickFolderModal
        open={open}
        clusterId={clusterId}
        spotId={spotId}
        // build={!collectStatus}
        setOpen={setOpen}
        setCollectStatus={setCollectStatus}
      />
    </div>
  );
};

export default Entrance;
