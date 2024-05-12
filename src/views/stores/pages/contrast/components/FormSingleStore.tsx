// 单个门店对比的组件
import { FC } from 'react';
import { Button, DatePicker, Typography } from 'antd';
import styles from './index.module.less';
import dayjs from 'dayjs';
import IconFont from '@/common/components/IconFont';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface IProps {
  dateScope: number; // 选择的对比方式 1 小时；2 天
  value?: any; // list ,start, end
  onChange?: any;
}

const FormSingleStore: FC<IProps> = ({ dateScope, value, onChange }) => {
  const changeDate = (_date: any, dateString: string, index: number) => {
    const target = {
      ...value.list[index],
      start: dateString,
      end: dateString,
    };

    const arr = value.list.slice();
    arr[index] = target;
    onChange({ ...value, list: arr });
  };

  const changeRangeDate = (dates: any, dateStrings: [string, string], index: number) => {
    const target = {
      ...value.list[index],
      start: dateStrings[0],
      end: dateStrings[1],
    };
    const arr = value.list.slice();
    arr[index] = target;
    onChange({ ...value, list: arr });
  };

  // 删除对比门店
  const onDeleteStore = (index: number) => {
    let arr = value.list.slice();
    arr.length <= 2 ? (arr = []) : arr.splice(index, 1);
    onChange({ ...value, list: arr });
  };

  // 新增对比时间
  const onAddContrast = () => {
    const arr = value.list.slice();
    arr.push({
      ...arr[0],
      start: dateScope === 2 ? value.start : '',
      end: dateScope === 2 ? value.end : '',
    });
    onChange({ ...value, list: arr });
  };

  const disabledDate = (current: any) => {
    return current && current > dayjs();
  };

  return (
    <>
      {Array.isArray(value?.list) &&
        value.list.map((item: any, index: number) => (
          <div key={index} className={styles.moreStoreWrap}>
            <div className={styles.storeName}>
              <Text style={{ width: 240 }} ellipsis={{ tooltip: item.name }}>
                门店：{item.name}
              </Text>
            </div>
            {dateScope === 1 && (
              <DatePicker
                disabledDate={disabledDate}
                onChange={(date, dateString) => changeDate(date, dateString, index)}
              />
            )}
            {dateScope === 2 && (
              <RangePicker
                format='YYYY-MM-DD'
                disabledDate={disabledDate}
                value={[item.start && dayjs(item.start), item.end && dayjs(item.end)]}
                onChange={(dates, dateStrings) => changeRangeDate(dates, dateStrings, index)}
              />
            )}

            <Button className={styles.resetBtn} type='link' onClick={() => onDeleteStore(index)}>
              <IconFont iconHref='iconic_delete_normal' className='mr-8' />
              删除
            </Button>

            {index === value.list.length - 1 && value.list.length < 10 && (
              <Button type='link' onClick={onAddContrast}>
                <IconFont iconHref='iconxinzeng' className='mr-8' />
                新增对比时间
              </Button>
            )}
          </div>
        ))}
    </>
  );
};

export default FormSingleStore;
