import { useMethods } from '@lhb/hook';
import { DeleteOutlined } from '@ant-design/icons';
import { deepCopy } from '@lhb/func';
import { Input, Tree } from 'antd';
import cs from 'classnames';
import { FC, useEffect, useState } from 'react';
import './index.antd.less';
import styles from './index.module.less';

const { Search } = Input;

const _tiledData: Array<any> = []; // 平铺的映射数组
let _originalData: Array<any> = []; // 接口获取到的原始数据

const SearchTree: FC<any> = ({
  children,
  data,
  onDelete = () => {}, // 删除icon点击后触发
  inputConfig = {
    placeholder: '搜索',
  },
  fieldNames = {
    // 自定义入参格式
    title: 'title',
    key: 'key',
    children: 'children',
  },
  ...extraProps
}) => {
  /* data */
  const [expandedKeys, setExpandedKeys] = useState<any>([]); // 展开指定的树节点
  // const [searchValue, setSearchValue] = useState<any>([]); // 搜索数据
  const [autoExpandParent, setAutoExpandParent] = useState<any>([]); // 是否自动展开父节点
  const [treeData, setTreeData] = useState(_originalData); // 经过过滤和包装的数据
  /* methods */
  const { onExpand, onChange, loop, generateList, ...methods } = useMethods({
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const obj = {
          keyword: node.keyword,
        };
        const children = node[fieldNames.children];
        obj[fieldNames.key] = node[fieldNames.key];
        obj[fieldNames.title] = node[fieldNames.title];
        _tiledData.push(obj);
        children && generateList(children);
      }
    },
    getParentKey(key, tree) {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        const nodeKey = node[fieldNames.key];
        const nodeChildren = node[fieldNames.children];
        if (nodeChildren) {
          if (nodeChildren.some((item) => item[fieldNames.key] === key)) {
            parentKey = nodeKey;
          } else if (methods.getParentKey(key, nodeChildren)) {
            parentKey = methods.getParentKey(key, nodeChildren);
          }
        }
      }
      return parentKey;
    },
    onExpand(expandedKeys) {
      setExpandedKeys(expandedKeys);
      setAutoExpandParent(false);
    },
    onChange(value) {
      let expandedKeys: Array<any> = [];
      let filteredData = _originalData;
      if (value) {
        // 如果有值，需要重新组装 filteredData 和 expandedKeys
        expandedKeys = _tiledData
          .map((item: any) => {
            if ((item.keyword || item[fieldNames.title]).indexOf(value) > -1) {
              return methods.getParentKey(item[fieldNames.key], _originalData);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        const hasSearchTerm = (node) => node.toLowerCase().indexOf(value) !== -1;
        const filterData = (arr) =>
          arr?.filter(
            (node) =>
              hasSearchTerm(node.keyword || node[fieldNames.title]) || filterData(node[fieldNames.children])?.length > 0
          );
        filteredData = filterData(_originalData).map((node) => {
          const obj = {
            ...node,
          };
          obj[fieldNames.children] = filterData(node[fieldNames.children]);
          return obj;
        });
      }
      setTreeData(filteredData);
      setExpandedKeys(expandedKeys);
      // setSearchValue(value);
      setAutoExpandParent(!!value);
    },

    onDelete(target, event) {
      onDelete(target);
      event.stopPropagation();
    },

    loop(data) {
      return data.map((item) => {
        const children = item[fieldNames.children];
        const obj = {
          icon: item.useDelete ? <DeleteOutlined onClick={(event) => methods.onDelete(item, event)} /> : null, // 默认是删除按钮
          ...item, // 可以覆盖icon，但是不能覆盖children
        };
        obj[fieldNames.children] = children ? loop(children) : undefined;
        return obj;
      });
    },
  });

  useEffect(() => {
    setTreeData(data); // 像tree组件插入数据
    generateList(data); // 组装平铺的映射数组
    _originalData = deepCopy(data); // 存储接口获取到的原始数据
    // eslint-disable-next-line
  }, [data]);

  return (
    <div className={styles['search-tree']}>
      <Search
        className={styles['search-tree-search']}
        allowClear
        placeholder={inputConfig.placeholder}
        onSearch={onChange}
        enterButton='搜索'
      />
      {children}
      <div style={{ position: 'relative', overflow: 'scroll' }}>
        <Tree
          className={cs(styles['search-tree-main'])}
          showIcon
          blockNode
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(treeData)}
          fieldNames={fieldNames}
          {...extraProps}
        />
      </div>
    </div>
  );
};

export default SearchTree;
