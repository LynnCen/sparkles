/**
 * @Description 二级分类
 */

import { deepCopy, isArray } from '@lhb/func';
import { FC, useMemo } from 'react';
import cs from 'classnames';
import styles from './index.module.less';

const CategoryChild: FC<any> = ({
  category,
  active,
  tabsParams,
  tabsParamsRef,
  setTabsParams,
  setSearchParams,
  setIsLoading,
}) => {
  const { childTabs } = category || {};
  // 当前二级tabs选中项
  const childActive = useMemo(() => {
    return tabsParams[+active]?.activeChild || 0;
  }, [tabsParams, active]);

  const onChange = (item: any, index: number) => {
    // 记录二级tabs的选中项
    const copyData = deepCopy(tabsParams);
    const target: any = copyData[+active];
    target && (target.activeChild = index);
    target && (target.valueChild = item?.name);
    tabsParamsRef.current[+active] = target;
    setIsLoading(true);
    setTabsParams(copyData);
    // 设置Table
    setSearchParams((state) => ({
      ...state,
      name0: target?.value,
      name1: target?.valueChild,
      // page: target?.page
    }));
  };

  return (
    <div className={styles.tabsChildCon}>
      {
        isArray(childTabs) ? childTabs.map((item: any, index: number) => <div
          key={index}
          className={cs(styles.item, childActive === index ? styles.active : '')}
          onClick={() => onChange(item, index)}
        >
          {item.name}
        </div>) : <></>
      }
    </div>
  );
};

export default CategoryChild;
