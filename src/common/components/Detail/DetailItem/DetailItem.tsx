import React, { FC } from 'react';
import styles from './index.module.less';
import { Link } from 'react-router-dom';
import cs from 'classnames';
import { each } from '@lhb/func';
import IconFont from '../../IconFont';
const typeMap = {
  'png,jpg,gif,jpeg,bmp': 'icon-file_icon_picture', // 图片
  'text': 'icon-file_icon_txt', // 文本
  'xls,xlsx': 'icon-file_icon_excel', // excel
  'doc,docx': 'icon-file_icon_word', // word文档
  'pdf': 'icon-file_icon_pdf', // pdf
  'ppt,pptx': 'icon-file_icon_ppt', // ppt
  'rar,zip,7z': 'icon-file_icon_zip', // 压缩包
  'mp4,m2v,mkv,rmvb,wmv,avi,flv,mov,m4v': 'icon-file_icon_video', // 视频
  'mp3,wav': 'icon-file_icon_music', // 音频
};
export interface ItemProps {
  label?: string;
  /**
   * @description 类型，text(文本) | files(文件) | open(打开新页面) | link(内部跳转)
   * @default text
   */
  type?: string;
  /**
   * @description 文件数组，仅 type=files 时生效
   * @default []
   */
  files?: any[];
  /**
   * @description link指向地址，仅 type=link 时生效
   */
  linkTo?: any;
  /**
   * @description 额外插入的外层样式
   */
  style?: React.CSSProperties;
  /**
   * @description 额外插入的外层class
   */
  className?: string;
  children?: any; // 类似vue的slot
}

const DetailItem: FC<ItemProps> = ({
  label,
  children,
  type = 'text',
  style, // 用来设置如 marginBottom: '0px' 等额外样式调整
  className,
  linkTo,
  files = [], // type = files时使用
}) => {
  const valueComp = () => {
    if (type === 'files') {
      files.forEach((item) => {
        const suffix = item.name?.split('?')[0].match(/[^.]+$/)[0];
        // 没多少轮询量，不需要考虑break
        each(typeMap, (itm, key) => {
          if (key.split(',').includes(suffix)) {
            item.type = itm;
          }
        });
        if (!item.type) {
          item.type = 'icon-file_icon_unknow'; // 未知文件
        }
      });
      return <div className={styles.detailItemFiles}>
        {
          files.map((item, index) => {
            return (
              <div key={index} className={styles.itemFiles}>
                <div className={styles.itemFilesRight}>
                  <span className={styles.itemFilesName}>{item.name || '-'}</span>
                  <a className={styles.itemFilesBtn} href={`${item.url}`} target='_blank'>查看</a>
                  <a className={styles.itemFilesBtn} href={`${item.url}?attname=${item.name}`} target='_blank'>下载</a>
                </div>
                <div className={styles.itemFilesLeft}>
                  <IconFont iconHref={item.type}/>
                </div>
              </div>
            );
          })
        }
      </div>;
    } else if (type === 'open') { // 跳转打开新页面
      return children ? <a href={children} target='_blank'>{children}</a> : '-';
    } else if (type === 'link') { // 内部跳转
      return children ? <Link to={linkTo}>{children}</Link> : '-';
    }
    return <span>{children}</span>; // 默认是type === 'text'
  };
  return (
    <div className={cs(styles.detailItem, className)} style={style}>
      <span className={styles.itemLabel}>{label ? `${label}：` : ''}</span>
      {valueComp()}
    </div>
  );
};

export default DetailItem;
