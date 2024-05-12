import { Col, Typography } from 'antd';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import { valueFormat } from '@/common/utils/ways';
import styles from './index.module.less';

const { Paragraph, Link } = Typography;

interface IProps {
  title: ReactNode; // 名称
  value?: string | number; // 内容
  colon?: boolean; // 冒号-默认为true
  titleClass?: string; // title的样式
  valueClass?: string; // value的样式
  span?: number;
  row?: number; // 省略的行数-如果传入内容是string或number类型则默认一行省略
  linkUrl?: string; // 要跳转的页面-如果有跳转链接，则使用link，新开页面跳转
  children?: ReactNode;
}

const DetailInfo: FC<IProps> = ({
  title,
  value,
  colon = true,
  titleClass,
  valueClass,
  span = 6,
  row = 1,
  children,
  linkUrl,
}) => {
  const colWrap: any = useRef(null);
  const titleWrap: any = useRef(null);
  const [width, setWidth] = useState<number>(100);

  useEffect(() => {
    if (colWrap.current && titleWrap.current) {
      // 动态获取剩余的宽度-用于超出省略的宽度固定
      const colWidth = colWrap.current.clientWidth;
      const titleWidth = titleWrap.current.clientWidth;
      if (colWidth - titleWidth > 0) {
        setWidth(colWidth - titleWidth);
      }
    }
  }, []);

  return (
    <Col span={span} className={'mb-10'} ref={colWrap}>
      <div className={styles.cardWrap}>
        <div className={cs(styles.title, 'c-656', titleClass)} ref={titleWrap}>
          {title}
          {colon && '：'}
        </div>
        <div className={cs(styles.value, 'c-132', valueClass)}>
          {children || (
            <Paragraph style={{ width: width }} ellipsis={{ rows: row, tooltip: value }}>
              {linkUrl && value ? (
                <Link href={linkUrl} target='_blank'>
                  {value}
                </Link>
              ) : (
                valueFormat(value)
              )}
            </Paragraph>
          )}
        </div>
      </div>
    </Col>
  );
};

export default DetailInfo;
