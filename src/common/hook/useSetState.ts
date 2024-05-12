// import { isFunction } from '@/utils/utils';
import { useCallback, useState, useEffect, useRef } from 'react';

type ISetState<U> = U | ((...args: any[]) => U);
type ReturnStateMethods<U> = Partial<U> | ((state: U) => Partial<U>);

type ReturnSetStateFn<T> = (
  state: ReturnStateMethods<T>,
  cb?: (...args: any[]) => void
) => void;

function isFunction(fn: any): fn is Function {
  return typeof fn === 'function';
}

/**
 * 模拟class组件的setState方法
 * @param {ISetState<T>} initObj
 * @returns {[T, ((state: ReturnStateMethods<T>) => void)]}
 * @author lincen
 */
export default function useSetState<T extends object>(
  initObj: ISetState<T>
): [T, ReturnSetStateFn<T>] {
  const [state, setState] = useState<T>(initObj);
  const executeCb = useRef<(...args: any[]) => void>();
  const newSetState = useCallback<ReturnSetStateFn<T>>((state, cb) => {
    let newState = state;
    setState((prevState: T) => {
      executeCb.current = cb;
      if (isFunction(state) && typeof state === 'function') {
        newState = state(prevState);
      }
      return { ...prevState, ...newState };
    });
  }, []);
  useEffect(() => {
    const { current: cb } = executeCb;
    if (typeof cb === 'function') isFunction(cb) && cb();
  }, [executeCb.current]);
  return [state, newSetState];
}
