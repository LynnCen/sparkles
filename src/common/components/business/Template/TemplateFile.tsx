import { FC } from 'react';
import { downloadFile } from '@/common/utils/ways';
import IconFont from '@/common/components/IconFont';
import styles from './index.module.less';

interface Props {
  url: string;
  fileName: string;
  fileType?: string;
  customDownload?: Function; // 自定义下载
}

const TemplateFile: FC<Props> = ({ url, fileName, fileType = 'xlsx', customDownload }) => {
  const fileTypes = {
    xlsx: 'icon-file_icon_excel',
    xls: 'icon-file_icon_excel',
    // todo add other type...
  };

  return (
    <div className={styles.templateFile}>
      <div>
        <IconFont iconHref={fileTypes[fileType]} className={styles.iconSize} />
      </div>
      <div className={styles.contentCon}>
        <div>{fileName}</div>
        <div
          className={styles.bott}
          onClick={() => {
            customDownload
              ? customDownload()
              : downloadFile({
                name: fileName,
                url,
              });
          }}
        >
          下载
        </div>
      </div>
    </div>
  );
};

export default TemplateFile;
