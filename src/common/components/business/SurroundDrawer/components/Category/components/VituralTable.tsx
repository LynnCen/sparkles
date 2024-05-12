/**
 * @Description 虚拟列表和表格
 */
import { Table } from 'antd';
import type { TableProps } from 'antd';
import cs from 'classnames';
import ResizeObserver from 'rc-resize-observer'; // 用于监听 DOM 元素大小变化的库
import React, { useEffect, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import styles from '../index.module.less';
import { isNotEmptyAny } from '@lhb/func';

const VirtualTable = <RecordType extends object>(props: TableProps<RecordType>) => {
  const { columns, scroll } = props;

  // 用于存储表格宽度的状态
  const [tableWidth, setTableWidth] = useState(0);

  // Grid 组件的引用
  const gridRef = useRef<any>();

  // 当表格宽度发生变化时重置虚拟网格的效果钩子，实现虚拟滚动，监听表格宽度的变化
  useEffect(() => resetVirtualGrid, [tableWidth]);

  // 用于保存连接对象的状态
  // React 将会调用函数来计算初始的状态，避免在组件每次重新渲染时都重新计算初始状态
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  // 没有指定宽度的列的计数
  const widthColumnCount = columns!.filter(({ width }) => !width).length;

  // 通过为没有指定宽度的列分配宽度生成合并的列，动态计算列宽，确保每列都有合适的宽度
  const mergedColumns = columns!.map(column => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  // 重置虚拟网格
  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  // 渲染虚拟列表的函数，在滚动时，只渲染可见的行和列，以提高性能
  const renderVirtualList = (rawData: readonly RecordType[], { scrollbarSize, ref, onScroll }: any) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 54;

    return (
      <Grid
        ref={gridRef}
        className={styles.virtualGrid}
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index];
          return totalHeight > ((typeof scroll?.y === 'number' ? scroll.y : 0) as number) && index === mergedColumns.length - 1
            ? (width as number) - scrollbarSize - 1
            : (width as number);
        }}
        height={scroll!.y as number}
        rowCount={rawData.length}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({ scrollLeft });
        }}
      >
        {({
          columnIndex,
          rowIndex,
          style,
        }: {
          columnIndex: number;
          rowIndex: number;
          style: React.CSSProperties;
        }) => (
          <div
            className={cs(styles.virtualTableCell,
              columnIndex === mergedColumns.length - 1 && styles.virtualTableCellLast
            )}
            style={style}
          >
            {
              isNotEmptyAny((mergedColumns as any)[columnIndex]?.render)
                ? (mergedColumns as any)[columnIndex].render(
                  (rawData[rowIndex] as any)[(mergedColumns as any)[columnIndex].dataIndex],
                  (rawData as any)[rowIndex],
                  rowIndex
                )
                : (rawData[rowIndex] as any)[(mergedColumns as any)[columnIndex].dataIndex]
            }
          </div>
        )}
      </Grid>
    );
  };

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        className={styles.virtualTable}
        columns={mergedColumns}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
};

export default VirtualTable;
