import { brandList } from '@/common/api/brand';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { PlusOutlined } from '@ant-design/icons';
import { FC, useMemo, useState } from 'react';
import { BrandModalInfo } from '../ts-config';
import BrandTable from './BrandTable';
import Filters from './Filters';
import BrandModal from './Modal/BrandModal';
import { refactorPermissions } from '@lhb/func';

const TabContent: FC<any> = ({ brandType }) => {
  const [brandModalInfo, setBrandModalInfo] = useState<BrandModalInfo>({ visible: false });
  const [params, setParams] = useState({ type: brandType });
  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.icon = <PlusOutlined />;
      }
      return res;
    });
  }, [operateExtra]);
  const { loadData, onSearch, ...methods } = useMethods({
    loadData: async (params: any) => {
      console.log('params', params);
      const result = await brandList(params);
      if (!operateList.length) {
        setOperateExtra(result?.meta?.permissions || []);
      }
      return {
        dataSource: result.objectList,
        count: result.totalNum,
      };
    },
    onSearch(filter: any) {
      setParams({ ...params, ...filter });
    },
    handleCreate() {
      setBrandModalInfo({ visible: true });
    },
  });

  return (
    <>
      <Filters setBrandModalInfo={setBrandModalInfo} onSearch={onSearch} />
      <div style={{ marginBottom: '10px' }}>
        <Operate operateList={operateList} onClick={(btn) => methods[btn.func](params)} />
      </div>
      <BrandTable
        loadData={loadData}
        brandModalInfo={brandModalInfo}
        setBrandModalInfo={setBrandModalInfo}
        onSearch={onSearch}
        params={params}
      />
      <BrandModal brandModalInfo={brandModalInfo} setBrandModalInfo={setBrandModalInfo} onSearch={onSearch} />
    </>
  );
};

export default TabContent;
