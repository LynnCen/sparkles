/**
 * @Description 根据 pdf 表格的样式，自定义的表格组件，没有其他功能
 */
import { FC } from 'react';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import { Space, Table, TableProps } from 'antd';


interface PdfTableProps extends TableProps<any>{
/**
 * @Description pdf表格的标题
 */
  tableTitle?: string;
}

const PdfTable: FC<PdfTableProps> = ({
  tableTitle,
  columns,
  dataSource,
  ...props
}) => {

  return (
    <div className={styles.pdfTable}>
      <Space direction='vertical' size={20}>
        {!!tableTitle && <V2Title
          divider
          type='H1'
          text={tableTitle} />}
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          {...props}
        />
      </Space>
    </div>
  );
};

export default PdfTable;
