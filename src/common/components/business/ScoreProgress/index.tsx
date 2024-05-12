import {
  FC,
  useEffect,
  useRef,
  useState,
  useMemo,
  CSSProperties
} from 'react';
import cs from 'classnames';
import styles from './index.module.less';

interface ScoreProgressProps {
  className?: any;
  explainText?: string[]; // 评分区域说明
  targetIndex: number; // 当前指针所处的评分区域索引
  pointerImg: string; // 指针图片地址
  pointerOffset: number; // 指针偏移量，注意是百分比的值，例如偏移量是'50%',那么传入50
  explainTextStyle?: CSSProperties; // 评分区域文字自定义样式
  progressWrapperStyle?: CSSProperties; // 进度条容器自定义样式
  progressStyle?: CSSProperties; // 进度条自定义样式
};

const ScoreProgress: FC<ScoreProgressProps> = ({
  className,
  explainText = ['一般', '良好', '优秀'],
  targetIndex,
  pointerImg,
  pointerOffset,
  explainTextStyle,
  progressWrapperStyle,
  progressStyle,
}) => {
  const smallTickMark = Array.from(Array(15), (val, index) => index); // 小刻度线个数
  const [selfWidth, setSelfWidth] = useState<number>(0); // 当前容器宽度，默认值
  const selefRef: any = useRef(); // 当前dom元素

  useEffect(() => {
    if (!selefRef.current) return;
    // 获取当前容器宽度
    const { width } = selefRef.current.getBoundingClientRect();
    setSelfWidth(width);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 灰色覆盖物宽度
  const trailWidth = useMemo(() => {
    const itemWidth = selfWidth / explainText.length; // 每个评分区域的宽度
    // 容器宽度 - （单个评分区域宽度 * 当前所处的评分区域索引 + 指针在当前评分区域的偏移量）
    const width = selfWidth - (itemWidth * targetIndex + pointerOffset / 100 * itemWidth);
    // console.log(`selfWidth`, selfWidth);
    // console.log(`itemWidth`, itemWidth);
    // console.log(`targetIndex`, targetIndex);
    // console.log(`pointerOffset`, pointerOffset);
    return width;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfWidth, targetIndex, pointerOffset]);

  return (
    <div ref={selefRef} className={cs(styles.container, className)}>
      {/* 评分说明区域 */}
      <div className={styles.explainTextCon}>
        {
          explainText.map((item: any) => (<>
            <div className={cs(styles.explainTextItem, 'fs-12 color-help ct')} style={explainTextStyle}>
              {item}
            </div>
          </>))
        }
      </div>
      {/* 刻度线区域 */}
      <div className={styles.tickMarkCon}>
        {
          // 单个大刻度线区域
          explainText.map((item, index) => (<>
            <div className={cs(styles.largeTickLine, index === 0 ? styles.isFirst : '')}>
              {
                // 生成的小刻度线
                smallTickMark.map((samllItem, ind) => (
                  <div className={cs(
                    styles.smallTickLine,
                    (ind === smallTickMark.length - 1) ? styles.isLast : '')}>
                  </div>))
              }
              {/* 指针 */}
              {
                targetIndex === index && pointerImg ? (
                  <div className={styles.pointerImg}
                    style={{
                      left: `${pointerOffset}%`
                    }}>
                    <img
                      src={pointerImg}
                      width='100%'
                      height='100%'/>
                  </div>
                ) : null
              }
            </div>
          </>))
        }
      </div>
      {/* 进度条 */}
      <div
        className={styles.progressWrapper}
        style={progressWrapperStyle}>
        {/* 进度条容器 */}
        <div
          className={styles.progressOuter}
          style={progressStyle}>
          {/* 进度条未覆盖部分 */}
          <div className={styles.progressInter} style={{
            width: `${trailWidth}px`
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default ScoreProgress;
