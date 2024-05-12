/**
 * @Description 入驻品牌
 */
import { getPoiList } from '@/common/api/car';
import { isArray, urlParams } from '@lhb/func';
import { Spin, Table, Tabs } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';

const renderTabBar:any = (props, DefaultTabBar) => {
  return (<div>
    <DefaultTabBar {...props}/>
  </div>
  );
};

const EnterBrand:FC<any> = () => {
  const { tenantPlaceId } = urlParams(location.search) as any as {
    tenantPlaceId: number;
  };
  const [data, setData] = useState<any>([]);
  const [activeKey, setActiveKey] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const getData = async() => {
    setLoading(true);
    const data = await getPoiList({ placeId: +tenantPlaceId }).finally(() => {
      setLoading(false);
    });
    setData(data);
    // 默认选中第一个tabs
    isArray(data) && data.length && setActiveKey(data[0]?.id);
  };

  const columns: any = [
    {
      title: '序号',
      width: 150,
      render: (val, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ];


  const items:any = useMemo(() => {
    const res:any = [];
    data.map((item) => {
      res.push({
        key: item.id,
        label: `${item.industry}(${item.count})`
      });
    });
    return res;
  }, [data]);

  const dataSource:any = useMemo(() => {
    return data.filter((item) => +item.id === +activeKey)[0]?.pois;
  }, [activeKey]);

  const onChange = (key) => {
    setActiveKey(key);
  };

  useEffect(() => {
    getData();
  }, []);

  return <Spin spinning={loading}>
    {
      isArray(data) && data.length
        ? <Tabs
          onChange={onChange}
          type='card'
          items={items}
          size='small'
          renderTabBar={renderTabBar}
        />
        : null
    }
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey='poiId'
      pagination={false}
      className='mb-34'/>
  </Spin>;
};
export default EnterBrand;
