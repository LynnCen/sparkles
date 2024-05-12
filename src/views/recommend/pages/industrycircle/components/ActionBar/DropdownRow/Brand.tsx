/**
 * @Description 本品牌分布
 */

import { FC, useEffect, useMemo, useState } from 'react';
import { Tree, Tooltip } from 'antd';
import { isArray } from '@lhb/func';
import { formatUnitTenThousand } from '@/common/utils/ways';
import { storePointCountStandard } from '@/common/api/storemap';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
// import BrandInMap from './BrandInMap';
import OwnBrandDistributionInMap from '@/common/components/business/OwnBrandDistributionInMap';

const Brand: FC<any> = ({
  mapHelpfulInfo,
  isShow,
  mapIns,
}) => {
  const { city } = mapHelpfulInfo;
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]); // 选中项
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]); // 展开项

  useEffect(() => {
    if (!isShow) return;
    loadStatusList();
  }, [isShow, city?.id]);

  const checkedIds = useMemo(() => {
    return checkedKeys.filter((item: any) => item > 0);
  }, [checkedKeys]);

  const loadStatusList = async () => {
    const params = {
      provinceId: city.provinceId,
      cityId: city.id
    };
    const res = await storePointCountStandard(params);
    const listData = isArray(res) ? res : [];
    setTreeData([{
      name: '本品牌门店分布',
      id: 0,
      children: listData
    }]);
    setCheckedKeys(listData.map((item) => item.id));
    setExpandedKeys([0]);
  };

  return (
    <>
      <div className={cs(styles.treeCon, styles.large)}>
        <Tree
          checkable // 复选模式
          treeData={treeData}
          expandedKeys={expandedKeys}
          checkedKeys={checkedKeys}
          fieldNames={{
            title: 'name',
            key: 'id',
          }}
          titleRender={(item: any) => (
            <div className={styles.treeTitCon}>
              {
                item.id
                  ? <>
                    <IconFont
                      iconHref='iconic_mendian'
                      style={{
                        color: item.color,
                        marginTop: '5px'
                      }}
                    />
                    <span className={styles.inlineFlex}>
                      <span className='pl-4 fs-14'>{ item.name }</span>
                      <Tooltip
                        placement='top'
                        overlayInnerStyle={{
                          fontSize: '12px'
                        }}
                        title={item.comment || ''}>
                        <span>
                          <IconFont
                            iconHref='iconquestion-o'
                            className='fs-14 c-999' />
                        </span>
                      </Tooltip>
                    </span>
                    <span className='pl-4 c-bbc'>|</span>
                    <span className='pl-4'>
                      {formatUnitTenThousand(item.count)}
                    </span>
                  </> : <span className='pl-4 fs-14'>{ item.name }</span>
              }

            </div>
          )}
          onExpand={(expandedKeys: any) => setExpandedKeys(expandedKeys)}
          onCheck={(checkedKeys: any) => setCheckedKeys(checkedKeys)}
        />
      </div>
      {
        isShow
          ? <OwnBrandDistributionInMap
            checkedIds={checkedIds}
            cityInfo={city}
            mapIns={mapIns}
          /> : <></>
      }
    </>
  );
};

export default Brand;
