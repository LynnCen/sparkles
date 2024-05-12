/**
 * @Description 列表
 */
import MapDrawer from '@/common/components/business/MapDrawer';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import { FixedSizeList } from 'react-window';
import EnterDrawer from './EnterDrawer';
import EnterListModal from './EnterListModal';
import cs from 'classnames';
import { StatusColor, status } from '../ts-config';
import { BUSINESS_FIT_ZOOM } from '@/common/components/AMap/ts-config';
const topDistance = 48 + 16 + 12 + 37 + 12 + 42;// 列表顶部距离页面顶部距离
const bottomDistance = 16 + 16;// 列表底部距离页面底部距离
const List: FC<any> = ({
  pointData,
  setEnterDrawerOpen,
  enterDrawerOpen,
  city,
  setDetailDrawer,
  onRefresh,
  setItemData,
  mapIns,
  itemData
}) => {
  const [visible, setVisible] = useState<boolean>(true);
  const [height, setHeight] = useState<number>(0);
  const [enterListOpen, setEnterListOpen] = useState(false);

  const handleResize = () => {
    // 按顺序从上到下
    setHeight(window.innerHeight - topDistance - bottomDistance);
  };

  const handleJump = (value) => {
    if (!value?.relationSpots) return;
    setDetailDrawer((state) => ({
      ...state,
      id: value?.planClusterId
    }));
  };
  useEffect(() => {
    // 初始化 - 按顺序从上到下
    setHeight(window.innerHeight - topDistance - bottomDistance);
    // 窗口大小改变
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const row = ({ index, style }) => (
    <div
      onClick={() => {
        mapIns?.setZoomAndCenter(BUSINESS_FIT_ZOOM, [pointData?.[index]?.lng, pointData?.[index]?.lat]);
        if (itemData.id === pointData?.[index]?.planClusterId) return;
        setItemData({
          visible: true, // 是否显示详情
          id: pointData?.[index]?.planClusterId,
          detail: pointData?.[index], // 存放详情相关字段
        });
      }}
      style={style}
      className={styles.itemCon}>
      <div className={styles.card}>
        <div className={styles.top}>
          <span className={styles.name}>{pointData?.[index]?.name}</span>
          <span className={styles.score}>{pointData?.[index]?.totalScore}分</span>
        </div>
        <div className='c-666 fs-12'>
          {pointData?.[index]?.city}-{pointData?.[index]?.district}
        </div>
        <div className={styles.bottom}>
          <span className='c-666'>
            已提交：
          </span>
          <span
            onClick={() => handleJump(pointData?.[index])}
            className={cs('pointer', pointData?.[index]?.relationSpots ? 'c-006' : '')}>
            {pointData?.[index]?.relationSpots || '0'}
          </span>
          <span className='c-666 ml-16'>
            状态：
          </span>
          <span
            style={{
              color: StatusColor?.[pointData?.[index]?.spotStatus]?.color
            }}
          >
            {pointData?.[index]?.spotStatusName}
          </span>
          {
            pointData?.[index]?.spotStatus === status.APPROVAL || pointData?.[index]?.spotStatus === status.DENY ? <></> : <span className={styles.btn} onClick={() => setEnterDrawerOpen({
              visible: true,
              value: pointData?.[index]
            })}>
              去录入
            </span>
          }

        </div>
      </div>
    </div>
  );
  return <div className={styles.listCon}>
    <MapDrawer
      placement='right'
      mapDrawerStyle={{
        width: '300px',
        bottom: '10px',
        transform: visible ? 'translateX(0%)' : 'translateX(312px)',
      }}
      closeConStyle={{
        top: '175px',
      }}
      visible={visible}
      setVisible={setVisible}
    >

      <div className={styles.right}>
        {/* 头部标题 */}
        <div className={styles.title}>
          <span className='fs-16 bold'>商圈列表</span>
          <span className={styles.inventory} onClick={() => setEnterListOpen(true)}>已录清单</span>
        </div>
        {/* 虚拟列表 */}
        <FixedSizeList
          height={height} // 列表可视区域的高度
          itemCount={pointData?.length || 0} // 列表数据长度
          itemSize={105} // 列表行高
          width={300} // 列表可视区域的宽度
          className={styles.fixedSizeList}
        >
          {row}
        </FixedSizeList>
      </div>
    </MapDrawer>
    <EnterDrawer open={enterDrawerOpen} setOpen={setEnterDrawerOpen} onRefresh={onRefresh}/>
    <EnterListModal
      open={enterListOpen}
      setOpen={setEnterListOpen}
      cityId={city?.id}
      setDetailDrawer={setDetailDrawer}
    />
  </div>;
};
export default List;
