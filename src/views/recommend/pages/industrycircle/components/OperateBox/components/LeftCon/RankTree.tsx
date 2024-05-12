import { Radio, Switch, Tree } from 'antd';
import { FC, useState } from 'react';
import styles from './index.module.less';
import { RankType } from './LeftCon';
import { RankStatus } from '../../../../ts-config';


const RankTree:FC<any> = ({
  setMapShowType
}) => {
  // 有使用外部引入的RankType，放函数内部
  const _rankTreeData = [
    {
      key: RankType,
      title: '展示商圈排名',
      checked: true,
      show: true,
      children: [
        {
          key: RankStatus.brandRank,
          title: '行业评分排名',
          checked: true,
          show: true,
        },
        // {
        //   key: RankStatus.yhtRank,
        //   title: '益禾堂评分排名',
        //   checked: false,
        //   show: true
        // }
      ]
    }
  ];

  const [rankTreeData, setRankTreeData] = useState<any>(_rankTreeData);

  // 处理展示商圈排名的单选框
  const checkRadio = (node) => {
    const res = rankTreeData.map((item) => {
      item?.children?.map((child) => {
        child.checked = false;
        if (child.key === node.key) {
          // 此时在奶茶行业评分和益禾堂评分两个单选中。
          setMapShowType(node.key);
          child.checked = true;
        }
      });
      return item;
    });
    setRankTreeData(res);
  };
  const clickSwitch = (node, checked) => {
    // 处理展示商圈排名{
    const res = rankTreeData.map((item) => {
      // 修改对应匹配的checked
      if (item.key === node.key) {
        item.checked = checked;
        setMapShowType(RankStatus.normal);
      }
      // 子元素是否展示
      item?.children?.map((child) => {
        child.show = checked;
        // 当打开展示商圈排名时，设置setMapShowType
        if (checked && child.checked) {
          setMapShowType(node.key);
        }
      });
      return item;
    });

    setRankTreeData(res);
    return;
  };

  return <div>
    <Tree
      treeData={rankTreeData}
      selectable={false}
      blockNode// 节点占据一行
      defaultExpandAll// 默认全展开
      style={{
        paddingBottom: 12,
        marginTop: 10,
        marginLeft: 12
      }}
      titleRender={(node:any) => {
        if (!node.show) {
          return <></>;
        }
        return <>
          {
            node?.children?.length
              ? <span className={node?.children?.length ? 'bold' : ''}>{node.title}</span>
              : <Radio
                onChange={() => checkRadio(node)}
                checked={node?.checked}>{node.title}</Radio>
          }
          {/* 展示商圈排名带有switch */}
          {node.key === RankType ? <Switch
            className={styles.switch}
            onClick={(checked) => clickSwitch(node, checked)}
            checked={node.checked}
            size='small' /> : <></>}
        </>;
      }}
    />
  </div>;
};
export default RankTree;
