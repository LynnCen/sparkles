import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { Tooltip } from 'antd';

export interface ShowMoreProps {
  /**
   * @description 内容
   */
  text?: string | ReactNode;
  /**
   * @description 最大宽，建议table.columns.td的width设置比maxWidth多20px即可
   */
  maxWidth?: string;
  /**
   * @description 最小款
   */
  minWidth?: string;
  /**
   * @description 是否自动检测...的存在，只有存在时才提供Tip弹窗。 注意：大数据量场景不建议使用
   */
  automatic?: boolean;
  children?: ReactNode;
}
const ShowMore: FC<ShowMoreProps> = ({
  text,
  maxWidth = '210px',
  minWidth = '0px',
  automatic = true,
  children,
}) => {
  const ref: any = useRef();
  const [useful, setUseful] = useState<boolean>(false);
  useEffect(() => {
    if (automatic) {
      const target = ref.current;
      if (target.scrollWidth > target.clientWidth) {
        setUseful(true);
      }
    }
  }, []);
  const main = (text) => {
    return <div ref={ref} className={styles.showMore} style={{ maxWidth, minWidth }}>
      {children || text}
    </div>;
  };
  return (
    useful ? <Tooltip placement='top' title={text}>
      {main(text)}
    </Tooltip> : main(text)
  );
};

export default ShowMore;
