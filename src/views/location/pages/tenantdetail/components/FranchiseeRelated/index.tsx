/**
 * @Description 加盟商配置
 */

import { FC, useState } from 'react';
import { enumTab } from '../../ts-config';
import FranchiseeTempConfig from '../FranchiseeTempConfig/index';
import FranchiseeThead from '../FranchiseeThead';
import V2Container from '@/common/components/Data/V2Container';
import V2Tabs from '@/common/components/Data/V2Tabs';

const FranchiseeRelated: FC<any> = ({ mainHeight, tenantId }) => {
  const [activeTab, setActiveTab] = useState<string>(enumTab.FRANCHISEE_TEMPLATE);

  const tabChildCom = () => {
    switch (activeTab) {
      case enumTab.FRANCHISEE_TEMPLATE:
        return <FranchiseeTempConfig tenantId={tenantId}/>;
      case enumTab.FRANCHISEE_TABLE_TITLE:
        // 加盟商列表表头配置
        return <FranchiseeThead tenantId={tenantId}/>;
      default:
        return <></>;
    }
  };

  return (
    <div>
      <V2Container
        style={{ height: mainHeight }}
        extraContent={{
          top: <V2Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={[
              {
                label: '加盟商模板配置',
                key: enumTab.FRANCHISEE_TEMPLATE,
              },
              {
                label: '加盟商列表表头配置',
                key: enumTab.FRANCHISEE_TABLE_TITLE,
              },
            ]}/>
        }}>
        {
          tabChildCom()
        }
      </V2Container>
    </div>
  );
};

export default FranchiseeRelated;
