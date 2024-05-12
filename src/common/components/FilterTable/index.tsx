/* 将请求/分页/排序/参数改变封装到一起的table组件 */
/**
 * 注意：
 * onFetch必传
 * 默认进入请求一次，如果分页直接点击分页即可；
 * 如需重新请求数据，变更filters，filters是个对象
 * useEffect监听filters是浅比较，只要重新setState filters的值(即使filters是个空对象)都会重新触发请求(分页回到第一页)
 * 直接在外部触发传入的onFetch不会生效，因为onFetch封装在handleChange里面，直接触发onFetch并不会触发handleChange，
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, ConfigProvider } from 'antd';
import { Summary } from 'rc-table';
import cs from 'classnames';
import Pagination from '@/common/components/Pagination';
import CustomEmpty from './CustomEmpty';
import { getKeys } from '@/common/utils/ways';
import { TableColumnType } from 'antd/lib/index';
import { FilteredTableProps } from './ts-config';

const DEFAULT_OBJECT = {};
const DEFAULT_PAGINATION = { page: 1, size: 20 }; // 初始化pagination

const FilteredTable: any = forwardRef<any, FilteredTableProps>(
  (
    {
      children,
      onFetch,
      initialFilters = {},
      className = '',
      filters: extraFilters = DEFAULT_OBJECT,
      rowKey,
      bordered = false,
      columns,
      rowSelection,
      pagination = true,
      paginationLeft,
      expandable = undefined,
      defaultSorter = DEFAULT_OBJECT,
      childrenColumnName = 'children',
      scroll = { x: 'max-content' },
      defaultExpendAll = true,
      refreshCurrent = false,
      emptyContent = '暂无数据', // 自定义空数据的内容展示ReactNode 或者 string
      paginationIsDisabled = false, // 是否禁用分页
      clickPagination, // 分页区域（整体）点击事件
      ...props
    },
    ref
  ) => {
    // 入参
    const [fields, setFields] = useState<any>({
      ...(pagination && DEFAULT_PAGINATION),
      ...initialFilters,
      ...defaultSorter,
    });

    // 返回值
    const [data, setData] = useState<any>({
      loading: true,
      dataSource: [],
      count: 0,
    });

    // 展开行
    const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);

    // 请求接口
    const handleChange = async (newValue: any) => {
      try {
        setData({ ...data, loading: true });
        const params = {
          ...newValue,
          ...extraFilters
        };
        params && setFields({
          ...params
        });
        const { dataSource, count } = await onFetch({
          ...params
        });
        setData({
          dataSource: dataSource,
          count,
          loading: false,
        });
        // 根据dataSource中是否有children(默认是children)，来决定每次请求是否展开全部行
        const needExpendAll = dataSource.find((item) => item[childrenColumnName]);
        // 默认展开且为树状结构
        if (defaultExpendAll && needExpendAll) {
          const expandedRowKeys = getKeys(dataSource, [], rowKey, childrenColumnName);
          setExpandedRowKeys(expandedRowKeys);
        }
      } catch (_err) {
        setData({ dataSource: [], count: 0, loading: false });
      }
    };
    // 排序
    const handleSorterChange = (_: any, __: any, sorter: any) => {
      const values = {
        ...fields,
        page: 1,
        size: fields.size,
        orderBy: sorter.columnKey,
        order: sorter.column ? (sorter.order === 'ascend' ? 'asc' : 'desc') : undefined,
      };
      handleChange(values);
    };
    // 分页相关
    const handlePageNoChange = (value: any, size: number) => {
      const values = {
        ...fields,
        page: fields.size === size ? value : 1,
        size: size,
      };
      handleChange(values);
    };

    // filter变化的时候重新请求数据
    useEffect(() => {
      const params = {
        ...fields,
        ...(pagination && { page: refreshCurrent ? fields.page : 1, size: fields.size }),
      };
      handleChange(params);
    }, [extraFilters]);

    // 将load方法暴露给父组件，可在父组件中使用该方法
    useImperativeHandle(ref, () => ({
      onload: handleChange,
    }));

    // columns的参数-只处理columns传入
    const addColumnDataIndex = (column: ColumnProps<any>) => {
      return {
        ...column,
        dataIndex: column.key, // 列数据在数据项中对应的路径-必须设置dataIndex，传入只需传入key，两个取相同字段
      };
    };

    // 渲染columns
    const renderColumnNode = (columns: Array<any>) => {
      return columns.map((column) => (
        <Table.Column {...addColumnDataIndex(column)}>
          {column.children && renderColumnNode(column.children)}
        </Table.Column>
      ));
    };

    const onExpand = (expanded: boolean, record) => {
      const key = record[rowKey];
      const arr = expandedRowKeys.slice();
      const targetIndex = arr.findIndex((item) => item === record[rowKey]);
      if (expanded) {
        arr.push(key);
      } else {
        arr.splice(targetIndex, 1);
      }
      setExpandedRowKeys(arr);
    };

    return (
      <div className={cs(className)} ref={ref}>
        <ConfigProvider renderEmpty={() => <CustomEmpty>{emptyContent}</CustomEmpty>}>
          <Table
            {...props}
            rowKey={rowKey}
            bordered={bordered}
            loading={data.loading}
            dataSource={data.dataSource}
            pagination={false}
            scroll={scroll}
            showSorterTooltip={false}
            rowSelection={rowSelection}
            childrenColumnName={childrenColumnName}
            expandable={{
              expandedRowKeys,
              onExpand,
              ...expandable,
            }}
            onChange={handleSorterChange}
          >
            {/* 如果传入是columns则使用columns 否则渲染children(与table用法一致) */}
            {(columns && Array.isArray(columns) && renderColumnNode(columns)) || children}
          </Table>
        </ConfigProvider>

        {pagination && (
          <Pagination
            current={fields.page}
            pageSize={fields.size}
            total={data.count}
            disabled={data.loading || paginationIsDisabled}
            onChange={handlePageNoChange}
            extraPagination={paginationLeft}
            clickPagination={clickPagination}
          />
        )}
      </div>
    );
  }
);

interface ColumnProps<RecordType> extends TableColumnType<RecordType> {
  children?: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Column<RecordType>(_: ColumnProps<RecordType>) {
  return null;
}

interface ColumnGroupProps<RecordType> extends Omit<TableColumnType<RecordType>, 'children'> {
  children: React.ReactElement<ColumnProps<RecordType>> | React.ReactElement<ColumnProps<RecordType>>[];
}

/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ColumnGroup<RecordType>(_: ColumnGroupProps<RecordType>) {
  return null;
}

FilteredTable.Column = Column;
FilteredTable.ColumnGroup = ColumnGroup;
FilteredTable.Summary = Summary;

export default FilteredTable;
