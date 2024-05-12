import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { enumTab } from '../../ts-config';
import { Form } from 'antd';
import { tenantCheckSpotRecordPagesByKey } from '@/common/api/location';
import dayjs from 'dayjs';
import Search from './components/Search';
import V2Table from '@/common/components/Data/V2Table';
import V2Container from '@/common/components/Data/V2Container';

const defaultColumns: any[] = [
  { key: 'createdAt', title: '交易时间', dragChecked: true, dragDisabled: false },
  { key: 'tradeTypeName', title: '交易类型', dragChecked: true, dragDisabled: false },
  { key: 'accountName', title: '操作人', dragChecked: true, dragDisabled: false },
  { key: 'grantTypeName', title: '详细内容', dragChecked: true, dragDisabled: false },
  { key: 'tradeValue', title: '企点', dragChecked: true, dragDisabled: false },
  { key: 'tradeNo', title: '交易流水号', dragChecked: true, dragDisabled: false },
];

const RechargePoint: FC<any> = ({
  active,
  tenantId,
  mainHeight
}) => {
  const [innerMainHeight, setInnerMainHeight] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<any>({}); // 搜索参数
  const wrapperRref: any = useRef(null); // 容器dom
  const [searchForm] = Form.useForm();

  useEffect(() => {
    if (active === enumTab.RECHARGEPOINT) {
      setSearchParams({}); // 重置
      searchForm.resetFields();
    }
  }, [active]);

  const onSearch = (values: any) => {
    setSearchParams({ ...values });
  };

  const loadData = async (params: any) => {
    const formatParams: any = {
      page: params.page,
      size: params.size,
      tenantId,
      benefitType: 2
    };
    params.tradeType && (formatParams.tradeType = params.tradeType);
    if (params.date) {
      formatParams.createdAtMin = dayjs(params.date[0]).format('YYYY-MM-DD');
      formatParams.createdAtMax = dayjs(params.date[1]).format('YYYY-MM-DD');
    };
    const { objectList, totalNum } = await tenantCheckSpotRecordPagesByKey(formatParams);
    return {
      dataSource: objectList,
      count: totalNum
    };
  };
  return (
    <div ref={wrapperRref}>
      <V2Container
        style={{ height: mainHeight }}
        emitMainHeight={(h) => setInnerMainHeight(h)}
        extraContent={{
          top: <Search onSearch={onSearch} form={searchForm}/>
        }}
      >
        {/* Table组件 */}
        <V2Table
          rowKey='tradeNo'
          filters={searchParams}
          // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
          scroll={{ y: innerMainHeight - 48 - 42 }}
          defaultColumns={defaultColumns}
          tableSortModule='locSAASLocationTenantdetailPoints'
          onFetch={loadData}
        />
      </V2Container>
    </div>
  );
};

export default RechargePoint;
