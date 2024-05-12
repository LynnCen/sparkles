/**
 * @Description 行业研报--小鹏标书需求
 */
import { FC } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import { downloadFile } from '@lhb/func';

const Report: FC<any> = () => {

  const defaultColumns = [
    {
      key: 'time',
      title: '时间',
      dragDisabled: true
    },
    {
      key: 'title',
      title: '文件标题',
      dragDisabled: true
    },
    {
      key: 'digest',
      title: '摘要',
      dragDisabled: true
    },
    {
      key: 'permissions',
      title: '操作',
      dragDisabled: true,
      render: () => (
        <span className='c-006 pointer' onClick={() => {
          downloadFile({
            name: '新能源汽车销量月报',
            url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/新能源汽车销量月报.pdf',
          });
        }}>下载查看</span>
      )
    }
  ];

  const loadData = () => {
    const data = Array.from({ length: 7 }).map((_, index) => ({
      time: `2023年${index + 1}月`,
      title: `2023年${index + 1}月新能源汽车销量月报`,
      digest: `销售表现、价格表现、市场动态、行业政策、专题分析`,
    }));
    return {
      dataSource: data,
      count: data.length,
    };
  };


  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 120px)' }}
      >
        <V2Table
          hideColumnPlaceholder
          rowKey='time'
          defaultColumns={defaultColumns}
          onFetch={loadData}
        />
      </V2Container>
    </div>
  );
};

export default Report;
