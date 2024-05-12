// 同步Effect
import { useEffect } from 'react';
export function useAsyncEffect(effect: () => Promise<void | (() => void)>, dependencies?: any[]) {
  return useEffect(() => {
    const cleanupPromise = effect();
    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
