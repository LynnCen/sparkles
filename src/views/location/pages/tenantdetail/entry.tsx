
import { urlParams } from '@lhb/func';
import { Button, Spin, Tabs, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { enumTab } from './ts-config';
import NotFound from '@/common/components/NotFound';
import styles from './entry.module.less';
import { useMethods } from '@lhb/hook';
import { tenantDetailById } from '@/common/api/location';
import DetailItem from '@/common/components/Detail/DetailItem/DetailItem';
import Filter from './components/Filter';
import FootprintingList from './components/FootprintingList';
import BenefitModal from './components/BenefitModal';
import RechargePoint from './components/RechargePoint';
import MapRelated from './components/MapRelated';
import ModelRelated from './components/ModelRelated';
import StoreRelated from './components/StoreRelated';
import FranchiseeRelated from './components/FranchiseeRelated';
import StoreOperation from './components/StoreOperation';
import V2Container from '@/common/components/Data/V2Container';
import IndustryInfomationConfig from './components/IndustryInfomationConfig';
import HomeConfig from './components/HomeConfig';

const { Title } = Typography;
const Tenantdetail: FC<any> = () => {
  const tenantId: string | number = urlParams(location.search)?.id || '';
  const [data, setData] = useState<{ detail: any; loading: boolean }>({
    detail: {},
    loading: true
  });
  const [filter, setFilter] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(enumTab.MAP_RELATED);

  // 租户详情
  const getTenantDetail = async () => {
    if (!tenantId) return;
    const res = await tenantDetailById({ tenantId });
    setData({ detail: res, loading: false });
  };
  useEffect(() => {
    getTenantDetail();
    // eslint-disable-next-line
  }, [tenantId]);
  const {
    onSearch,
    onOpenModal,
    onCloseModal,
    refresh
  } = useMethods({
    onSearch: (values) => {
      setFilter({ ...values });
    },
    onCloseModal: () => {
      setVisible(false);
    },
    onOpenModal: () => {
      setVisible(true);
    },
    refresh: () => {
      getTenantDetail();
      onSearch({ ...filter });
      setActiveTab(enumTab.TREADRECORD);
    }
  });

  const tabChildCom = () => {
    switch (activeTab) {
      case enumTab.TREADRECORD:
        return <FootprintingList
          params={filter}
          tenantId={tenantId}
          onSearch={onSearch} />;
      case enumTab.RECHARGEPOINT:
        return <RechargePoint
          active={activeTab}
          tenantId={tenantId}/>;
      case enumTab.MAP_RELATED:
        return <MapRelated tenantId={tenantId}/>;
      case enumTab.MODEL_RELATED:
        return <ModelRelated tenantId={tenantId}/>;
      case enumTab.STORE_RELATED:
        return <StoreRelated tenantId={tenantId}/>;
      case enumTab.FRANCHISEE_RELATED:
        return <FranchiseeRelated tenantId={tenantId}/>;
      case enumTab.STORE_OPERATION:
        return <StoreOperation tenantId={tenantId}/>;
      case enumTab.INDUSTRY_INFORMATION: // 行业信息
        return <IndustryInfomationConfig tenantId={tenantId}/>;
      case enumTab.HOME_CONFIG: // 首页配置
        return <HomeConfig tenantId={tenantId as number}/>;

      default:
        return '';
    }
  };

  return (
    <Spin spinning={data.loading}>
      <div className={styles.container}>
        {tenantId ? (
          <V2Container
            style={{ height: `calc(100vh - 120px)` }}
            extraContent={{
              // {/* 搜索栏 */}
              top: <>
                <Title level={4}>
                  {data.detail.enterprise}【{data.detail.name}】
                  <Button type='primary' onClick={onOpenModal}>发放权益</Button>
                </Title>
                {data.detail.benefits?.map(benefit =>
                  <DetailItem key={benefit.benefitTypeName} label={benefit.benefitTypeName} children={benefit.benefitAmount} />)}
                <Tabs
                  activeKey={activeTab}
                  onChange={(key) => setActiveTab(key)}
                  items={[
                    {
                      label: '地图相关配置',
                      key: enumTab.MAP_RELATED,
                    },
                    {
                      label: '模型相关配置',
                      key: enumTab.MODEL_RELATED,
                    },
                    {
                      label: '拓店管理相关配置',
                      key: enumTab.STORE_RELATED,
                    },
                    {
                      label: '加盟商配置',
                      key: enumTab.FRANCHISEE_RELATED,
                    },
                    {
                      label: '门店运营配置',
                      key: enumTab.STORE_OPERATION,
                    },
                    {
                      label: '行业信息',
                      key: enumTab.INDUSTRY_INFORMATION,
                    },
                    {
                      label: '踩点记录',
                      key: enumTab.TREADRECORD,
                    },
                    {
                      label: '首页配置',
                      key: enumTab.HOME_CONFIG,
                    },
                    {
                      label: '企点使用记录',
                      key: enumTab.RECHARGEPOINT,
                    },
                  ]}
                  defaultActiveKey='record' />
                {
                  activeTab === enumTab.TREADRECORD && <Filter onSearch={onSearch} />
                }
              </>
            }}
          >
            {
              tabChildCom()
            }
          </V2Container>
        ) : (
          <NotFound text='暂无数据' />
        )}
        <BenefitModal
          visible={visible}
          refresh={refresh}
          tenantId={tenantId}
          onCloseModal={onCloseModal}
        />
      </div>
    </Spin>
  );
};

export default Tenantdetail;


