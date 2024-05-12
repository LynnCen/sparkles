/**
 * @Description 排序
 */

import { FC, useContext, useEffect, useRef, useState } from 'react';
import { Dropdown, Tooltip } from 'antd';
import { useMethods } from '@lhb/hook';
import {
  collecting,
  creating,
  isResetContext,
  rankOptions,
  sortRuleAliasOptions
} from '@/views/iterate/pages/siteselectionmapb/ts-config';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import Entrance from '@/views/iterate/pages/siteselectionmapb/components/Collection/Entrance';
import { bigdataBtn } from '@/common/utils/bigdata';

const Sort: FC<any> = ({
  poiData, // 搜索后选中的数据
  setDistanceSort,
  searchParams,
  setRankSort,
  setIsSync,
  hasOtherData, // 是否存在生成中、收藏中的数据
  rankSort,
}) => {
  const { collectList }: any = useContext(isResetContext);

  const { sortRule } = searchParams;
  const itemsRef: any = useRef([]);
  const scrollRef: any = useRef();
  // const rankItemsRef: any = useRef([]);
  const [items, setItems] = useState<any>([]); // 下拉菜单
  // const [rankItems, setRankItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>({
    keys: [],
    target: null
  });
  // 默认前100
  const [selectedRank, setSelectedRank] = useState<any>(rankOptions[5].key); // 默认前100
  const [distanceDisabled, setDistanceDisabled] = useState<boolean>(true); // 距离排序默认禁用

  const distanceSort = {
    label: <Tooltip title={distanceDisabled ? '搜索地址后可用' : ''}>
      <div className='fs-12' onClick={() => {
        if (distanceDisabled) return; // 禁用不可点击
        sortHandle('lat_lng');

      }}>
        距离排序
      </div>
    </Tooltip>,
    // Tooltip
    key: 'lat_lng',
    name: '距离排序',
    disabled: distanceDisabled,
  };
  // 搜索完地址，距离排序才可用
  useEffect(() => {
    if (poiData) {
      setDistanceDisabled(false);
      return;
    }
    setDistanceDisabled(true); // 默认禁用
  }, [poiData]);

  useEffect(() => {
    if (!sortRule) return;
    const target: any = sortRuleAliasOptions.find((item) => item.id === +sortRule);
    if (!target) return;
    const defaultSort = {
      label: <div className='fs-12' onClick={() => sortHandle(`${target.id}`)}>{target.name}</div>,
      key: `${target.id}`,
      name: target.name,
    };
    // 设置默认值
    setSelected({
      keys: [`${target.id}`],
      target: defaultSort
    });
    const targetItems = [
      defaultSort,
      distanceSort
    ];
    setItems(targetItems);
    itemsRef.current = targetItems;
  }, [sortRule, distanceDisabled]);

  useEffect(() => {
    setRankSort(rankOptions[5]); // 默认前100
    // const target: any[] = [];
    // rankOptions.forEach((item: any, index: number) => {
    //   const targetItem = {
    //     label: <div className='fs-12' onClick={() => rankHandle(item.key)}>{item.name}</div>,
    //     key: item.key,
    //     name: item.name
    //   };
    //   target.push(targetItem);
    //   if (index === 0) {
    //     setSelectedRank(item.key);
    //   }
    // });
    // setRankItems(target);
    // setRankSort(rankOptions[0]);
    // rankItemsRef.current = target;
  }, []);

  // const sortHandle = (key: string) => {
  //   setDistanceSort(key === distanceSort.key);
  //   setSelected({
  //     keys: [key],
  //     target: itemsRef.current.find((item) => item.key === key)
  //   });
  // };

  // const handleRank = (item: any, index: number) => {
  //   // setSelectedRank({
  //   //   keys: [key],
  //   //   target: rankItemsRef.current.find((item) => item.key === key)
  //   // });
  //   // setRankSort(rankOptions.find((item) => item.key === key));
  //   setSelectedRank(item.key);
  //   setRankSort(item);
  // };

  const {
    sortHandle,
    handleRank,
  } = useMethods({
    sortHandle: (key: string) => {
      setDistanceSort(key === distanceSort.key);
      setSelected({
        keys: [key],
        target: itemsRef.current.find((item) => item.key === key)
      });
    },
    handleRank: (item: any, index: number) => {
      bigdataBtn('a18c9df7-3ea7-e4b7-00b5-7fab2c9415b3', '选址地图', '商圈排名选择', '点击商圈排名选择');
      setSelectedRank(item.key);
      setRankSort(item);
      scrollRef.current?.scrollTo({
        left: index < 2 ? 0 : 80,
        behavior: 'smooth',
      });
    }
  });
  useEffect(() => {
    if (rankSort.key !== selectedRank) {
      setSelectedRank(rankSort.key);
      setRankSort(rankSort);
    }
  }, [rankSort]);
  useEffect(() => {
    if (!hasOtherData?.hasCreating && selectedRank === creating) {
      setSelectedRank(rankOptions[5].key);
      setRankSort(rankOptions[5]);
    }
    if (!collectList?.length && selectedRank === collecting) {
      setSelectedRank(rankOptions[5].key);
      setRankSort(rankOptions[5]);
    }
  }, [hasOtherData?.hasCreating, collectList?.length]);
  return (
    <div className={styles.topCon}>
      <div className={styles.sortWrapper}>
        <Dropdown
          menu={{
            items,
            selectable: true, // 可选中
            selectedKeys: selected.keys
          }}
        >
          <div
            className={cs(styles.textCon, 'pointer fs-12')}
          >
            <span className='pr-8'>{selected.target?.name}</span>
            <IconFont
              iconHref='pc-common-icon-a-iconarrow_down'
              className={cs(styles.arrowIcon, 'c-959')}
            />
          </div>
        </Dropdown>

        {/* <Dropdown
          menu={{
            items: rankItems,
            selectable: true, // 可选中
            selectedKeys: selectedRank.keys
          }}
        >
          <div
            className={cs(styles.textCon, 'pointer fs-12')}
          >
            <span className='pr-8'>{selectedRank.target?.name}</span>
            <IconFont
              iconHref='pc-common-icon-a-iconarrow_down'
              className={cs(styles.arrowIcon, 'c-959')}
            />
          </div>
        </Dropdown> */}
        {/* 我的收藏 */}
        <Entrance setIsSync={setIsSync}/>
      </div>
      <div ref={scrollRef} className={styles.rankCon}>
        {
          rankOptions.map((item, index: number) => {
            let flag = false;
            let name = item.name;
            if (item.key === creating) {
              flag = !!hasOtherData?.hasCreating;
              name = `${name}(${hasOtherData?.hasCreating})`;
            } else if (item.key === collecting) {
              flag = !!collectList?.length;
              name = `${name}(${collectList?.length})`;
            } else {
              flag = true;
            }
            if (flag) {
              return <div
                key={item.key}
                className={cs(styles.rankItem, selectedRank === item.key ? styles.active : '')}
                onClick={() => handleRank(item, index)}
              >
                {name}
              </div>;
            } else {
              return null;
            }
          })
        }
      </div>
    </div>
  );
};
export default Sort;
