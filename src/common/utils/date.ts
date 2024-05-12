/**
 * [日期相关函数方法]
 */
// 计算记忆  减少重复计算   毫秒
// ps:   dateFns.year,dateFns.day
const timeTypes = [
  { value: 'year', unit: '年' },
  { value: 'day', unit: '天' },
  { value: 'hour', unit: '时' },
  { value: 'minute', unit: '分' },
  { value: 'second', unit: '秒' },
];
function DateFn(this: any) {
  this.second = 1000;
  this.minute = this.second * 60;
  this.hour = this.minute * 60;
  this.day = this.hour * 24;
  this.year = this.day * 365;
}
// 获取  '01' 格式的日期
// ps:   dateFns.doubleDigit(8)=>'08'
// n: string | number
DateFn.prototype.doubleDigit = function(n) {
  // @ts-ignore
  const r = parseInt(n);
  if (r > 9) {
    return r;
  } else {
    return '0' + r;
  }
};
// 日期转换
// ps:   dateFns.changeTime(n,'/')=> 2019/09/03 23:59:59
// ps:   dateFns.changeTime(n,null,true)=> 2019-09-03
// t: any
// divider?: string
// nohour?: boolean
DateFn.prototype.changeTime = function(t, divider, nohour):string {
  const d = divider || '-'; // 默认分隔符
  if (t) {
    const date = new Date(t);
    const Y = date.getFullYear() + d;
    const M = dateFns.doubleDigit(date.getMonth() + 1) + d;
    const D = dateFns.doubleDigit(date.getDate());
    const h = dateFns.doubleDigit(date.getHours()) + ':';
    const m = dateFns.doubleDigit(date.getMinutes()) + ':';
    const s = dateFns.doubleDigit(date.getSeconds());
    return nohour ? Y + M + D : Y + M + D + ' ' + h + m + s;
  } else {
    return '';
  }
};
DateFn.prototype.durationStr = function(t) {
  let res = '';
  timeTypes.forEach(item => {
    if (t >= this[item.value]) {
      // @ts-ignore
      res += (parseInt(t / this[item.value]) + item.unit);
      t %= this[item.value];
    }
  });
  return res;
};
const dateFns = new DateFn();

/**
 * @description: 获取开始结束日期之间的所有日期（包括开始、结束）
 * @param {*} stime 开始日期时间戳
 * @param {*} etime 结束日期时间戳
 * @param {*} toDate 输出结果是否转换为日期（年-月-日）
 * @return {*}
 * getSectionDate(+new Date('2022.12.08'), +new Date('2023.2.08'), true);
 */
export function getSectionDate(stime, etime, toDate = false) {
  if (!stime || !etime) {
    return [];
  }
  // 初始化日期列表，数组
  var section: Array<any> = [];
  // 开始日期小于等于结束日期,并循环
  while (stime <= etime) {
    section.push(toDate ? dateFns.changeTime(stime, null, true) : stime);
    // 增加一天时间戳后的日期
    stime = stime + (24 * 60 * 60 * 1000);
  }
  return section;
}

// 判断两个正序排序的日期是否连续：true 连续
function isConsecutiveDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return +startDate === +endDate || startDate.setDate(startDate.getDate() + 1) === endDate.getTime(); // 将 startDate 增加一天后比对时间戳是否一致
}

/**
 * @description: 处理日期数组，对连续的日期合并显示
 * @param {*} dates 日期数组，如 ['2022-11-29', '2022-11-30', '2022-12-01', '2022-12-02', '2022-12-03', '2022-12-04', '2022-12-06', '2022-12-08', '2022-12-09', '2022-12-11']
 * @return {*} 处理后的日期数组，如 ['2022-11-29 - 2022-12-04', '2022-12-06', '2022-12-08 - 2022-12-09', '2022-12-11']
 */
export function parseConsecutiveDate(dates) {
  if (!Array.isArray(dates) || !dates.length) {
    return dates;
  }
  dates = dates.sort((a, b) => +new Date(a) - +new Date(b));

  const dateObj = dates.reduce((result, item) => {
    const index = result.index;
    if (Array.isArray(result.dates[index]) && result.dates[index].length && isConsecutiveDate(result.dates[index][1], item)) { // 如果是连续，覆盖到 dates[index][1] 上
      result.dates[index][1] = item;
    } else { // 如果非连续，累加 index，开始新的数组
      result.index++;
      result.dates[result.index] = [item, item];
    }
    return result;
  }, {
    // dates: [
    //   [开始，结束]
    // ],
    dates: [],
    index: -1
  });

  return dateObj.dates.map(item => Array.isArray(item) ? (+new Date(item[0]) === +new Date(item[1]) ? item[0] : item.join(' - ')) : '');
}

