/**
 * @Description 商圈类型选择树（共二级）
 */
import { FC, useEffect, useMemo, useState } from 'react';
import { getSelection as getBusinessCircleTypeSelection } from '@/common/api/networkplan';
import { isArray } from '@lhb/func';
import { Tree, Typography } from 'antd';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

const { Text } = Typography;

const ClusterTypeTree: FC<any> = ({
  className,
  onSelect, // 设置选择结果
  isNetworkPlan = false, // 是否网规，用于getBusinessCircleTypeSelection接口区分
}) => {
  const [treeData, setTreeData] = useState<any[]>([]); // 树数据
  const [allOptions, setAllOptions] = useState<[]>([]); // 所有选项平铺后数组
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]); // 选中项
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // 展开项

  useEffect(() => {
    getSelection();
  }, []);

  useEffect(() => { // 根据选中项，设置接口对应参数
    if (!(isArray(treeData) && treeData.length)) return;
    const firstLevelCategory: any[] = [];
    const secondLevelCategory: any[] = [];
    treeData[0]?.child.forEach((item: any) => {
      const { child, key, id } = item;
      if (checkedKeys.includes(key)) { // 选中
        firstLevelCategory.push(id);
      }
      if (!isArray(child)) return;
      child.forEach((childItem: any) => {
        const { id: childId, key: childKey } = childItem;
        if (checkedKeys.includes(childKey)) { // 选中
          secondLevelCategory.push(childId);
        }
      });
    });
    onSelect && onSelect(checkedSecondLevelIds, checkedSecondLevelNames);
  }, [checkedKeys, treeData]);

  const getSelection = async () => {
    // module 1 网规相关，2行业商圈 （通用版）
    const { firstLevelCategory } = await getBusinessCircleTypeSelection({ module: isNetworkPlan ? 1 : 2 });
    const listData = isArray(firstLevelCategory) ? firstLevelCategory : [];
    const keys: any[] = [];
    const tiledOptions: any = [];
    listData.forEach((item: any, index: number) => {
      const { child, id } = item;
      item.key = `${index}-${id}`;
      keys.push(item.key);
      tiledOptions.push(item);

      if (!isArray(child)) return;
      child.forEach((childItem: any, childIndex: number) => {
        const { id: childId } = childItem;
        childItem.key = `${index}-${childIndex}-${childId}`;
        keys.push(childItem.key);
        tiledOptions.push(childItem);
      });
    });
    // 默认选中
    setTreeData([{
      key: '0',
      name: '商圈类型展示',
      id: 0,
      child: listData
    }]);
    setAllOptions(tiledOptions);
    setCheckedKeys(['0', ...keys]);
    setExpandedKeys(['0']);
  };

  const checkHandle = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys);
  };

  // useEffect(() => {
  //   console.log('useEffect treeData', treeData);
  // }, [treeData]);

  // useEffect(() => {
  //   console.log('useEffect allOptions', allOptions);
  // }, [allOptions]);

  // useEffect(() => {
  //   console.log('useEffect checkedKeys', checkedKeys);
  // }, [checkedKeys]);

  // useEffect(() => {
  //   console.log('useEffect expandedKeys', expandedKeys);
  // }, [expandedKeys]);

  // /**
  //  * @description 当前选中的一级商圈类型
  //  * @return number数组
  //  */
  // const checkedFirstLevelIds = useMemo(() => {
  //   if (!isArray(checkedKeys)) return [];

  //   const ids: number[] = [];
  //   checkedKeys.forEach((key: any) => {
  //     const infos: any[] = key.split('-');
  //     if (infos.length === 2) {
  //       ids.push(+infos[1]);
  //     }
  //   });
  //   return ids;
  // }, [checkedKeys]);

  /**
   * @description 当前选中的二级商圈类型
   * @return number数组
   */
  const checkedSecondLevelIds = useMemo(() => {
    if (!isArray(checkedKeys)) return [];

    const ids: number[] = [];
    checkedKeys.forEach((key: any) => {
      const infos: any[] = key.split('-');
      if (infos.length === 3) {
        ids.push(+infos[2]);
      }
    });
    return ids;
  }, [checkedKeys]);

  /**
 * @description 当前选中的二级商圈类型
 * @return string数组
 */
  const checkedSecondLevelNames = useMemo(() => {
    if (!isArray(checkedKeys)) return [];
    const names: number[] = allOptions.filter((opt: any) => opt.key.split('-').length === 3 && checkedKeys.includes(opt.key)).map((opt: any) => opt.name);
    return names;
  }, [checkedKeys]);

  return (
    <div className={cs(styles.clusterType, className && className)}>
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
    </div>
  );
};

export default ClusterTypeTree;
