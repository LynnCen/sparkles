/**
 * @Description 详情-子表单渲染
 */
import { FC } from 'react';
import { isObject, replaceEmpty } from '@lhb/func';
import { v4 } from 'uuid';
import Table from 'antd/lib/table';
import styles from '../index.module.less';


interface SubFormTableProps {
  data?: any[];
}

const SubFormTable: FC<SubFormTableProps> = ({ data = [] }) => {
  const newColumns = data.map(item => {
    const { propertyConfigId, propertyName, anotherName } = item;

    return {
      title: anotherName || propertyName,
      dataIndex: propertyConfigId,
      width: 220,
      align: 'center',
      render: (text: string, row: any) => {
        if (row[propertyConfigId] && isObject(row[propertyConfigId])) {
          return `${replaceEmpty(row[propertyConfigId]?.value)}${replaceEmpty(row[propertyConfigId]?.suffix)}`;
        }
        return replaceEmpty(text);
      }
    };
  });

  // 添加序号
  const indexColumns = [
    {
      title: '序号',
      dataIndex: 'key',
      width: 60,
      align: 'center',
      render: (text: string, row: any, _index) => {
        return <span>{_index + 1}</span>;
      }
    }, ...newColumns];

  // 将newColumns中的dataIndex去重
  const uniqueColumns = Array.from(new Set(indexColumns.map(item => item.dataIndex))).map(dataIndex => {
    return indexColumns.find(item => item.dataIndex === dataIndex);
  });

  const dataSource = data.reduce((acc, item) => {
    const { row, propertyConfigId, value, textValue } = item;
    if (!acc[row]) {
      acc[row] = {};
    }
    try {
      acc[row][propertyConfigId] = value || JSON.parse(textValue);
    } catch (error) {
      acc[row][propertyConfigId] = '-';
    }
    return acc;
  }, []);

  return <div style={{ maxWidth: '60vw' }}>
    <Table
      sticky
      dataSource={dataSource}
      scroll={{ y: 400 }}
      className={styles.tableContent}
      pagination={false}
      rowKey={() => {
        // 采用随机生成key，由于接口请求都会触发render不需要考虑key的全量变动
        return v4();
      }}
      columns={(uniqueColumns as any)} />
  </div>;

};

export default SubFormTable;
