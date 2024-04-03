/**
 * @Author Pull
 * @Date 2021-10-21 17:03
 * @project useFilePicker
 */
import { useEffect, useRef } from "react";
import { setAttribute } from "utils/sn_vidoe";

export const useFilePicker = (attrs) => {
    const fileElRef = useRef();

    useEffect(() => {
        if (!fileElRef.current) {
            const input = document.createElement("input");
            input.type = "file";
            fileElRef.current = input;
        }

        setAttribute(fileElRef.current, attrs);
    }, [attrs]);

    const handlePick = () => {
        return new Promise((resolve) => {
            fileElRef.current.onchange = (e) => {
                try {
                    const file = e.target.files[0];
                    const { path } = file;
                    e.target.value = "";
                    resolve(path);
                } catch (e) {
                    console.log(e);
                }
            };
            fileElRef.current.click();
        });
    };

    return {
        handlePick,
    };
};

export default useFilePicker;
