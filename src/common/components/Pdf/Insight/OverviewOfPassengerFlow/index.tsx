import { FC, useMemo } from 'react';
import styles from '../entry.module.less';
import Header from '../Header';
import ChaptersCover from '../ChaptersCover';
import cs from 'classnames';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2Title from '@/common/components/Feedback/V2Title';
import Space from 'antd/lib/space';
import DoubleCircle from '../DoubleCircle';
import IndoorRateChart from './components/IndoorRateChart';
import ShoppingAllChart from './components/ShoppingAllChart';
import FLowTable from './components/FLowTable';
import { beautifyThePrice, floorKeep, replaceEmpty } from '@lhb/func';
import dayjs from 'dayjs';

// const demographicChangesMock = [
//   {
//     'name': '同比增长',
//     'type': 'demographicChanges_onYear',
//     'data': [
//       {
//         'name': '2018',
//         'value': '0.0330',
//       },
//       {
//         'name': '2019',
//         'value': '0.0320',
//       },
//       {
//         'name': '2020',
//         'value': '0.0310',
//       },
//       {
//         'name': '2021',
//         'value': '0.0192',
//       },
//       {
//         'name': '2022',
//         'value': '0.0148',
//       }
//     ]
//   },
//   {
//     'name': '进店总数',
//     'type': 'demographicChanges_population',
//     'data': [
//       {
//         'name': '2018',
//         'value': '11250000',
//       },
//       {
//         'name': '2019',
//         'value': '11610000',
//       },
//       {
//         'name': '2020',
//         'value': '11970000',
//       },
//       {
//         'name': '2021',
//         'value': '12200000',
//       },
//       {
//         'name': '2022',
//         'value': '12380000',
//       }
//     ]
//   },
//   {
//     'name': '过店总数',
//     'type': 'demographicChanges_population',
//     'data': [
//       {
//         'name': '2018',
//         'value': '11250000',
//       },
//       {
//         'name': '2019',
//         'value': '11610000',
//       },
//       {
//         'name': '2020',
//         'value': '11970000',
//       },
//       {
//         'name': '2021',
//         'value': '12200000',
//       },
//       {
//         'name': '2022',
//         'value': '12380000',
//       }
//     ]
//   }
// ];

// const tableMock = {
//   'flowList': [
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '00:00:00',
//       'duration': 0,
//       'endTime': '00:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '未完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '00:30:00',
//       'duration': 0,
//       'endTime': '01:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 1,
//       'passbyFemaleChild': 1,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '01:00:00',
//       'duration': 0,
//       'endTime': '01:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 1,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 1,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '01:30:00',
//       'duration': 0,
//       'endTime': '02:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 1,
//       'passbyFemaleChild': 1,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '02:00:00',
//       'duration': 0,
//       'endTime': '02:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 1,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 1,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '02:30:00',
//       'duration': 0,
//       'endTime': '03:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 1,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 1,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '03:00:00',
//       'duration': 0,
//       'endTime': '03:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 1,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 1,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '03:30:00',
//       'duration': 0,
//       'endTime': '04:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 1,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 1,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '04:00:00',
//       'duration': 0,
//       'endTime': '04:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 1,
//       'passbyFemaleChild': 1,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '04:30:00',
//       'duration': 0,
//       'endTime': '05:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 1,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 1,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '05:00:00',
//       'duration': 0,
//       'endTime': '05:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '05:30:00',
//       'duration': 0,
//       'endTime': '06:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '06:00:00',
//       'duration': 0,
//       'endTime': '06:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '06:30:00',
//       'duration': 0,
//       'endTime': '07:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '07:00:00',
//       'duration': 0,
//       'endTime': '07:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '07:30:00',
//       'duration': 0,
//       'endTime': '08:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '08:00:00',
//       'duration': 0,
//       'endTime': '08:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '08:30:00',
//       'duration': 0,
//       'endTime': '09:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '09:00:00',
//       'duration': 0,
//       'endTime': '09:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '09:30:00',
//       'duration': 0,
//       'endTime': '10:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '10:00:00',
//       'duration': 0,
//       'endTime': '10:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '10:30:00',
//       'duration': 0,
//       'endTime': '11:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '11:00:00',
//       'duration': 0,
//       'endTime': '11:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '11:30:00',
//       'duration': 0,
//       'endTime': '12:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '12:00:00',
//       'duration': 0,
//       'endTime': '12:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '12:30:00',
//       'duration': 0,
//       'endTime': '13:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '13:00:00',
//       'duration': 0,
//       'endTime': '13:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '13:30:00',
//       'duration': 0,
//       'endTime': '14:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '14:00:00',
//       'duration': 0,
//       'endTime': '14:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '14:30:00',
//       'duration': 0,
//       'endTime': '15:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '15:00:00',
//       'duration': 0,
//       'endTime': '15:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '15:30:00',
//       'duration': 0,
//       'endTime': '16:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '16:00:00',
//       'duration': 0,
//       'endTime': '16:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '16:30:00',
//       'duration': 1804,
//       'endTime': '17:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '17:00:00',
//       'duration': 0,
//       'endTime': '17:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '17:30:00',
//       'duration': 0,
//       'endTime': '18:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '18:00:00',
//       'duration': 0,
//       'endTime': '18:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '18:30:00',
//       'duration': 0,
//       'endTime': '19:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '19:00:00',
//       'duration': 0,
//       'endTime': '19:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '19:30:00',
//       'duration': 0,
//       'endTime': '20:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '20:00:00',
//       'duration': 0,
//       'endTime': '20:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '20:30:00',
//       'duration': 0,
//       'endTime': '21:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '21:00:00',
//       'duration': 0,
//       'endTime': '21:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '21:30:00',
//       'duration': 0,
//       'endTime': '22:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '22:00:00',
//       'duration': 0,
//       'endTime': '22:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '22:30:00',
//       'duration': 0,
//       'endTime': '23:00:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     },
//     {
//       'flowProjectId': 274,
//       'flowProjectCode': '9jqw',
//       'date': '2022-11-05',
//       'startTime': '23:00:00',
//       'duration': 0,
//       'endTime': '23:30:00',
//       'videoUrls': [
//         'https://videos.linhuiba.com/Fm-Nfy5ONbbzYnskd4WTvos-4oEW'
//       ],
//       'statusName': '已完成',
//       'passbyCount': 0,
//       'passbyFemaleChild': 0,
//       'passbyFemaleTeen': 0,
//       'passbyFemaleOlder': 0,
//       'passbyFemaleCount': 0,
//       'passbyMaleChild': 0,
//       'passbyMaleTeen': 0,
//       'passbyMaleOlder': 0,
//       'passbyMaleCount': 0,
//       'indoorCount': 0,
//       'indoorFemaleChild': 0,
//       'indoorFemaleTeen': 0,
//       'indoorFemaleOlder': 0,
//       'indoorFemaleCount': 0,
//       'indoorMaleChild': 0,
//       'indoorMaleTeen': 0,
//       'indoorMaleOlder': 0,
//       'indoorMaleCount': 0,
//       'indoorRate': 0.00,
//       'shoppingRate': 0.00,
//       'shoppingCount': 0.00
//     }
//   ],
//   'fields': [
//     {
//       'title': '时间段',
//       'key': 'startTime',
//       'showColumn': true,
//       'children': []
//     },
//     {
//       'title': '过店客流',
//       'key': 'flow',
//       'showColumn': true,
//       'children': [
//         {
//           'title': '过店总数',
//           'key': 'flowAll',
//           'showColumn': true,
//           'children': null
//         },
//         {
//           'title': '女性',
//           'key': 'flowFemale',
//           'showColumn': true,
//           'children': [
//             {
//               'title': '儿童',
//               'key': 'flowFemaleChildren',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '青壮年',
//               'key': 'flowFemaleYouth',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '老人',
//               'key': 'flowFemaleOle',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '女性总数',
//               'key': 'flowFemaleAll',
//               'showColumn': true,
//               'children': null
//             }
//           ]
//         },
//         {
//           'title': '男性',
//           'key': 'flowMale',
//           'showColumn': true,
//           'children': [
//             {
//               'title': '儿童',
//               'key': 'flowMaleChildren',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '青壮年',
//               'key': 'flowMaleYouth',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '老人',
//               'key': 'flowMaleOle',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '男性总数',
//               'key': 'flowMaleAll',
//               'showColumn': true,
//               'children': null
//             }
//           ]
//         }
//       ]
//     },
//     {
//       'title': '进店客流',
//       'key': 'passenger',
//       'showColumn': true,
//       'children': [
//         {
//           'title': '进店总数',
//           'key': 'passengerAll',
//           'showColumn': true,
//           'children': null
//         },
//         {
//           'title': '女性',
//           'key': 'passengerFemale',
//           'showColumn': true,
//           'children': [
//             {
//               'title': '儿童',
//               'key': 'passengerFemaleChildren',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '青壮年',
//               'key': 'passengerFemaleYouth',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '老人',
//               'key': 'passengerFemaleOle',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '女性总数',
//               'key': 'passengerFemaleAll',
//               'showColumn': true,
//               'children': null
//             }
//           ]
//         },
//         {
//           'title': '男性',
//           'key': 'passengerMale',
//           'showColumn': true,
//           'children': [
//             {
//               'title': '儿童',
//               'key': 'passengerMaleChildren',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '青壮年',
//               'key': 'passengerMaleYouth',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '老人',
//               'key': 'passengerMaleOle',
//               'showColumn': true,
//               'children': null
//             },
//             {
//               'title': '男性总数',
//               'key': 'passengerMaleAll',
//               'showColumn': true,
//               'children': null
//             }
//           ]
//         }
//       ]
//     },
//     {
//       'title': '进店率',
//       'key': 'indoorRate',
//       'showColumn': true,
//       'children': []
//     },
//     {
//       'title': '提袋客流',
//       'key': 'shoppingRate',
//       'showColumn': true,
//       'children': []
//     },
//     {
//       'title': '提袋率',
//       'key': 'shoppingAll',
//       'showColumn': true,
//       'children': []
//     }
//   ]
// };

const OverviewOfPassengerFlow: FC<any> = ({
  detailInfo = {},
}) => {

  const titleTime = useMemo(() => {
    if (detailInfo?.checkSpotInfo?.checkDate) {
      return `${detailInfo?.checkSpotInfo?.checkDate}(${dayjs(detailInfo?.checkSpotInfo?.checkDate).format('ddd')})`;
    } else {
      return '';
    }
  }, [detailInfo]);

  const img = useMemo(() => {
    if (detailInfo?.shopInfo?.pics && detailInfo?.shopInfo?.pics.length) {
      return detailInfo?.shopInfo?.pics[0];
    } else {
      return '';
    }

  }, [detailInfo]);

  /**
   * @description 通过前端解析字段是否展示
   * @returns Object 需要展示的字段，有则显示
   */
  const flowInfos = useMemo(() => {
    const result: any = {};
    detailInfo?.fields?.forEach((item) => {
      if (item.key === 'flow') {
        // 过店客流
        let flowSexRate = false;
        let flowAgeRate = false;
        for (let i = 0; i < item.children?.length; i++) {
          if ((item.children[i].key === 'flowFemale' || item.children[i].key === 'flowMale') && item.children[i].showColumn) {
            flowSexRate = true;
            const child = item.children[i];
            for (let j = 0; j < child?.length; j++) {
              if ((child[j].key === 'passbyFemaleChild' || child[j].key === 'passbyFemaleTeen' || child[j].key === 'passbyFemaleOlder') && child[j].showColumn) {
                flowAgeRate = true;
                break;
              }
            }
          }
        }
        if (flowSexRate) {
          result['flowSexRate'] = `男性${floorKeep(detailInfo?.flowInfo?.maleRate, 100, 3, 2)}%、女性${floorKeep(detailInfo?.flowInfo?.femaleRate, 100, 3, 2)}%`;
        }
        if (flowAgeRate) {
          result['flowAgeRate'] = `儿童${floorKeep(detailInfo?.flowInfo?.childRate, 100, 3, 2)}%、中青年${floorKeep(detailInfo?.flowInfo?.teenRate, 100, 3, 2)}%、老人${floorKeep(detailInfo?.flowInfo?.olderRate, 100, 3, 2)}%`;
        }
      } else if (item.key === 'passenger' && item.showColumn) {
        result['indoorCount'] = `${beautifyThePrice(detailInfo?.flowInfo?.indoorCount, ',', 0)}人次`;
      } else if (item.key === 'indoorRate' && item.showColumn) {
        result['indoorRate'] = `${floorKeep(detailInfo?.flowInfo?.indoorRate, 100, 3, 2)}%`;
      }
    });
    return result;
  }, [detailInfo]);

  return (
    <div className={styles.overviewOfPassengerFlow}>
      <div className={cs(styles.overviewCon)}>
        <ChaptersCover
          sectionVal='01'
          title='客流概览'
          subheadingEn='Overview of passenger flow'/>
      </div>
      <div className={cs(styles.firstPage)}>
        <Header
          hasIndex
          name='踩点情况'/>
        <div className={styles.content}>
          <div className={styles.left}>
            <img
              src={img}
              width='100%'
              height='100%'
            />
          </div>
          <div className={styles.right}>
            <Space direction='vertical' size={64}>
              <V2DetailGroup
                direction='horizontal'
                labelLength={6}>
                <V2Title divider type='H1' text='踩点概况' />
                <V2DetailItem
                  labelStyle={{
                    color: '#CCCCCC',
                  }}
                  valueStyle={{
                    color: '#FFFFFF',
                  }}
                  label='踩点品牌'
                  value={detailInfo?.checkSpotInfo?.brand}/>
                <V2DetailItem
                  labelStyle={{
                    color: '#CCCCCC',
                  }}
                  valueStyle={{
                    color: '#FFFFFF',
                  }}
                  label='踩点时间'
                  value={`${detailInfo?.checkSpotInfo?.checkDate} ${detailInfo?.checkSpotInfo?.datePeriods?.map((item) => `${item.start}-${item.end}`)?.join('; ')}`}/>
                <V2DetailItem
                  labelStyle={{
                    color: '#CCCCCC',
                  }}
                  valueStyle={{
                    color: '#FFFFFF',
                  }}
                  label='踩点总时长'
                  value={`${replaceEmpty(detailInfo?.checkSpotInfo?.duration)} 小时`}/>
                <V2DetailItem
                  labelStyle={{
                    color: '#CCCCCC',
                  }}
                  valueStyle={{
                    color: '#FFFFFF',
                  }}
                  label='踩点位置'
                  rows={3}
                  value={detailInfo?.checkSpotInfo?.address}/>
              </V2DetailGroup>
              <V2DetailGroup
                direction='horizontal'
                labelLength={6}>
                <V2Title divider type='H1' text='客流信息' />
                <V2DetailItem
                  labelStyle={{
                    color: '#CCCCCC',
                  }}
                  valueStyle={{
                    color: '#FFFFFF',
                  }}
                  label='过店客流'
                  value={`${beautifyThePrice(detailInfo?.flowInfo?.passbyCount, ',', 0)}人次`}/>
                { !!flowInfos['indoorCount'] && (
                  <V2DetailItem
                    labelStyle={{
                      color: '#CCCCCC',
                    }}
                    valueStyle={{
                      color: '#FFFFFF',
                    }}
                    label='进店客流'
                    value={flowInfos['indoorCount']}/>
                ) }
                { !!flowInfos['indoorRate'] && (
                  <V2DetailItem
                    labelStyle={{
                      color: '#CCCCCC',
                    }}
                    valueStyle={{
                      color: '#FFFFFF',
                    }}
                    label='进店率'
                    value={flowInfos['indoorRate']}/>
                ) }
                { !!flowInfos['flowAgeRate'] && (
                  <V2DetailItem
                    labelStyle={{
                      color: '#CCCCCC',
                    }}
                    valueStyle={{
                      color: '#FFFFFF',
                    }}
                    label='过店年龄段比例'
                    labelLength={7}
                    value={flowInfos['flowAgeRate']}/>
                ) }
                { !!flowInfos['flowSexRate'] && (
                  <V2DetailItem
                    labelStyle={{
                      color: '#CCCCCC',
                    }}
                    valueStyle={{
                      color: '#FFFFFF',
                    }}
                    label='过店男女比例'
                    labelLength={7}
                    value={flowInfos['flowSexRate']}/>
                ) }
                <V2DetailItem
                  labelStyle={{
                    color: '#CCCCCC',
                  }}
                  valueStyle={{
                    color: '#FFFFFF',
                  }}
                  label='过店高峰时间段'
                  labelLength={7}
                  value={detailInfo?.flowInfo?.periods?.map((item) => `${item.start}-${item.end}`)?.join('; ')}/>
              </V2DetailGroup>
            </Space>
          </div>
        </div>
        <div className={styles.footer}>
          <DoubleCircle layout='vertical'/>
        </div>
      </div>
      <FLowTable data={detailInfo} title={titleTime}/>
      <IndoorRateChart
        detailInfo={detailInfo}
        titleTime={titleTime}
      />
      <ShoppingAllChart
        detailInfo={detailInfo}
        titleTime={titleTime}
      />
    </div>
  );
};

export default OverviewOfPassengerFlow;
