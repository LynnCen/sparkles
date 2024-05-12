import { Switch, Tree } from 'antd';
import { FC } from 'react';

import cs from 'classnames';
import { MapTreeProps } from '../ts-config';

import styles from '../entry.module.less';

const MapTree: FC<MapTreeProps> = ({
  onCheck,
  treeData,
  clickSwitch,
  showSwitch,
  hasBtBorder = true,
  disabled = false,
  checkedKeys,
  onSelectBrandTree,
  switchTitle = '热力图',
  classNames = 'nt-14',
}) => {
  return <div className={cs(styles.treeCon, classNames)}>
    <Tree
      checkedKeys={checkedKeys}
      disabled={disabled}
      showIcon
      checkable
      blockNode
      onCheck={onCheck}
      onSelect={onSelectBrandTree && onSelectBrandTree}
      defaultExpandAll
      treeData={treeData}
      className={cs(hasBtBorder && styles.borderBottom, styles.tree)}
      titleRender={(node: any) =>
        <>
          <div className={styles.treeTitle}>
            {node.color && <div
              style={{
                background: node.color,
              }}
              className={styles.circleIcon}></div>}
            <span className={cs(node.isTitle && 'bold c-132', !node.isTitle && node.color && 'ml-14')}>
              {node.title}
            </span>
          </div>
          {showSwitch && <div className={styles.customerTreeTitle}>
            {node?.children?.length
              ? <span className={cs(styles.switch, 'bold c-132')}>{switchTitle}</span>
              : node.checked ? <Switch
                // checked={node.show}
                className={styles.switch}
                onClick={(checked, e) => {
                  e.stopPropagation();
                  clickSwitch && clickSwitch(node, checked);
                }}
                size='small' /> : null}
          </div>}
        </>}
    />
  </div>;
};

export default MapTree;
