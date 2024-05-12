import React, {
  FC,
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';
import {
  Input,
  Tree,
  Divider,
  Image
} from 'antd';
import {
  deepCopy,
  isArray,
  debounce,
  recursionEach
} from '@lhb/func';
import {
  poiIndustryBrand,
  poiTreeBrand
} from '@/common/api/selection';
import cs from 'classnames';
import styles from '../entry.module.less';
import IconFont from '@/common/components/IconFont';


const CheckboxIcon: FC<any> = ({
  isChecked,
  checkHandle
}) => {
  // const { key, id: brandId } = info;
  return (<IconFont
    iconHref={ isChecked ? 'iconduoxuanxuanzhong' : 'iconduoxuan'}
    className='color-help pointer fs-16'
    onClick={checkHandle}/>);
};

const BrandTree: FC<any> = ({
  dataRef,
  isInit,
  // initExpandedKeys,
  brandTreeData, // 树状行业品牌数据
  // treeCheckedKeys, // 选中的品牌数据
  setTreeCheckedKeys, // 设置选中的品牌数据
  setBrandTreeData // 设置树状行业品牌数据
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]); // 展开的节点key数组
  const [searchValue, setSearchValue] = useState(''); // 搜索关键词
  const [autoExpandParent, setAutoExpandParent] = useState(false); // 是否自动展开父节点
  const searchFnRef = useRef((str) => searchHandle(str));
  // 默认展开逻辑
  useEffect(() => {
    if (!isInit) return;
    const initExpandedKeys = dataRef.current.initExpandedKeys;
    if (!(isArray(initExpandedKeys) && initExpandedKeys.length)) return;
    setExpandedKeys(initExpandedKeys);
    dataRef.current.expandedKeys = initExpandedKeys;
    setAutoExpandParent(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit]);
  // 节点展开/收起
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    // 非搜索状态时才记录
    if (!searchValue) {
      dataRef.current.expandedKeys = newExpandedKeys;
    }
    setAutoExpandParent(false);
  };
  // 搜索匹配时的标题
  const matchedTitle = (name: string) => {
    if (!searchValue) return name;
    const preText = name.split(searchValue)[0];
    const matchedText = name.indexOf(searchValue) > -1 ? searchValue : '';
    const nextText = name.split(searchValue)[1];
    return (<>
      {preText}<span className='c-006'>{matchedText}</span>{nextText}
    </>);
  };
  /** 虽然注释了该段代码，但是代码请不要删除
   * 逻辑说明
   * 选择行业（一级、二级、三级）时，禁用品牌，品牌该选中还要选中
   * 选择品牌时，禁用行业（一级、二级、三级）
   * checkedKeys, e:{checked: bool, checkedNodes, node, event, halfCheckedKeys}
   * @param checkedKeys 所有选中的节点key组成的数组
   * @param e {checked: bool, checkedNodes, node, event, halfCheckedKeys} 可通过console打印具体信息
   */
  // const checkHandle = (checkedKeys, e) => {
  //   if (checkedKeys.length === 0) { // 所有选中已取消，恢复到初始状态
  //     setTreeCheckedKeys([]);
  //     setBrandTreeData(deepCopy(dataRef.current.brandTreeData));
  //     return;
  //   }
  //   const { node } = e;
  //   const { isBrand } = node; // 选中的节点
  //   if (isBrand) { // 选中的是品牌, 禁用所有行业
  //     recursionSetBrandDataStatus(brandTreeData, false); // 递归禁用
  //     setBrandTreeData(brandTreeData); // 更新树状行业品牌数据
  //     setTreeCheckedKeys(checkedKeys); // 更新选中项
  //     return;
  //   }
  //   // 选中的是行业, 禁用所有品牌
  //   // 传入的copyKeys是为了保持交互统一：第一次选中父级（行业）后，子集（品牌）会选中禁用，第二次再选择其他父级时，子集只禁用未选中，结果需要统一，统一为禁用未选中
  //   const copyKeys = deepCopy(checkedKeys);
  //   recursionSetBrandDataStatus(brandTreeData, true, copyKeys);
  //   setBrandTreeData(brandTreeData); // 更新树状行业品牌数据
  //   setTreeCheckedKeys(copyKeys); // 更新选中项
  // };

  /** 虽然注释了该段代码，但是代码请不要删除
   * 递归遍历禁用品牌或者行业
   * @param data {Array<any>} 行业品牌数据
   * @param status {Boolean}  给定的状态值，根据选中的是品牌还是行业决定状态值
   * @param checkedKeys {Array<string>} 选中的品牌keys(只有在选中行业时传入)
   */
  // const recursionSetBrandDataStatus = (data: Array<any>, status: boolean, checkedKeys?: Array<string>) => {
  //   data.forEach((item: any) => {
  //     const { isBrand, children, key } = item;
  //     if (!!isBrand === status) item.disabled = true;
  //     if (checkedKeys?.length && isBrand) { // 禁用品牌时，剔除掉品牌的key
  //       const targetIndex = checkedKeys.findIndex((itemKey: string) => itemKey === key);
  //       if (targetIndex !== -1) checkedKeys.splice(targetIndex, 1);
  //     }
  //     if (isArray(children) && children.length) {
  //       recursionSetBrandDataStatus(children, status, checkedKeys);
  //     }
  //   });
  // };

  // 递归查找对应的行业，在该行业下插入对应的品牌数据
  const recursionSetBrandData = (originData: any[], key: string, brands: any[]) => {
    originData.forEach((item: any) => {
      const { key: curKey, children } = item;
      if (key === curKey) { // 匹配到对应的行业
        item.children = brands;
        return;
      }
      if (isArray(children) && children.length) {
        recursionSetBrandData(children, key, brands);
      }
    });
  };

  // 递归查找点击的品牌，响应选中和取消选中
  const recursionTargetBrand = (data: any[], targetBrandId: number) => {
    data.forEach((item: any) => {
      const { id, children } = item;
      if (id === targetBrandId) { // 匹配到对应的品牌
        item.isChecked = !item.isChecked;
        item.switcherIcon = <CheckboxIcon
          isChecked={item.isChecked}
          checkHandle={() => checkHandle(item)}/>;
        // 重新set data
        setBrandTreeData(deepCopy(dataRef.current.brandTreeData));
        const targetIndex = dataRef.current.brandIds.findIndex(idItem => idItem === id);
        if (targetIndex > -1) {
          dataRef.current.brandIds.splice(targetIndex, 1);
          const newVal = deepCopy(dataRef.current.brandIds);
          setTreeCheckedKeys(newVal);
          return;
        }
        dataRef.current.brandIds.push(id);
        setTreeCheckedKeys((state) => ([...state, id]));
      }
      if (isArray(children) && children.length) {
        recursionTargetBrand(children, targetBrandId);
      }
    });
  };

  /**
   * switcherIcon绑定的复选框事件
   */
  const checkHandle = (item: any) => {
    const { id } = item;
    // 这里要用dataRef中存的brandTreeData，保证是同一份引用才能重新设置switcherIcon的选中与否
    recursionTargetBrand(dataRef.current.brandTreeData, id);
  };

  // 异步加载品牌数据
  const onLoadData = async (item: any) => {
    const { children, id, key } = item;
    // 行业数据下最后一层children是null，此时点击就要请求接口获取对应行业下的品牌
    if (isArray(children) && children.length) return;
    if (searchValue) return; // 搜索状态时
    try {
      const brands = await poiIndustryBrand({ industryId: id });
      // 生成唯一key
      brands.forEach((brandItem: any, index: number) => {
        brandItem.key = `${key}-${index}`;
        brandItem.isBrand = true;
        brandItem.isLeaf = true; // 设置该参数就不会作为父节点展示
        brandItem.isChecked = false;
        // 自定义复选框icon
        brandItem.switcherIcon = <CheckboxIcon
          isChecked={false}
          checkHandle={() => checkHandle(brandItem)}
        />;
      });
      const newData = deepCopy(brandTreeData); // 拷贝一份现有的树状数据
      // 递归匹配对应的行业，在该行业下插入对应的品牌数据
      recursionSetBrandData(newData, key, brands);
      setBrandTreeData(newData); // 更新数据
      dataRef.current.brandTreeData = newData;
    } catch (error) {}
  };

  // --------------------------------------手动分割线------------------------------------------
  // 获取父节点的key
  const getParentKey = (key: string, tree: Array<any>) => {
    let parentKey = '';
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey!;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(debounce((str) => searchFnRef.current(str), 200), []);
  // 搜索框change事件
  const onChange = async (e: any) => {
    const { value } = e.target;
    const keyword = value.replace(/(^\s*)|(\s*$)/g, '');
    setSearchValue(keyword);
    if (!keyword) { // 没有keyword时，恢复之前的树状结构的数据状态
      resetSearchHandle();
      return;
    }
    debounceSearch(keyword);
  };
  // 搜索时请求接口的逻辑
  const searchHandle = async (keyword: string) => {
    const treeData = await poiTreeBrand({
      keyword,
      type: 2 // 品牌+行业树状图
    });
    // 取消非搜索状态时的树状数据中的选中
    uncheckBeforeHandle();
    // 需要对原始的接口数据做处理才能用于Tree组件
    if (!isArray(treeData)) return;
    // 递归匹配对应的行业，在该行业下插入对应的品牌数据
    recursionBrandData(treeData, 0);
    const newData = deepCopy(treeData); // 拷贝一份现有的树状数据
    setBrandTreeData(newData); // 更新数据
    dataRef.current.treeDataSearchResult = newData; // 搜索后的数据
    const tiledData: Array<any> = [];
    recursionEach(newData, 'children', (item: any) => {
      tiledData.push(item);
    });
    dataRef.current.tiledDataSearchResult = tiledData;
    // 从平铺的数据中匹配关键字
    const newExpandedKeys = dataRef.current.tiledDataSearchResult.map(item => {
      if (keyword && item.name.indexOf(keyword) > -1) {
        return getParentKey(item.key, dataRef.current.tiledDataSearchResult);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(!!newExpandedKeys.length);
  };

  // 搜索状态时取消未搜索时的选中状态
  const uncheckBeforeHandle = () => {
    setTreeCheckedKeys([]); // 将选中的品牌清空
    dataRef.current.brandIds = [];
    // 取消复选框的选中状态
    resetCheckboxHandle(dataRef.current.brandTreeData);
  };
  // 取消选中
  const resetCheckboxHandle = (data: any[]) => {
    data.forEach((item: any) => {
      const { children, isBrand } = item;
      if (isBrand) { // 匹配到对应的品牌层级时
        item.isChecked = false;
        item.switcherIcon = <CheckboxIcon
          isChecked={item.isChecked}
          checkHandle={() => checkHandle(item)}/>;
        // 重新set data
        setBrandTreeData(deepCopy(dataRef.current.brandTreeData));
      }
      if (isArray(children) && children.length) {
        resetCheckboxHandle(children as any[]);
      }
    });
  };

  // 以下为搜索相关的逻辑，默认的左侧数据结构和搜索后的左侧数据结构因接口不同，交互不同，需要独自处理
  // 递归遍历原始的数据，转包为符合Tree组件及交互要求的格式，需要对antd的tree组件有一定的了解
  const recursionBrandData = (data: Array<any>, index: number | string) => {
    // 需要了解接口返回的数据结构
    data.forEach((item: any, curIndex: number,) => {
      const { brandList, children } = item;
      // 层级组成唯一的key，接口返回的id不唯一（行业id是一张表，品牌是另外一张表）
      item.key = `${index ? `${index}-` : ''}${curIndex}`;
      // item.disabled = false;
      // 前三层为行业
      // levelVal < 4 && dataRef.current.industryKeyId.set(item.key, {
      //   id,
      //   level: levelVal,
      //   name
      // });
      // 行业层-继续向下遍历
      if (isArray(children) && children.length) {
        recursionBrandData(children, item.key);
        return;
      }
      item.isLeaf = false;
      // 到了最底层-品牌层
      if (isArray(brandList) && brandList.length) {
        recursionBrandData(brandList, item.key); // 将最后一层的品牌数据转包成需要的数据格式
        brandList.forEach((brandItem: any) => { // 标记这一层为品牌
          brandItem.isLeaf = true; // 设置该参数就不会作为父节点展示
          brandItem.isChecked = false;
          // 自定义复选框icon
          brandItem.switcherIcon = <CheckboxIcon
            isChecked={false}
            checkHandle={() => searchCheckHandle(brandItem)}
          />;
          // brandItem.isBrand = true;
          // dataRef.current.brandKeyId.set(brandItem.key, { id: brandItem.id });
        });
        item.children = brandList; // 将品牌数据替换为最后一层的children
      }
    });
  };

  // 递归查找点击的品牌，响应选中和取消选中
  const recursionSearchTargetBrand = (data: any[], targetBrandId: number) => {
    data.forEach((item: any) => {
      const { id, children } = item;
      if (id === targetBrandId) { // 匹配到对应的品牌
        item.isChecked = !item.isChecked;
        item.switcherIcon = <CheckboxIcon
          isChecked={item.isChecked}
          checkHandle={() => searchCheckHandle(item)}/>;
        // 重新set data
        setBrandTreeData(deepCopy(dataRef.current.treeDataSearchResult));
        const targetIndex = dataRef.current.brandIds.findIndex(idItem => idItem === id);
        if (targetIndex > -1) {
          dataRef.current.brandIds.splice(targetIndex, 1);
          const newVal = deepCopy(dataRef.current.brandIds);
          setTreeCheckedKeys(newVal);
          return;
        }
        dataRef.current.brandIds.push(id);
        setTreeCheckedKeys((state) => ([...state, id]));
      }
      if (isArray(children) && children.length) {
        recursionSearchTargetBrand(children, targetBrandId);
      }
    });
  };

  /**
   * switcherIcon绑定的复选框事件
   */
  const searchCheckHandle = (item: any) => {
    const { id } = item;
    // 这里要用dataRef中存的treeDataSearchResult，保证是同一份引用才能重新设置switcherIcon的选中与否
    recursionSearchTargetBrand(dataRef.current.treeDataSearchResult, id);
  };
  // 清空搜索词时
  const resetSearchHandle = () => {
    setSearchValue(''); // 清空输入框
    setTreeCheckedKeys([]); // 清空选中的品牌项
    dataRef.current.brandIds = []; // 清空选中的品牌项
    setBrandTreeData(deepCopy(dataRef.current.brandTreeData)); // 恢复搜索前的树状数据
    setExpandedKeys(dataRef.current.expandedKeys); // 恢复搜索前的展开项
  };

  return (
    <div className={styles.leftDrawerWrapper}>
      <div className='fs-16 bold'>
        LOCATION - 行业数据库
      </div>
      <Input
        value={searchValue}
        placeholder='搜索行业/品牌'
        onChange={onChange}
        className='mt-16'
        suffix={searchValue
          ? <IconFont
            iconHref='iconic_close_colour_seven'
            className='color-help pointer fs-12'
            onClick={resetSearchHandle}/>
          : <IconFont iconHref='iconsearch' className='c-707'/>}/>
      <Divider style={{ borderColor: '#eee', marginTop: '16px', marginBottom: '16px' }}/>
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        // checkable
        // checkStrictly
        fieldNames={{
          title: 'name',
          key: 'key',
        }}
        selectable={false}
        treeData={brandTreeData}
        // checkedKeys={treeCheckedKeys}
        loadData={onLoadData}
        // icon={(item) => <Icon info={item}/>}
        // switcherIcon={<IconFont iconHref='iconsearch' className='c-707'/>}
        // 自定义自渲染节点内容
        titleRender={(item: any) => (<>
          { // 品牌层级的时候按照品牌logo + 品牌名自定义展示，行业层级时只显示行业名字
            item.isBrand ? (
              <div className={styles.brandItemCon}>
                {/* 展示品牌图标 */}
                {
                  item.icon
                    ? <Image
                      preview={false}
                      width={14}
                      height={14}
                      // https://staticres.linhuiba.com/project-custom/locationpc/img_placeholder.png
                      src={item.icon}/>
                    : null
                }
                <span className={item.icon ? 'pl-6' : ''} title={item.name}>
                  {matchedTitle(item.name)}
                </span>
              </div>)
              : (<div className={cs('ellipsis', item.level === 1 ? 'bold' : '')} title={item.name} style={{ maxWidth: '85px' }}>
                {
                  item.level === 1
                    ? (<>
                      <IconFont iconHref='iconmendian' className='fs-14'/>
                    </>)
                    : null
                }
                <span className={item.level === 1 ? 'pl-4' : ''}>{matchedTitle(item.name)}</span>
              </div>)
          }
        </>)}
        // onCheck={checkHandle}
        className={styles.treeCon}/>
    </div>
  );
};

export default BrandTree;
