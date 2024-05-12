/**
 * @Description LBS报告结果入口
 */
import IconFont from '@/common/components/IconFont';
import styles from '../index.module.less';
import { FC } from 'react';
import { exportBusinessReport } from '@/common/api/surround';
import { downloadFile } from '@lhb/func';
import { message } from 'antd';

const LBSEntry:FC<any> = ({ reportId }) => {
  const jumpPdf = async() => {
    message.loading('报告生成中，请稍等');
    const url = await exportBusinessReport({ reportId });
    downloadFile({
      url,
    });
  };
  return (
    <div className={styles.entry}>
      <img src='https://staticres.linhuiba.com/project-custom/locationpc/surround/bg_surround_entryImg.png' />
      <div className={styles.entryText}>
        <span className={styles.leftText}>VIP</span>
        <span className={styles.centerText}>您已成功购买VIP分析报告，更多周边数据为您呈现</span>
        <span className={styles.rightText} onClick={jumpPdf}>
        查看VIP分析报告
          <IconFont iconHref='iconic_arrows' className='ml-4'/>
        </span>
      </div>
    </div>
  );
};
export default LBSEntry;

