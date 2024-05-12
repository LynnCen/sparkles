import { FC } from 'react';
import { useMethods } from '@lhb/hook';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import styles from './index.module.less';
import { QRCodeSVG } from 'qrcode.react';
import { Button, List } from 'antd';
import ShowMore from '@/common/components/FilterTable/ShowMore';

const ConversionList: FC<any> = ({ data }) => {
  const { ...methods } = useMethods({
    onDetail(record) {
      dispatchNavigate('/brain/insightreport?id=' + record.no);
    },
  });

  return (
    <div
      style={{
        overflow: 'auto',
        padding: '0 16px 16px',
        border: '1px solid #EEEEEE',
        marginTop: '16px'
      }}
    >
      <List
        itemLayout='horizontal'
        dataSource={data}
        renderItem={(record: any) => (
          <List.Item>
            <div onClick={() => methods.onDetail(record)}>
              <div className={styles.row}>
                <div className={styles.left}>
                  <div className='pt-6'>
                    <QRCodeSVG
                      value={`${process.env.INSIGHT_URL}/conversion?id=` + record.no}
                      style={{
                        width: 72,
                        height: 72,
                      }}
                    />
                  </div>
                  <div className={styles.text}>
                    <div>洞察编号：{record.no}</div>
                    <div>
                      {record.storeNum}家门店｜分析时间：{record.time}
                    </div>
                    <div className={styles.showMore}>
                      <ShowMore maxWidth='900px' text={'洞察结果：' + record.text} />
                    </div>
                  </div>
                </div>
                <div>
                  <Button type='primary' shape='round' ghost>
                    查看详情
                  </Button>
                </div>
              </div>
            </div>
          </List.Item>
        )}
        pagination={{
          position: 'bottom',
        }}
      />
    </div>
  );
};

export default ConversionList;
