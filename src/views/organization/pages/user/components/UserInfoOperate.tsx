/* 用户管理 */
import { FC, useEffect, useState } from 'react';
import { Col, Divider, Drawer, Form, message, Row, Space, Typography } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import FormSetName from '@/common/components/Form/FormSetName/FormSetName';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import FormPostList from '@/common/components/FormBusiness/FormPostList';
import Operate from '@/common/components/Operate';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';
import dayjs from 'dayjs';
import { dictionaryTypeItems } from '@/common/api/common';
import { roleList } from '@/common/api/role';
import { get, post } from '@/common/request';
import { SEX, STATUS } from '@/common/utils/options';
import { EMAIL_REG, MOBILE_REG, USRT_REG } from '@lhb/regexp';
import { UserInfoOperateProps } from '../ts-config';
import { PermissionSelectorValues } from '@/common/components/Modal/ts-config';
const { Title } = Typography;

const UserInfoOperate: FC<UserInfoOperateProps> = ({ setOperateUser, operateUser, onSearch }) => {
  const [form] = Form.useForm();
  const [selectList, setSelectList] = useState<{
    role: any[]; // 角色
    education: []; // 文化程度
  }>({ role: [], education: [] });
  const [chooseUserValues, setChooseUserValues] = useState<PermissionSelectorValues>({
    visible: false,
    users: [], // 直属上级
  });

  useEffect(() => {
    if (operateUser.visible) {
      loadDepartMent();
      operateUser.id ? userDetail() : form.setFieldsValue({ departmentIds: operateUser.departmentId ? [operateUser.departmentId] : [] });
    } else {
      form.resetFields();
    }
  }, [operateUser.visible, operateUser.departmentId]);

  // 获取用户详情
  const userDetail = async () => {
    // http://yapi.lanhanba.com/project/289/interface/api/33051
    const result = await get('/employee/detail', { id: operateUser.id }, {
      needHint: true,
      proxyApi: '/mirage'
    });
    const photoList = (result?.avatar && [{ url: result.avatar, uid: result.avatar, status: 'done' }]) || [];
    const wechatQrCodePhotoList = (result?.wechatQrCode && [{ url: result.wechatQrCode, uid: result.wechatQrCode, status: 'done' }]) || [];
    form.setFieldsValue({
      ...result,
      entryTime: result?.entryTime && dayjs(result?.entryTime), // 时间的回显需要处理成moment格式
      birth: result?.birth && dayjs(result?.birth), // 时间的回显需要处理成moment格式
      cityId: result.cityId ? [result.provinceId, result.cityId] : [],
      avatar: photoList,
      wechatQrCode: wechatQrCodePhotoList,
      managerName: result?.managerName,
      managerId: result.managerId,
    });
    const managerList = result.managerId ? [{ name: result.managerName, id: result.managerId }] : [];

    setChooseUserValues({
      ...chooseUserValues,
      users: managerList,
    });
  };

  // 获取部门列表/角色列表/岗位列表/城市列表
  const loadDepartMent = async () => {
    const roleResult = await roleList({ size: 100 });
    const educationResult = await dictionaryTypeItems({ encode: 'education' });
    setSelectList({
      role: roleResult.objectList.map((item) => ({ value: item.id, label: item.name })) || [],
      education: educationResult.map((item) => ({ value: item.id, label: item.name })) || [],
    });
  };

  // 关闭
  const onClose = () => {
    setOperateUser({ ...operateUser, visible: false });
  };

  // 确定
  const onOk = () => {
    form.validateFields().then((values: any) => {
      const params = {
        ...values,
        birth: values.birth && dayjs(values.birth).format('YYYY-MM-DD'),
        entryTime: values.entryTime && dayjs(values.entryTime).format('YYYY-MM-DD'),
        provinceId: values.cityId[0],
        cityId: values.cityId[1],
        roleIds: Array.isArray(values.roleIds) ? values.roleIds : [values.roleIds],
        avatar: (values?.avatar && values.avatar.length && values.avatar[0].url) || null,
        wechatQrCode: (values?.wechatQrCode && values.wechatQrCode.length && values.wechatQrCode[0].url) || null,
        ...(values.positionIds && { positionIds: values.positionIds }),
        ...(operateUser.id && { id: operateUser.id }),
      };

      // // 创建-http://yapi.lanhanba.com/project/289/interface/api/33052
      // // 修改-http://yapi.lanhanba.com/project/289/interface/api/33055
      const url = operateUser.id ? '/employee/update' : '/employee/create';
      post(url, params, {
        needHint: true,
        proxyApi: '/mirage'
      }).then(() => {
        message.success(`用户信息${operateUser.id ? '修改' : '新建'}成功`);
        onSearch();
        onClose();
      });
    });
  };


  // 选择直属上级
  const checkPartner = () => {
    setChooseUserValues({ ...chooseUserValues, visible: true });
  };

  // 确定选择部门主管
  const onOkSelector = ({ users, visible }: PermissionSelectorValues) => {
    form.setFieldsValue({
      managerName: (users.length && users.map(user => user.name)?.join('、')) || '',
      managerId: users.length && users.map(user => user.id).pop() || undefined,
    });
    setChooseUserValues({ users, visible });
  };

  return (
    <>
      <Drawer
        title={!operateUser.id ? '新建用户' : '编辑用户'}
        placement='right'
        closable={true}
        keyboard={false}
        maskClosable={false}
        onClose={onClose}
        open={operateUser.visible}
        width={'800px'}
        forceRender
        extra={
          <Space>
            <Operate
              operateList={[
                { name: '确定', event: 'onOk', type: 'primary', onClick: onOk },
                { name: '取消', event: 'onClose', type: 'default', onClick: onClose },
              ]}
            />
          </Space>
        }
      >
        <V2Form form={form}>
          <Row gutter={16}>
            <Col span={24}>
              <Title level={5}>基础信息</Title>
              <Divider />
            </Col>
            {operateUser.id && ( // 编辑的时候显示账户，仅查看不可编辑
              <Col span={12}>
                <V2FormInput label='账户' name='username' config={{ readOnly: true }} />
              </Col>
            )}
            <Col span={12}>
              <V2FormInput
                label='姓名'
                name='name'
                placeholder='真实姓名'
                rules={[{ required: true, message: '请输入真实姓名' }]}
                maxLength={20}
              />
            </Col>
            <Col span={12}>
              <V2FormInput
                label='手机号'
                name='mobile'
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: MOBILE_REG, message: '手机号格式错误' },
                ]}
              />
            </Col>
            <Col span={12}>
              <V2FormInput
                label='邮箱'
                name='email'
                placeholder='邮箱'
                rules={[{ pattern: EMAIL_REG, message: '邮箱格式错误' }]}
              />
            </Col>
            <Col span={12}>
              <V2FormSelect label='性别' name='gender' required options={SEX}/>
            </Col>
            <Col span={12}>
              <V2FormProvinceList label='所属城市' name='cityId' required type={2}/>
            </Col>
            <Col span={12}>
              <V2FormTreeSelect
                label='所属部门'
                name='departmentIds'
                required
                treeData={operateUser.department}
                config={{
                  fieldNames: { label: 'name', value: 'id', children: 'children' },
                  multiple: true,
                  showSearch: true,
                  treeNodeFilterProp: 'name',
                  treeDefaultExpandAll: true,
                }}
              />
            </Col>
            {operateUser.visible && (
              <Col span={12}>
                <FormPostList
                  label='所属岗位'
                  name='positionIds'
                  allowClear={true}
                  placeholder='请选择所属岗位'
                  config={{
                    mode: 'multiple',
                    disabled: !!form.getFieldValue('isWxCorp')
                  }}
                />
              </Col>
            )}
            <Col span={12}>
              <V2FormInput
                label='直属上级'
                name='managerName'
                maxLength={20}
                onClickInput={checkPartner}
                config={{
                  readOnly: true,
                }}
              />
              <FormSetName name='managerId'/>
              {/* 是否是企微用户  1：是  0：否 */}
              <FormSetName name='isWxCorp'/>
            </Col>
            <Col span={12}>
              <V2FormSelect
                label='角色'
                name='roleIds'
                options={selectList.role}
                config={{ showSearch: true, optionFilterProp: 'label', mode: 'multiple' }}
              />
            </Col>
            <Col span={12}>
              <V2FormSelect label='状态' name='status' required options={STATUS}/>
            </Col>
            <Col span={24}>
              <Title level={5}>扩展信息</Title>
              <Divider />
            </Col>
            <Col span={12}>
              <V2FormUpload
                label='头像'
                name='avatar'
                uploadType='image'
                config={{
                  maxCount: 1,
                  size: 4,
                }}
              />
            </Col>
            <Col span={12}>
              <V2FormUpload
                label='微信二维码'
                name='wechatQrCode'
                uploadType='image'
                config={{
                  maxCount: 1,
                  size: 4,
                }}
              />
            </Col>
            <Col span={12}>
              <V2FormDatePicker label='入职时间' name='entryTime' />
            </Col>
            <Col span={12}>
              <V2FormInput
                label='证件号码'
                name='idNumber'
                maxLength={18}
                rules={[{ pattern: USRT_REG, message: '证件号码格式错误' }]}
              />
            </Col>
            <Col span={12}>
              <V2FormSelect label='文化程度' name='education' options={selectList.education} />
            </Col>
            <Col span={12}>
              <V2FormDatePicker label='出生年月' name='birth' />
            </Col>
            <Col span={24}>
              <V2FormTextArea label='通讯地址' name='address' maxLength={200} config={{ showCount: true }} />
            </Col>
          </Row>
        </V2Form>
      </Drawer>
      <PermissionSelector
        title='选择用户'
        type='ONE'
        values={chooseUserValues}
        onClose={setChooseUserValues}
        onOk={onOkSelector}
      />
    </>
  );
};

export default UserInfoOperate;