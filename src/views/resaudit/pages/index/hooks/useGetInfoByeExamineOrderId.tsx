import { post } from '@/common/request';
import { useEffect, useState } from 'react';

function useGetInfoByeExamineOrderId(examineOrderId?: string, similarResourceId?: string) {
  const [info, setInfo] = useState<{placeName?: string, spotName?: string, placeId?: number, spotId?: number, mergeResourceId?: number}>({});

  const getInfoByeExamineOrderId = async (examineOrderId?: string) => {
    const result = await post('/examineOrder/getResource', { examineOrderId, similarResourceId }, true);
    setInfo(result);
  };

  useEffect(() => {
    getInfoByeExamineOrderId(examineOrderId);
  }, [examineOrderId]);

  return info;
}

export default useGetInfoByeExamineOrderId;
