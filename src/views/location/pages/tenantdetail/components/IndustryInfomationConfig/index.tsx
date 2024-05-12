/**
 * @Description  行业地图配置
 */

import { urlParams } from '@lhb/func';
import { Tabs } from 'antd';
import { FC, useState } from 'react';
import { enumTab } from '../../ts-config';
import V2Container from '@/common/components/Data/V2Container';
import MarkertPreScreens from './components/MarkertPreScreens';
import AreaIndustryConfig from '../AreaIndustryConfig';

const IndustryInfomationConfig: FC<any> = ({ mainHeight }) => {
  const tenantId: string | number = urlParams(location.search)?.id || '';
  const [activeTab, setActiveTab] = useState<string>(enumTab.MARKET_PRE_SCREENS);

  const tabChildCom = () => {
    switch (activeTab) {
      case enumTab.MARKET_PRE_SCREENS:
        return <MarkertPreScreens tenantId={tenantId}/>;
      case enumTab.AREA_INDUSTRY:
        return <AreaIndustryConfig tenantId={tenantId}/>;
      default:
        return '';
    }
  };

  return (
    <div>
      <V2Container
        style={{ height: mainHeight }}
        extraContent={{
          top: <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={[
              {
                label: '商场初筛',
                key: enumTab.MARKET_PRE_SCREENS,
              },
              {
                label: '所属行业',
                key: enumTab.AREA_INDUSTRY,
              },
            ]}
            defaultActiveKey='record' />
        }}>
        {
          tabChildCom()
        }
      </V2Container>
    </div>
  );
};

export default IndustryInfomationConfig;
