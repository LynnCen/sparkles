import IconFont from '@/common/components/Base/IconFont';
import V2Container from '@/common/components/Data/V2Container';
import { Table, Tooltip } from 'antd';
import { FC, ReactNode, useState } from 'react';

import styles from './index.module.less';

interface ScrollListCardProps {
  dataSource: object[];
  columns: any[];
  title?: string | ReactNode;
  titleTips?: string ; // title右侧的提示，hover展示
  rightSlot?: string | ReactNode;
  noPadding?: boolean ;
  height?: number; // 外部可传入高度，如果没有传入默认为100%
  rowKey?: string; // 表格行 key 的取值
}


const ScrollListCard: FC<ScrollListCardProps> = ({
  title,
  titleTips,
  rightSlot, // 卡片右上角插槽
  columns = [],
  dataSource = [],
  noPadding = false,
  height,
  rowKey = 'name'
}) => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  // const [dataSource, setDataSource] = useState<any[]>([]);
  // const columns: any[] = [
  //   {
  //     key: 'index', title: '排名', width: 50, render: (_, __, index) => {
  //       const _index: number = index + 1;
  //       if (_index > 3) {
  //         return <span style={{ marginLeft: 7 }}>{_index}</span>;
  //       } else {
  //         return <img style={{ width: 24, height: 24 }} src={`https://staticres.linhuiba.com/project-custom/pms/icon/No${_index}@2x.png`} />;
  //       }
  //     }
  //   },
  //   { key: 'age', title: '点位名称', },
  //   { key: 'address2', title: '收入', align: 'right' },
  // ];

  // const getData = () => {
  //   const data: any[] = [];
  //   for (let i = 0; i < 100; i++) {
  //     data.push({
  //       key: i,
  //       name: `Edrward ${i} `,
  //       age: 32,
  //       address: `London Park no.${i} `,
  //     });
  //   }
  //   setDataSource(data);
  // };
  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <div className={styles.scrollListCardContainer} style={{ padding: noPadding ? 0 : 12 }}>
      <V2Container
        className={styles.demoA}
        style={{ height: height || '100%' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <>
            {title && <div className={styles.cardTitle}>
              <div className={styles.title}>
                {title}
                {titleTips && <Tooltip title={titleTips} placement='bottom' >
                  <span><IconFont iconHref={'iconxq_ic_shuoming_normal'} className={styles.titleTipsIcon} /></span>
                </Tooltip>}
              </div>
              <div>{rightSlot}</div>
            </div>}
          </>,
        }}>
        <Table
          size='small'
          rowKey={rowKey}
          scroll={{ y: mainHeight - 40 }}
          bordered={false}
          pagination={false}
          columns={columns}
          dataSource={dataSource}
          className={styles.listTable}
        />
      </V2Container>
    </div>
  );
};

export default ScrollListCard;
