/**
 * 个人绩效报表
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
import { postYNPerson } from '@/common/api/fishtogether';

const IndividualKPIReport: FC<any> = () => {
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
      if (_params.month?.length) {
        _params.monthStart = dayjs(_params.month[0]).format('YYYY-MM');
        _params.monthEnd = dayjs(_params.month[1]).format('YYYY-MM');
      }
      _params.month = undefined;
      const res = await postYNPerson(_params);
      return { dataSource: res.objectList, count: res.totalNum };
    }
  });

  const defaultColumns = [
    { title: '开发部', key: 'departmentName', width: 100, dragChecked: true },
    { title: '姓名', key: 'userName', width: 100, dragChecked: true },
    { title: '落位计划完成率', key: 'contractPlanRate', width: 130, dragChecked: true },
    { title: '落位', key: 'contractAgree',
      children: [
        { title: '总数', key: 'contractAgreeCount', width: 100, dragChecked: true },
        { title: '签约率', key: 'contractAgreeRate', width: 100, dragChecked: true },
      ],
    },
    {
      title: '评估通过',
      key: 'evaluationAgree',
      children: [
        { title: '总数', key: 'evaluationAgreeCount', width: 100, dragChecked: true },
        { title: '通过率', key: 'evaluationAgreeRate', width: 100, dragChecked: true },
      ],
    },
    { title: '评估上报', key: 'evaluationCount', width: 100, dragChecked: true },
    { title: '新增加盟商', key: 'franchiseeCount', width: 100, dragChecked: true },
    { title: '新增点位数', key: 'pointAllCount', width: 100, dragChecked: true },
    { title: '平均落位周期', key: 'avgContractAgreePeriod', width: 110, dragChecked: true },
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
        rowKey='id'
        hideColumnPlaceholder
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 - 56 }}
      />
    </V2Container>
  );
};

export default IndividualKPIReport;
