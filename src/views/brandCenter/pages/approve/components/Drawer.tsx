import { FC, useEffect, useRef } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import Detail from './Detail';

// 品牌审核详情抽屉
const Drawer: FC<any> = ({
  reviewId,
  brandId,
  open,
  setOpen,
  onRefresh,
}) => {
  const detailRef: any = useRef();

  useEffect(() => {
    if (open) {
      detailRef.current.onload();
    }
  }, [open]);

  return (
    <V2Drawer open={open} onClose={() => setOpen(false)}>
      <Detail
        ref={detailRef}
        reviewId={reviewId}
        brandId={brandId}
        onOK={() => {
          onRefresh?.();
          setOpen(false);
        }}
      />
    </V2Drawer>
  );
};

export default Drawer;
