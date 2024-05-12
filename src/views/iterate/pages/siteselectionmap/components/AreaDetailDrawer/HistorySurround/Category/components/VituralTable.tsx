/**
 * @Description 虚拟列表和表格
 *
 *  使用react-window实现动态高度的虚拟列表:
 * 文档 https://www.npmjs.com/package/react-window
 * 例子 https://4x-ant-design.antgroup.com/components/table-cn/#components-table-demo-virtual-list
 */
import { FC } from 'react';
import { Table } from 'antd';
// import type { TableProps } from 'antd';
import cs from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import React, { useEffect, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import styles from '../index.module.less';

const CustomizeRowHeight = 69;

// const VirtualTable = <RecordType extends object>(props: TableProps<RecordType>) => {
const VirtualTable: FC<any> = ({
  columns,
  scroll,
  loadMore, // 非table需要的参数
  ...props
}) => {
  // const { columns, scroll } = props;

  // 用于存储表格宽度的状态
  const [tableWidth, setTableWidth] = useState(0);

  // Grid 组件的引用
  const gridRef = useRef<any>();

  // 当表格宽度发生变化时重置虚拟网格的效果钩子，实现虚拟滚动，监听表格宽度的变化
  useEffect(() => resetVirtualGrid, [tableWidth]);

  // 用于保存连接对象的状态
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
  const renderVirtualList = (rawData: readonly /* RecordType[]*/any[], { scrollbarSize, ref, onScroll }: any) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * CustomizeRowHeight; // 内容总高度

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
        rowHeight={() => CustomizeRowHeight}
        width={tableWidth}
        onScroll={(values) => {
          // values: {
          //   horizontalScrollDirection: "backward"
          //   scrollLeft: 0
          //   scrollTop: 1376
          //   scrollUpdateWasRequested: false
          //   verticalScrollDirection: "forward"
          // }

          const { scrollLeft, scrollTop } = values;
          onScroll({ scrollLeft });

          const scrollHeight = scroll?.y || 0; // 列表可见区域高度
          if (scrollHeight + scrollTop >= totalHeight) { // 到达底部
            loadMore && loadMore();
          }
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
        }) => {
          // 定制化点
          const record = rawData[rowIndex];
          return (
            <div
              className={cs(styles.virtualTableCell,
                columnIndex === mergedColumns.length - 1 && styles.virtualTableCellLast
              )}
              style={style}
            >
              {/* <div className={styles.virtualTableCellCon}> */}
              {/* {(rawData[rowIndex] as any)[(mergedColumns as any)[columnIndex].dataIndex]} */}
              { (mergedColumns as any)[columnIndex].render ? (mergedColumns as any)[columnIndex].render(record, rowIndex) : '请实现render'}
              {/* </div> */}
            </div>
          );
        }
        }
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
        scroll={scroll}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
};

export default VirtualTable;
