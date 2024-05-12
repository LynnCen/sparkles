/**
 * 落位记录明细表
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import { FC, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
// import { data } from './ts-config';
import { useMethods } from '@lhb/hook';
import { Form } from 'antd';
import { deepCopy, isArray } from '@lhb/func';
import dayjs from 'dayjs';
import { importPoint, postYNTaskPoint } from '@/common/api/fishtogether';
import ImportModal from '@/common/components/business/ImportModal';

const LandedPositionReport: FC<any> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [searchForm] = Form.useForm();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  const [permissionsArr, setPermissionsArr] = useState<any[]>([]);

  const methods = useMethods({
    onSearch(data) {
      // 为了让查询动态化
      const _params = searchForm.getFieldsValue();
      setParams({
        ..._params,
        ...data,
      });
    },
    async loadData(params) {
      const _params = deepCopy(params);
      if (_params.ssq?.length) {
        _params.provinceId = _params.ssq[0];
        _params.cityId = _params.ssq[1];
        _params.districtId = _params.ssq[2];
      }
      _params.ssq = undefined;
      if (_params.orderTime?.length) {
        _params.orderStart = dayjs(_params.orderTime[0]).format('YYYY-MM-DD');
        _params.orderEnd = dayjs(_params.orderTime[1]).format('YYYY-MM-DD');
      }
      _params.orderTime = undefined;
      const res = await postYNTaskPoint(_params);
      const { meta } = res || {};
      const { permissions } = meta || {};
      // 只存一次
      if (isArray(permissions) && permissions.length && !permissionsArr.length) {
        setPermissionsArr(permissions);
      }
      return { dataSource: res.objectList, count: res.totalNum };
    },
  });

  const defaultColumns = [
    { title: '授权号', key: 'authNo', fixed: true, width: 100, dragDisabled: true, dragChecked: true },
    { title: '城市线级', key: 'cityTier', fixed: true, width: 130, dragDisabled: true, dragChecked: true },
    { title: '所属分公司', key: 'department', width: 130, dragChecked: true },
    { title: '省份', key: 'province', width: 130, dragChecked: true },
    { title: '城市', key: 'city', width: 130, dragChecked: true },
    { title: '行政区', key: 'district', width: 130, dragChecked: true },
    { title: '客户名称', key: 'name', width: 220, dragChecked: true },
    { title: '是否老客多店', key: 'multiType', width: 220, dragChecked: true },
    { title: '加盟费', key: 'franchiseeAmount', width: 130, dragChecked: true },
    { title: '加盟商电话', key: 'contactInfo', width: 130, dragChecked: true },
    { title: '加盟日期', key: 'franchiseeDate', width: 130, dragChecked: true },
    { title: '接单日期', key: 'orderDate', width: 130, dragChecked: true },
    { title: '账龄（月）', key: 'month', width: 100, dragChecked: true },
    { title: '账龄（天）', key: 'day', width: 100, dragChecked: true },
    { title: '初始类别', key: 'customerType', width: 100, dragChecked: true },
    { title: '项目提报店名', key: 'pointName', width: 150, dragChecked: true },
    { title: '点位/店铺状态', key: 'status', width: 170, dragChecked: true },
    { title: '开店时间', key: 'openTime', width: 130, dragChecked: true },
    { title: '价格带', key: 'price', width: 130, dragChecked: true },
    { title: '闭店时间', key: 'closeTime', width: 130, dragChecked: true },
    { title: '营业额实际达成（91-180天）', key: 'saleAmount', dragChecked: true },
    { title: '新址提报日期', key: 'reportDate', width: 190, dragChecked: true },
    { title: '选址类别', key: 'typeName', width: 100, dragChecked: true },
    { title: '预估流水', key: 'predictSaleAmount', width: 100, dragChecked: true },
    { title: '开发人员', key: 'developer', width: 100, dragChecked: true },
    { title: '店型', key: 'shopTypeName', width: 100, dragChecked: true },
    { title: '商圈类型', key: 'businessTypeName', width: 150, dragChecked: true },
    { title: '租赁年限', key: 'rentYear', width: 100, dragChecked: true },
    { title: '排他协议', key: 'exclusivityClause', width: 220, dragChecked: true },
    { title: '楼层', key: 'floor', width: 130, dragChecked: true },
    { title: '月租金+物业费（首年）', key: 'firstRent', width: 180, dragChecked: true },
    { title: '月租金+物业费（次年）', key: 'secondRent', width: 180, dragChecked: true },
    { title: '月租金+物业费（第三年）', key: 'thirdRent', dragChecked: true },
    { title: '递增', key: 'rentIncrease', width: 100, dragChecked: true },
    { title: '签约面积', key: 'area', width: 100, dragChecked: true },
    { title: '使用面积', key: 'useArea', width: 100, dragChecked: true },
    { title: '租售比', key: 'rentSaleRate', width: 130, dragChecked: true },
    { title: '坪效', key: 'flatEffect', width: 130, dragChecked: true },
    { title: '利润率', key: 'profit', width: 100, dragChecked: true },
    { title: '付款方式', key: 'payMethod', width: 100, dragChecked: true },
    { title: '签约房租押金', key: 'deposit', width: 110, dragChecked: true },
    { title: '首期租约起始时间', key: 'rentStart', width: 160, dragChecked: true },
    { title: '租约到期时间', key: 'rentEnd', width: 130, dragChecked: true },
    { title: '免租期（装修+经营）', key: 'freeRent', width: 160, dragChecked: true },
    { title: '现有可用电量', key: 'hasElectric', width: 110, dragChecked: true },
    { title: '是否可增容', key: 'needPower', width: 100, dragChecked: true },
    { title: '筹备开始时间', key: 'backTime', width: 180, dragChecked: true },
    { title: '回合同日期', key: 'contractDate', width: 180, dragChecked: true },
    { title: '特殊条款', key: 'customerDescription', dragChecked: true },
    { title: '问题客户', key: 'customerQuestion', dragChecked: true },
    { title: '备注', key: 'remark', dragChecked: true },
  ];
  return (
    <V2Container
      className={cs(styles.container, 'bg-fff', 'pd-20')}
      style={{ height: 'calc(100vh - 88px)' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: <Filter
          onSearch={methods.onSearch}
          searchForm={searchForm}
          permissions={permissionsArr}
          setVisible={setVisible}/>,
      }}
    >
      <V2Table
        onFetch={methods.loadData}
        filters={params}
        defaultColumns={defaultColumns}
        rowKey='authNo'
        emptyRender
        tableSortModule='consoleFishTogetherLandedPosition1000'
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 - 56 }}
      />
      <ImportModal
        visible={visible}
        closeHandle={() => {
          setVisible(false);
        }}
        title='导入落位明细数据'
        fileName='落位明细表导入模板.xlsx'
        importFile={importPoint}
      />
    </V2Container>
  );
};

export default LandedPositionReport;
