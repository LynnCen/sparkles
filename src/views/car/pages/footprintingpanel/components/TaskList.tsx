import { FC } from 'react';
import Table from '@/common/components/FilterTable';
import { post } from '@/common/request/index';
import { useClientSize } from '@lhb/hook';
import { valueFormat } from '@/common/utils/ways';
import { Typography } from 'antd';
// import { downloadFile } from '@lhb/func';

const { Paragraph, Link } = Typography;
const defaultRender = { width: 130, render: (value: number | string) => valueFormat(value) };

const TaskList: FC<any> = ({ searchParams, refreshCurrent = false }) => {
  const scrollHeight = useClientSize().height - 260;
  const columns = [
    {
      title: '点位名称',
      key: 'shopName',
      width: 100,
      render: (value: string, record) =>
        record.id ? (
          <Paragraph style={{ width: 130 }} ellipsis={{ rows: 1, tooltip: record?.shopName || record?.shopAddress || '' }}>
            <Link href={`/car/footprintingreport?id=${record.id}`}>{record?.shopName || record?.shopAddress || '-'}</Link>
          </Paragraph>
        ) : (
          '-'
        ),
    },
    {
      title: '店铺类型',
      key: 'shopCategoryName',
      width: 80,
    },
    { title: '踩点总时长（h）', key: 'allDuration', sorter: true, ...defaultRender },
    { title: '平均踩点时长（h）', key: 'aveDurationHour', sorter: true, ...defaultRender },
    { title: '工作日日均客流（人次）', key: 'aveFlowWeekday', sorter: true, width: 150 },
    { title: '节假日日均客流（人次）', key: 'aveFlowWeekend', sorter: true, width: 150 },
    { title: '平均CPM（元）', key: 'aveCpm', sorter: true, defaultSortOrder: 'descend', ...defaultRender },
  ];

  const loadData = async (params: any) => {
    const postParams = { ...params };
    if (postParams.cpm) {
      postParams.aveCpmMin = postParams.cpm.min;
      postParams.aveCpmMax = postParams.cpm.max;
      delete postParams.cpm;
    }
    if (postParams.aveFlowWeekday) {
      postParams.aveFlowWeekdayMin = postParams.aveFlowWeekday.min;
      postParams.aveFlowWeekdayMax = postParams.aveFlowWeekday.max;
      delete postParams.aveFlowWeekday;
    }
    if (postParams.aveFlowWeekend) {
      postParams.aveFlowWeekendMin = postParams.aveFlowWeekend.min;
      postParams.aveFlowWeekendMax = postParams.aveFlowWeekend.max;
      delete postParams.aveFlowWeekend;
    }

    // 未传排序字段默按照cpm排序
    if (postParams.orderBy === undefined && postParams.order === undefined) {
      postParams.sortField = 'aveCpm';
      postParams.isAsc = false;
    }

    if (postParams.orderBy && postParams.order) {
      postParams.sortField = postParams.orderBy;
      postParams.isAsc = postParams.order === 'asc';
      delete postParams.orderBy;
      delete postParams.order;
    }

    // 列字段和排序字段定义不一致，这里做下转换
    if (postParams.sortField === 'aveDurationHour') {
      postParams.sortField = 'aveDuration';
    }

    // https://yapi.lanhanba.com/project/329/interface/api/33876
    const { objectList, totalNum } = await post('/checkSpot/project/flowRank', postParams);
    return {
      dataSource: objectList || [],
      count: totalNum || 0,
    };
  };

  return (
    <Table
      rowKey='id'
      refreshCurrent={refreshCurrent}
      filters={searchParams}
      scroll={{ x: 'max-content', y: scrollHeight }}
      columns={columns}
      onFetch={loadData}
    />
  );
};

export default TaskList;
