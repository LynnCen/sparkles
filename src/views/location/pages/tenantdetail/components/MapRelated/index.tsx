
import { urlParams } from '@lhb/func';
import { Tabs } from 'antd';
import { FC, useState } from 'react';
import { enumTab } from '../../ts-config';
import MapConfig from '../MapConfig';
import StoreInfoList from '../StoreInfoImport/StoreInfoList';
import TemplateList from '../CircleTemplate/TemplateList';
import BrandPoint from '../BrandPoint';
import V2Container from '@/common/components/Data/V2Container';
import ShopDataImport from '../ShopDataImport';

const MapRelated: FC<any> = ({ mainHeight }) => {
  const tenantId: string | number = urlParams(location.search)?.id || '';
  const [activeTab, setActiveTab] = useState<string>(enumTab.INDUSTRYMAPCONFIG);

  console.log('MapRelated mainHeight', mainHeight);

  const tabChildCom = () => {
    switch (activeTab) {
      case enumTab.INDUSTRYMAPCONFIG:
        return <MapConfig tenantId={tenantId}/>;
      case enumTab.INDUSTRY_MAP_CIRCLET_CONFIG:
        return <TemplateList tenantId={tenantId} mainHeight={mainHeight}/>;
      case enumTab.BRANDPOINT:
        return <BrandPoint tenantId={tenantId}/>;
      case enumTab.STORE_INFO_IMPORT:
        return <StoreInfoList tenantId={tenantId}/>;
      case enumTab.SHOP_DATA_IMPORT:
        return <ShopDataImport tenantId={tenantId}/>;
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
                label: '行业地图相关配置',
                key: enumTab.INDUSTRYMAPCONFIG,
              },
              {
                label: '行业地图商圈信息模板配置',
                key: enumTab.INDUSTRY_MAP_CIRCLET_CONFIG,
              },
              {
                label: '品牌网点数据配置',
                key: enumTab.BRANDPOINT,
              },
              {
                label: '门店信息导入',
                key: enumTab.STORE_INFO_IMPORT,
              },
              {
                label: '门店数据导入',
                key: enumTab.SHOP_DATA_IMPORT,
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

export default MapRelated;
