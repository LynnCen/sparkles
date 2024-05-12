import { FC, useEffect, useMemo, useState } from 'react';
import { Form } from 'antd';
import { HeadComProps } from '../ts-config';
import { StoreListItem } from '@/common/api/common';
import FormStores from '@/common/components/FormBusiness/FormStores';
import FormRadio from '@/common/components/Form/FormRadio';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import dayjs from 'dayjs';
import { useMethods } from '@lhb/hook';

const radioOptions = [
  { label: '实时视频', value: 1 },
  { label: '历史视频', value: 2 },
];

const Header: FC<HeadComProps> = ({
  searchParams,
  setSearchParams,
  curDevice,
  stop,
  storeChangeHandle
}) => {
  const { videoType, storeId, HWDate, YDTime } = searchParams;
  const { source } = curDevice || {};
  const [form] = Form.useForm();
  // const [playBack, setPlayBack] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [storeListData, setStoreListData] = useState<StoreListItem[]>([]);

  const playBack = useMemo(() => {
    const { playbackStatus } = curDevice;
    return !!playbackStatus;
  }, [curDevice]);
  const {
    videoChange,
    storeChange,
    disabledDate,
    playBackNode,
    dateChange
  } = useMethods({
    videoChange: (e) => {
      const type = e.target.value;
      stop();
      setShowPicker(type === 2);
      setSearchParams((state) => ({ ...state, videoType: type }));
    },
    storeChange: (id: number) => { // 切换门店，判断是否可以回放视频
      id !== storeId && storeChangeHandle(id);
      form.setFieldsValue({
        videoType: 1
      });
      setShowPicker(false);
      // const targetStore = storeListData.find((item) => item.id === id);
      // if (!targetStore) return;
      // const { playbackStatus } = targetStore;
      // setPlayBack(!!playbackStatus);
    },
    playBackNode: () => {
      if (playBack) {
        return (
          <>
            <FormRadio
              label='选择视频'
              name='videoType'
              initialValue={videoType}
              options={radioOptions}
              onChange={videoChange}/>
            {
              showPicker &&
                <FormDatePicker
                  name='startTime'
                  formItemConfig={{
                    initialValue: source === 'HW' ? HWDate : YDTime
                  }}
                  config={{
                    format: source === 'HW' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss',
                    showTime: source === 'YD',
                    disabledDate,
                    onChange: dateChange
                  }}/>
            }
          </>
        );
      }
      return null;
    },
    disabledDate: (current) => {
      return current && (current >= dayjs() || current <= dayjs().subtract(7, 'day'));
    },
    dateChange: (val: Date) => {
      const fieldName = source === 'HW' ? 'HWDate' : 'YDTime';
      // const value = source === 'HW' ? dayjs(val).format('YYYY-MM-DD') : val;
      const dateVal = {
        [fieldName]: val
      };
      stop();
      setSearchParams((state) => ({
        ...state,
        ...dateVal
      }));
    }
  });

  useEffect(() => {
    // 门店数据
    if (Array.isArray(storeListData) && storeListData.length) {
      storeChange(storeId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeListData]);

  return (
    <Form
      form={form}
      preserve={false}
      name='form'
      layout='inline'>
      <FormStores
        label='选择门店'
        name='storeId'
        formItemConfig={{
          initialValue: storeId,
          style: { width: '260px' }
        }}
        change={storeChange}
        config={{
          finallyData: (data) => setStoreListData(data),
          onChange: () => stop()
        }}/>
      {playBackNode()}
    </Form>
  );
};

export default Header;
