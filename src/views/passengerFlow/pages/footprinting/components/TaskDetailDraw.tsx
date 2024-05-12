import { Button, Divider, Drawer, List, Row, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import DetailInfo from '@/common/components/Business/DetailInfo';
import { post } from '@/common/request';
import { EditTaskModalProps, TaskDetailDrawProps } from '../ts-config';
import styles from './entry.module.less';
import { AnalysisStatusEnum, ProcessStatus } from '../ts-config';
import { downloadFile, getKeysFromObjectArray } from '@lhb/func';

interface IProps {
  taskDetail: TaskDetailDrawProps;
  setTaskDetail: (values: TaskDetailDrawProps) => void;
  setEditTask: (values: EditTaskModalProps) => void;
}

const { Title } = Typography;

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

const TaskDetailDraw: React.FC<IProps> = ({ taskDetail, setTaskDetail, setEditTask }) => {
  const [data, setData] = useState<{ loading: boolean; result: any }>({ loading: true, result: {} });

  const renderPeriod = (value) => {
    if (value && value.length) {
      return value.map((item) => item.start + '-' + item.end).join(', ');
    }
    return '-';
  };

  const onEdit = () => {
    setTaskDetail({
      visible: false,
    });

    setEditTask({
      visible: true,
      id: data.result.id,
      tenantName: data.result.tenantName,
      projectCode: data.result.projectCode,
      demandBrandName: data.result.demandBrandName,
      placeName: data.result.placeName,
    });
  };

  const hasEditPermission = (permissions) => {
    let flag = false;
    if (permissions && permissions.length) {
      permissions.forEach((element) => {
        if (element.event === 'checkSpot:projectEdit') {
          flag = true;
        }
      });
    }
    return flag;
  };

  const renderTitle = (title) => {
    if (title && title.length < 25) {
      return <Title level={3}>{title}</Title>;
    } else {
      return (
        <Tooltip title={title} placement='bottom'>
          <Title level={3}>{title.substring(0, 25)}...</Title>
        </Tooltip>
      );
    }
  };

  useEffect(() => {
    if (taskDetail.visible) {
      (async () => {
        // https://yapi.lanhanba.com/project/462/interface/api/53801
        const result = await post('/checkSpot/project/query', { id: taskDetail.id }, {
          proxyApi: '/blaster',
          needHint: true
        });
        setData({ loading: false, result: result });
      })();
    }

    // eslint-disable-next-line
  }, [taskDetail.visible]);

  return (
    <Drawer
      title='踩点任务详情'
      maskClosable={true}
      width='900px'
      onClose={() => setTaskDetail({ visible: false })}
      open={taskDetail.visible}
    >
      <>
        {data.loading ? (
          <Spin />
        ) : (
          <div className={cs('bg-fff', 'pd-20')}>
            <div className={cs(styles.title)}>
              <Space align='center'>
                {renderTitle(data.result.name)}
                {renderTags(
                  data.result.process,
                  data.result.processName,
                  data.result.analysisStatus,
                  data.result.analysisStatusName
                )}
              </Space>

              {hasEditPermission(data.result.permissions) ? (
                <Button type='primary' onClick={() => onEdit()}>
                  编辑
                </Button>
              ) : null}
            </div>
            <Row>
              <DetailInfo span={8} title='创建人' value={data.result.creator} />
              <DetailInfo span={16} title='创建时间' value={data.result.createdAt} />
            </Row>

            <Divider />

            <Row>
              <DetailInfo span={12} title='租户名称' value={data.result.tenantName} />
              <DetailInfo span={12} title='任务码' value={data.result.projectCode} />
              <DetailInfo span={12} title='踩点日期' value={data.result.checkDate} />
              <DetailInfo span={12} title='需求品牌' value={data.result.demandBrandName} />
              <DetailInfo span={12} title='踩点时间段' value={renderPeriod(data.result.checkPeriod)} />
              <DetailInfo span={12} title='有效视频时长' value={`${Math.round(data.result.validDuration / 60)} min`} />
              <DetailInfo span={12} title='所属行业' value={data.result.industryName} />
              <DetailInfo span={12} title='踩点总时长' value={data.result.checkDuration} />
              <DetailInfo
                span={12}
                title='需求城市'
                value={data.result.province + data.result.city + data.result.district}
              />
              <DetailInfo span={12} title='场地联系人' value={data.result.placeContact} />
              <DetailInfo span={12} title='场地联系方式' value={data.result.placePhone} />
              <DetailInfo span={12} title='场地类型' value={data.result.placeCategoryName} />
              <DetailInfo span={12} title='踩点方式' value={data.result.checkWayName} />
              <DetailInfo span={12} title='详细地址' value={data.result.placeAddress} />
              <DetailInfo span={12} title='踩点人员' value={data.result.checkerName} />
              <DetailInfo span={12} title='店铺类型' value={data.result.shopCategoryName} />
              <DetailInfo span={12} title='手机号码' value={data.result.checkerPhone} />
              <DetailInfo span={12} title='店铺位置' value={data.result.address} />
              <DetailInfo span={12} title='任务跟进人' value={(getKeysFromObjectArray(data.result.follows, 'name')).join('、')} />
              <DetailInfo span={12} title='关联设备码' value={data.result.deviceCode} />
              <DetailInfo span={24} title='店铺图片' value={data.result.attachment}>
                {data.result.attachment && data.result.attachment.length ? (
                  <List split={false} size='small'>
                    {data.result.attachment.map((item, idx) => (
                      <List.Item key={'list-' + idx}>
                        <Button
                          key={idx}
                          type='link'
                          onClick={() => {
                            downloadFile({
                              name: item.name,
                              url: item.url,
                              downloadUrl: item.url + '?attname=' + item.name,
                            });
                          }}
                        >
                          {item.name}
                        </Button>
                      </List.Item>
                    ))}
                  </List>
                ) : null}
              </DetailInfo>
              <DetailInfo span={24} title='备注' value={data.result.remark} />
            </Row>
          </div>
        )}
      </>
    </Drawer>
  );
};
export default TaskDetailDraw;
