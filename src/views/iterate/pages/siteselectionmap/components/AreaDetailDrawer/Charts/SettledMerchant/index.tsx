/**
 * @Description 入驻商户
 */

import { FC, useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import { useMethods } from '@lhb/hook';
import { surroundPOICategoryList } from '@/common/api/siteselectionmap';
// import cs from 'classnames';
// import styles from './entry.module.less';
// import LazyLoad from '@/common/components/LazyLoad';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Tabs from '@/common/components/Data/V2Tabs';
import CategoryChild from './CategoryChild';
import List from './List';

const SettledMerchant: FC<any> = ({
  detail
}) => {
  const tabsParamsRef: any = useRef();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabs, setTabs] = useState<any[]>([]); // 一级tabs
  const [tabsParams, setTabsParams] = useState<any>([]); // 二级tabs以及对应tables的分页
  const [tabActive, setTabActive] = useState<string>('0'); // 一级tabs选中项
  const [searchParams, setSearchParams] = useState<any>(); // Table获取数据的接口入参

  useEffect(() => {
    loadData(); // 加载数据
  }, []);

  const {
    loadData,
    tabsOnChange
  } = useMethods({
    loadData: async () => { // 初始化
      const params = {
        // range: 500,
        // latitude: detail?.lat,
        // longitude: detail?.lng
        clusterId: detail.id
      };
      const { industries } = await surroundPOICategoryList(params);
      const tabItems: any[] = [];
      const targetParams: any[] = [];
      industries?.forEach((item: any, index: number) => {
        const { name, poiNum, children } = item;
        tabItems.push({
          key: `${index}`,
          name,
          label: <div className='pl-8 pr-8'>
            {name}
            <span className='pl-4'>{poiNum}</span>
          </div>,
          childTabs: children
        });
        // 记录默认的一、二级tabs及对应tables
        targetParams.push({
          active: '0', // 一级tab选中
          value: name,
          activeChild: 0, // 二级tab选中项
          valueChild: children?.[0]?.name,
          // page: 1
        });
      });
      setTabs(tabItems); // 一级tabs
      setTabsParams(targetParams); // 二级tabs及分页缓存数据
      tabsParamsRef.current = targetParams;
      setSearchParams({
        // customActive: '0', // 一级tab的默认值
        // range: 500,
        // latitude: detail?.lat,
        // longitude: detail?.lng,
        name0: tabItems?.[0]?.name || null,
        name1: targetParams?.[0]?.valueChild || null,
        // page: 1,
        size: 10,
        clusterId: detail.id
      }); // 子组件Table列表入参
    },
    tabsOnChange: (active: string) => { // 一级tabs切换
      // 恢复上一次的接口入参
      const activeParams = tabsParamsRef.current[+active];
      setSearchParams((state) => ({
        ...state,
        name0: activeParams?.value,
        name1: activeParams?.valueChild,
        // page: activeParams?.page
      }));
      setIsLoading(true);
      setTabActive(active);
    }
  });

  return (
    // 不能使用懒加载，会影响滚动计算选中tab项
    // <LazyLoad>
    <Spin
      spinning={isLoading}
      indicator={<></>} // 使用V2Table自带的loading
    >
      <div className='mt-24'>
        <V2Title
          divider
          type='H2'
          text='入驻商户'
        />
        {/* 一级tabs */}
        <V2Tabs
          items={tabs}
          activeKey={tabActive}
          type='fullCard'
          animated={false}
          onChange={tabsOnChange}
          className='mt-12'
        />
        {/* 二级分类 */}
        <CategoryChild
          category={tabs[+tabActive]}
          active={tabActive}
          tabsParams={tabsParams}
          tabsParamsRef={tabsParamsRef}
          setTabsParams={setTabsParams}
          setSearchParams={setSearchParams}
          setIsLoading={setIsLoading}
        />
        {/* 对应分类下的tabs */}
        {
          searchParams ? <List
            params={searchParams}
            // tabsParamsRef={tabsParamsRef}
            // setTabsParams={setTabsParams}
            setIsLoading={setIsLoading}
          /> : <></>
        }
      </div>
    </Spin>
    // </LazyLoad>
  );
};

export default SettledMerchant;
