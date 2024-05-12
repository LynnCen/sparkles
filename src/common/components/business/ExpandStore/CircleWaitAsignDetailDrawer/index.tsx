/**
 * @Description 卡旺卡拓店任务详情
 * 1109 标准版数据迁移引用该组件，显示拓店任务详情内容
 */
import React, { FC, useEffect, useMemo, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import { getCircleTaskDetail } from '@/common/api/expandStore/expansionCircleTask';
import { Form, Button, Col, Row, Space, Spin } from 'antd';
import styles from './index.module.less';
import cs from 'classnames';
import V2Title from '@/common/components/Feedback/V2Title';
import { TaskMap } from './ts-config';
import CircleTaskDetailMap from '../CircleTaskDetailMap';
import AreaDetailDrawer from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer';
import { isNotEmptyAny } from '@lhb/func';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { getCircleOptions } from '@/common/api/expandStore/expansiontask';
import FormSearchUser from '@/views/expandstore/pages/expansioncircletask/components/FormSearchUser';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import { TaskStatusColor } from '../CircleTaskDetailDrawer/ts-config';

interface Props {
  /** 是否打开 */
  open: boolean;
  /** 控制是否打开 */
  setOpen: React.Dispatch<boolean>;
  /** 拓店任务Id*/
  id;
  /** 是否隐藏操作按钮 */
  // hideOperate?: boolean;
  // 刷新外层调用方处理（通常是页面）
  outterRefresh?: ()=>void;
}
interface DrawerData{
  open:boolean;
  id:string
}
const CircleWaitAsignDetailDrawer: FC<Props> = ({
  open,
  setOpen,
  id,
  // outterRefresh,
}) => {
  const [form] = Form.useForm(); // 指派
  const [detail, setDetail] = useState<any>({}); // 拓店任务详情信息
  const [loading, setLoading] = useState<boolean>(false); // 加载中
  // const [refresh, setRefresh] = useState<boolean>(false); // 刷新
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [emergencyDegree, setEmergencyDegree] = useState<any>([]);
  const [drawerData, setDrawerData] = useState<DrawerData>({ // 选址地图详情抽屉
    open: false,
    id: ''
  });
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  // useEffect(() => {
  //   if (!id && !refresh) return;

  //   open && getTaskDetail();
  //   // 非打开抽屉时初次请求，是操作后刷新时，同时回调刷新外层
  //   (refresh && outterRefresh) && outterRefresh();
  // }, [id, refresh, open]);

  const getTaskDetail = () => {
    setLoading(true);
    try {
      getCircleTaskDetail({ id }).then((res) => {
        setDetail(res);
        // setRefresh(false); // 刷新结束
        setLoading(false);
      });
    } catch (error) {
      // setRefresh(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getTaskDetail();
    getEmployeeOptions();
  }, []);

  const basicTaskInfo = useMemo(() => {
    if (!isNotEmptyAny(detail)) return {};
    const { modelClusterInfo, manager, emergencyDegreeName, targetProvinceName, targetCityName, targetDistrictName, signShopCount, expectDropInDate } = detail;
    return {
      modelClusterName: modelClusterInfo?.modelClusterName,
      manager,
      emergencyDegreeName,
      targetAdress: `${targetProvinceName ? targetProvinceName + '/' : ''}${targetCityName ? targetCityName + '/' : ''}${targetDistrictName ?? ''}`,
      signShopCount,
      expectDropInDate
    };
  }, [detail]);


  /**
   * @description 查询紧急度&开发经理
   */
  const getEmployeeOptions = async () => {
    const options = await getCircleOptions();
    const emergencyData = options?.emergencyDegree.map((item) => ({
      label: item.name,
      value: item.id
    })) || [];
    setEmergencyDegree(emergencyData);
  };
  console.log('mainHeight', mainHeight);

  const handleClickClusterName = () => {
    setDrawerData({
      open: true,
      id: detail?.modelClusterInfo?.modelClusterId
    });
  };

  const handleSubmit = async() => {
    setConfirmLoading(true);
    try {
      const { emergencyDegree, managerIds, expectDropInDate } = await form.validateFields();
      console.log(emergencyDegree, managerIds, expectDropInDate);
    } catch (error) {
      console.log('handleSubmit', error);
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <V2Drawer
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 40,
          paddingRight: 58,
        }}
        destroyOnClose
        open={open}
        onClose={() => setOpen(false)}
      >
        <V2Container
          // 容器上下padding 32， 所以减去就是64
          style={{ height: '100vh' }}
          emitMainHeight={h => setMainHeight(h)}
          className={styles.container}
          extraContent={{
            top: <div className={styles.taskDetailHeader}>
              <div className={styles.headerLeft}>
                <span className={cs('fs-18 bold', styles.name)}>{detail?.name}</span>
                <div
                  className={cs('ml-10 fs-12', styles.statusBox)}
                  style={{
                    ...TaskStatusColor[detail?.status]
                  }}
                >{detail?.statusName}</div>
              </div>
            </div>,
            bottom:
            <div className={styles.drawerFooter}>
              <Space size={12}>
                <Button onClick={() => setOpen(false)}>取消</Button>
                <Button type='primary' onClick={handleSubmit} loading={confirmLoading}>
              提交
                </Button>
              </Space>
            </div>
          }}
        >
          <div >
            <Spin spinning={loading}>

              <div className={cs(styles.basicWrapper)}>
                <div className={styles.basicInfo}>
                  <V2Title
                    type='H2'
                    divider
                    text={'任务基本信息'}
                  />
                  {
                    Object.entries(TaskMap).map(([key, label], index) => {
                      return <div key={index}>
                        <div className={styles.label}>{label}</div>
                        <div className={styles.value}>{key === 'modelClusterName' ? <a onClick={handleClickClusterName}>{basicTaskInfo[key] || '-'}</a> : (basicTaskInfo[key] || '-')}</div>
                      </div>;
                    })
                  }
                  <V2Form form={form}>
                    <Row gutter={24} style={{ marginTop: 16 }}>
                      <Col span={24}>
                        <V2FormSelect
                          required
                          label='紧急度'
                          name='emergencyDegree'
                          options={emergencyDegree} />
                      </Col>
                      <Col span={24}>
                        <V2FormDatePicker required label='期望落位日期' name='expectDropInDate' />
                      </Col>
                      <Col span={24}>
                        <FormSearchUser
                          required
                          label='开发经理'
                          name='managerIds'
                          placeholder='请输入姓名'
                          mode='multiple'
                        // departmentIds={selectedDepartmentIds}
                        />
                      </Col>

                    </Row>
                  </V2Form>
                </div>
                <div className={styles.basicMap}>
                  {
                    isNotEmptyAny(detail) && <CircleTaskDetailMap
                      businessDetail={detail}
                    />
                  }
                </div>
                {drawerData.open && <AreaDetailDrawer
                  drawerData={drawerData}
                  setDrawerData={setDrawerData}
                  viewChanceDetail={false}
                />
                }
              </div>
            </Spin>
          </div>
        </V2Container>
      </V2Drawer>
    </>
  );
};
export default CircleWaitAsignDetailDrawer;
