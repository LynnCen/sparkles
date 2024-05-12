import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import { Table, Row, Col } from 'antd';
import ShowMore from '@/common/components/FilterTable/ShowMore';
import { shop, street } from '../ts-config';
import { scoreInterpret } from '@/common/api/storemanage';
import Radar from '@/common/components/EChart/Radar';

const columns = [
  { title: '评估指标', dataIndex: 'name', width: 80 },
  { title: '得分', dataIndex: 'score', render: (_) => <span>{_?.toFixed(2)}</span>, width: 70 },
  { title: '权重值', dataIndex: 'weight', width: 70 },
  { title: '加权得分', dataIndex: 'weightScore', render: (_) => <span>{_?.toFixed(2)}</span>, width: 80 },
  { title: '建议', width: 240, dataIndex: 'conclusion', render: (text) => <ShowMore maxWidth='240px' text={text} /> }
];
const GradeInfo:FC<any> = ({
  result
}) => {
  const [indicator, setIndicator] = useState<any>(null);
  const [radarData, setRadarData] = useState<any>(null);
  const [tableData, setTableData] = useState<any>([]);

  const getRadarData = () => {
    let configList: any = [];
    result.shopCategory === 1 && (configList = shop);
    result.shopCategory === 2 && (configList = street);
    const columns = configList.map(item => {
      return { name: item.name, max: 100 };
    });
    setIndicator(columns);
    const radarData = configList.map(item => result[item.score]);
    setRadarData(radarData);
  };
  const getTableData = async (params) => {
    const { data } = await scoreInterpret(params);
    const tableList: any = [];
    let configList: any = [];
    result.shopCategory === 1 && (configList = shop);
    result.shopCategory === 2 && (configList = street);
    configList.forEach(item => {
      const scoreItem: any = {};
      Object.keys(item).forEach(key => {
        if (key === 'name') {
          scoreItem[key] = item[key];
          return;
        }
        if (key === 'weight') {
          scoreItem[key] = data[item[key]] * 100 + '%';
          return;
        }
        scoreItem[key] = data[item[key]];
      });
      tableList.push(scoreItem);
    });
    setTableData([...tableList]);
  };
  useEffect(() => {
    if (!result) return;
    const params: any = {
      shopCategory: result.shopCategory
    };
    result.shopCategory === 1 && shop.forEach(item => {
      params[item.score] = result[item.score];
    });
    result.shopCategory === 2 && street.forEach(item => {
      params[item.score] = result[item.score];
    });
    getTableData(params);
    getRadarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);
  return (
    <div className={styles.gradeInfoCon}>
      <div className={cs(styles.title, 'mt-16')}>区域评分信息</div>
      <div className={styles.scoreBody}>
        <Row>
          <Col className={styles.echarts} span={9}>
            <div>
              <span className='lh-20 fn-14 bold c-959 mr-12'>综合总分</span>
              <span className={cs(styles.rightRankSpan, 'fn-30 bold c-ff8 lh-42')}>{Math.round(result.shopScore)}分</span>
            </div>
            <div className={cs(styles.suggest, 'mt-8 c-132 pl-16 fn-14')}>
              <div className={styles.trangle}></div>
              {result.shopScoreConclusion}
            </div>
            {indicator && radarData && <Radar
              data={radarData}
              indicator={indicator}
              title={Math.round(result.shopScore)}
              titleLabel='总分'
              radius={100}
              height='280px'
              seriesInfo={{}}
              radarInfo={{
                rich: {
                  a: {
                    color: '#86909C',
                    lineHeight: 20,
                    fontSize: '12px',
                  },
                  b: {
                    color: '#656E85',
                    align: 'center',
                    fontWeight: 'bolder',
                    fontSize: '12px'
                  }
                },
              }}
            />}
          </Col>

          <Col className={cs(styles.rightCon, 'left pl-24')} span={15}>
            <Table
              scroll={{ y: 580 }}
              rowKey={'name'}
              columns={columns}
              dataSource={tableData}
              pagination={false}
              className={styles.table}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default GradeInfo;
