/**
 * @Description 商场详情
 */

import { FC } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import DetailPage from 'src/views/car/pages/resourcedetail/entry';
const ShopDetailDraw: FC<any> = ({
  drawData,
  close
}) => {
  const { open, id } = drawData;
  return (
    <V2Drawer
      open={open}
      onClose={close}
      contentWrapperStyle={{
        width: '980px',
      }}
    >
      <DetailPage id={id}/>
    </V2Drawer>
  );
};

export default ShopDetailDraw;
