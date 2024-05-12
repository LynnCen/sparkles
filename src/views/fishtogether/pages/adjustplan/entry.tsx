// 计划调整
import { FC, useEffect, useState } from 'react';
import AreaOverview from './components/AreaOverview';
import ExportModule from './components/ExportModule';
import { Spin } from 'antd';
import { get } from '@/common/request';

const Adjustplan: FC<any> = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<any>([]);

  const loadData = async () => {
    // https://yapi.lanhanba.com/project/497/interface/api/51463
    const result: any = await get('/yn/franchisee/plan/list', {}, {
      isMock: false,
      mockId: 497,
      mockSuffix: '/api',
      isZeus: true,
    });
    setData(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSearch = () => {
    loadData();
  };

  return (
    <Spin spinning={loading}>
      <AreaOverview data={data}/>
      <ExportModule setLoading={setLoading} onSearch={onSearch} />
    </Spin>
  );
};

export default Adjustplan;
