/**
 * @Description 列表项
 */

import { FC, useState } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import Title from './Title';
import TagRow from './TagRow';
import ScoreCom from './ScoreCom';
import { businessStatus } from '../../../ts-config';
import V2Empty from '@/common/components/Data/V2Empty';

const ListItem: FC<any> = ({
  mapIns,
  listRef,
  style,
  item,
  index,
  firstLevelCategory, // 商圈类型数据
  listData, // 列表数据
  setDrawerData, // 设置详情抽屉
  setItemData,
  setPointDrawerData,
}) => {

  const [hasLabel, setHasLabel] = useState<any>(true);
  return <div className={styles.wrapperCon} style={style}>
    <div className={styles.itemCon}>
      {
        item && Object.entries(item)?.length ? <>
          {/* 标题行 */}
          <Title
            mapIns={mapIns}
            listRef={listRef}
            index={index}
            item={item}
            listData={listData}
            setItemData={setItemData}
          />
          {
            item?.isFrontEndExpanded
              ? item?.status === businessStatus.NEW ? <>
                <V2Empty
                  customTip={'暂无内容生效中'}
                  // centerInBlock
                />
              </> : <>
                {/* 标签行 */}
                <TagRow
                  id={item.id}
                  setHasLabel={setHasLabel}
                />
                {/* 评分 */}
                <ScoreCom
                  id={item.id}
                  rank={+item.rank ? (+item.rank + 1) : null}
                  firstLevelCategory={firstLevelCategory}
                  hasLabel={hasLabel}
                  setDrawerData={setDrawerData}
                  setPointDrawerData={setPointDrawerData}
                />
              </> : <></>
          }
        </> : <div></div>
      }
    </div>
  </div>;
};

export default ListItem;
