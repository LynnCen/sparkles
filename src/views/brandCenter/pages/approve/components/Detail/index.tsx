import { FC, forwardRef, useState, useImperativeHandle } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import Top from './Top';
import Main from './Main';
import { brandReviewDetail, brandApproveDetail } from '@/common/api/brand-center';

const Detail: FC<any> = forwardRef(({
  reviewId,
  brandId,
  onOK,
}, ref) => {
  useImperativeHandle(ref, () => ({
    onload: () => {
      getReviewDetail();
      getBrandDetail();
    },
  }));

  const [reviewInfo, setReviweInfo] = useState<any>();
  const [brandInfo, setBrandInfo] = useState<any>();

  const getReviewDetail = async () => {
    const data = await brandReviewDetail({ reviewId });
    setReviweInfo(data);
  };

  const getBrandDetail = async () => {
    const data = await brandApproveDetail({ id: brandId });
    setBrandInfo(data);
  };

  return (
    <V2Container
      style={{ height: 'calc(100vh - 100px)' }}
      extraContent={{
        top: <div>
          <Top reviewId={reviewId} detail={reviewInfo} brandInfo={brandInfo} onOK={onOK}/>
        </div>
      }}
    >
      <Main brandId={brandId} detail={brandInfo} changeDetail={setBrandInfo}/>
    </V2Container>
  );
});

export default Detail;
