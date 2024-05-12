/**
 * @Description 踩点实测客流视频 table 页
 */
import { FC, useMemo } from 'react';
import { Table, Typography } from 'antd';
import { deepCopy, recursionEach } from '@lhb/func';
import styles from '../../entry.module.less';
import { valueFormat } from '@/common/utils/ways';
import Header from '../../Header';
import { treeData, treeDataProps } from '@/views/passengerFlow/pages/footprinting/components/Modal/ImportVideoList';

const { ColumnGroup, Column } = Table;
const { Link } = Typography;

// 默认展示列
const defaultColumns:treeDataProps[] = [
  {
    title: '时间段',
    key: 'startTime',
    showColumn: true,
    children: []
  },
];

const _treeData:any = recursionEach(deepCopy(treeData), 'children', (item:treeDataProps) => {
  item.showColumn = true;
});

const FLowTable: FC<any> = ({
  data = {},
  title = ''
}) => {

  const treeColumns = useMemo(() => {
    return data?.fields && data?.fields.length ? [...defaultColumns, ...data?.fields] : [...defaultColumns, ..._treeData];
  }, [data?.fields]);

  // 需要讲表格数据按 10 条一组分组，每页 pdf 显示 10 条
  const tableDataArr = useMemo(() => {

    const flowList:any[] = data?.hourFlows ? deepCopy(data?.hourFlows) : [];

    const result:any[] = [];
    for (let i = 0; i < flowList.length; i += 10) {
      result.push(flowList.slice(i, i + 10));
    }
    return result;
  }, [data?.hourFlows]);



  // 表格列渲染
  const renderColumn = (value: any, record: any, key:string) => {
    switch (key) {
      case 'startTime':
        return record.timeDuration || '-';
      case 'videoUrls':
        if (value && value.length) {
          return value.map((item:string, index:number) => {
            return <Link href={item} target='_blank' key={index}>{item}</Link>;
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
          let colWidth = 12;
          switch (item.key) {
            case 'startTime':
              colWidth = 80;
              break;
            case 'flowFemaleAll':
              colWidth = 22;
              break;
            case 'flowMaleAll':
              colWidth = 22;
              break;
            case 'passengerFemaleAll':
              colWidth = 22;
              break;
            case 'passengerMaleAll':
              colWidth = 22;
              break;
            case 'indoorRate':
              colWidth = 22;
              break;
            case 'passbyFemaleCount':
              colWidth = 34;
              break;
            case 'indoorFemaleCount':
              colWidth = 34;
              break;
            case 'passbyMaleCount':
              colWidth = 34;
              break;
            case 'indoorMaleCount':
              colWidth = 34;
              break;

            default:
              break;
          }
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
              width={colWidth}
              align='center'
              render={(value: string, record: any) => renderColumn(value, record, item.key)}
            />
            : <></>;
        }
      } else {
        return <></>;
      }
    });
  };


  return (
    <>
      {
        tableDataArr.map((item, index) => {
          return <div className={styles.fLowTable} key={index}>
            <Header
              hasIndex
              name={`${title}踩点实测客流视频`}/>
            <div className={styles.tableContainer}>
              <Table
                size='small'
                // scroll={{ x: 'max-content', y: 480 }}
                pagination={false}
                dataSource={item}
              >
                {renderColumns(treeColumns)}
              </Table>
            </div>
          </div>;
        })
      }
    </>
  );
};

export default FLowTable;
