/**
 * @Description 是否是测距的逻辑复用
 */
import { useEffect, useContext, useState } from 'react';
import MapHelpfulContext from '@/common/components/AMap/MapHelpfulContext';

export function useStadiometry() {
  const helpfulContext: any = useContext(MapHelpfulContext);
  const [isStadiometry, setIsStadiometry] = useState<boolean>(false); // 是否在使用测距功能


  useEffect(() => {
    const { stateData } = helpfulContext || {};
    const { toolBox } = stateData || {};
    const { stadiometry } = toolBox || {};
    if (stadiometry) {
      setIsStadiometry(true);
      return;
    }
    setIsStadiometry(false);
  }, [helpfulContext?.stateData]);

  return isStadiometry;
}
