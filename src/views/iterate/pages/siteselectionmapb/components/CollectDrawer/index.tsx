/**
 * @Description 收藏夹列表
 */

import V2Drawer from '@/common/components/Feedback/V2Drawer';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import { useState } from 'react';
import { Button } from 'antd';
import { post } from '@/common/request';
import { downloadFile } from '@lhb/func';


const Collect = ({ open, setOpen, setIsSync }) => {
  const [loading, setLoading] = useState(false);
  const [leftKey, setLeftKey] = useState('');
  const [folderNum, setFolderNum] = useState({
    clusterNum: 0,
    siteLocationNum: 0,
    siteLocationFlag: false,
  });
  const [isRefresh, setRefresh] = useState(false);
  /**
   * @description 导出收藏列表
   */
  const exportCollect = () => {
    setLoading(true);
    // https://yapi.lanhanba.com/project/546/interface/api/70230
    post('/clusterLocationFavor/export', { id: leftKey }).then((res) => {
      if (res.url) {
        downloadFile({
          name: res?.name,
          url: res.url,
        });
        // window.open(`${res.url}?attname=${res.name}`);
      }
    }).finally(() => setLoading(false));
  };

  return (
    <>
      <V2Drawer bodyStyle={{ padding: 0 }} open={open} onClose={() => {
        setOpen(false);
        setIsSync(true);
      }}>
        <div className={styles.collectWrap}>
          <V2Title text='收藏列表' className={styles.collectTitle} extra={<Button onClick={exportCollect} loading={loading}>一键导出</Button>}/>
          { !!open && (
            <div className={styles.collectContent}>
              <LeftContent open={open} leftKey={leftKey} setLeftKey={setLeftKey} folderNum={folderNum} setFolderNum={setFolderNum} isRefresh={isRefresh} setRefresh={setRefresh} />
              { !!leftKey && <RightContent leftKey={leftKey} folderNum={folderNum} setRefresh={setRefresh}/> }
            </div>
          ) }
        </div>
      </V2Drawer>
    </>
  );
};

export default Collect;
