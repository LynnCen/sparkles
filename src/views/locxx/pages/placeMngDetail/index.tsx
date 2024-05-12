import { Spin } from 'antd';
import { FC, useState, forwardRef, useImperativeHandle } from 'react';
import styles from './entry.module.less';
import TopDetail from './components/TopDetail';
import MainDetail from './components/MainDetail';


interface DetailProps {
  detailId: number, // 详情id
  onRefresh?: Function, // 列表刷新
}


const PlaceDetail: FC<DetailProps & {ref?:any}> = forwardRef(({
  detailId,
  onRefresh,
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
    // const result = await detail(detailId as any);
    // if (result) {
    //   setInfo(result);
    // }
    setTimeout(() => {
      setInfo({ id: 1, name: '我是蔡徐坤' });
      setLoading(false);
    }, 2000);
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
