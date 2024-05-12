/**
 * 测评点位报表
 */
import { FC, useState } from 'react';
import styles from './entry.module.less';
import cs from 'classnames';
import { Form } from 'antd';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import Filter from './components/Filter';
import { useMethods } from '@lhb/hook';
import { deepCopy } from '@lhb/func';
import { postYNEvaluationPoint } from '@/common/api/fishtogether';

const EvaluationReport: FC<any> = () => {
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
      const res = await postYNEvaluationPoint(_params);
      return { dataSource: res.objectList, count: res.totalNum };
    }
  });

  const defaultColumns = [
    { title: '点位名称', key: 'pointName', dragChecked: true },
    { title: '点位地址', key: 'address', dragChecked: true },
    { title: '省份', key: 'provinceName', dragChecked: true },
    { title: '城市', key: 'cityName', dragChecked: true },
    { title: '行政区', key: 'districtName', dragChecked: true },
    { title: '授权号', key: 'authNo', width: 100, dragChecked: true },
    { title: '接单日期', key: 'orderDate', width: 100, dragChecked: true },
    { title: '对接开发经理', key: 'developer', width: 120, dragChecked: true },
    { title: '所属开发部', key: 'department', width: 100, dragChecked: true },
    { title: '点位状态', key: 'status', width: 120, dragChecked: true },
    { title: '创建时间早于测评点位的机会点名称', key: 'point', width: 250, dragChecked: true },
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
        emptyRender
        tableSortModule='consoleFishTogetherEvaluationReport1000'
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 - 56 }}
      />
    </V2Container>
  );
};

export default EvaluationReport;
