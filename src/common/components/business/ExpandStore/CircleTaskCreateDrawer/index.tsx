
/**
 * @Description 创建拓店任务抽屉
 */

import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, Cascader, Col, Form, Row, Space } from 'antd';
import styles from './index.module.less';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Form from '@/common/components/Form/V2Form';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import CirclebusinessMap from '../CircleBusinessMap';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import { isArray, isNotEmptyAny, refactorSelection } from '@lhb/func';
import { employeeListPermission } from '@/common/api/employee';
import { getCookie } from '@lhb/cache';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import dayjs from 'dayjs';
import { createCircleTask, getCircleOptions } from '@/common/api/expandStore/expansiontask';


interface CircleTaskCreateDrawerProps {
  showDrawer: boolean; // 是否显示抽屉
  setShowDrawer: React.Dispatch<boolean>; // 控制是否显示抽屉
  // franchiseeId?: number; // 指定加盟商信息id，可选；指定时不可更改加盟商
  refresh?: ()=>void; // 提交表单后的回调
  businessInfo?:any;
  isBusiness?:boolean;

}

const CircleTaskCreateDrawer: FC<CircleTaskCreateDrawerProps> = ({
  showDrawer,
  setShowDrawer,
  isBusiness = false,
  businessInfo,
  refresh
}) => {
  const [form] = Form.useForm(); // 指派

  const circlebusinessMap: any = useRef();
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState<any>([]); // 指派人选项
  const [emergencyDegree, setEmergencyDegree] = useState<any>([]);
  const targetAddressInfo = Form.useWatch('targetAddressInfo', form);
  const businessName = Form.useWatch('businessName', form);
  useEffect(() => {
    getEmployeeOptions();
    if (isBusiness) {
      const { id, areaName, provinceId, cityId, districtId, provinceName, cityName, districtName } = businessInfo;
      form.setFieldsValue({
        businessName: areaName,
        targetAddress: [provinceId, cityId, districtId],
        targetAddressInfo: [provinceName, cityName, districtName],
        circleBusinessId: id
      });

    }
  }, []);

  useEffect(() => {
    // const targetCity = targetAddressInfo && isArray(targetAddressInfo) ? `${targetAddressInfo.slice(0, 2).join('/')}_` : '';
    const targetCity = targetAddressInfo && isNotEmptyAny(targetAddressInfo[1]) ? `${targetAddressInfo[1]}_` : '';
    const targetBusinessName = businessName ? `${businessName}_` : '';

    const taskName = (targetCity || targetBusinessName) ? `${targetCity}${targetBusinessName}拓店任务` : '';
    form.setFieldsValue({
      name: taskName
    });
  }, [targetAddressInfo, businessName]);

  /**
   * @description 获取可指派的团队人员
   */
  const getEmployeeOptions = async () => {
    const { objectList: data } = await employeeListPermission();
    const options = await getCircleOptions();
    const arr = isArray(data) && data.length ? data.map((item) => ({
      ...item,
      name: `${item.name} ${item.mobile}`
    })) : [];
    const emergencyData = options?.emergencyDegree.map((item) => ({
      label: item.name,
      value: item.id
    })) || [];
    setEmergencyDegree(emergencyData);
    setEmployeeOptions(arr);
  };

  // 创建拓店任务
  const onCreateTask = async():Promise<void> => {
    const { radio, assignAccountIds, targetAddress, ...values } = await form.validateFields();
    let assignAccount: any[] = [];
    if (radio === 1) {
      const accountId = getCookie('employeeId');
      assignAccount = [accountId];
    } else if (radio === 2) {
      if (assignAccountIds) {
        assignAccount = [assignAccountIds];
      } else {
        V2Message.warning('请选择指派的团队成员');
        return;
      }
    } else {
      V2Message.warning('请选择指派的成员');
      return;
    }
    if (targetAddress && !targetAddress[1]) {
      V2Message.warning('城区请选择到市');
      return;
    }
    try {
      setLoading(true);
      const {
        name,
        emergencyDegree,
        expectDropInDate,
      } = values;
      const circleBusinessId = form.getFieldValue('circleBusinessId');
      // 构建目标城市参数
      const targetAddNew = targetAddress && {
        targetProvinceId: targetAddress[0] || undefined,
        targetCityId: targetAddress[1] || undefined,
        targetDistrictId: targetAddress[2] || undefined,
      };
      createCircleTask({
        name,
        expectDropInDate: expectDropInDate && dayjs(expectDropInDate).format('YYYY-MM-DD'),
        emergencyDegree,
        ...targetAddNew,
        assignAccountIds: assignAccount,
        modelClusterId: circleBusinessId
      }).then(() => {
        V2Message.success('创建拓店任务成功');
        setShowDrawer(false);
        refresh && refresh();
      })
        .catch((err) => {
          setShowDrawer(false);
          console.log('catch 失败', err);
          V2Message.error('创建拓店任务失败');
        }).finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log('error', error);
      setShowDrawer(false);
      setLoading(false);
    }
  };



  return (
    <div>
      {/* 设置这里的固定宽度 */}
      <V2Drawer
        className={styles.createTaskDrawer}
        open={showDrawer}
        destroyOnClose
        onClose={() => setShowDrawer(false)}
        contentWrapperStyle={{
          minWidth: 'auto',
          width: '1008px',
        }}

      >
        <V2Title type='H1' text='创建拓店任务' />
        <V2Form form={form}>
          <V2Title type='H2' divider text='任务信息' style={{ margin: '16px 0' }} />
          <Row gutter={24}>
            <Col span={12}>
              <V2FormInput required label='任务名称' name='name' maxLength={50} />
            </Col>
            <Col span={12}>
              <Form.Item name='targetAddressInfo' hidden noStyle/>
              <V2FormProvinceList
                required
                label='目标城市'
                name='targetAddress'
                disabled={isBusiness}
                config={{
                  value: [1],
                  changeOnSelect: true,
                  allowClear: true,
                  expandTrigger: 'hover',
                  showCheckedStrategy: Cascader.SHOW_PARENT,
                  onChange: (_, selectedOptions) => {
                    circlebusinessMap.current?.onChangeProvince && circlebusinessMap.current.onChangeProvince(_, selectedOptions);
                  },
                  onDropdownVisibleChange: (value) => {
                    circlebusinessMap.current?.onChangeProvince && circlebusinessMap.current.onDropdownVisibleChange(value);

                  }
                }}
              />
            </Col>
            <Col span={12}>
              <V2FormSelect
                required
                label='紧急度'
                name='emergencyDegree'
                options={emergencyDegree} />
            </Col>
            <Col span={12}>
              <V2FormDatePicker required label='期望落位日期' name='expectDropInDate' />
            </Col>
            <Col span={24}>
              <V2FormInput required label='商圈名称' name='businessName' disabled={true} placeholder='请在地图上选择商圈'/>
            </Col>
            <Col span={24}>
              <CirclebusinessMap
                form ={form}
                ref={circlebusinessMap}
                businessInfo={businessInfo}
                isBusiness={isBusiness}
              />
            </Col>
          </Row>
          <V2Title type='H1' divider text='选择拓店团队' style={{ margin: '16px 0' }} />
          <V2FormRadio
            name='radio'
            className={styles.radioList}
            options={[
              { label: '指派给自己', value: 1 },
              {
                label: (
                  <div className={styles.radioSelect}>
                    指派给团队成员
                    <V2FormSelect
                      className={styles.assignAccountIds}
                      placeholder='请选择指派人'
                      name='assignAccountIds'
                      options={refactorSelection(employeeOptions)}
                      config={{
                        showSearch: true,
                        onClick: e => {
                          e.preventDefault();
                          e.stopPropagation;
                        }, // 解决下拉框闪现的情况
                        onFocus: () => {
                          form.setFieldValue('radio', 2);
                        }, // 下拉框获取焦点的时候单选选择第二个
                      }}
                    />
                  </div>
                ),
                value: 2,
              },
            ]}
          />
        </V2Form>

        <div className={styles.drawerFooter}>
          <Space size={12}>
            <Button onClick={() => setShowDrawer(false)}>取消</Button>
            <Button type='primary' loading={loading} onClick={onCreateTask}>
              确定
            </Button>
          </Space>
        </div>
      </V2Drawer>
    </div>
  );
};
export default CircleTaskCreateDrawer;
