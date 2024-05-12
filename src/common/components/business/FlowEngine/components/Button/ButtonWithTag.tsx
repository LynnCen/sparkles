import { FC } from 'react';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { deepCopy } from '@lhb/func';

const ButtonWithTag: FC<any> = ({ title, tags, className, onClick, onTagClose }) => {
  const copyTags = deepCopy(tags);
  const methods = useMethods({
    onClose(index: number) {
      copyTags.splice(index, 1);
      onTagClose(copyTags);
    },
  });
  return (
    <div className={className}>
      <Button onClick={onClick} className={styles.button} icon={<PlusOutlined />}>{title}</Button>
      <div>
        {
          tags && tags.map((item: any, index: number) => {
            return (
              <Tag key={index} className={styles.tag} closable onClose={(e) => {
                e.preventDefault(); methods.onClose(index);
              }}>
                {item.name}
              </Tag>
            );
          })
        }

      </div>
    </div>
  );
};

export default ButtonWithTag;
