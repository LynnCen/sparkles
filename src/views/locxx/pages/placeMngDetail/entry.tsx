import { Spin } from 'antd';
import { FC, useState, forwardRef, useImperativeHandle } from 'react';
import styles from './entry.module.less';
import TopDetail from './components/TopDetail';
import MainDetail from './components/MainDetail';
import { getPlaceInfoDetail } from '@/common/api/locxx';


interface DetailProps {
  detailId: number, // 详情id
  onRefresh?: Function, // 列表刷新
}


const PlaceDetail: FC<DetailProps & {ref?:any}> = forwardRef(({
  detailId, // 详情ID
  onRefresh
}, ref) => {

  useImperativeHandle(ref, () => ({
    init
  }));
  const [loading, setLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<any>({});
  // 初始化
  const init = () => {
    loadDetail(true);
  };

  const loadDetail = async (first?: boolean): Promise<any> => {
    if (!detailId) {
      return false;
    }
    setLoading(true);
    const result = await getPlaceInfoDetail(detailId);
    if (result) {
      setInfo(result);
      setLoading(false);
    }
    if (!first) {
      onRefresh?.();
    }
  };

  return (
    <Spin tip='数据正在加载中请稍等......' spinning={loading}>
      {info && <div
        className={styles['container']}>
        <TopDetail placeInfo={info}/>
        <MainDetail placeInfo={info} onRefresh={loadDetail}/>
      </div>}
    </Spin>
  );
});

export default PlaceDetail;
