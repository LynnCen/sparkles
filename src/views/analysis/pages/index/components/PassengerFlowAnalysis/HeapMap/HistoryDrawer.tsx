/**
 * @Description 历史巡店图
 */

import { FC, useEffect, useState } from 'react';
import { Form } from 'antd';
import { storeDeviceHistoryHeatMap } from '@/common/api/store';
// import cs from 'classnames';
import styles from './index.module.less';
import dayjs from 'dayjs';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Container from '@/common/components/Data/V2Container';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Empty from '@/common/components/Data/V2Empty';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormTimePicker from '@/common/components/Form/V2FormTimePicker/V2FormTimePicker';
import { isArray } from '@lhb/func';

const HistoryDrawer: FC<any> = ({
  open,
  storeId,
  deviceId,
  close
}) => {
  const [form] = Form.useForm();
  const [mainHeight, setMainHeight] = useState<number|string>('100vh');
  const [historyList, setHistoryList] = useState<any[]>([]);

  useEffect(() => {
    if (!(open && storeId && deviceId)) return;
    // 默认当天
    form.setFieldValue('date', dayjs());
    getHistory({
      date: dayjs().format('YYYY-MM-DD')
    }); // 默认请求一次
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const getHistory = (formValues: any) => {
    const { date, time } = formValues;
    const params: any = {
      storeId,
      deviceId
    };
    date && (params.date = dayjs(date).format('YYYY-MM-DD'));
    time && (params.time = dayjs(time).format('HH:mm'));
    storeDeviceHistoryHeatMap(params).then((res: any) => {
      setHistoryList(isArray(res) ? res : []);
    });
  };

  const onSearch = (values: any) => {
    getHistory(values);
  };

  const closeHandle = () => {
    form.resetFields();
    close && close();
  };

  return (
    <V2Drawer
      open={open}
      onClose={closeHandle}>
      <V2Container
        emitMainHeight={(h) => setMainHeight(h)}
        // 容器上下padding 40， 所以减去就是80
        style={{ height: 'calc(100vh - 80px)' }}
        extraContent={{
          top: <>
            <V2Title text='历史巡店图'/>
            {/* <div className='mt-20 mb-16'>
              <DatePicker
                onChange={dateChange}
                disabledDate={(current) => current && current > dayjs()}
                style={{ width: '288px' }}/>
            </div> */}
            <SearchForm
              form={form}
              onSearch={onSearch}
              showResetBtn={false}
              // labelLength={4}
              className='mt-20 mb-16'
            >
              <V2FormDatePicker
                name='date'
                config={{
                  style: { width: '180px' },
                  clearIcon: false,
                  disabledDate: (current) => current && current > dayjs()
                }}/>
              <V2FormTimePicker
                name='time'
                config={{
                  style: { width: '180px' },
                  format: 'HH:mm'
                }}/>
            </SearchForm>
          </>
        }}
      >
        <div style={{
          height: mainHeight,
          overflowY: 'scroll',
        }}>
          {
            historyList?.length > 0 ? historyList.map((item: any) => (
              <div className={styles.itemCon}>
                <img
                  src={item.url}
                  width='100%'
                  height='100%'/>
              </div>
            )) : <V2Empty customTip='暂无数据' centerInBlock/>
          }
        </div>
      </V2Container>
    </V2Drawer>
  );
};

export default HistoryDrawer;
