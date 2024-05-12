import { FC, useEffect, useState } from 'react';
import { isArray, isNotEmptyAny } from '@lhb/func';

import Radar from '@/common/components/EChart/Radar';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import V2Table from '@/common/components/Data/V2Table';
// import Empty from '@/common/components/Empty';
import V2Empty from '@/common/components/Data/V2Empty';

import { IndicatorType, ModuleDetailsType } from '../type';
import styles from '../index.module.less';
import { fixNumber } from '@/common/utils/ways';
import { Typography } from 'antd';


interface AreaScoreProps {
  data: ModuleDetailsType;
  [p: string]: any;
}

const AreaScore: FC<AreaScoreProps> = ({ data }) => {
  const [radarData, setRadarData] = useState<number[] | undefined>(); // 雷达图角数组
  const [indicator, setIndicator] = useState<IndicatorType[] | undefined>(); // 雷达图数据标准项

  useEffect(() => {
    if (!data.radarModule?.scoreGroups || !isArray(data.radarModule?.scoreGroups)) {
      return;
    }
    const indicator = data.radarModule.scoreGroups.map((item) => ({
      name: item.name,
      max: 100,
    }));
    const radarData = data.radarModule.scoreGroups.map((item) => item.score);

    setIndicator(indicator);
    setRadarData(radarData);
  }, [data.radarModule]);

  const onLoad = async () => {
    const { radarModule } = data;
    if (!isArray(radarModule?.scoreGroups)) {
      return {
        dataSource: [],
        count: 0,
      };
    }
    const objectList = radarModule?.scoreGroups.map((item) => ({
      ...item,
      key: item.name,
    }));

    return {
      dataSource: objectList,
      count: objectList?.length,
    };
  };

  /** 区域评分信息-表格组件表头 */
  const defaultColumns = [{
    key: 'name',
    title: '评估指标',
    width: 150,
    dragChecked: true,
    render: (value) => {
      return (
        <Typography.Text
          style={{ width: 98 }}
          className={styles.customTip}
          ellipsis={{ tooltip: value }}>
          { isNotEmptyAny(value) ? value : '-' }
        </Typography.Text>
      );
    },
  },
  {
    key: 'score',
    title: '得分',
    width: 'auto',
    dragChecked: true,
    render: (value) => {
      return isNotEmptyAny(value) ? value : '-';
    },
  },
  {
    key: 'weightScore',
    title: '加权分',
    width: 'auto',
    dragChecked: true,
    render: (value) => {
      return isNotEmptyAny(value) ? value : '-';
    },
  },
  {
    key: 'weight',
    title: '权重值',
    width: 100,
    dragChecked: true,
    render: (value) => {
      // js 浮点数精度问题，0.55 * 100 = 55.00000000000001
      if (isNotEmptyAny(value)) {
        const val = fixNumber(value * 100); // 可能是浮点数，也有可能是整数
        // 比如val是55.00
        if (+val === parseInt(val as string)) {
          return `${+val}%`;
        }
        return `${val}%`;
      }
      return '-';
      // return isNotEmptyAny(value) ? (value * 100 + '%') : '-';
    },
  },
  ];

  return (
    <div className={styles.areaScore}>
      <TitleTips name={data.moduleTypeName} showTips={false} />
      <div className={styles.areaScoreConatin}>
        <div className={styles.rader}>
          {/* 综合得分 */}
          <div className={styles.totalScore}>
            <span className={styles.tips}>综合得分 </span>
            <span className={styles.score}>{data.radarModule?.shopScore || 0}</span>
            <span className={styles.unit}>分</span>
          </div>

          {/* 雷达图 */}
          {indicator && radarData ? (
            <Radar
              data={radarData}
              indicator={indicator}
              title={Math.round(data.radarModule?.shopScore || 0)}
              titleLabel='总分'
              radius={60}
              height='226px'
              titleTextFontSize={['16px', '10px']}
              radarInfo={{
                rich: {
                  a: {
                    color: '#999999',
                    lineHeight: 18,
                    fontSize: '10px',
                    align: 'center',
                  },
                  b: {
                    color: '#222222',
                    align: 'center',
                    fontWeight: 'bolder',
                    fontSize: '12px',
                  },
                },
              }}
              shape='polygon'
              startAngle={90}
            />
          ) : (
            <V2Empty customTip={<div className='fs-14 c-222'>暂无内容</div>} />
          )}
        </div>

        {/* 表格 */}
        <div className={styles.table}>
          <V2Table
            rowKey='name'
            onFetch={onLoad}
            type='easy'
            childrenColumnName='scoreItems'
            defaultColumns={defaultColumns}
            pagination={false}
            scroll={{ y: 280 }}
            indentSize={0}
            hideColumnPlaceholder
          />
        </div>
      </div>
    </div>
  );
};

export default AreaScore;

