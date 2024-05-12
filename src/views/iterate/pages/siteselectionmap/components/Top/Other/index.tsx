/**
 * @Description 地图显示设置
 */
import { FC, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Brand from './Brand';
import Competitor from './Competitor';

const Other: FC<any> = ({
  mapIns, // 地图实例
  mapHelpfulInfo
}) => {
  const [open, setOpen] = useState<boolean>(false);
  // const [tabActiveKey, setTabActiveKey] = useState<string>('1'); // 为了实现默认也要显示竞品门店
  // const [items, setItems] = useState<any[]>([]);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setTabActiveKey('0');
  //   }, 200);
  // }, []);

  const items = [
    {
      label: '本品牌门店',
      key: '0',
      children: <Brand
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
      />
    },
    {
      label: `竞品门店`,
      key: '1',
      children: <Competitor
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
      />
    }
  ];
  return (
    <div className={styles.container}>
      <div
        className={styles.otherCon}
        onClick={() => setOpen(!open)}
      >
        <IconFont iconHref='iconic_map1' className='fs-16'/>
        <span className='pl-4 pr-16'>地图显示设置</span>
        <IconFont
          iconHref='pc-common-icon-a-iconarrow_down'
          // className={open ? styles.arrowIconUp : styles.arrowIcon}
        />
      </div>

      <div className={cs(styles.wrapper, 'mt-12', open ? styles.isUnfold : '')}>
        <V2Tabs
          // activeKey={tabActiveKey}
          items={items}
          style={{
            marginBottom: '0'
          }}
          // onChange={(key) => setTabActiveKey(key)}
        />
      </div>
    </div>
  );
};

export default Other;
