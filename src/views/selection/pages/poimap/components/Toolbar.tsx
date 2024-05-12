import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import ProvinceList from '@/common/components/ProvinceList';
// import type { DataNode, TreeProps } from 'antd/es/tree';
import { useMethods } from '@lhb/hook';
import { Tree } from 'antd';
import IconFont from '@/common/components/IconFont';
import { selectionNewTree } from '@/common/api/selection';
import { selectIcon } from '../ts-config';
import { isArray } from '@lhb/func';

const Toolbar: FC<{
  changeProvince: (val, city, option) => void;
  changeCheck: (val) => void;
  province: number[] | [];
  setCheckedType: (val) => void;
}> = ({
  changeProvince,
  changeCheck,
  province,
  setCheckedType
}) => {
  const [treeData, setTreeData] = useState<any>(null);
  const [isBrandDisabled, setIsBrandDisabled] = useState<boolean>(false);
  const [isTypeDisabled, setIsTypeDisabled] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<any>([]);

  useEffect(() => {
    methods.getTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    changeCheck(checkedKeys);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedKeys]);
  const methods = useMethods({
    onChangeProvince(val, selectedOptions) {
      val.length < 2 && methods.fillSelect(val, selectedOptions);
      changeProvince(val, selectedOptions.map((val) => val.name), selectedOptions);
    },
    fillSelect: (idList, optionList) => {
      idList.push(optionList[0]?.children[0]?.id);
      optionList.push(optionList[0]?.children[0]);
    },
    onCheck: (keys, e) => {
      const { node } = e;
      /**
       * 选中从0到1的时候需要确定禁用的类型
       * 选中从1到0的时候需要两个状态都不禁用
       */
      if (checkedKeys.length === 0) {
        if (node.level === 4) {
          // 当行业下只有一个品牌的时候会自动勾选父级，需要去除
          setIsBrandDisabled(false);
          setIsTypeDisabled(true);
          setCheckedKeys([node.key]);
          setCheckedType('brand');
          return;
        }
        // 从0到1切选中的是分类的时候需要把key数字（品牌）的去除
        setIsBrandDisabled(true);
        setIsTypeDisabled(false);
        setCheckedKeys(keys.filter(key => typeof key !== 'number'));
        setCheckedType('type');
        return;
      }
      if (keys.length === 0) {
        setIsBrandDisabled(false);
        setIsTypeDisabled(false);
      }
      setCheckedKeys(keys);
    },
    async getTree() {
      const res: any = await selectionNewTree();
      setTreeData(res || []);
    },
    deepTree: (list: any[], level = 1) => {
      /**
       * 后端：寒锋
       * prd: https://confluence.lanhanba.com/pages/viewpage.action?pageId=67510383
       * 树为定死的形式，三层encode为后端查询品类数据所需参数（购物中心传递的为购物中心encode），四层id为查询具体商家所需参数
       * 2022-11-04 14:18:30
       */
      return list.map(item => {
        return {
          /**
           * 无效的key：店铺分类的前两级
           * 特殊情况：如购物中心这种一级但是没有子集的key
           */
          key: level < 3 ? ((isArray(item.children) && item.children.length === 0 && level === 1) ? item.encode : `del_${item.encode}`) : (item.encode ? item.encode : item.id),
          title: item.name,
          icon: selectIcon[item.name] && <IconFont {...selectIcon[item.name]} />,
          children: item.children && methods.deepTree(item.children, level + 1),
          disabled: !item.encode ? isBrandDisabled : isTypeDisabled,
          level: level
        };
      });
    },
  });
  return (
    <div className={styles.toolbarCon}>
      <div className={styles.province}>
        <ProvinceList
          type={1}
          changeOnSelect
          expandTrigger='hover'
          style={{ width: '100%' }}
          value={province}
          placeholder='请选择省市区'
          onChange={methods.onChangeProvince}
        />
      </div>
      <div className={styles.treeSelect}>
        {treeData && <Tree
          rootClassName={styles.tree}
          checkable
          checkedKeys={checkedKeys}
          onCheck={methods.onCheck}
          defaultExpandAll={true}
          showIcon={true}
          titleRender={(node) => <div className='titleWrapper'>
            <span className={node?.children?.length || node.title === '购物中心' ? 'dark' : 'light'}>{node.title}</span>
          </div>}
          treeData={methods.deepTree(treeData)}
        />}
      </div>
    </div>
  );
};

export default Toolbar;
