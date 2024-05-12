/**
 * @Description 踩点分析结果表格
 */
import { FC, useEffect, useState } from 'react';
import { treeData, treeDataProps } from '../ts-config';
import { deepCopy, isArray, recursionEach } from '@lhb/func';
import { valueFormat } from '@/common/utils/ways';
import { Table, Typography } from 'antd';
import { getProjectInfo } from '@/common/api/car';

const { Link } = Typography;
const { Column, ColumnGroup } = Table;

const _treeData = recursionEach(deepCopy(treeData), 'children', (item:treeDataProps) => {
  item.showColumn = true;
});
const defaultColumns:treeDataProps[] = [
  {
    title: '时间段',
    key: 'startTime',
    showColumn: true,
    children: []
  },
  {
    title: '视频URL',
    key: 'videoUrls',
    showColumn: true,
    children: []
  },
  // {
  //   title: '分析进度',
  //   key: 'statusName',
  //   showColumn: true,
  //   children: []
  // },
];

const ResultTable:FC<any> = ({
  searchParams
}) => {
  const [data, setData] = useState<any>({
    flowList: [],
    treeColumns: []
  });
  const [loading, setLoading] = useState(false);

  const renderTimeRange = (value: string, record: any) => {
    return `${record.date} ${value}-${record.endTime}`;
  };

  const loadData = async () => {
    setLoading(true);
    const { flowList = [], fields = [] } = await getProjectInfo({ ...searchParams });
    const treeColumns :treeDataProps[] = fields.length ? fields : _treeData;
    const _treeColumns = [...defaultColumns, ...treeColumns];

    setData({
      treeColumns: _treeColumns,
      flowList: flowList
    });

    setLoading(false);

  };

  // 表格列渲染
  const renderColumn = (value: any, record: any, key:string) => {
    switch (key) {
      case 'startTime':
        return renderTimeRange(value, record);
      case 'videoUrls':
        if (isArray(record?.videos) && record.videos.length) {
          return record.videos.map((item) =>
            <div>
              <Link href={`/imageserve/video?id=${item.videoHash}`} target='_blank'>点击查看视频</Link>
            </div>
          );
        } else {
          return '-';
        }
        // return value && <Link href={value} target='_blank'>点击查看视频</Link> || '-';

      default:
        return valueFormat(value);
    }
  };

  // 根据配置的树结果渲染表格
  const renderColumns = (treeData:any[]) => {
    return treeData.map((item) => {
      if (item.showColumn) {
        if (item.children && item.children.length) {
          return (
            <ColumnGroup title={item.title} key={item.key}>
              {renderColumns(item.children)}
            </ColumnGroup>
          );
        } else {
          return item.showColumn
            ? <Column
              title={item.title}
              key={item.key}
              dataIndex={item.key}
              fixed={item.key === 'startTime' ? 'left' : false}
              width={item.key === 'startTime' ? 240 : 100}
              render={(value: string, record: any) => renderColumn(value, record, item.key)}
            />
            : <></>;
        }
      } else {
        return <></>;
      }
    });
  };

  useEffect(() => {
    if (searchParams.id) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.id]);

  return <div>
    <Table
      size='small'
      bordered
      scroll={{ x: 'max-content', y: 460 }}
      pagination={false}
      loading={loading}
      dataSource={data.flowList}
    >
      {renderColumns(data.treeColumns)}
    </Table>
  </div>;
};
export default ResultTable;

