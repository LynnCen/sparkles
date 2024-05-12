/**
 * @Description 踩点分析结果动态表格
 */
import { FC, useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { valueFormat } from '@/common/utils/ways';
import { deepCopy, recursionEach } from '@lhb/func';
import { treeData, treeDataProps } from '../../footprinting/components/Modal/ImportVideoList';
import { post } from '@/common/request';

const { Link } = Typography;
const { ColumnGroup, Column } = Table;


export function formatTimeStr(secondTime: number) {
  let minuteTime = 0;// 分
  let hourTime = 0;// 小时
  if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = Math.floor(secondTime / 60);
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = Math.floor(secondTime % 60);
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime >= 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = Math.floor(minuteTime / 60);
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = Math.floor(minuteTime % 60);
      return `${hourTime}小时${minuteTime}分${secondTime}秒`;
    }
    return `${minuteTime}分${secondTime ? `${secondTime}秒` : ''}`;
  }
  return `${secondTime}秒`;
}


// table 默认展示的列，全展示
const _treeData :any = recursionEach(deepCopy(treeData), 'children', (item:treeDataProps) => {
  item.showColumn = true;
});

// 默认展示列
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
  {
    title: '分析进度',
    key: 'statusName',
    showColumn: true,
    children: []
  },
];


const VideoList: FC<{id?: string|number}> = ({ id }) => {

  const [data, setData] = useState<any>({
    flowList: [],
    treeColumns: []
  });
  const [loading, setLoading] = useState(false);


  const loadData = async () => {
    setLoading(true);
    // https://yapi.lanhanba.com/project/329/interface/api/56615
    const { flowList = [], fields = [] } = await post('/checkSpot/project/flow', { id: id }, {
      proxyApi: '/terra-api',
      needHint: true
    });
    const treeColumns :treeDataProps[] = fields?.length ? fields : _treeData;
    const _treeColumns = [...defaultColumns, ...treeColumns];

    setData({
      treeColumns: _treeColumns,
      flowList: flowList || []
    });

    setLoading(false);

  };


  const renderTimeRange = (value: string, record: any) => {
    return `${record.date} ${value}-${record.endTime}`;
  };

  // 表格列渲染
  const renderColumn = (value: any, record: any, key:string) => {
    switch (key) {
      case 'startTime':
        return renderTimeRange(value, record);
      case 'videoUrls':
        if (value && value.length) {
          return value.map((item:string, index:number) => {
            return <Link href={item} target='_blank'>点击查看视频{index + 1}</Link>;
          });
        } else {
          return '-';
        }

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
          let title = item.title;
          switch (item.key) {
            case 'indoorRate':
              title = item.title + '(%)';
              break;
            case 'shoppingRate':
              title = item.title + '(%)';
              break;
            default:
              break;
          }
          return item.showColumn
            ? <Column
              title={title}
              key={item.key}
              dataIndex={item.key}
              fixed={item.key === 'startTime' ? 'left' : false}
              width={item.key === 'startTime' ? 240 : 110}
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
    if (id) loadData();
  }, [id]);


  return (
    <>
      <Table
        size='small'
        bordered
        scroll={{ x: 'max-content', y: 380 }}
        pagination={false}
        loading={loading}
        rowKey={'startTime'}
        dataSource={data.flowList}
      >
        {renderColumns(data.treeColumns)}
      </Table>
    </>
  );
};

export default VideoList;
