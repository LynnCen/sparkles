import { FC, useEffect, useState } from 'react';
import { Spin } from 'antd';
import Basic from './components/Basic';
import TabsContent from './components/TabsContent';
import NotFound from '@/common/components/NotFound';
import { refactorPermissions } from '@lhb/func';
import styles from './entry.module.less';
import { StoreDetail } from './ts-config';
import { storeDetail } from '@/common/api/passenger-flow';

const Detail: FC<any> = ({ id }) => {
  // const { id } = urlParams(location.search);
  const [detail, setDetail] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [deviceParams, setDeviceParams] = useState({});
  const [source, setSource] = useState<any>();

  useEffect(() => {
    getDetail();
  }, [id]);

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
    <div className={styles.container}>
      <Spin spinning={loading}>
        {id ? (
          <>
            <Basic detail={detail} onChange={getDetail}/>
            <TabsContent deviceParams={deviceParams} source={source} setSource={setSource} detail={detail} onChange={getDetail}/>
          </>
        ) : (
          <NotFound text='暂无数据' />
        )}
      </Spin>
    </div>
  );
};

export default Detail;
