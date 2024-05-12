import { FC, useMemo } from 'react';
import styles from '../entry.module.less';
import Header from '../Header';
import ChaptersCover from '../ChaptersCover';
import cs from 'classnames';
import Space from 'antd/lib/space';
import DoubleCircle from '../DoubleCircle';
import PdfTable from '../PdfTable';
import ModuleInfoWrapper from '@/common/components/Business/ModuleInfoWrapper';
import InfoItemWrapper from '@/common/components/Business/ModuleInfoWrapper/InfoItemWrapper';
import V2Title from '@/common/components/Feedback/V2Title';
import { Divider } from 'antd';
import DemographicChangesCharts from './components/DemographicChangesCharts';
import GdpGrowthCharts from './components/GdpGrowthCharts';
import { beautifyThePrice, isArray } from '@lhb/func';

const PeripheralData: FC<any> = ({
  detailInfo,
}) => {
  // 对数组分割
  const splitArrayRecursive = (arr, size) => {
    if (!(isArray(arr) && arr.length)) return [[]];
    if (arr.length <= size) {
      return [arr];
    } else {
      return [arr.slice(0, size)].concat(splitArrayRecursive(arr.slice(size), size));
    }
  };
  // 得三项为一个子数组的二维数组
  const splitArrayResult = useMemo(() => {
    if (!(isArray(detailInfo?.attentions) && detailInfo?.attentions.length)) return [[]];
    return splitArrayRecursive(detailInfo?.attentions, 3);
  }, [detailInfo?.attentions]);

  // // 周边人群columns
  const neighborhoodColumns = [
    {
      title: '查询范围',
      dataIndex: 'distance',
      width: 300,
      render: (text) => <span>{text || '-'}</span>
    },
    {
      title: '常住人口',
      dataIndex: 'peopleCount',
      width: 300,
      render: (text) => <span>{text || '-'}</span>
    },
    {
      title: '全市占比',
      dataIndex: 'rate',
      width: 300,
      render: (text) => <span>{text || '-'}</span>
    },
  ];

  return (
    <div className={styles.peripheralData}>
      <div className={cs(styles.overviewCon)}>
        <ChaptersCover
          sectionVal='02'
          title='周边数据'
          subheadingEn='Peripheral data'/>
      </div>
      {/* 每三个一页 */}
      {
        splitArrayResult?.map((everyPageData, index) => {
          return (
            <div className={cs(styles.firstPage)}>
              <Header
                hasIndex
                name='周边1公里重点关注数据'/>
              <div className={styles.content}>
                <Space direction='vertical' size={36}>
                  {
                    everyPageData.map((cur) => {
                      const column:any = [];
                      const data:any = [];
                      let poiCount = 0;
                      cur?.data?.map((item) => {
                        // POI点位总数 不在表格展示
                        if (item.code === '000000') {
                          poiCount = item.count;
                          return;
                        };
                        column.push({
                          title: item.name,
                          dataIndex: item.code,
                          width: 220,
                          render: (text: string|number) => (beautifyThePrice(text, ',', 0))
                        });
                        data[0] = {
                          ...data[0],
                          [item.code]: item.count
                        };
                      });
                      return (
                        <PdfTable
                          tableTitle={`${cur.name}(POI点位总数：${poiCount})`}
                          columns={column || {}}
                          dataSource={data || []}
                        />
                      );
                    })
                  }
                  {/* 最后一页的table少于两个就加入周边人群table */}
                  {(index === splitArrayResult.length - 1 &&
                  splitArrayResult[splitArrayResult.length - 1].length < 2 &&
                  detailInfo?.peopleInfos?.length
                  ) ? <PdfTable
                      tableTitle={'周边人群'}
                      columns={neighborhoodColumns}
                      dataSource={detailInfo?.peopleInfos}
                    /> : null}
                </Space>
              </div>
              <div className={styles.footer}>
                <DoubleCircle layout='vertical'/>
              </div>
            </div>
          );
        })
      }
      {/* 最后一页的table大于等于2个就单开周边人群table页面 */}
      { (splitArrayResult[splitArrayResult.length - 1].length >= 2 &&
        detailInfo?.peopleInfos?.length
      ) ? <div className={cs(styles.firstPage)}>
          <Header
            hasIndex
            name='周边1公里重点关注数据'/>
          <div className={styles.content}>
            <Space direction='vertical' size={36}>
              <PdfTable
                tableTitle={'周边人群'}
                columns={neighborhoodColumns}
                dataSource={detailInfo?.peopleInfos}
              />
            </Space>
          </div>
          <div className={styles.footer}>
            <DoubleCircle layout='vertical'/>
          </div>
        </div> : null}

      {/* 城市信息 */}
      <div className={cs(styles.firstPage)}>
        <Header
          hasIndex
          name='周边1公里重点关注数据'/>
        <div className={styles.content}>
          <V2Title
            divider
            type='H1'
            text={'城市信息'}
            style={{ marginBottom: 20 }}
          />
          <div className={styles.cityInformation}>
            <ModuleInfoWrapper
              title='城市概况'
              theme='dark'
            >
              <InfoItemWrapper
                columns={6}
                maxSize={6}
                data={detailInfo?.cityInfo?.cityOverview}
                theme='dark'/>
            </ModuleInfoWrapper>
            <Divider style={{ background: '#4D4D4D' }}/>
            <ModuleInfoWrapper
              title='经济概况'
              theme='dark'
            >
              <InfoItemWrapper
                columns={6}
                maxSize={6}
                data={detailInfo?.cityInfo?.economicOverview}
                theme='dark'
              />
            </ModuleInfoWrapper>
            <Divider style={{ background: '#4D4D4D' }}/>
            <ModuleInfoWrapper
              title='行政区概况'
              theme='dark'
            >
              <InfoItemWrapper
                columns={6}
                maxSize={12}
                data={detailInfo?.cityInfo?.administrativeOverview}
                theme='dark'
              />
            </ModuleInfoWrapper>
          </div>
        </div>
        <div className={styles.footer}>
          <DoubleCircle layout='vertical'/>
        </div>
      </div>
      {/* 城市信息图表 */}
      <div className={cs(styles.firstPage)}>
        <Header
          hasIndex
          name='周边1公里重点关注数据'/>
        <div className={styles.content}>
          <V2Title
            divider
            type='H1'
            text={'城市信息'}
            style={{ marginBottom: 20 }}
          />
          <Space direction='horizontal' size={16}>
            <div className={styles.chartsContent}>
              <DemographicChangesCharts
                data={detailInfo?.cityPeopleHistogram}
                title={detailInfo?.shopInfo?.city || '杭州'}
              />
            </div>
            <div className={styles.chartsContent}>
              <GdpGrowthCharts
                data={detailInfo?.cityGdpHistogram}
                title={detailInfo?.shopInfo?.city || '杭州'}
              />
            </div>
          </Space>
        </div>
        <div className={styles.footer}>
          <DoubleCircle layout='vertical'/>
        </div>
      </div>
    </div>
  );
};

export default PeripheralData;
