import { reviewExportPdf } from '@/common/api/pdf';
import { urlParams } from '@lhb/func';
import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
const VideoLink: FC<any> = () => {
  const id: string | number = urlParams(location.search)?.id;
  const index: string | number = urlParams(location.search)?.index;
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const result = await reviewExportPdf(+id);
      setData(result.tableDatas[index]);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div className={styles.container}>
      <div className={styles.title}>踩点报告-视频链接</div>
      <div className={styles.timeRange}>
        时间段：{data.timeRange}
      </div>
      <div className={styles.durationsText}>
        拍摄时间：{data.durationsText}
      </div>
      <div className={styles.flows}>
        总人数：{Math.ceil(data.flows)}
      </div>
      <div className={styles.urls}>
        {data.urls?.map((item, index) =>
          <div
            key={index}
            className={styles.url}
            onClick={() => { window.location.href = item; }}>
            {item}
          </div>
        )}
      </div>

    </div>
  );
};

export default VideoLink;
