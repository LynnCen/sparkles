import V2Container from '@/common/components/Data/V2Container';
import cs from 'classnames';
import List from './components/List';
import { useState } from 'react';
import Filter from './components/Filter';
import { favorPage } from '@/common/api/areacollect';
import { useNavigate } from 'react-router-dom';
import { modelCircle } from '@/common/api/recommend';
const Tap = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<any>({});

  const loadData = async (params) => {
    const result: any = await favorPage(params);
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };

  // 解析排名
  const parseInd = async (reportId, clusterId) => {
    const res = await modelCircle({ id: reportId });
    if (res && Array.isArray(res.items) && res.items.length) {
      for (let i = 0; i < res.items.length; i++) {
        if (res.items[i].clusterId === clusterId) {
          return i;
        }
      }
    }
    return 0;
  };

  const viewDetail = (record) => {
    parseInd(record.reportId, record.clusterId).then((ind) => {
      navigate(`/recommend/detail?id=${record.reportId}&ind=${ind}`);
    });
  };
  const onSearch = (values: any) => {
    setParams({ ...values });
  };

  return (
    <div className={cs('bg-fff', 'pd-20')}>
      <V2Container
        /*
          减去高度设置120 = 顶部条高度48 + main上下padding各16 + container上下padding各20；
          减去高度大于这个值，页面底部留白大于预期；
          减去高度小于这个值，页面底部留白小于预期，且页面右侧会出现不必要的滚动条；
        */
        style={{ height: 'calc(100vh - 120px)' }}
        extraContent={{
          top: <Filter onSearch={onSearch} />,
        }}
      >
        <List params={params} loadData={loadData} openDetail={viewDetail} />
      </V2Container>
    </div>
  );
};

export default Tap;
