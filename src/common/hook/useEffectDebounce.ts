/**
 * @Description 带有debounce功能的useEffect
 */

import { debounce } from '@lhb/func';
import { DependencyList, EffectCallback, useCallback, useEffect, useState } from 'react';

export function useDebounceEffect(
  effect: EffectCallback, // effect回调函数
  deps?: DependencyList, // 依赖项数组
  time: number = 1000, // 配置防抖的时间
) {
  // 通过设置 flag 标识依赖，只有改变的时候，才会触发 useEffect 中的回调
  const [flag, setFlag] = useState<any>(null);

  // 为函数设置防抖功能
  const run = useCallback(
    debounce(() => {
      setFlag((state) => !state);
    }, time),
    [time]);

  // return run() 会触发run并在下一次执行时销毁上一次的定时器
  useEffect(() => {
    return run();
  }, deps);

  // 只有在 flag 变化的时候，才执行逻辑
  useEffect(() => {
    if (flag !== null) {
      // 执行effect，并执行上一次的return
      return effect();
    }
  }, [flag]);
}

