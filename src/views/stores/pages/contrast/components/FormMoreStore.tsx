// 多个门店对比的组件
import { FC } from 'react';
import { Button, DatePicker, Typography } from 'antd';
import styles from './index.module.less';
import dayjs from 'dayjs';
import IconFont from '@/common/components/IconFont';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface IProps {
  dateScope: number; // 选择的对比方式 1 小时；2 天
  value?: any;
  onChange?: any;
  deleteStores: (index: number) => void;
}

const FormMoreStore: FC<IProps> = ({ dateScope, value, onChange, deleteStores }) => {
  const changeDate = (_date: any, dateString: string, index: number) => {
    const target = {
      ...value[index],
      start: dateString,
      end: dateString,
    };

    const arr = value.slice();
    arr[index] = target;
    onChange(arr);
  };

  const changeRangeDate = (dates: any, dateStrings: [string, string], index: number) => {
    const target = {
      ...value[index],
      start: dateStrings[0],
      end: dateStrings[1],
    };
    const arr = value.slice();
    arr[index] = target;
    onChange(arr);
  };

  // 删除对比门店
  const onDeleteStore = (index: number) => {
    deleteStores(index);
  };

  const disabledDate = (current: any) => {
    return current && current > dayjs();
  };

  return (
    <>
      {Array.isArray(value) &&
        value.map((item: any, index: number) => (
          <div key={item.id} className={styles.moreStoreWrap}>
            <div className={styles.storeName}>
              <Text style={{ width: 240 }} ellipsis={{ tooltip: item.name }}>
                门店{index + 1}：{item.name}
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
                value={[item.start && dayjs(item.start), item.end && dayjs(item.end)]}
                onChange={(dates, dateStrings) => changeRangeDate(dates, dateStrings, index)}
                disabledDate={disabledDate}
              />
            )}
            <Button
              className={styles.resetBtn}
              icon={<IconFont iconHref='iconic_delete_normal' />}
              type='link'
              onClick={() => onDeleteStore(index)}
            >
              删除
            </Button>
          </div>
        ))}
    </>
  );
};

export default FormMoreStore;
