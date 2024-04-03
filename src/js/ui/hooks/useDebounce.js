/**
 * @Author Pull
 * @Date 2021-10-14 14:17
 * @project useDebounce
 */
import { useEffect, useRef, useCallback } from "react";
export const useDebounce = (fn, delay, dep) => {
    const { current } = useRef({
        fn,
        timer: null,
    });
    useEffect(() => {
        current.fn = fn;
    }, [fn]);
    return useCallback(function (...args) {
        if (current.timer !== null) {
            clearTimeout(current.timer);
        }

        if (args[0] && args[0].persist) {
            // 兼容 ReactV17以下
            args[0].persist();
        }
        current.timer = setTimeout(() => {
            // @ts-ignore
            current.fn.apply(this, args);
        }, delay);
    }, dep);
};
export default useDebounce;
