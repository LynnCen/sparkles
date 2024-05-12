/*
 * @Author: xiangshangzhi
 * @Date: 2023-05-29 15:35:37
 * @FilePath: \console-pc\src\views\longerpoppupshop\pages\placescreen\components\detailDrawer\index.tsx
 * @Description: 详情页抽屉
 */

import { FC } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import ContentDetail from './content';
import { PlaceList } from '../../ts-config';
// import styles from './entry.module.less';

interface DrawerProps {
  record: PlaceList; // 拓店调研报告id
  isOpen: boolean; // 是否打开抽屉
  onClose: () => void; // 设置是否打开抽屉
  origin?: string; // 来源，场地筛选和场地管理
}

const DetailDrawer: FC<DrawerProps> = (props) => {
  const { record, isOpen, onClose, origin } = props;
  return (
    <V2Drawer open={isOpen} onClose={() => onClose()} >
      {/* <h3>详情页抽屉</h3> */}
      <ContentDetail record={record} origin={origin}></ContentDetail>
    </V2Drawer>
  );
};

export default DetailDrawer;
