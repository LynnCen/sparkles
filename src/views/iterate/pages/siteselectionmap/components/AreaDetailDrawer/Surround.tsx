/**
 * @Description 商圈详情-周边配套
 */

import { FC, memo, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
// import cs from 'classnames';
import { isArray } from '@lhb/func';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Category from './Category';
import { useMethods } from '@lhb/hook';
import { modelCategoryList } from '@/common/api/surround';
import V2Title from '@/common/components/Feedback/V2Title';
import cs from 'classnames';
import { bigdataBtn } from '@/common/utils/bigdata';
import { v4 } from 'uuid';
import { Table } from 'antd';
import V2PieChart from '@/common/components/Charts/V2PieChart';
/**
 * @description category的poi个数统计
 */
interface CategoryCount {
  categoryId: number;
  pointNum: number;
}

const Surround: FC<any> = ({
  detail,
}) => {

  const [tabs, setTabs] = useState<any[]>([]);
  const [tabActive, setTabActive] = useState<string>('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);

  const columnsAndData = useMemo(() => {
    const column:any = [{ key: 'distance', dataIndex: 'distance', title: 'POI数量', width: 110 }];
    const data:any = [];
    detail?.surroundingInfoVO?.distributionVOs?.map((item, index) => {
      data[index] = {
        distance: item?.name
      };
      item?.children.map((item) => {
        const value = column.find((cur) => cur?.title === item?.name);
        const uuid = v4();
        if (!value) {
          column.push({ key: uuid, dataIndex: uuid, title: item?.name, width: 54 });
        }
        data[index] = {
          ...data[index] || null,
          [value?.key || uuid]: item?.num
        };
      });
    });
    return {
      column,
      data,
      rateVOs: detail?.surroundingInfoVO?.rateVOs?.map((item) => ({
        ...item,
        value: item.rate
      }))
    };
  }, [detail]);

  useEffect(() => {
    if (!detail?.id) return;

    getTabList();
  }, [detail?.id]);

  /**
   * @description 更新各category tab的统计数
   */
  useEffect(() => {
    if (!isArray(categoryCounts)) return;

    const tmpTabs: any[] = [];
    tabs.map(tb => {
      const cntInfo = categoryCounts.find(cateCnt => +tb.key === cateCnt.categoryId);
      tmpTabs.push({
        ...tb,
        label: `${tb.name} ${cntInfo ? cntInfo.pointNum : ''}`
      });
    });
    setTabs(tmpTabs);
  }, [categoryCounts]);

  const {
    getTabList,
  } = useMethods({
    async getTabList() {
      const res = await modelCategoryList();
      const list: any[] = isArray(res) ? res.map((item: any) => ({
        label: item.name, // 显示用
        key: item.id,
        name: item.name, // 保存name，不参与显示
      })) : [];
      // tabs列表数据
      setCategoryIds(list.map(itm => itm.key));
      setTabs(list);
      // 默认选中第一个
      setTabActive(list.length ? (list[0].key || '') : '');
    },
    async onLoad() {

    }
  });

  return (
    <div className={styles.surround}>

      <V2Title divider type='H2' text='周边配套'/>

      {/* 由于周边数据不同步，暂时隐藏 */}

      {/* <div className={styles.desc}> {detail?.surroundingInfoVO?.introduction || '-'} </div> */}

      <div className={cs(styles.surroundContainer, 'mt-12')}>
        <V2Tabs
          items={tabs}
          activeKey={tabActive}
          onChange={(active) => {
            bigdataBtn('27e59046-d9fe-1ce5-ed13-1a87d9ffabd8', '选址地图', '商圈详情-周边配套', '点击商圈详情-周边配套');
            setTabActive(active);
          }}
          className={styles.surroundTabs}
        />
        <div className='mt-12'>
          <Category
            categoryIds={categoryIds}
            categoryId={+tabActive}
            lat={detail?.lat}
            lng={detail?.lng}
            cityName={detail?.cityName}
            centerName={detail?.areaName}
            centerAddress={detail?.centerAddress}
            setCategoryCounts={setCategoryCounts}
            radius={500}
          />
        </div>
      </div>
      {detail?.surroundingInfoVO ? <>
        <div className={styles.desc}> {detail?.surroundingInfoVO?.introduction || '-'} </div>
        <div className={styles.surroundingFacility}>
          <div className={styles.table} >
            <div className='mb-8 c-222'>POI数量</div>
            {columnsAndData?.data?.length ? <Table
              rowKey='name'
              rowClassName={(record, i) => (i % 2 === 1 ? 'zebraLine' : '')}
              scroll={{ x: 440 }}
              dataSource={columnsAndData?.data}
              columns={columnsAndData?.column}
              pagination={false}
            /> : <></>}
          </div>
          <div className={styles.pieChart}>
            <div className='mb-8 c-222'>配套</div>
            <V2PieChart
              type='circle'
              seriesData={[{
                data: columnsAndData?.rateVOs || [],
                unit: '%',
              }]}
            />
          </div>
        </div>
      </>
        : <></>}
    </div>

  );
};

export default memo(Surround);
