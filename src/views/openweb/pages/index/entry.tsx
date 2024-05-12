import { FC, useEffect } from 'react';
import CompleteInfo from '@/layout/components/CompleteInfo';
import { getCookie } from '@lhb/cache';
import { dispatchNavigate } from '@/common/document-event/dispatch';
const OpenWebCompleteInfo: FC<any> = () => {
  useEffect(() => {
    if (!getCookie('flow_token')) {
      dispatchNavigate('/');
    }
  }, []);
  return (
    <CompleteInfo justAwait/>
  );
};

export default OpenWebCompleteInfo;
