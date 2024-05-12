import { useEffect, useState } from 'react';
import { Divider, Row, Spin, Typography, Image, Tag, Space, Button, Tooltip, Col } from 'antd';
import DetailInfo from '@/common/components/business/DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';

import cs from 'classnames';
import { downloadFile, urlParams } from '@lhb/func';
import styles from './entry.module.less';
import VideoList from './components/VideoList';
import { AnalysisStatusEnum, ProcessStatus } from './ts-config';
import { VideoCameraFilled } from '@ant-design/icons';
import DetailImage from '@/common/components/business/DetailImage';
import { getCheckSpotReport } from '@/common/api/footprinting';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const { Title } = Typography;

const ReviewDetail = () => {
  const [data, setData] = useState<{ loading: boolean; result: any }>({ loading: true, result: {} });
  const [loading, setLoading] = useState<boolean>(false);
  const id: string | number = urlParams(location.search)?.id;

  useEffect(() => {
    (async () => {
      const result = await getCheckSpotReport({ id: Number(id) });
      setData({ loading: false, result: result || {} });
    })();
  }, [id]);

  const renderTags = (process, processName, analysisStatus, analysisStatusName) => {
    return (
      <div className='mb-12'>
        {/* 拍摄状态 */}
        {process === ProcessStatus.FINISHED && <Tag color='#FF861D'>{processName}</Tag>}
        {process === ProcessStatus.ISSUED && <Tag color='#FF861D'>{processName}</Tag>}
        {process === ProcessStatus.DOING && <Tag color='#002c8c'>{processName}</Tag>}
        {process === ProcessStatus.FILM_COMPLETE && <Tag color='#009963'>{processName}</Tag>}
        {process === ProcessStatus.ASSIGN && <Tag color='#FF861D'>{processName}</Tag>}
        {process === ProcessStatus.RESHOOT && <Tag color='#F23030'>{processName}</Tag>}

        {/* 分析状态 */}
        {analysisStatus === AnalysisStatusEnum.NOT_START && <Tag color='#FF861D'>{analysisStatusName}</Tag>}
        {analysisStatus === AnalysisStatusEnum.WAITING && <Tag color='#002c8c'>{analysisStatusName}</Tag>}
        {analysisStatus === AnalysisStatusEnum.PENDING && <Tag color='#009963'>{analysisStatusName}</Tag>}
        {analysisStatus === AnalysisStatusEnum.SET_RULE && <Tag color='#FF861D'>{analysisStatusName}</Tag>}
        {analysisStatus === AnalysisStatusEnum.FINISH && <Tag color='#009963'>{analysisStatusName}</Tag>}
        {/* {analysisStatus === AnalysisStatusEnum.NO_CREATE && <Tag color='#FF861D'>{analysisStatusName}</Tag>} */}
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
      return '-';
    }
    return (
      <>
        <Row>
          {list.map((item: any, idx) => {
            return (
              <Col span={8}>
                <Space>
                  <VideoCameraFilled />
                  <div>视频{item.number}</div>
                </Space>
                <div>
                  <span className='color-info fn-12 ff-normal'>
                    （{item.startTime} 至 {item.endTime}）
                  </span>
                </div>
                <Image rootClassName='mr-16' key={idx} width={134} height={134} src={item.imageUrl} />{' '}
              </Col>
            );
          })}
        </Row>
      </>
    );
  };

  const onExport = () => {
    setLoading(true);
    if (!data.result?.deliveryReportUrl) {
      V2Message.error('报告生成中，请耐心等待');
      setLoading(false);
      return;
    }
    downloadFile({
      name: '交付报告',
      useBlob: true,
      downloadUrl: data.result?.deliveryReportUrl
    });
    setLoading(false);
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

  const renderTitle = (title) => {
    if (title && title.length < 50) {
      return <Title level={3}>{title}</Title>;
    } else {
      return (
        <Tooltip title={title} placement='bottom'>
          <Title level={3}>{title.substring(0, 50)}...</Title>
        </Tooltip>
      );
    }
  };

  return (
    <>
      <Spin spinning={loading}>

        {data.loading ? (
          <Spin />
        ) : (
          <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
            <div className={cs(styles.title)}>
              <Space align='center'>
                {renderTitle(data.result.name + '踩点分析报告')}
                {renderTags(
                  data.result.process,
                  data.result.processName,
                  data.result.analysisStatus,
                  data.result.analysisStatusName
                )}
              </Space>

              {hasEditPermission(data.result.permissions) ? (
                <Button type='primary' onClick={() => onExport()}>
                导出报告
                </Button>
              ) : null}
            </div>

            <Row>
              <DetailInfo span={24} title='踩点项目名称' value={data.result.name} />
              <DetailInfo title='踩点日期' value={data.result.checkDate} />
              <DetailInfo title='踩点时间段' value={renderPeriod(data.result.checkPeriod)} />
              <DetailInfo title='踩点方式' value={data.result.checkWayName} />
              <DetailInfo title='踩点人员' value={data.result.checkerName} />
              <DetailInfo title='上传视频总数' value={data.result.uploadVideoSize} />
              <DetailInfo title='分析完成视频总数' value={data.result.analysisVideoSize} />
              <DetailInfo title='分析总人数' value={data.result.analysisFlow} />
              <DetailInfo title='平均CPM' value={data.result.cpm && data.result.cpm + '元'} />
            </Row>
            <Divider />
            <TitleTips name='场地信息' showTips={false} />
            <Row>
              <DetailInfo title='场地类型' value={data.result.placeCategoryName} />
              <DetailInfo title='场地名称' value={data.result.placeName} />
              <DetailInfo
                title='所属城市'
                value={data.result.province + '' + data.result.city + '' + data.result.district}
              />
              <DetailInfo title='详细地址' value={data.result.placeAddress} />
              <DetailInfo span={24} title='商圈楼层导览图' value={data.result.floorPics}>
                <DetailImage imgs={data?.result?.floorPics}/>
              </DetailInfo>
            </Row>
            <TitleTips name='店铺信息' showTips={false} />
            <Row>
              <DetailInfo title='店铺类型' value={data.result.shopCategoryName} />
              <DetailInfo title='店铺位置' value={data.result.address} />
              <DetailInfo title='在营品牌' value={data.result.brandName ? data.result.brandName : data.result.shopName} />
              <DetailInfo title='所在楼层' value={data.result.floor} />
              <DetailInfo title='左右品牌' value={data.result.aroundBrand} />
              <DetailInfo title='店铺面积' value={data.result.area && data.result.area + 'm²'} />
              <DetailInfo title='店铺租金' value={data.result.shopRent ? (data.result.shopRent + data.result.shopRentUnitName) : (data.result.rent && (data.result.rent + '元/年'))} />
              <DetailInfo span={24} title='店铺图片' value={data.result.pics}>
                <DetailImage imgs={data?.result?.pics}/>
              </DetailInfo>
            </Row>
            <TitleTips name='画框信息' showTips={false} />
            {renderDrawImage(data.result.images)}
            <TitleTips name='踩点分析结果' showTips={false} />
            <VideoList taskId={id} />
            {
              data.result?.deliveryReportUrl ? (<>
                <TitleTips name='踩点交付报告' showTips={false} />
                <a href={data.result?.deliveryReportUrl }>{data.result?.deliveryReportUrl }</a>
              </>) : null
            }
          </div>
        )}
      </Spin>
    </>
  );
};
export default ReviewDetail;
