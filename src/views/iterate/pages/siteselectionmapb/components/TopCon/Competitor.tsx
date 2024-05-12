/**
 * @Description 竞品
 */

import { FC, useEffect, useMemo, useState } from 'react';
import { Checkbox, Spin, Typography } from 'antd';
// Tooltip Typography
import { isArray } from '@lhb/func';
import { getBrand } from '@/common/api/recommend';
// import cs from 'classnames';
import styles from './index.module.less';
// import IconFont from '@/common/components/IconFont';
import CompetitorInMap from './CompetitorInMap';

const { Text } = Typography;
const Competitor: FC<any> = ({
  mapIns, // 地图实例
  mapHelpfulInfo,
  isStadiometry,
  isStadiometryRef,
  setCompetitorOpen
}) => {
  const { city } = mapHelpfulInfo;
  const [listData, setListData] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // 选中项
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false); // 全选
  const [isLoading, setIsLoading] = useState<boolean>(false);// 勾选后的接口是否正在加载

  useEffect(() => {
    loadData();
  }, []);

  // 默认设置全部选中
  // useEffect(() => {
  // if (isArray(listData) && listData.length) {
  //   onCheckAllChange({
  //     target: {
  //       checked: true
  //     }
  //   });
  //   return;
  // }
  // setSelectedIds([]);
  // setIndeterminate(false);
  // setCheckAll(false);
  // }, [listData]);
  // // 地图上显示选中的本品牌门店
  // useEffect(() => {
  //   if (!mapIns) return;
  //   if (selectedIds?.length) {
  //     return;
  //   }
  //   // 没有选中时，清空地图的覆盖物
  // }, [mapIns, selectedIds]);

  const dataIds = useMemo(() => {
    return listData.map((item) => item.id);
  }, [listData]);

  const loadData = async () => {
    const params = {
      origin: 2,
      type: 3
    };
    const res = await getBrand(params);
    const data = isArray(res) ? res : [];
    setListData(data);
  };
  // 全选
  const onCheckAllChange = (e: any) => {
    const { checked } = e?.target || {};
    setSelectedIds(checked ? dataIds : []);
    setIndeterminate(false);
    setCheckAll(checked);
  };
  // 监听复选框的变化
  const onChange = (ids: number[]) => {
    setSelectedIds(ids);
    setIndeterminate(!!ids?.length && (ids?.length < dataIds?.length));
    setCheckAll(ids?.length === dataIds?.length);
  };

  return (
    <div
      className={styles.competitorCon}
      onMouseLeave={() => setCompetitorOpen(false)}
    >
      <div className={styles.title}>
        竞品门店
      </div>
      <Spin spinning={isLoading}>
        {
          isArray(listData) && listData.length > 0
            ? <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
              className='mt-8'
            >
          全部
            </Checkbox>
            : <></>
        }
        <Checkbox.Group
          value={selectedIds}
          onChange={(ids: any[]) => onChange(ids)}
        >
          {
            isArray(listData) && listData.length > 0
              ? <>
                {
                  listData.map((item: any) => <div key={item.id} className='mt-8'>
                    <Checkbox value={item.id}>
                      <span className={styles.flexStartCon}>
                        {
                          item.logo ? <span className={styles.imgCon}>
                            <img
                              src={item.logo}
                              alt='logo'
                              width='100%'
                              height='100%'
                            />
                          </span> : <></>
                        }
                        <Text
                          style={ { width: 150 }}
                          ellipsis={ { tooltip: item.name }}
                          className='pl-4 mt-2'
                        >
                          {item.name}
                        </Text>
                      </span>
                    </Checkbox>
                  </div>
                  )
                }
              </>
              : <></>
          }
        </Checkbox.Group>
      </Spin>
      <CompetitorInMap
        mapIns={mapIns}
        checkedIds={selectedIds}
        isStadiometryRef={isStadiometryRef}
        isStadiometry={isStadiometry}
        cityInfo={city}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default Competitor;
