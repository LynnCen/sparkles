let winterMorningTimetable = [
  // ["22:36", "22:45"], // test
  // ["22:40", "22:45"], // test
  ["7:35", "8:15"],
  ["8:25", "9:05"],
  ["9:35", "10:15"],
  ["10:25", "11:05"],
  ["11:15", "11:55"],
  ["13:30", "14:10"],
  ["14:20", "15:00"]
];
let winterNoonTimetableDay1_4 = [
  ["15:30", "16:10"],
  ["16:20", "17:00"]
];
let winterNoonTimetableDay5 = [
  ["15:10", "15:50"],
  ["16:00", "16:40"]
  // ["22:25", "22:35"], // test
  // ["22:35", "22:45"] // test
];
const date = new Date().toLocaleDateString(); // yyyy/mm/dd
const joinDate = arr => arr.map(item => item.map(t => date + " " + t));

winterMorningTimetable = joinDate(winterMorningTimetable);
winterNoonTimetableDay1_4 = joinDate(winterNoonTimetableDay1_4);
winterNoonTimetableDay5 = joinDate(winterNoonTimetableDay5);

/**
 * 获取冬令作息时间表
 */
export const getWinterTimetable = () => {
  let day = new Date().getDay();
  if (day >= 1 && day <= 5) {
    return winterMorningTimetable.concat(
      day === 5 ? winterNoonTimetableDay5 : winterNoonTimetableDay1_4
    );
  } else return null;
};

/**
 * 当前时间处于某个一个时间段前中后
 * @param {*} beginDateStr
 * @param {*} endDateStr
 */
export const isDuringDate = (beginDateStr, endDateStr) => {
  let curDate = new Date();
  if (curDate < new Date(beginDateStr)) return -1;
  else if (curDate <= new Date(endDateStr)) return 0;
  else return 1;
};
