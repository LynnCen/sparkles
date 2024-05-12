/**
 * @Description 筛选列表
 */
import { FC, Fragment } from 'react';
import styles from './index.module.less';
import { Badge } from 'antd';
import IconFont from '@/common/components/IconFont';
import { leftListSelectionDOM, leftSection, sectionKey } from '../../ts-config';
import cs from 'classnames';

const SelectionList:FC<any> = ({
  setActive,
  selectionListRef,
  checked,
  active,
  menuStructure,
}) => {
  // 这里传入的item是一级菜单，带有Menu
  const handleCount = (item) => {
    // 排名规则，默认返回选中1
    if (item.code === sectionKey.sortRuleMenu) {
      return 1;
    }

    return item.children.reduce((pre, item) => {
      return pre + (checked?.[item?.code]?.length || 0);
    }, 0);
  };

  return <div
    className={styles.selectionListCon}
  >
    <div className={styles.top}>
      <img src='https://staticres.linhuiba.com/project-custom/locationpc/map/icon_siteselectionmap_search.png' alt='' className={styles.textImg}/>
      <img src='https://staticres.linhuiba.com/project-custom/locationpc/map/icon_siteselectionmap_arrow.png' alt='' className={styles.arrowImg}/>
    </div>
    <div
      className={cs(leftListSelectionDOM, styles.list)}
      ref={selectionListRef}
    >
      {
        leftSection?.map((item, index: number) => {
          if (menuStructure.find((menu) => menu.encode === item.code)) {
            return <div
              className={cs(styles.card, item.code === active ? styles.activeCard : '')}
              onMouseEnter={() => setActive(item.code)}
              key={item.code}>
              <Badge
                count={handleCount(item)}
                size='small'
                overflowCount={10}
              >
                <span className={styles.label}>{item.label}</span>
              </Badge>
              <IconFont iconHref='iconic_next_black_seven' className={styles.icon}/>
            </div>;
          }
          return <Fragment key={index}></Fragment>;
        })
      }
    </div>
  </div>;
};
export default SelectionList;
