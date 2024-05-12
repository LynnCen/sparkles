import { FC } from 'react';
import IconFont from '../../IconFont';
import styles from './index.module.less';
import { each } from '@lhb/func';
import { CSSProperties } from 'react';

interface DetailFilesProps {
    assets: Array<any>; // 文件数组
    style?: CSSProperties
}

const typeMap = {
  'png,jpg,gif,jpeg,bmp': 'pc-common-icon-file_icon_picture', // 图片
  'text': 'pc-common-icon-file_icon_txt', // 文本
  'xls,xlsx': 'pc-common-icon-file_icon_excel', // excel
  'doc,docx': 'pc-common-icon-file_icon_word', // word文档
  'pdf': 'pc-common-icon-file_icon_pdf', // pdf
  'ppt,pptx': 'pc-common-icon-file_icon_ppt', // ppt
  'rar,zip,7z': 'pc-common-icon-file_icon_zip', // 压缩包
  'mp4,m2v,mkv,rmvb,wmv,avi,flv,mov,m4v': 'pc-common-icon-file_icon_video', // 视频
  'mp3,wav': 'pc-common-icon-file_icon_music', // 音频
};
// 文件预览组件
const DetailFiles: FC<DetailFilesProps> = ({
  assets = [], // [{url:'xxxx',name:'xxx'}]
  style
}) => {

  Array.isArray(assets) && assets.forEach((item) => {
    const suffix = item.name?.split('?')[0].match(/[^.]+$/)[0];
    // 没多少轮询量，不需要考虑break
    each(typeMap, (itm, key) => {
      if (key.split(',').includes(suffix)) {
        item.type = itm;
      }
    });
    if (!item.type) {
      item.type = 'pc-common-icon-file_icon_unknow'; // 未知文件
    }
  });

  return (
    <>
      { assets?.length ? <div className={styles.v2DetailItemFiles} style={style}>
        {assets.map((item, index) => {
          return (
            <div key={index} className={styles.v2ItemFiles}>
              <div className={styles.v2ItemFilesRight}>
                <span className={styles.v2ItemFilesName}>{item.name || '-'}</span>
                <a className={styles.v2ItemFilesBtn} href={`${item.url}`} target='_blank'>预览</a>
                <a className={styles.v2ItemFilesBtn} href={`${item.url}?attname=${item.name}`} target='_blank'>下载</a>
              </div>
              <div className={styles.v2ItemFilesLeft}>
                <IconFont iconHref={item.type}/>
              </div>
            </div>
          );
        }) }
      </div> : '-'}
    </>
  );
};

export default DetailFiles;
