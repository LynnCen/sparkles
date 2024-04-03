/**
 * @Author Pull
 * @Date 2021-11-05 11:31
 * @project useThrottle
 */
import { useEffect, useRef, useCallback } from "react";
export const useThrottle = (fn, delay, dep) => {
    const { current } = useRef({
        fn,
        timer: null,
    });
    useEffect(() => {
        current.fn = fn;
    }, [fn]);
    return useCallback(function (...args) {
        if (current.timer !== null) return;

        if (args[0] && args[0].persist) {
            // 兼容 ReactV17以下
            args[0].persist();
        }
        current.timer = setTimeout(() => {
            // @ts-ignore
            current.fn.apply(this, args);
            current.timer = null;
        }, delay);
    }, dep);
};
export default useThrottle;
