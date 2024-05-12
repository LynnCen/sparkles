/**
 * @Author : chenyu
 * @Since : 2023-04-14 10:04
 * @LastEditors : chenyu
 * @LastEditTime : 2023-04-14 15:04
 * @Description :
 */
import ModuleInfoWrapper from '@/common/components/business/ModuleInfoWrapper';
import InfoItemWrapper from '@/common/components/business/ModuleInfoWrapper/InfoItemWrapper';
import V2Container from '@/common/components/Data/V2Container';
import ScrollListCard from '../../ScrollListCard';
import { replaceEmpty } from '@lhb/func';
import { Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

// const colData = [{ name: '城市名称', value: '杭州市1' }, { name: '城市名称', value: '杭州市2' }, { name: '城市名称', value: '杭州市3' }];

const BusinessProfile: React.FC<any> = ({
  data = {},
}) => {
  const [mainHeight, setMainHeight] = useState<number>(0);


  // 多经收入排名 相关
  const columns: any[] = [
    {
      dataIndex: 'name', title: '商圈名称', width: 140, render: (_) => <Text ellipsis={{ tooltip: _ }}>{replaceEmpty(_)}</Text>
    },
    { dataIndex: 'value', title: `城市客流排名`, width: 80 },
    { dataIndex: 'value2', title: '全国客流排名', width: 80 },
  ];

  return (
    <>
      <V2Container
        // className={styles.demoA}
        style={{ height: '100%' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <>
            <ModuleInfoWrapper title='商业概况'>
              <InfoItemWrapper columns={3} maxSize={6} data={data?.businessProfile}>
              </InfoItemWrapper>
            </ModuleInfoWrapper>
          </>,
        }}>
        <ScrollListCard
          columns={columns}
          dataSource={data?.businessCircleList}
          noPadding
          height={mainHeight}
        />
      </V2Container>
    </>
  );
};


export default BusinessProfile;
