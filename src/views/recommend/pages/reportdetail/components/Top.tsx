import TopCon from '@/common/components/AMap/components/TopCon';
import { FC } from 'react';
import cs from 'classnames';
import styles from '../entry.module.less';
import IconFont from '@/common/components/IconFont';
import { useMapLevelAndCity } from '@/common/hook/useMapLevelAndCity';
const Top:FC<any> = ({
  _mapIns,
  rightDrawerVisible,
  topRef,
  onChangeShow,
}) => {
  const { city } = useMapLevelAndCity(_mapIns);

  return (
    <div className={styles.top}>
      <TopCon
        city={city}
        _mapIns={_mapIns}
        boxRef={topRef}
        boxStyle={{
          width: '310px'
        }}
        boxConStyle={{
          marginLeft: '6px'
        }}
      >
        <div
          className={
            cs(styles.fullScreen,
              'bg-fff pointer selectNone',
              !rightDrawerVisible ? 'c-006' : 'c-132')
          }
          onClick={onChangeShow}
        >
          <IconFont
            iconHref='iconic_map_quanping'
            style={{ width: '16px', height: '16px' }} />
          <span className='inline-block ml-5'>{rightDrawerVisible ? '全屏' : '退出全屏'}</span>
        </div>
      </TopCon>
    </div>
  );
};
export default Top;
