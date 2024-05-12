import { FC, useState } from 'react';
import styles from './entry.module.less';
import { Spin } from 'antd';
import { useMethods } from '@lhb/hook';
import { matchQuery } from '@lhb/func';

const Analyse: FC<any> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const url = `https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=e0346f93-6b69-4bef-b9e3-7995952b16b0&accessToken=ebbdd95ef0ef7a820d941751ff4db197&dd_orientation=auto`; // url由数据部门提供

  const methods = useMethods({
    onload() {
      setLoading(false);
      loading && setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  });

  return (
    <div className={styles.container}>
      <Spin spinning={loading} wrapperClassName={styles.spinContainer}>
        <div
          /*
            减去高度设置80 = 顶部条高度48 + container上margin16 + container下margin16 + container上padding0 + container下padding0；
            减去高度大于这个值，页面底部留白大于预期；
            减去高度小于这个值，页面底部留白小于预期，且页面右侧会出现不必要的滚动条；

            如果是作为外部加载页面，比如邻汇吧后台，不需要考虑顶部条高度48和margin，则为0
          */
          style={{ height: matchQuery(location.search, 'source') ? 'calc(100vh - 3px)' : 'calc(100vh - 80px)' }}
        >
          <iframe
            src={url}
            className={styles.iframeBox}
            onLoad={methods.onload}
          />
        </div>
      </Spin>
    </div>
  );
};

export default Analyse;
