// 综合评估
import { Typography, Image, Row, Col } from 'antd';
import { FC, ReactNode } from 'react';
import cs from 'classnames';
import { replaceEmpty } from '@lhb/func';
import styles from './index.module.less';
import IconFont from '@/common/components/Base/IconFont';

const { Text } = Typography;

interface AssessInfoProps {
  data?:any; // 数据
  infoTipsNumber?:number; // 详情展示的条数，默认2
  leftSlot?:ReactNode; // 左侧插槽
  rightBtn?:boolean; // 右侧按钮
  rightBtnOnClick?:()=>void; // 右侧按钮
}

const AssessInfo: FC<AssessInfoProps> = ({
  data = {},
  infoTipsNumber = 3,
  leftSlot,
  rightBtn = false,
  rightBtnOnClick = () => {},
}) => {
  return (
    <div className={cs(styles.assessInfo, styles[leftSlot ? 'small-bg' : 'big-bg'])} >
      {/* 左侧插槽 */}
      <div className={ styles[leftSlot ? 'title' : '']}>
        {leftSlot}
      </div>
      {/* 分数 */}
      <div className={styles.scoreBox}>
        {/* 用来纵向居中套一层盒子 */}
        <div className={styles.scoreContainer}>
          <div className={styles.scoreTop}>
            <span className={styles.score}>{replaceEmpty(data?.leftCard?.score)}</span><span className={styles.scoreTitle}>{replaceEmpty(data?.leftCard?.title)}</span>
          </div>
          <Text ellipsis={{ tooltip: data?.leftCard?.detailInfos?.[0] }} style={{ width: 108 }} className={styles.scoreTips}>{replaceEmpty(data?.leftCard?.detailInfos?.[0])}</Text>
        </div>
      </div>
      {/* 信息盒子 */}
      <div className={styles.info}>
        <div className={styles.infoTitle}>
          {replaceEmpty(data?.rightCard?.title)}
          {/* {`${data?.rightCard?.title}${data?.rightCard?.score}`} */}
          {typeof +data?.rightCard?.score === 'number' && +data?.rightCard?.score <= 3 && <Image
            width={22}
            height={24}
            preview={false}
            className={styles.infoIcon}
            src='https://staticres.linhuiba.com/project-custom/pms/icon/no1.png'
          />}
        </div>
        <div className={styles.infoTipBox}>
          <Row gutter={24}>
            { data?.rightCard?.detailInfos.map((item, index) => {
              if (index + 1 > infoTipsNumber) return;
              return <Col span={8} key={index}><Text
                ellipsis={{ tooltip: item }}
                className={styles.infoTip}>
                {item}
              </Text></Col>;
            })}
          </Row>
        </div>
      </div>
      {/* 右侧按钮插槽 */}
      {rightBtn && <div className={styles.rightIconBox} onClick={rightBtnOnClick}>
        <IconFont iconHref='iconic_zhuanjiao_seven' className={styles.rightIcon} />
      </div>}
    </div>
  );
};

export default AssessInfo;
