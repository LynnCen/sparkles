/**
 * @Description pdf的目录
 */
import { FC } from 'react';
import Space from 'antd/lib/space';

import styles from '../entry.module.less';
import Header from '../Header';
import ChaptersCover from '../ChaptersCover';
import ListTitle from './components/ListTitle';

const PdfList: FC<any> = ({
  name,
}) => {

  return (
    <div className={styles.pdfList}>
      <Header name={name}/>
      <div className={styles.listContent}>
        <ChaptersCover
          title={null}
        />
        <div className={styles.list}>
          <Space direction='vertical' size={64}>
            <ListTitle index={'01'} title='客流概览' subheadingEn='Overview of passenger flow'/>
            <ListTitle index={'02'} title='周边数据' subheadingEn='Peripheral data'/>
            <ListTitle index={'03'} title='周边分析' subheadingEn='Perimeter analysis'/>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default PdfList;
