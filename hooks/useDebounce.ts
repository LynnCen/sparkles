import { useEffect, useRef, useCallback,useState } from "react";

interface Debounce {
    (fn: Function, delay: number, dep: any): () => void;
}

// export const useDebounce = (fn:Function, delay:number, dep?:any) => {
//     const { current } = useRef<{ fn?: Function; timer?: any }>({
//         fn,
//         timer: null,
//     });
//     useEffect(() => {
//         current.fn = fn;
//     }, [fn]);
//     return useCallback(function (...args: any[]) {
//         if (current.timer !== null) {
//             clearTimeout(current.timer);
//         }

//         if (args[0] && args[0].persist) {
//             // 兼容 ReactV17以下
//             args[0].persist();
//         }
//         current.timer = setTimeout(() => {
//             // @ts-ignore
//             current.fn.apply(this, args);
//         }, delay);
//     }, dep);
// };
// export default useDebounce;
export const useDebounce = (fn:Function,delay:number)=>{
    let timer = null;
   
    return function (){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(()=>{
            fn()
        },delay)
    }
    


}

export function useDebounceHook(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(() => {
      let timer = setTimeout(() => setDebounceValue(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debounceValue;
  }
  

