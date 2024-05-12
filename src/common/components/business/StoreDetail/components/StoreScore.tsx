/**
 * @Description 机会点详情、备选址详情、储备店详情共用的展示
 *              包括基本信息、店铺评分
 */
import { Button, Col, Row, Table } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import DetailInfo from '@/common/components/business/DetailInfo';
import styles from '../index.module.less';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import ShowMore from '@/common/components/FilterTable/ShowMore';
import ApproveDetail from './Asics/ApproveDetail';
import { getChancePoint, getChancePointAsics, getReportScore, getReportScoreAsics } from '@/common/api/storemanage';
import cs from 'classnames';
import Radar from '@/common/components/EChart/Radar';
import { downloadFile, fixNumber, valueFormat } from '@/common/utils/ways';
import { post } from '@/common/request';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { isArray } from '@lhb/func';
import IconFont from '@/common/components/IconFont';

const StoreScore: FC<any> = ({
  result,
  showAuditInfo,
  showExportBtn,
  isBabyCare,
  isAsics,
  isChancepoint,
  isAlternative,
  isReserve,
  id,
}) => {
  const [tableData, setTableData] = useState<any>([]);
  const [indicator, setIndicator] = useState<any>(null);
  const [radarData, setRadarData] = useState<any>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const path = isAsics ? '/storemanage/scoredetailasics' : '/storemanage/scoredetail';
  const [hasPDFPermission, setHasPDFPermission] = useState<boolean>(false);
  const [hasProjectCalculationPermission, setHasProjectCalculationPermission] = useState<boolean>(false);
  const [has3KilometersAroundPermission, setHas3KilometersAroundPermission] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false); // 审批详情抽屉

  useEffect(() => {
    if (Array.isArray(result.permissions)) {
      const pdfs = result.permissions.filter((item) => item.event === 'chancePoint:pcPDF');
      if (Array.isArray(pdfs) && pdfs.length === 1) {
        setHasPDFPermission(true);
      }

      const projects = result.permissions.filter((item) => item.event === 'chancePoint:ProjectCalculation');
      if (Array.isArray(projects) && projects.length === 1) {
        setHasProjectCalculationPermission(true);
      }

      const arounds = result.permissions.filter((item) => item.event === 'chancePoint:3KilometersAround');
      if (Array.isArray(arounds) && arounds.length === 1) {
        setHas3KilometersAroundPermission(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);
  useEffect(() => {
    if (!result) return;
    getTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const columns = useMemo(() => {
    if (isAsics) {
      return [
        { title: '评估指标', dataIndex: 'name', width: 80 },
        { title: '得分', dataIndex: 'score', render: (_) => <span>{_?.toFixed(2)}</span>, width: 70 },
        { title: '权重值', dataIndex: 'weight', width: 70 },
        { title: '加权得分', dataIndex: 'weightScore', render: (_) => <span>{_?.toFixed(2)}</span>, width: 80 },
      ];
    }
    return [
      { title: '评估指标', dataIndex: 'name', width: 80 },
      { title: '得分', dataIndex: 'score', render: (_) => <span>{_?.toFixed(2)}</span>, width: 70 },
      { title: '权重值', dataIndex: 'weight', width: 70 },
      { title: '加权得分', dataIndex: 'weightScore', render: (_) => <span>{_?.toFixed(2)}</span>, width: 80 },
      {
        title: '建议',
        width: 340,
        dataIndex: 'scoreConclusion',
        render: (text) => <ShowMore maxWidth='440px' text={text} />,
      },
    ];
  }, [isAsics]);
  const getTableData = async () => {
    const {
      shopInformation,
      mallInformation,
      engineCondition,
      surroundFacility,
      trafficOverview,
      flowInformation,
      takeawayAtmosphere,
      businessInformation,
      competeBrandOverview,
      earnEstimate,
      shopInformationAsics,
      operateEnvironmentAsics,
      flowMatchAsics,
      competeEnvironmentAsics,
      earnEstimateAsics,
      businessInformationAsics,
    } = result || {};
    let func;
    if (isChancepoint && isAsics) {
      // 机会点下的亚瑟士
      func = getChancePointAsics;
    } else if (isChancepoint && !isAsics) {
      // 机会点--普通租户
      func = getChancePoint;
    } else if (!isChancepoint && isAsics) {
      // 拓店调研报告--备选址、储备店下的亚瑟士
      func = getReportScoreAsics;
    } else {
      // 拓店调研报告--备选址、储备店下--普通租户
      func = getReportScore;
    }
    let data: any;
    if (isAsics) {
      data = await func({
        shopInformationAsics,
        operateEnvironmentAsics,
        flowMatchAsics,
        competeEnvironmentAsics,
        earnEstimateAsics,
        businessInformationAsics,
      });
    } else {
      data = await func({
        shopInformation,
        mallInformation,
        engineCondition,
        surroundFacility,
        trafficOverview,
        flowInformation,
        takeawayAtmosphere,
        businessInformation,
        competeBrandOverview,
        earnEstimate,
      });
    }

    setTableData(data);
    getRadarData(data.scoreGroups);
  };
  const getRadarData = (scoreGroups) => {
    if (!isArray(scoreGroups) || !scoreGroups.length) return;
    const columns = scoreGroups.map((item) => {
      return { name: item.name, max: 100 };
    });
    setIndicator(columns);
    const radarData = scoreGroups.map((item) => item.score);
    setRadarData(radarData);
  };

  const content = (item) => (
    <Col span={4}>
      <div className={styles.labelCon}>
        <div>
          <span className={styles.number}>{valueFormat(item.data)}</span>
          <span className={styles.unit}>{item.unit}</span>
        </div>
        <div className={styles.label}>{item.label}</div>
      </div>
    </Col>
  );

  const exportReportHandle = () => {
    if (isAsics) {
      setExportLoading(true);
      post('/chancePoint/asics/exportUrl', { id: result.id }, true)
        .then((res) => {
          setExportLoading(false);
          if (res.url) {
            downloadFile({
              name: res.name,
              url: res.url,
            });
          }
        })
        .catch(() => setExportLoading(false));
    } else {
      downloadFile({
        name: '奥体印象城项目报告.pdf',
        url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/奥体印象城项目报告.pdf',
      });
    }
  };

  const jumpAprroveResults = () => {
    setDrawerVisible(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.topCon}>
        <div className={styles.topTitle}>{result.chancePointName || result.reportName}</div>
        {showExportBtn && (isBabyCare || (isAsics && isChancepoint)) && (
          <Button loading={exportLoading} onClick={exportReportHandle} className={styles.exportBtn} type='primary'>
            报告导出
          </Button>
        )}
        {/* 根据权限判断是否导出demo pdf（https://confluence.lanhanba.com/pages/viewpage.action?pageId=67520234） */}
        {showExportBtn && hasPDFPermission && (
          <Button
            loading={exportLoading}
            onClick={() =>
              window.open('https://staticres.linhuiba.com/project-custom/locationpc/file/北京合生汇购物中心1001.pdf ')
            }
            className={styles.exportBtn}
            type='primary'
          >
            报告导出
          </Button>
        )}
      </div>
      {showAuditInfo ? (
        <div className={styles.card}>
          <Row gutter={[16, 0]}>
            <DetailInfo title='当前阶段' value={result.shopStatusName} />
            <DetailInfo title='调研时间' value={result.submitTime} />
            <DetailInfo span={12} title='责任人' value={result.responsibleName} />
            {!isAsics && <>
              <DetailInfo title='审批结果' value={result.approvalStatusName} />
              <DetailInfo title='审批意见' value={result.approvalRemark} />
              <DetailInfo title='审批人' value={result.approverName} />
              <DetailInfo title='审批时间' value={result.approvalTime}/>
            </>}
          </Row>
          {!!isAsics && <Row>
            <DetailInfo span={18} title='审批结果' value={result.approvalStatusName} />
            <div className={styles.viewMore} onClick={jumpAprroveResults}>
              <span className='fs-12 c-006 pl-6 pr-6'>查看审批详情</span>
              <IconFont iconHref='iconarrow-right' className='fs-12 c-006'/>
            </div>
          </Row>}
        </div>
      ) : null}

      {/* 项目测算 */}
      {hasProjectCalculationPermission ? (
        <div className={styles.project}>
          <TitleTips name='项目测算' showTips={false} className={styles.tips} />

          <div className={styles.row}>
            <Row gutter={[64, 16]}>
              {content({ data: valueFormat(result?.projectCalculation.flow), unit: '人', label: '日均过店客流' })}
              {content({
                data: valueFormat(result?.projectCalculation.flowWeekday),
                unit: '人',
                label: '工作日日均过店客流',
              })}
              {content({
                data: valueFormat(result?.projectCalculation.flowWeekend),
                unit: '人',
                label: '节假日日均过店客流',
              })}
              {content({ data: valueFormat(result?.projectCalculation.rent), unit: '元/年', label: '租金报价' })}
              {content({ data: valueFormat(result?.projectCalculation.contractPeriod), unit: '', label: '合同期限' })}
              <Col span={1}></Col>
              {content({
                data: valueFormat(result?.projectCalculation.estimatedSaleDaily),
                unit: '元',
                label: '预计日销售额',
              })}
              {content({
                data: valueFormat(result?.projectCalculation.dailyInsurancePoint),
                unit: '元',
                label: '日保本点',
              })}
              {content({
                data: valueFormat(result?.projectCalculation.totalInvestment),
                unit: '元',
                label: '投资总额',
              })}
              {content({ data: valueFormat(result?.projectCalculation.profitRate), unit: '%', label: '利润率' })}
            </Row>
          </div>
        </div>
      ) : null}

      {/* 周边3公里demo数据 */}
      {has3KilometersAroundPermission ? (
        <div className={styles.around}>
          <div className={styles.table}>
            <Table
              pagination={false}
              bordered={true}
              dataSource={[
                {
                  key: '1',
                  store: '周边门店A',
                  address: '朝阳区西大路2号',
                  date: '2022-5-1',
                  sale: '9653元',
                  distance: '2.5公里',
                  distanceRed: false,
                  hasProtection: '无争议',
                  hasProtectionRed: false,
                },
                {
                  key: '2',
                  store: '周边门店B',
                  address: '朝阳区百子湾南二路西66号',
                  date: '2022-9-10',
                  sale: '10213元',
                  distance: '1公里',
                  distanceRed: true,
                  hasProtection: '已沟通无异议',
                  hasProtectionRed: true,
                },
              ]}
              columns={[
                {
                  title: '周边三公里门店',
                  dataIndex: 'store',
                  key: 'store',
                },
                {
                  title: '门店地址',
                  dataIndex: 'address',
                  key: 'address',
                },
                {
                  title: '开业时间',
                  dataIndex: 'date',
                  key: 'date',
                },
                {
                  title: '日均销售额',
                  dataIndex: 'sale',
                  key: 'sale',
                },
                {
                  title: '距离本店',
                  dataIndex: 'distance',
                  key: 'distance',
                  render: (text, record) => (record.distanceRed ? <div className='c-f23'>{text}</div> : text),
                },
                {
                  title: '是否存在保护区争议',
                  dataIndex: 'hasProtection',
                  key: 'hasProtection',
                  render: (text, record) => (record.hasProtectionRed ? <div className='c-f23'>{text}</div> : text),
                },
              ]}
            />
          </div>
        </div>
      ) : null}
      <div className={styles.score}>
        <TitleTips name='店铺评分' showTips={false} className={styles.tips} />
        <div className={styles.scoreBody}>
          <div className={styles.echartsCon}>
            <div className={styles.echartsScore}>
              <span className='lh-20 fn-14 bold c-959 mr-12'>综合总分</span>
              <span className={cs(styles.rightRankSpan, 'fn-30 bold c-ff8 lh-42')}>
                {fixNumber(tableData.shopScore)}分
              </span>
              <div className={styles.ecahrtDetail}>
                ( {tableData.scoreConclusion},
                <span
                  className={styles.echartsLink}
                  onClick={() =>
                    dispatchNavigate(
                      `${path}?id=${id}&isChancepoint=${!!isChancepoint}&isAlternative=${!!isAlternative}&isReserve=${!!isReserve}`
                    )
                  }
                >
                  查看详细解析
                </span>{' '}
                )
              </div>
            </div>
            {indicator && radarData && (
              <Radar
                data={radarData}
                indicator={indicator}
                title={fixNumber(tableData.shopScore)}
                titleLabel='总分'
                radius={100}
                height='330px'
                axisNameFontSize={['12px', '14px']}
                titleTextFontSize={['24px', '16px']}
                radarInfo={{
                  padding: [10, 10, 10, 10],
                }}
              />
            )}
          </div>

          <div className={cs(styles.rightCon)}>
            <Table
              scroll={{ y: 580 }}
              rowKey={'name'}
              columns={columns}
              dataSource={tableData.scoreGroups}
              pagination={false}
            />
          </div>
        </div>
      </div>

      {/* 审批详情 */}
      <ApproveDetail id={result.id} open={drawerVisible} setOpen={setDrawerVisible}/>
    </div>
  );
};

export default StoreScore;
