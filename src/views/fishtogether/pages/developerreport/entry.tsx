/**
 * 开发人员提报报表
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import { FC, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { Form } from 'antd';
import { deepCopy } from '@lhb/func';
import dayjs from 'dayjs';
import { postYNEvaluationReport } from '@/common/api/fishtogether';

const DeveloperReport: FC<any> = () => {
  const [searchForm] = Form.useForm();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
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
      if (_params.contractTime?.length) {
        _params.contractStart = dayjs(_params.contractTime[0]).format('YYYY-MM-DD');
        _params.contractEnd = dayjs(_params.contractTime[1]).format('YYYY-MM-DD');
      }
      _params.contractTime = undefined;
      const res = await postYNEvaluationReport(_params);
      return { dataSource: res.objectList, count: res.totalNum };
    }
  });

  const defaultColumns = [
    { title: '回合同日期', key: 'contractDate', width: 100, dragChecked: true },
    { title: '提报日期', key: 'reportDate', width: 100, dragChecked: true },
    { title: '姓名', key: 'name', width: 150, dragChecked: true },
    { title: '所属开发部', key: 'department', width: 150, dragChecked: true },
    { title: '职务', key: 'positionName', width: 100, dragChecked: true },
    { title: '接单日期', key: 'orderDate', width: 100, dragChecked: true },
    { title: '选址城市', key: 'city', width: 150, dragChecked: true },
    { title: '城市线级', key: 'cityTier', width: 150, dragChecked: true },
    { title: '授权号', key: 'authNo', width: 150, dragChecked: true },
    { title: '加盟商名称', key: 'franchiseeName', width: 200, dragChecked: true },
    { title: '店型', key: 'shopTypeName', width: 100, dragChecked: true },
    { title: '加盟日期', key: 'franchiseeDate', width: 100, dragChecked: true },
    { title: '加盟费', key: 'franchiseeAmount', width: 150, dragChecked: true },
    { title: '预计日均实收', key: 'inCome', width: 150, dragChecked: true },
    { title: '月房租', key: 'rent', width: 150, dragChecked: true },
    { title: '租售比', key: 'rentSaleRate', width: 100, dragChecked: true },
    { title: '合同签约年限', key: 'contractYear', width: 120, dragChecked: true },
    { title: '选址类别', key: 'typeName', width: 100, dragChecked: true },
    { title: '选址费缴纳情况', key: 'feeMark', width: 130, dragChecked: true },
  ];
  return (
    <V2Container
      className={cs(styles.container, 'bg-fff', 'pd-20')}
      style={{ height: 'calc(100vh - 88px)' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: <Filter onSearch={methods.onSearch} searchForm={searchForm} />,
      }}
    >
      <V2Table
        onFetch={methods.loadData}
        filters={params}
        defaultColumns={defaultColumns}
        rowKey='authNo'
        hideColumnPlaceholder
        tableSortModule='consoleFishTogetherDeveloperReport1000'
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 - 56 }}
      />
    </V2Container>
  );
};

export default DeveloperReport;
