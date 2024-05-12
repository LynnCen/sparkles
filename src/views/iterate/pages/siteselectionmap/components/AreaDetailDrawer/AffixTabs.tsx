/**
 * @Description tabs
 */
import { FC } from 'react';
import { Affix } from 'antd'; // Button List
import { useMethods } from '@lhb/hook';
import V2Tabs from '@/common/components/Data/V2Tabs';

// import cs from 'classnames';
// import styles from './entry.module.less';

const AffixTabs: FC<any> = ({
  fixedHeight,
  container, // 滚动容器
  dynamicTabActiveRef,
  dynamicTabContentRefs,
  tabs,
  tabActive, // tab当前选中项
  setTabActive,
}) => {
  const {
    tabChange,
  } = useMethods({
    tabChange: (active: string) => {
      setTabActive(active);
      dynamicTabActiveRef && (dynamicTabActiveRef.current = active);
      // 滚动到对应的位置
      const targetEle = dynamicTabContentRefs.current?.find((refItem) => refItem.key === active);
      const topVal = (targetEle?.el?.offsetTop || 0) - fixedHeight + 3;
      container?.current?.scrollTo({
        top: topVal,
        behavior: 'instant'
      });
    }

  });
  return (
    <Affix
      offsetTop={0}
      target={() => container?.current}
    >
      <V2Tabs
        items={tabs}
        activeKey={tabActive}
        onChange={tabChange}
      />
    </Affix>
  );
};

export default AffixTabs;
