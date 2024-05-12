import { valueFormat } from '@/common/utils/ways';
import { FC } from 'react';
import Table from '@/common/components/FilterTable';
import styles from './entry.module.less';
import { urlParams } from '@lhb/func';
const PassengerFlowVideo: FC<any> = ({ tableChartTitle, tableDatas, indexVal }) => {
  const id: string | number = urlParams(location.search)?.id;
  const defaultRender = { width: 120, render: (value: number) => valueFormat(value) };
  const href = location.href.split('/pdf')[0].concat(`/pdf/videoLink?id=${id}`);
  let index:number = 0;
  const columns = [
    {
      title: '时间段',
      dataIndex: 'timeRange',
      key: 'timeRange',
      ...defaultRender
    },
    {
      title: '视频链接',
      dataIndex: 'urls',
      key: 'urls',
      textWrap: 'word-break',
      ellipsis: true,
      width: 200,
      render: () => <div>
        {process.env.NODE_ENV === 'development' ? `${href}&index=${(indexVal * 10) + index++}`
          : `${process.env.CONSOLE_PC_URL}/pdf/videoLink?id=${id}&index=${(indexVal * 10) + index++}`}
      </div>

    },
    {
      title: '时长',
      dataIndex: 'durationsText',
      key: 'durationsText',
      ...defaultRender,

    },
    {
      title: '人数',
      dataIndex: 'flows',
      key: 'flows',
      ...defaultRender,
      render: (value) => Math.ceil(value)
    }
  ];

  const loadData = () => {
    return Promise.resolve({
      dataSource: tableDatas
    });
  };
  return (
    <div className={styles.videoCon}>
      <div className={styles.title}>
        {tableChartTitle}
      </div>
      <Table
        columns={columns}
        pagination={false}
        onFetch={loadData}
        bordered={true}
        rowKey='timeRange'
        filters={tableDatas}
      />

    </div>
  );
};

export default PassengerFlowVideo;
