import moment from "moment";

export const offsetMin = 5;
export const getCurrentTimeWithOffset = () =>
    Date.now() + moment.duration(5, "minutes").asMilliseconds();
