import moment, { Moment } from 'moment';

function updateValidItems(
  timespan: [Moment, Moment],
  columns = ['hours', 'days', 'weeks', 'months'],
) {
  const dayDuration = moment.duration(timespan[1].diff(timespan[0])).asDays();
  const yearDuration = moment.duration(timespan[1].diff(timespan[0])).asYears();

  const items = [
    { key: 'hours', value: 'hours', enable: dayDuration === 0 },
    { key: 'days', value: 'days', enable: dayDuration > 1 && yearDuration <= 1 },
    { key: 'weeks', value: 'weeks', enable: dayDuration > 7 },
    { key: 'months', value: 'months', enable: dayDuration > 7 },
  ];

  return columns.map((item) => items.find((col) => col.key === item));
}

export { updateValidItems };
