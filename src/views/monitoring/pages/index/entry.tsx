import { FC, useState, useEffect, useRef } from 'react'; // useState
import { Empty, Tabs } from 'antd';
import { dateFns, urlParams } from '@lhb/func';
import { SearchParamsProps } from './ts-config';
import { deviceList } from '@/common/api/device';
import { DeviceListItem } from './ts-config';
import styles from './entry.module.less';
import dayjs from 'dayjs';
import Header from './components/Header';
import YDLive from '@/common/components/business/Live/YDLive';
import HWLive from '@/common/components/business/Live/HWLive';
import { useMethods } from '@lhb/hook';
import { getCookie } from '@lhb/cache';

const yesterday = dayjs().subtract(1, 'days').format('YYYY-MM-DD');
const { TabPane } = Tabs;
const Monitoring: FC<any> = ({ location }) => {
  const videoRef = useRef(null);
  const storeId: string = urlParams(location.search)?.id || '';
  const [searchParams, setSearchParams] = useState<SearchParamsProps>({
    storeId: +storeId,
    videoType: 1,
    HWDate: dayjs(`${yesterday}`),
    YDTime: dayjs(`${yesterday} 08:00:00`)
  });
  const [deviceData, setDeviceData] = useState<DeviceListItem[]>([]);
  const [curDevice, setCurDevice] = useState<DeviceListItem>({} as DeviceListItem);
  const [tabActiveKey, setTabActiveKey] = useState<string>('');
  // const [curStoreId, setCurStoreId] = useState<string|number>(storeId);
  const curDeviceRef = useRef<any>(null);

  const bigDataSend = (event_id) => {
    const employeeId = getCookie('employeeId');
    window.LHBbigdata.send({
      event_id, // 事件id
      msg: {
        // 用户id取员工id
        employeeId: employeeId,
        time: dateFns.currentTime('', false),
        equipmentId: curDeviceRef.current.sn,
        name: curDeviceRef.current.name,
        storeId: storeId,
        platform: 'pc'
      } // 额外需要插入的业务信息
    });
  };

  const {
    storeChange,
    loadData,
    tabsContent,
    tabChange,
    stopHandle
  } = useMethods({
    storeChange: (id: number) => { // 切换门店
      // setCurStoreId(id);
      stopHandle();
      setSearchParams({
        storeId: id,
        videoType: 1,
        HWDate: dayjs(`${yesterday}`),
        YDTime: dayjs(`${yesterday} 08:00:00`)
      });
      // loadData();
    },
    loadData: async () => { // 获取当前门店下的设备列表
      const data = await deviceList({ id: searchParams.storeId });
      setDeviceData(data);
      setCurDevice(data[0] || {});
      curDeviceRef.current = data[0] || {};
      setTabActiveKey(data?.[0]?.id?.toString());
    },
    tabsContent: () => {
      if (Array.isArray(deviceData) && deviceData.length) {
        return (
          <>
            <Tabs activeKey={tabActiveKey} onChange={tabChange} className='mt-20'>
              {deviceData.map((device: DeviceListItem) => (
                <TabPane tab={device.name} key={device?.id?.toString()}>
                </TabPane>
              ))}
            </Tabs>
            {
              curDevice.source === 'YD' && (
                <YDLive
                  ref={videoRef}
                  url={curDevice.url}
                  isLive={searchParams.videoType === 1}
                  startTime={searchParams.YDTime}
                  bigDataSend={bigDataSend}
                />
              )
            }
            {
              curDevice.source === 'HW' && (
                <HWLive
                  ref={videoRef}
                  id={curDevice.id}
                  // storeId={curStoreId}
                  bigDataSend={bigDataSend}
                  isLive={searchParams.videoType === 1}
                  targetDate={searchParams.HWDate}/>
              )
            }
          </>
        );
      }
      return (<Empty className='mt-30'/>);
    },
    tabChange: (active: string) => {
      stopHandle();
      setTabActiveKey(active);
      const targetDevice = deviceData.find((item: DeviceListItem) => item.id.toString() === active);
      if (targetDevice) {
        setCurDevice(targetDevice);
        curDeviceRef.current = targetDevice;
      }
    },
    stopHandle: () => {
      const targetRef: any = videoRef.current;
      if (!targetRef) return;
      targetRef.stop();
    }
  });
  useEffect(() => {
    searchParams.storeId && loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.storeId]);
  useEffect(() => {
    // 离开页面埋点上报
    return () => {
      bigDataSend('4caa5998-43bd-4888-a8e3-8f8a572e1170');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Header
        searchParams={searchParams}
        curDevice={curDevice}
        stop={stopHandle}
        setSearchParams={setSearchParams}
        storeChangeHandle={storeChange}
      />
      { tabsContent() }
    </div>
  );
};

export default Monitoring;
