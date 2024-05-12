import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Container from '@/common/components/Data/V2Container';
import Top from './Top';
import TabsContent from './TabsContent';
import { useEffect, useState } from 'react';
import { storeDetail } from '@/common/api/passenger-flow';
import { isNotEmptyAny, refactorPermissions } from '@lhb/func';
import { StoreDetail } from '../../../detail/ts-config';
import { Spin } from 'antd';
import NotFound from '@/common/components/NotFound';
import styles from './index.module.less';
import Main from './Main';

export type PassengerFlowDetailDrawerProps = {
  open: boolean; // 是否打开弹窗
  setOpen: Function; // 设置弹窗状态
  id: number | string; // 详情id
}

const PassengerFlowDetailDrawer = (props: PassengerFlowDetailDrawerProps) => {
  const {
    open,
    setOpen,
    id
  } = props;
  const [activeKey, setActiveKey] = useState('1');
  const [detail, setDetail] = useState<StoreDetail | Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [deviceParams, setDeviceParams] = useState({});
  const [source, setSource] = useState<any>();

  useEffect(() => {
    if (open) {
      getDetail();
    }
  }, [id, open]);

  const getDetail = async () => {
    if (!id) return;
    setLoading(true);
    const data = await storeDetail({ id });

    const permissionEvents = !data ? [] : refactorPermissions(data.permissions).map(itm => itm.event);

    setDetail({
      ...data,
      permissionEvents,
    });
    setSource(data.source);
    setDeviceParams({});
    setLoading(false);
  };
  return (
    <>
      <V2Drawer bodyStyle={{
        paddingRight: '40px',
        paddingLeft: '40px',
      }} open={open} onClose={() => setOpen(false)}>
        <Spin spinning={loading} style={{ height: '100vh' }}>
          { isNotEmptyAny(detail) && (
            <V2Container
              // 容器上下padding 32， 所以减去就是64
              style={{ height: 'calc(100vh - 64px)' }}
              extraContent={{
                top: <>
                  <Top detail={detail} onChange={getDetail}></Top>
                  <TabsContent detail={detail} activeKey={activeKey} setActiveKey={setActiveKey} />
                </>,
              }}
            >
              <Main activeKey={activeKey} open={open} detail={detail} source={source} setSource={setSource} deviceParams={deviceParams} getDetail={getDetail} />
            </V2Container>
          )}
          { !isNotEmptyAny(detail) && !loading && (
            <div className={styles.emptyDiv}>
              <NotFound text='暂无数据'/>
            </div>
          )}

        </Spin>
      </V2Drawer>
    </>
  );
};
export default PassengerFlowDetailDrawer;
