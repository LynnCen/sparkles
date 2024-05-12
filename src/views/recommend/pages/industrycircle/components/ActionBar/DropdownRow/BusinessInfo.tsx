/**
 * @Description 商圈信息
 */
import { FC, useEffect, useState } from 'react';

import { isArray } from '@lhb/func';
import { Tree, Divider, Switch, Typography } from 'antd';
import {
  DISTRICT_LEVEL,
} from '@/common/components/AMap/ts-config';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

const { Text } = Typography;

const BusinessCircleInfo: FC<any> = ({
  level, // 地图缩放等级
  selection, // 筛选项集合
  showRailPath,
  // serachParams, // 接口入参
  setSearchParams, // 设置接口入参
  setShowRailPath,
}) => {
  const [treeData, setTreeData] = useState<any[]>([]); // 树数据
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]); // 选中项
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // 展开项

  useEffect(() => {
    const { firstLevelCategory } = selection || {};
    if (!isArray(firstLevelCategory)) return;
    init();
  }, [selection]);

  useEffect(() => { // 根据选中项，设置接口对应参数
    if (!(isArray(treeData) && treeData.length)) return;
    // const firstLevelCategory: any[] = []; // 新接口不需要传一级了
    const secondLevelCategory: any[] = [];
    treeData[0]?.child.forEach((item: any) => {
      const { child } = item;
      // if (checkedKeys.includes(key)) { // 选中
      //   firstLevelCategory.push(id);
      // }
      if (!isArray(child)) return;
      child.forEach((childItem: any) => {
        const { id: childId, key: childKey } = childItem;
        if (checkedKeys.includes(childKey)) { // 选中
          secondLevelCategory.push(childId);
        }
      });
    });
    setSearchParams((state) => ({
      ...state,
      secondLevelCategories: secondLevelCategory
    }));
  }, [checkedKeys, treeData]);

  const init = () => {
    const { firstLevelCategory: listData } = selection;
    const keys: any[] = [];
    listData.forEach((item: any, index: number) => {
      const { child, id } = item;
      item.key = `${index}-${id}`;
      keys.push(item.key);
      if (!isArray(child)) return;
      child.forEach((childItem: any, childIndex: number) => {
        const { id: childId } = childItem;
        childItem.key = `${index}-${childIndex}-${childId}`;
        keys.push(childItem.key);
      });
    });
    // 默认选中
    setTreeData([{
      key: '0',
      name: '商圈类型展示',
      id: 0,
      child: listData
    }]);
    setCheckedKeys(['0', ...keys]);
    setExpandedKeys(['0']);
  };

  const checkHandle = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys);
  };

  return (
    <div className={cs(styles.treeCon, styles.clusterType)}>
      <Tree
        checkable // 复选模式
        treeData={treeData}
        expandedKeys={expandedKeys}
        checkedKeys={checkedKeys}
        fieldNames={{
          title: 'name',
          key: 'key',
          children: 'child'
        }}
        titleRender={(item: any) => (<div className={styles.treeTitCon}>
          {
            item?.icon
              ? <IconFont
                iconHref={item.icon}
                className='fn-16'
                style={{ color: item.color }}
              /> : null
          }
          &nbsp;
          <Text
            style={item.key?.split('-')?.length > 2 ? { width: 60 } : item.key?.split('-')?.length === 1 ? { fontWeight: 'bold' } : undefined}
            ellipsis={item.key !== '0' ? { tooltip: item.name } : false}>
            {item.name}
          </Text>
        </div>)}
        onExpand={(expandedKeys: any) => setExpandedKeys(expandedKeys)}
        onCheck={checkHandle}
      />
      {
        level === DISTRICT_LEVEL ? <>
          <Divider style={{ margin: '8px 0 12px 0' }}/>
          <div className={styles.flexCon}>
            <div className='fn-14 bold c-132'>只展示商圈围栏</div>
            <Switch
              checked={showRailPath}
              onChange={(checked) => setShowRailPath(checked)}
              size='small' />
          </div>
        </> : <></>
      }

    </div>
  );
};

export default BusinessCircleInfo;
