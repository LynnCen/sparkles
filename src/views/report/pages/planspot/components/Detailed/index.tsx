/**
 * @Description 集客点报表-明细
 */
import { FC, useMemo, useState } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import Filter from './Filter';
import { isArray } from '@lhb/func';
import { detailedList, getPlanSpotDetailPage } from '@/common/api/expandStore/planspot';
import { defaultColumns, planSpotColumns } from './ts-config';

interface DetailedProps {
  mainHeight: any;
  style?: any;
  setDetailedParams: Function;
  type?:string
}

const Detailed: FC<DetailedProps> = ({
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  style,
  setDetailedParams,
  type, // planSpot 集客点 不传的时候默认为明细查询table
}) => {
  const [filters, setFilters] = useState<any>({});

  /**
   * @description 点击搜索框模糊查询
   * @param fields 搜索框参数
   */
  const onSearch = (value) => {
    setFilters(value);
  };

  /**
   * @description 获取加载table表格数据。该函数依赖filters变化自动触发
   * @param params filters和搜索框参数
   * @return table数据
   */
  const loadData = async (params) => {
    // 初始请求时没选择必填参数分公司，不能请求
    if (!params || !params.branchCompanyId) return;

    const { objectList, totalNum } = type === 'planSpot'
      ? await getPlanSpotDetailPage({ ...params })
      : await detailedList({ ...params });
    return {
      dataSource: isArray(objectList) ? objectList : [],
      count: totalNum,
    };
  };

  const typeColumns = useMemo(() => {
    // 集客点列表表头
    if (type === 'planSpot') {
      return planSpotColumns;
    }
    return defaultColumns;
  }, [type]);

  return (
    <div style={style || {}}>
      <Filter
        type={type}
        onSearch={onSearch}
        setDetailedParams={setDetailedParams}/>
      <V2Table
        defaultColumns={typeColumns}
        onFetch={loadData}
        hideColumnPlaceholder={true}
        filters={filters}
        rowKey='id'
        // 64是分页模块的总大小， 42是table头部， 52是筛选条, 筛选条上间距
        scroll={{ y: mainHeight - 64 - 42 - 52 - 20 }}
        pageSize={50}
        emptyRender
      />
    </div>
  );
};

export default Detailed;
