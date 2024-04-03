/**
 * @Author Pull
 * @Date 2021-10-18 14:06
 * @project useEffectOnce
 */
import { useRef, useEffect } from "react";
export const useEffectOnce = (fn, dep, rule) => {
    const flag = useRef(false);
    useEffect(() => {
        if (!flag.current && rule) {
            flag.current = true;
            fn();
        }
    }, dep);
};

export default useEffectOnce;
