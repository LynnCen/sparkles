/* 选择应用图标组件 */
/* eslint-disable react-hooks/exhaustive-deps */
import IconFont from '@/common/components/IconFont';
import { Modal, Tabs } from 'antd';
import cs from 'classnames';
import { FC, useEffect, useState } from 'react';
import { AppIconList } from './icon-config';
import styles from './index.module.less';
import { IProps } from './ts-config';

const CheckIcon: FC<IProps> = ({ iconModal, onChange, closeModal }) => {
  const [icon, setIcon] = useState<string>(iconModal.iconLink);
  const changeIcon = (iconName: string) => {
    setIcon(iconName);
  };

  useEffect(() => {
    if (iconModal.visible) {
      setIcon(iconModal.iconLink);
    }
  }, [iconModal.visible]);

  const onOk = () => {
    onChange(icon);
    onCancel();
  };

  const onCancel = () => {
    closeModal({ ...iconModal, visible: false });
  };

  return (
    <Modal open={iconModal.visible} onCancel={onCancel} onOk={onOk}>
      <div className={styles.container}>
        <Tabs defaultActiveKey='1' items={[
          { label: '应用图标', key: '1', children: <ul className={styles.iconWrap}>
            {AppIconList.map((item) => (
              <li
                key={item.link}
                className={cs(
                  'cursor-pointer',
                  styles.iconItem,
                  icon === item.link && styles.activeIcon
                )}
                onClick={() => changeIcon(item.link)}
                // style={{ color: (icon === item.link && iconModal.color) || '' }}
              >
                <IconFont className={styles.iconStyle} iconHref={item.link} />
              </li>
            ))}
          </ul> }
        ]}/>
      </div>
    </Modal>
  );
};

export default CheckIcon;
