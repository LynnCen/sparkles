import moment from "moment";
export const formatMis = (mis: number | string): string => {
    const dur = moment.duration(mis);
    const h = dur.get("hour");
    const m = `${dur.get("minute")}`;
    const s = `${dur.get("second")}`;
    const d = Math.floor(dur.asDays())

    if(d>=1){
        return Math.floor(d) + 'day'
    }

    let str = ``;

    if (h) str += `${h}`.padStart(2, "0") + ":";
    str += `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;

    return str;
};

export default formatMis;
