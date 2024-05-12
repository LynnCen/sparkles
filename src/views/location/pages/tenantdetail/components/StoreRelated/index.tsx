/**
 * @Description 拓店管理相关配置
 */

import { urlParams } from '@lhb/func';
import { FC, useState } from 'react';
import { enumTab } from '../../ts-config';
import StoreTemplateConfig from '../StoreTemplateConfig/index';
import ChancePointConfig from '../ChancePointStatusConfig';
import ApprovalProcessConfig from '../ApprovalProcessConfig';
import ChancePointTable from '../ChancePointTable';
import ChancePointExport from '../ChancePointExport';
import TaskType from '../TaskType';
import V2Container from '@/common/components/Data/V2Container';
import V2Tabs from '@/common/components/Data/V2Tabs';
import { Button, Space } from 'antd';
import ChangeTemplate from '@/views/flowEngine/pages/index/components/ChangeTemplate';
import DataMigrationConfig from '../DataMigrationConfig';
import StoreStatusRenameConfig from '../StoreStatusRenameConfig';

const StoreRelated: FC<any> = ({ mainHeight }) => {
  const tenantId: string | number = urlParams(location.search)?.id || '';
  const [activeTab, setActiveTab] = useState<string>(enumTab.TASK_TYPE);
  const [templateModalData, setTemplateModalData] = useState<boolean>(false); // 选择模板弹窗

  const tabChildCom = () => {
    switch (activeTab) {
      case enumTab.STORE_TEMPLATE_IMPORT:
        return <StoreTemplateConfig tenantId={tenantId} />;
      case enumTab.CHANCEPOINT_STATUS_CONFIG:
        return <ChancePointConfig tenantId={tenantId} mainHeight={mainHeight} />;
      case enumTab.STORE_STATUS_RENAME_CONFIG:
        return <StoreStatusRenameConfig tenantId={tenantId} mainHeight={mainHeight} />;
      case enumTab.APPROVAL_PROCESS:
        return <ApprovalProcessConfig tenantId={tenantId} mainHeight={mainHeight} />;
      case enumTab.CHANCEPOINT_TABLE_TITLE:
        return <ChancePointTable tenantId={tenantId} />;
      case enumTab.CHANCEPOINT_EXPORT:
        return <ChancePointExport tenantId={tenantId} />;
      case enumTab.TASK_TYPE:
        return <TaskType tenantId={tenantId} mainHeight={mainHeight} />;
      case enumTab.DATA_MIGRATION:
        return <DataMigrationConfig tenantId={tenantId} mainHeight={mainHeight} />;
      default:
        return '';
    }
  };

  const tabBarExtraContent1 = {
    right: (
      <Space>
        {activeTab === enumTab.APPROVAL_PROCESS && (
          <Button type='primary' onClick={() => setTemplateModalData(true)}>
            新建审批流
          </Button>
        )}
      </Space>
    ),
  };

  return (
    <div>
      <V2Container
        style={{ height: mainHeight }}
        extraContent={{
          top: (
            <V2Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              items={[
                {
                  label: '拓店任务模板配置',
                  key: enumTab.TASK_TYPE,
                },
                {
                  label: '机会点模板配置',
                  key: enumTab.STORE_TEMPLATE_IMPORT,
                },
                {
                  label: '机会点状态配置',
                  key: enumTab.CHANCEPOINT_STATUS_CONFIG,
                },
                {
                  label: '状态重命名',
                  key: enumTab.STORE_STATUS_RENAME_CONFIG,
                },
                {
                  label: '流程相关配置',
                  key: enumTab.APPROVAL_PROCESS,
                },
                {
                  label: 'PC端机会点列表配置',
                  key: enumTab.CHANCEPOINT_TABLE_TITLE,
                },
                {
                  label: '机会点导出模版配置',
                  key: enumTab.CHANCEPOINT_EXPORT,
                },
                {
                  label: '数据迁移配置',
                  key: enumTab.DATA_MIGRATION,
                },
              ]}
              defaultActiveKey='record'
              tabBarExtraContent={tabBarExtraContent1}
            />
          ),
        }}
      >
        {tabChildCom()}
      </V2Container>
      <ChangeTemplate
        isDemo={true}
        propsTenantId={tenantId}
        templateModalData={templateModalData}
        setTemplateModalData={setTemplateModalData}
      />
    </div>
  );
};

export default StoreRelated;
