/**
 * @Description 踩点分析报告详情
 */
import { useEffect, useState } from 'react';
import { Divider, Row, Spin, Space, Col, Affix } from 'antd';
import cs from 'classnames';
import { downloadFile, floorKeep, replaceEmpty } from '@lhb/func';
import { VideoCameraFilled } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';

import { post } from '@/common/request';
import styles from './index.module.less';
import VideoList from './VideoList';
import { AnalysisStatusEnum, ProcessStatus } from '../ts-config';
import { getCheckSpotReport } from '@/common/api/footprinting';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Tag from '@/common/components/Data/V2Tag';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import GenderChart from './GenderChart';
import AgeFlowChart from './AgeFlowChart';
import HourFlowChart from './HourFlowChart';
import AnalysisImage from '../../footprinting/components/AnalysisImage';


const DetailMain = ({
  id,
  drawerContainer
}) => {
  const imgList:string[] = ['pics', 'floorPics'];// 图片字段，原格式不支持，需要转换
  const [tabAffixed, setTabAffixed] = useState<boolean>(false);
  const [data, setData] = useState<{ loading: boolean; result: any }>({ loading: true, result: {} });
  const [loading, setLoading] = useState<boolean>(false);

  const operateList: any[] = [
    {
      name: '导出报告', // 必填
      event: 'onExport', // 必填
      type: 'primary', //  非必填，默认为link
      disabled: false, // 非必填，默认为false
      func: 'onExport', // 非必填，通过统一的onClick方法调用的方法名，如果使用统一的onClick事件调用，没有填写该名字，且没有写单独的onClick方法，会提示方法找不到
    },
  ];



  const renderTags = (process, processName, analysisStatus, analysisStatusName) => {
    return (
      <div >
        {/* 拍摄状态 */}
        {process === ProcessStatus.FINISHED && <V2Tag color='orange'>{processName}</V2Tag>}
        {process === ProcessStatus.ISSUED && <V2Tag color='orange'>{processName}</V2Tag>}
        {process === ProcessStatus.DOING && <V2Tag color='blue'>{processName}</V2Tag>}
        {process === ProcessStatus.FILM_COMPLETE && <V2Tag color='green'>{processName}</V2Tag>}
        {process === ProcessStatus.ASSIGN && <V2Tag color='orange'>{processName}</V2Tag>}
        {process === ProcessStatus.RESHOOT && <V2Tag color='red'>{processName}</V2Tag>}

        {/* 分析状态 */}
        {analysisStatus === AnalysisStatusEnum.NOT_START && <V2Tag color='orange'>{analysisStatusName}</V2Tag>}
        {analysisStatus === AnalysisStatusEnum.WAITING && <V2Tag color='blue'>{analysisStatusName}</V2Tag>}
        {analysisStatus === AnalysisStatusEnum.PENDING && <V2Tag color='green'>{analysisStatusName}</V2Tag>}
        {analysisStatus === AnalysisStatusEnum.SET_RULE && <V2Tag color='orange'>{analysisStatusName}</V2Tag>}
        {analysisStatus === AnalysisStatusEnum.FINISH && <V2Tag color='green'>{analysisStatusName}</V2Tag>}
        {/* {analysisStatus === AnalysisStatusEnum.NO_CREATE && <V2Tag color='orange'>{analysisStatusName}</V2Tag>} */}
      </div>
    );
  };

  const renderPeriod = (value) => {
    if (value && value.length) {
      return value.map((item) => item.start + '-' + item.end).join(', ');
    }
    return '-';
  };

  const renderDrawImage = (list: any[]) => {
    if (!list || !list.length) {
      return <div style={{ paddingTop: 12 }}>-</div>;
    }
    return (
      <>
        <Row style={{ paddingTop: 12 }} gutter={24}>
          {list.map((item: any, idx) => {
            return (
              <Col span={12} key={idx}>
                <Space>
                  <VideoCameraFilled />
                  <div className={styles.videoTitle}>视频{item.number}</div>
                </Space>
                <div className={styles.videoTime}>
                    视频时间：{item.startTime} 至 {item.endTime}
                </div>
                <div className={styles.videoAndImage}>
                  <AnalysisImage info={item} />
                </div>
              </Col>
            );
          })}
        </Row>
      </>
    );
  };

  const hasEditPermission = (permissions) => {
    var flag = false;
    if (permissions && permissions.length) {
      permissions.forEach((element) => {
        if (element.event === 'checkSpot:reviewPPT') {
          flag = true;
        }
      });
    }
    return flag;
  };

  // 计算比率
  const getRate = (dividend, divisor) => {
    if (dividend && divisor) {
      const _enteringRate = floorKeep(dividend, divisor, 4, 2);
      return floorKeep(_enteringRate, 100, 3, 2);
    }
    return '-';
  };

  const methods = useMethods({
    onExport() {
      setLoading(true);
      // 本地环境默认使用 ie环境地址
      const url:string = process.env.NODE_ENV === 'development' ? `https://ie-admin.lanhanba.net/pdf/insight` : `${window.location.origin}/pdf/insight`;
      const params = {
        id: data.result?.id,
        url: url
      };
      // https://yapi.lanhanba.com/project/329/interface/api/39990
      post('/checkSpot/review/exportUrl', params, {
        proxyApi: '/blaster',
        needHint: true
      })
        .then(({ url }) => {
          downloadFile({ url });
        })
        .finally(() => {
          setLoading(false);
        });

    },
    loadData() {
      getCheckSpotReport({ id: Number(id) }).then((result:any) => {

        // 图片字段，原格式不支持，需要转换
        Object.keys(result).map((key:string) => {
          if (imgList.includes(key)) {
            result[key] = result[key]?.map((item: any) => {
              return { url: item };
            });
          }
        });

        setData({ loading: false, result: result || {} });
      });
    }
  });

  // 渲染客流分布图
  const renderHourFlowChart = () => {
    if (data.result?.hourFlowList && data.result?.hourFlowList.length) {
      return <div className={styles.doughnutEcharts}>
        <HourFlowChart data={data.result?.hourFlowList}/>
      </div>;
    }
    return <></>;
  };


  useEffect(() => {
    if (id) methods.loadData();
  }, [id]);

  return (
    <>
      <Spin spinning={loading}>
        {data.loading ? (
          <Spin />
        ) : (
          <div className={styles.container}>
            <Affix offsetTop={0} target={() => drawerContainer} onChange={(affixed) => setTabAffixed(!!affixed)}>
              <div className={cs(styles.title, styles[tabAffixed ? 'fixed' : ''])}>
                <V2Title
                  text={data.result.name + '踩点分析报告'}
                  extra={
                    !!hasEditPermission(data.result.permissions) && <V2Operate
                      operateList={operateList}
                      onClick={(btns: { func: string | number }) => methods[btns.func]()}/>
                  }>
                  <span className={styles['title-text']}>{data.result.name + '踩点分析报告'}</span>
                  <Space >
                    {renderTags(
                      data.result.process,
                      data.result.processName,
                      data.result.analysisStatus,
                      data.result.analysisStatusName
                    )}
                  </Space>
                </V2Title>
              </div>
            </Affix>
            <Divider style={{ marginBottom: 15, marginTop: 18 }}/>
            <div className={styles.baseInfo}>
              <V2DetailGroup direction='vertical' moduleType='easy'>
                <Row gutter={8}>
                  <Col span={4}>
                    <V2DetailItem label='项目名称' value={data.result.name} />
                  </Col>
                  <Col span={4}>
                    <V2DetailItem label='踩点日期' value={data.result.checkDate} />
                  </Col>
                  <Col span={4}>
                    <V2DetailItem label='踩点时间段' value={renderPeriod(data.result.checkPeriod)} />
                  </Col>
                  <Col span={4}>
                    <V2DetailItem label='踩点方式' value={data.result.checkWayName} />
                  </Col>
                  <Col span={4}>
                    <V2DetailItem label='踩点人员' value={data.result.checkerName} />
                  </Col>
                  <Col span={4}>
                    <V2DetailItem label='上传视频总数' value={data.result.uploadVideoSize} />
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={4}>
                    <V2DetailItem label='分析完成视频总数' value={data.result.analysisVideoSize} />
                  </Col>
                  <Col span={4}>
                    <V2DetailItem label='分析总人数' value={data.result.analysisFlow} />
                  </Col>
                  <Col span={4}>
                    <V2DetailItem label='平均CPM' value={data.result.cpm && data.result.cpm + '元'} />
                  </Col>
                </Row>
              </V2DetailGroup>
            </div>
            <div className={styles.flowInfo}>
              <div className={styles.box}>
                <p className={styles['box-value']}>{replaceEmpty(data.result.analysisFlow)}</p>
                <p className={styles['box-title']}>过店客流</p>
              </div>
              <div className={styles.box}>
                <p className={styles['box-value']}>{replaceEmpty(data.result.analysisIndoorFlow)}</p>
                <p className={styles['box-title']}>进店客流</p>
              </div>
              <div className={styles.box}>
                <p className={styles['box-value']}>{replaceEmpty(data.result.analysisBagFlow)}</p>
                <p className={styles['box-title']}>提袋客流</p>
              </div>
              <div className={styles.box}>
                {/* 进店率：进店总数/过店总数 */}
                <p className={styles['box-value']}>{getRate(data.result.analysisIndoorFlow, data.result.analysisFlow)}%</p>
                <p className={styles['box-title']}>进店率</p>
              </div>
              <div className={styles.box}>
                {/* 提袋率：提袋客流/进店总数 */}
                <p className={styles['box-value']}>{getRate(data.result.analysisBagFlow, data.result.analysisIndoorFlow)}%</p>
                <p className={styles['box-title']}>提袋率</p>
              </div>
            </div>
            {renderHourFlowChart()}
            <div className={styles.doughnutEcharts}>
              <Row>
                <Col span={12}>
                  <GenderChart rowData={data.result}/>
                </Col>
                <Col span={12}>
                  <AgeFlowChart rowData={data.result}/>
                </Col>
              </Row>
            </div>
            <Divider />
            <V2Title type='H2' text='场地信息' divider/>
            <V2DetailGroup block>
              <Row gutter={12}>
                <Col span={12}>
                  <V2DetailItem label='场地类型' value={data.result.placeCategoryName} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='场地名称' value={data.result.placeName} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='所属城市' value={data.result.province + '' + data.result.city + '' + data.result.district} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='详细地址' value={data.result.placeAddress} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='商圈楼层导览图' type='images' assets={data?.result?.floorPics}/>
                </Col>
              </Row>
            </V2DetailGroup>
            <Divider />
            <V2Title type='H2' text='店铺信息' divider/>
            <V2DetailGroup block>
              <Row gutter={12}>
                <Col span={12}>
                  <V2DetailItem label='店铺类型' value={data.result.shopCategoryName} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='店铺位置' value={data.result.address} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='在营品牌' value={data.result.brandName ? data.result.brandName : data.result.shopName} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='所在楼层' value={data.result.floor} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='左右品牌' value={data.result.aroundBrand} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='店铺面积' value={data.result.area && data.result.area + 'm²'} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='店铺租金' value={data.result.shopRent ? (data.result.shopRent + data.result.shopRentUnitName) : (data.result.rent && (data.result.rent + '元/年'))} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='店铺图片' type='images' assets={data?.result?.pics}/>
                </Col>
              </Row>
            </V2DetailGroup>

            <V2Title type='H2' text='画框信息' divider />
            {renderDrawImage(data.result.images)}
            <Divider />
            <V2Title type='H2' text='踩点分析结果' divider style={{ marginBottom: 12 }}/>
            <VideoList id={id} />
            {
              data.result?.deliveryReportUrl ? (<>
                <Divider />
                <V2Title type='H2' text='踩点交付报告' divider style={{ marginBottom: 12 }}/>
                <a href={data.result?.deliveryReportUrl }>{data.result?.deliveryReportUrl }</a>
              </>) : null
            }
          </div>
        )}
      </Spin>
    </>
  );
};
export default DetailMain;
