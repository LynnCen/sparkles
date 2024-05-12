/* eslint-disable react-hooks/exhaustive-deps */
/* 左侧树 */
import { FC, useState, useEffect } from 'react';
import { Tree, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getKeys } from '@/common/utils/ways';
import { LeftTreeProps } from '../ts-config';
import styles from './index.module.less';

const LeftTree: FC<LeftTreeProps> = ({
  treeData,
  fieldNames = { title: 'name', key: 'id', children: 'children' },
  onSelect,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    (treeData && treeData.length && getKeys([treeData[0]], [], fieldNames.key, 'children', true)) || []
  );

  useEffect(() => {
    // selectedKeys不存在，在treeData改变且treeData存在的时候默认选中第一个
    if (!selectedKeys.length && treeData && treeData.length) {
      const ids = getKeys([treeData[0]], [], fieldNames.key, 'children', true);
      setSelectedKeys(ids);
    }
  }, [fieldNames.key, treeData]);

  // selectedKeys改变同步到外部
  useEffect(() => {
    onSelect && onSelect(selectedKeys);
  }, [selectedKeys]);

  // 选中节点
  const onSelectKey = (selectedKeys: any, info: any) => {
    // 节点不可取消选择
    if (info.selected) {
      const selectIds = getKeys(info.selectedNodes, [], 'id', 'children', true);
      setSelectedKeys(selectIds);
    }
  };
  return (
    <div className={styles.treeWrap}>
      <div className={styles.title}>组织架构</div>
      <div className={styles.content}>
        <Tree
          showIcon
          selectedKeys={selectedKeys}
          defaultExpandAll
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          onSelect={onSelectKey}
          fieldNames={fieldNames}
          titleRender={(node) =>
            <Typography.Paragraph
              className={styles.nodeName}
              ellipsis={{ tooltip: node?.name }}
            >
              {node?.name}
            </Typography.Paragraph>
          }
        />
      </div>
    </div>
  );
};

export default LeftTree;
