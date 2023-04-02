import React, { useRef, useState } from 'react';
import styles from './index.less';
import { Button, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '@/services/common';
import { useIntl } from 'umi';

interface UploadPropType {
  onChange?: (link: string) => void;
  value?: string;
  multiple?: boolean;
  accept?: string;
  type?: string;
}

const UploadPKG: React.FC<UploadPropType> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatMessage } = useIntl();
  const [loading, toggleUploading] = useState<boolean>(false);
  return (
    <Spin spinning={loading}>
      <div className={styles.package_wrapper}>
        <div className={styles.package_container}>
          <Button type="primary" ghost icon={<UploadOutlined />} size={'middle'}>
            {formatMessage({ id: 'table-choose-file' })}
          </Button>
          <input
            disabled={props.type === '0'}
            className={styles.file_input}
            ref={inputRef}
            type={'file'}
            accept={props.accept || '.exe, .dmg, .apk'}
            onChange={async () => {
              const { files } = inputRef.current!;
              if (!files) return;
              const file = files[0];
              if (props.accept === '.yml' && !file.name.match(/.yml$/)) {
                message.error(`${formatMessage({ id: 'table-choose-file-type' })}.yml`);
                return;
              }
              toggleUploading(true);
              try {
                const resp = await uploadFile(
                  file,
                  '/upfile/pkg',
                  parseInt(props.type || '0', 10) + 2,
                );
                if (typeof props.onChange === 'function') {
                  props.onChange(resp.url);
                }
              } catch (e) {
                message.error(e.message);
              } finally {
                toggleUploading(false);
              }
            }}
          />
        </div>
        {props.value && <div className={styles.package_val}>{props.value}</div>}
      </div>
    </Spin>
  );
};

export default UploadPKG;
