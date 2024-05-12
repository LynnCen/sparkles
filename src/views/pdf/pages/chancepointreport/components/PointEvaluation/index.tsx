import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import { Col, Row } from 'antd';
import V2Title from '@/common/components/Feedback/V2Title';
import { PageLayout } from '../../../areareport/components/Layout';
import { ChancePdfPageClass } from '../../ts-config';
import cs from 'classnames';
import { IndicatorType } from '@/common/components/business/ExpandStore/ChancePointDetail/components/Deatil/type';
import { isArray, isNotEmptyAny } from '@lhb/func';
import Radar from '@/common/components/EChart/Radar';
import V2Table from '@/common/components/Data/V2Table';
import { fixNumber } from '@/common/utils/ways';

interface PointEvaluationProps{
  [k:string]:any
}
const PointEvaluation:React.FC<PointEvaluationProps> = ({ pointEvalutionData, homeData }) => {
  const { radarModule } = pointEvalutionData;
  const { shopScoreDescription, shopScoreRange, scoreGroups } = radarModule;
  const [radarData, setRadarData] = useState<number[] | undefined>(); // 雷达图角数组
  const [indicator, setIndicator] = useState<IndicatorType[] | undefined>(); // 雷达图数据标准项

  useEffect(() => {
    if (!radarModule?.scoreGroups || !isArray(radarModule?.scoreGroups)) {
      return;
    }
    const indicator = radarModule.scoreGroups.map((item) => ({
      name: item.name,
      max: 100,
    }));
    const radarData = radarModule.scoreGroups.map((item) => item.score);

    setIndicator(indicator);
    setRadarData(radarData);
  }, [radarModule]);

  const createNewArr = (data, key) => {
    // data 需要处理的表格数据 key 就是需要合并单元格的唯一主键，我这里是id
    return data
      .reduce((result, item) => {
        // 首先将key字段作为新数组result取出
        if (result.indexOf(item[key]) < 0) {
          result.push(item[key]);
        }
        return result;
      }, [])
      .reduce((result, value, rownum) => {
        // 将key相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
        const children = data.filter((item) => item[key] === value);
        result = result.concat(
          children.map((item, index) => ({
            ...item,
            rowSpan: index === 0 ? children.length : 0, // 将第一行数据添加rowSpan字段
            rownum: rownum + 1
          }))
        );
        return result;
      }, []);
  };


  const dataSource = useMemo(() => {
    if (!isNotEmptyAny(scoreGroups)) return [];
    const data:Array<any> = [];
    let count = 0;
    scoreGroups.map((item,) => {
      item?.scoreItems.forEach((el, index) => {
        const newItem = {
          id: count++,
          key: index,
          ...item,
          ...el,
          scoreType: item.name,
          scoringDimensions: el.name,
        };
        data.push(newItem);
      });
    });
    return createNewArr(data, 'scoreType');
    // console.log('data', data);
    // return data;

  }, [radarModule]);

  /** 区域评分信息-表格组件表头 */
  const defaultColumns = [{
    key: 'scoreType',
    title: '评分类型',
    width: 95,
    dragChecked: true,
    onCell: (record) => ({ rowSpan: record.rowSpan }),
  },
  {
    key: 'scoringDimensions',
    title: '评分维度',
    dragChecked: true,
    width: 167,
  },
  {
    key: 'score',
    title: '得分',
    dragChecked: true,
    width: 89
  },
  {
    key: 'weightScore',
    title: '加权分',
    dragChecked: true,
    width: 78,
    render: (value) => {
      return isNotEmptyAny(value) ? value : '-';
    },
  },
  {
    key: 'weight',
    title: '权重值',
    dragChecked: true,
    width: 167,
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
  return <PageLayout
    title='点位评估'
    logo={homeData?.standardChancePointReportLogo}
    // moduleCount={Number('03')}
    // totalPage={32}
    // currentPage={Number('04')}
    childClass={ChancePdfPageClass}
  >
    <Row gutter={[16, 32]}>
      <Col span={24}>
        <div className={cs(styles.wrapper, styles.distanceWrapper)}>
          {
            radarModule?.shopScore && <div className={styles.score}>
              <span className={styles.digit}>{radarModule?.shopScore}</span>
              <span className={styles.text}>综合得分</span>
            </div>
          }
          {/* 雷达图 */}
          {indicator && radarData && (
            <Radar
              data={radarData}
              indicator={indicator}
              // title={Math.round(data.radarModule?.shopScore || 0)}
              // titleLabel='总分'
              radius={60}
              height='260px'
              titleTextFontSize={['16px', '10px']}
              radarInfo={{
                rich: {
                  a: {
                    color: '#999999',
                    lineHeight: 24,
                    fontSize: '14px',
                    align: 'center',
                  },
                  b: {
                    color: '#222222',
                    align: 'center',
                    fontWeight: 'bolder',
                    fontSize: '16px',
                  },
                },
              }}
              shape='polygon'
              startAngle={90}
            />
          )}
        </div>
        {
          (shopScoreDescription || shopScoreRange) && <div className={cs(styles.wrapper)}>
            <div className={styles.scoreRange}>{shopScoreRange}分</div>
            <div className={styles.scoreDesc}>{shopScoreDescription}</div>
          </div>
        }
      </Col>
      <Col span={24}>
        <V2Title divider type='H2' text='维度解读' style={{ marginBottom: 16 }}/>
        <V2Table
          rowKey='name'
          onFetch={() => {
            return {
              dataSource,
            };
          }}
          type='easy'
          defaultColumns={defaultColumns}
          pagination={false}
          hideColumnPlaceholder
        />
      </Col>
    </Row>

  </PageLayout>;
};

export default PointEvaluation;
