import { useEffect, useRef, useState } from "react";

export const usePercentByStep = (init) => {
    const [percent, setPercent] = useState(init);
    const [displayPercent, setDisplay] = useState(0);

    const stepTimer = useRef(null);
    useEffect(() => {
        clearInterval(stepTimer.current);
        if (percent === displayPercent) return;
        stepTimer.current = setInterval(() => {
            const step = Number((Math.random() + 0.66).toFixed(2));
            const _percent = Number((displayPercent + step).toFixed(2));

            // 步增
            if (_percent < percent) {
                setDisplay(_percent);
            } else {
                clearInterval(stepTimer.current);
                setPercent(percent);
            }
        }, 16);

        return () => {
            clearInterval(stepTimer.current);
        };
    }, [percent, displayPercent]);

    return {
        setPercent,
        displayPercent,
    };
};

export default usePercentByStep;
