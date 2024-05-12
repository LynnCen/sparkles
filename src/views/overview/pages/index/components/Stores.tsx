import { Progress } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import cs from 'classnames';
import { useState, useRef, FC } from 'react';
import { StoresProps } from '../ts-config';
import styles from './index.module.less';

const items = Array.from({ length: 10 }).map((_, index) => ({
  title: `门店${index}`,
  name: '进店率',
  radio: Math.round(Math.random() * 100),
}));

const Stores: FC<StoresProps> = ({ activeTab }) => {
  const [checkedKey, setCheckedKey] = useState<string>(items[0].title);

  const element: any = useRef(null);

  const moveCardScroll = (direction: string) => {
    const scrollLeft = element.current.scrollLeft;
    const clientWidth = element.current.clientWidth;
    const move = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
    element.current.scrollTo({
      left: move,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.storeContainer}>
      <ul ref={element}>
        {items.map((item) => (
          <li
            className={cs(checkedKey === item.title && styles.check)}
            key={item.title}
            onClick={() => setCheckedKey(item.title)}
          >
            <p className={styles.title}>{item.title}</p>
            <div className={styles.content}>
              <div className={styles.left}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.num}>{item.radio}%</p>
              </div>
              {activeTab === 'passengerflow' && (
                <div className={styles.process}>
                  <Progress
                    type='circle'
                    percent={item.radio}
                    showInfo={false}
                    width={63}
                    strokeWidth={26}
                    strokeLinecap='square'
                    strokeColor={`#006AFF`}
                    trailColor={'#F0F2F5'}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <LeftOutlined className={styles.leftIcon} onClick={() => moveCardScroll('left')} />
      <RightOutlined className={styles.rightIcon} onClick={() => moveCardScroll('right')} />
    </div>
  );
};

export default Stores;
