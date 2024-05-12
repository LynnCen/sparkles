import V2Tabs from '@/common/components/Data/V2Tabs';
import { useMethods } from '@lhb/hook';
import { Spin } from 'antd';
import { FC, useEffect, useState } from 'react';
import List from './components/List';
import styles from './index.module.less';
import { getSourroundPoiCount } from '@/common/api/surround';
import V2Empty from '@/common/components/Data/V2Empty';

interface CategoryProps {
  categoryId?: number;
  _mapIns?;
  mainHeight?;
  params?;
}

const CategoryCom: FC<CategoryProps> = ({
  categoryId,
  mainHeight,
  params,
  _mapIns,
}) => {
  const [loading, setLoading] = useState<boolean>(true); // loading
  const [tabActive, setTabActive] = useState<string>(''); // 当前活跃的tabkey
  const [tabs, setTabs] = useState<any>([]); // tabs

  const methods = useMethods({
    /** 获取poi点位 */
    getPOIList: async () => {
      try {
        setLoading(true);
        const _params = {
          categoryId,
          poiSearchType: params.radius ? 1 : 2,
          ...params,
        };

        const data = await getSourroundPoiCount(_params);
        const res = data?.filter((item) => item.pointNum !== 0);
        setLoading(false);

        const mappedTabs = Array.isArray(res)
          ? res.map(({ attributeName, pointNum, code, icon }) => ({
            label: `${attributeName} ${pointNum}`,
            key: code,
            children: (
              <>
                <List
                  params={_params}
                  code={code}
                  icon={icon}
                  _mapIns={_mapIns}
                  mainHeight={mainHeight}
                />
              </>
            ),
          }))
          : [];

        setTabs(mappedTabs);
        if (mappedTabs[0]) {
          setTabActive(mappedTabs[0].key);
        }
      } catch (error) {
        console.error('Error in getPOIList:', error);
      }
    },
  });

  useEffect(() => {
    methods.getPOIList();
  }, []);

  const onChange = (val) => {
    setTabActive(val);
  };

  return (
    <div className={styles.categoryCom}>
      <Spin spinning={loading}>
        {tabs.length ? (
          <V2Tabs
            items={tabs}
            activeKey={tabActive}
            destroyInactiveTabPane
            onChange={onChange}
          />
        ) : (
          <div style={{ height: '315px' }}>
            <V2Empty
              centerInBlock
              type={loading ? 'search' : 'nothing'}
              customTip={loading ? '加载中' : '暂无内容'}/>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default CategoryCom;
