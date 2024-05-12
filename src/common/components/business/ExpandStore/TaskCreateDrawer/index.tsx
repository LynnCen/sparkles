/**
 * @Description 创建拓店任务抽屉
 */

import { FC, useEffect, useState } from 'react';
import { getCookie } from '@lhb/cache';
import dayjs from 'dayjs';
import { isArray } from '@lhb/func';
import { Button, Cascader, Col, Form, Row, Space } from 'antd';

import styles from './index.module.less';
import { refactorSelection } from '@/common/utils/ways';

import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Form from '@/common/components/Form/V2Form';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import FormFranchisee from './components/FormFranchisee';
import { employeeListPermission } from '@/common/api/employee';
import { createExpansionTask, taskTypeList, taskSignTypeList } from '@/common/api/expandStore/expansiontask';
import { getFranchiseeDetail } from '@/common/api/expandStore/franchisee';

interface TaskCreateDrawerProps {
  showDrawer: boolean; // 是否显示抽屉
  setShowDrawer: Function; // 控制是否显示抽屉
  franchiseeId?: number; // 指定加盟商信息id，可选；指定时不可更改加盟商
  refresh: Function; // 刷新拓店任务表格
}
const TaskCreateDrawer: FC<TaskCreateDrawerProps> = ({
  showDrawer,
  setShowDrawer,
  franchiseeId,
  refresh
}) => {
  const [form] = Form.useForm(); // 指派
  const [loading, setLoading] = useState(false);
  const [taskTypeOptions, setTaskTypeOptions] = useState<any[]>([]);
  const [signTypeOptions, setSignTypeOptions] = useState<any[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<any>([]); // 指派人选项
  const [targetAdd, setTargetAdd] = useState<any>(); // 目标城市信息
  const [selFranchiseeId, setSelFranchiseeId] = useState<any>(); // 手动选择的加盟商id
  const [uniqueName, setUniqueName] = useState<string>('加盟商唯一标识'); // 加盟商唯一字段名称

  useEffect(() => {
    if (showDrawer) {
      getEmployeeOptions();
      getTaskTypeList();
      getSignTypeList();

      // 默认指定加盟商时获取加盟商详情
      if (franchiseeId) {
        getFranchiseeInfo(franchiseeId);
      }
    }
  }, [showDrawer]);

  /**
   * @description 加盟商详情
   * @param franId
   * @return
   */
  const getFranchiseeInfo = (franId: number) => {
    getFranchiseeDetail({ id: franId }).then((data) => {
      const { name, uniqueId, uniqueName: uniName } = data;
      form.setFieldsValue({
        franchiseeName: name,
        uniqueId: uniqueId,
      });
      setUniqueName(uniName || '加盟商唯一标识');

      // 刷新自动生成任务名称
      onAutoSetName();
    });
  };

  useEffect(() => {
    onAutoSetName();
  }, [targetAdd]);

  /** 重置表单，关闭弹窗 */
  const onReset = (modal?) => {
    form.resetFields();
    setTargetAdd({});
    modal && modal.destroy();
    setShowDrawer(false);
  };

  /** 点击取消 */
  const onCancel = () => {
    V2Confirm({
      onSure: (modal: any) => onReset(modal),
      content: '取消后将清空内容，请确认是否退出',
    });
  };

  /**
   * @description 获取可指派的团队人员
   */
  const getEmployeeOptions = async () => {
    const { objectList: data } = await employeeListPermission();
    const arr = isArray(data) && data.length ? data.map((item) => ({
      ...item,
      name: `${item.name} ${item.mobile}`
    })) : [];

    console.log('arr', arr);
    setEmployeeOptions(arr);
  };

  /**
   * @description 任务类型选项
   */
  const getTaskTypeList = () => {
    taskTypeList().then((data) => {
      if (isArray(data) && data.length) {
        const options = data.map((itm: any) => ({ value: itm.id, label: itm.typeName }));
        setTaskTypeOptions(options);
      }
    });
  };
  /**
   * @description 签约类型选项
   */
  const getSignTypeList = () => {
    taskSignTypeList().then((data) => {
      if (isArray(data) && data.length) {
        const options = data.map((itm: any) => ({ value: itm.id, label: itm.typeName }));
        setSignTypeOptions(options);
      }
    });
  };
  // 自动生成名字;
  const onAutoSetName = () => {
    const { franchiseeName, targetAddress } = form.getFieldsValue();

    if (!franchiseeName && !targetAddress) return; // 没有输入的时候不用自动生成

    const infos = ['拓店任务'];
    const pcdNames: string[] = [];

    // console.log('addd', targetAddress, targetAdd);
    !!targetAdd && pcdNames.push(targetAdd.slice(-1)[0].name);
    !!pcdNames.length && infos.unshift(pcdNames.join('、'));

    franchiseeName && infos.unshift(franchiseeName);
    const newName = infos.join('_');

    form.setFieldValue('name', newName);
  };

  const handleFranchiseeCreated = (val: any) => {
    console.log('handleFranchiseeCreated', val);
    setSelFranchiseeId(val);

    // 新增加盟商后获取加盟商详情
    getFranchiseeInfo(val);
  };

  const handleFranchisee = (val: any) => {
    setSelFranchiseeId(val);

    // 选择加盟商后获取加盟商详情
    getFranchiseeInfo(val);
  };

  const onCreateTask = async () => {
    const { radio, assignAccountIds, ...values } = await form.validateFields();

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

    try {
      setLoading(true);
      const {
        name,
        taskTypeId,
        signType,
        expectDropInDate,
        firstArea,
        secondArea,
        targetAddress,
      } = values;

      // 构建目标城市参数
      const targetAddNew = targetAddress && {
        targetProvinceId: targetAddress[0] || undefined,
        targetCityId: targetAddress[1] || undefined,
        targetDistrictId: targetAddress[2] || undefined,
      };
      createExpansionTask({
        standardFranchiseeId: franchiseeId || selFranchiseeId,
        name,
        taskTypeId,
        signType,
        expectDropInDate: expectDropInDate && dayjs(expectDropInDate).format('YYYY-MM-DD'),
        firstArea,
        secondArea,
        ...targetAddNew,
        assignAccountIds: assignAccount,
      })
        .then(() => {
          V2Message.success('创建拓店任务成功');
          setLoading(false);
          onReset(); // 重置
          refresh();
        })
        .catch((err) => {
          setLoading(false);
          console.log('catch 失败', err);
          V2Message.error('创建拓店任务失败');
        });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 设置这里的固定宽度 */}
      <V2Drawer
        className={styles.createTaskDrawer}
        open={showDrawer}
        onClose={onCancel}
        contentWrapperStyle={{
          minWidth: 'auto',
          width: '824px',
        }}
      >
        <V2Title type='H1' text='创建拓店任务' />
        <V2Form form={form}>
          <V2Title type='H2' divider text='任务信息' style={{ margin: '16px 0' }} />
          <Row gutter={24}>
            <Col span={12}>
              <FormFranchisee
                label='加盟商姓名'
                name='franchiseeName'
                placeholder='请输入加盟商姓名'
                disabled={!!franchiseeId}
                formItemConfig={{
                  rules: [{ required: true, message: '请输入加盟商姓名' }]
                }}
                onCreated={handleFranchiseeCreated}
                onChange={handleFranchisee}
              />
            </Col>
            <Col span={12}>
              <V2FormInput
                required
                label={uniqueName}
                name='uniqueId'
                disabled
              />
            </Col>
            <Col span={12}>
              <V2FormProvinceList
                required
                label='目标城市'
                name='targetAddress'
                config={{
                  changeOnSelect: true,
                  expandTrigger: 'hover',
                  showCheckedStrategy: Cascader.SHOW_PARENT,
                  onChange: (_, selectedOptions) => setTargetAdd(selectedOptions),
                }}
              />
            </Col>
            <Col span={12}>
              <V2FormInput required label='任务名称' name='name' maxLength={50} />
            </Col>
            <Col span={12}>
              <V2FormSelect
                required
                label='任务类型'
                name='taskTypeId'
                options={taskTypeOptions} />
            </Col>
            <Col span={12}>
              <V2FormSelect
                required
                label='签约类型'
                name='signType'
                options={signTypeOptions} />
            </Col>
            <Col span={12}>
              <V2FormInput required label='第一意向区域' name='firstArea' maxLength={200} />
            </Col>
            <Col span={12}>
              <V2FormInput required label='第二意向区域' name='secondArea' maxLength={200} />
            </Col>
            <Col span={12}>
              <V2FormDatePicker required label='期望落位日期' name='expectDropInDate' />
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
            <Button onClick={onCancel}>取消</Button>
            <Button type='primary' loading={loading} onClick={onCreateTask}>
              确定
            </Button>
          </Space>
        </div>
      </V2Drawer>
    </div>
  );
};
export default TaskCreateDrawer;
