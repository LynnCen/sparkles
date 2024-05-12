/**
 * @Description 模型相关
 */
import { urlParams } from '@lhb/func';
import { Tabs } from 'antd';
import { FC, useState } from 'react';
import { enumTab } from '../../ts-config';
import SurroundConfig from '../Surround';
import RecommendConfig from './components/RecommendConfig';
import PlanModelConfig from '../PlanModelConfig';
import LocationMapModel from '../LocationMapModel';
import V2Container from '@/common/components/Data/V2Container';

const ModelRelated: FC<any> = ({ mainHeight }) => {
  const tenantId: string | number = urlParams(location.search)?.id || '';
  const [activeTab, setActiveTab] = useState<string>(enumTab.MODEL_RECOMMEND_CONFIG);

  console.log('ModelRelated mainHeight', mainHeight);

  const tabChildCom = () => {
    switch (activeTab) {
      case enumTab.MODEL_RECOMMEND_CONFIG:
        return <RecommendConfig tenantId={tenantId}/>;
      case enumTab.SURROUND:
        return <SurroundConfig tenantId={tenantId}/>;
      case enumTab.PLANNING_MODEL_CONFIGURATION:
        return <PlanModelConfig tenantId={tenantId}/>;
      case enumTab.LOCATION_MAP_MODEL:
        return <LocationMapModel tenantId={tenantId}/>;
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
                label: '开店区域推荐模型配置',
                key: enumTab.MODEL_RECOMMEND_CONFIG,
              },
              {
                label: '周边信息模板配置',
                key: enumTab.SURROUND,
              },
              {
                label: '规划模型',
                key: enumTab.PLANNING_MODEL_CONFIGURATION,
              },
              {
                label: '选址地图模型',
                key: enumTab.LOCATION_MAP_MODEL,
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

export default ModelRelated;
