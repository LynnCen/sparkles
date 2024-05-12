/* 客流卡片 */
import React from 'react';
import { Col, Tooltip } from 'antd';
import IconFont from '@/common/components/IconFont';
import { CardProps } from './ts-config';
import { InfoCircleOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import cs from 'classnames';
import styles from './index.module.less';
import { valueFormat } from '@/common/utils/ways';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

// const card = [
//   { name: '进店客流', icon: 'icon-jindian1', backgroundColor: '#ECF6FE', shadowColor: '#D2E9FF' },
//   { name: '过店客流', icon: 'icon-guodian1', backgroundColor: '#FEF3F9', shadowColor: '#FFDBF0' },
//   { name: '进店率', icon: 'icon-filter-filledbeifen', backgroundColor: '#FDF4EA', shadowColor: '#FFE4C5' },
//   { name: '平均停留时长', icon: 'icon-shichang', backgroundColor: '#F1F1FE', shadowColor: '#CECDFF' },
//   { name: '店内销售额（元）', icon: 'icon-xiaoshou', backgroundColor: '#E4FAFE', shadowColor: '#B5F3FF' },
//   { name: '店内订单（笔）', icon: 'icon-dingdan', backgroundColor: '#F4FFFB', shadowColor: '#C3F1E8' },
//   { name: '转化率', icon: 'icon-zhuanhualv', backgroundColor: '#ECF6FE', shadowColor: '#D2E9FF' },
//   { name: '客单价（元）', icon: 'icon-kedanjia', backgroundColor: '#E4FAFE', shadowColor: '#B5F3FF' },
// ];

const Indicator: React.FC<CardProps> = ({
  count,
  label,
  title,
  ratio,
  ratioFlag, // 1 上升  其他(0/-1)下降
  icon,
  backgroundColor,
  totalLabel,
  totalTitle,
  totalCount,
  nullLabel = undefined,
  col = 8,
  showTooltip = true,
  importTitle,
  resetCardStyle = {},
  countType = 'default'
}) => {

  /** 格式化时间 */
  const formatTime = (val:string|number) => {
    if (!val || isNaN(Number(val))) return '-';
    const duration = dayjs.duration(Number(val), 'seconds');
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    if (hours > 0) {
      return <span>
        {hours}<span className={styles.unit}> h </span>
        {minutes}<span className={styles.unit}> min </span>
        {seconds}<span className={styles.unit}> s </span>
      </span>;
    } else if (minutes > 0) {
      return <span>
        {minutes}<span className={styles.unit}> min </span>
        {seconds}<span className={styles.unit}> s </span>
      </span>;
    } else {
      return <span>{seconds}<span className={styles.unit}> s </span></span>;
    }
  };

  return (
    <Col span={col}>
      <div className={styles.card} style={{ ...resetCardStyle }}>
        <div className={styles.topStyle}>
          <div className={styles.left}>
            <p className={styles.title}>
              {title}
              {showTooltip && (
                <Tooltip title={label}>
                  <InfoCircleOutlined className={styles.infoIcon} />
                </Tooltip>
              )}
            </p>
            <div className={styles.content}>
              <Tooltip title={nullLabel}>
                {countType === 'time'
                  ? <div className={styles.time}>{formatTime(count)}</div>
                  : <div className={styles.number}>{valueFormat(count)}</div>
                }
              </Tooltip>
              {!!ratio && (
                <Tooltip title={`环比${ratioFlag === 1 ? '上升' : '下降'}${ratio}%`}>
                  <div className={cs(styles.ratioStyle, ratioFlag === 1 ? styles.upStyle : styles.downStyle)}>
                    ({ratioFlag === 1 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    {ratio}%)
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
          {icon ? (
            <div className={styles.right} style={{ backgroundColor: backgroundColor }}>
              <IconFont iconHref={icon} />
            </div>
          ) : null}
        </div>
        {totalTitle && (
          <p className={styles.total}>
            <Tooltip title={totalLabel}>{totalTitle}：</Tooltip>
            <Tooltip title={nullLabel}>
              {countType === 'time'
                ? <span className={styles.time}>{formatTime(totalCount)}</span>
                : <span className='pointer'>{valueFormat(totalCount)}</span>
              }
            </Tooltip>
          </p>
        )}
        {importTitle && (
          <p className={styles.total}>
            <Tooltip title={importTitle}>{importTitle}</Tooltip>
          </p>
        )}
      </div>
    </Col>
  );
};

export default Indicator;
