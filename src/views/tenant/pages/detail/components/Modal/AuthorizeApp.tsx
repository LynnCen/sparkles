/* 授权应用  */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Steps, message, Form, DatePicker, Alert } from 'antd';
import OperatePermission from '@/views/organization/pages/permission/components/OperatePermission';
import PermissionTree from '@/views/organization/pages/permission/components/PermissionTree';
import { get, post } from '@/common/request';
import { getKeys } from '@/common/utils/ways';
import { dealWithTree } from '@/views/organization/pages/permission/entry';
import { getAuthorizedInfoByTenatInfo, listByModuleIds } from '@/common/api/permission';
import { AuThorizeAppProps, ModalStatus, AppId } from '../../ts-config';
import styles from './index.module.less';
import dayjs from 'dayjs';
import FormTreeSelect from '@/common/components/Form/FormTreeSelect';
import { appVersionList, brandList } from '@/common/api/brand';
import { industryList } from '@/common/api/industry';
// import FormBrand from '@/common/components/FormBusiness/FormBrand';
import { menuStore } from '@/views/application/pages/menu-managent/store';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import { useMethods } from '@lhb/hook';
import { isNotEmptyAny } from '@lhb/func';
const { getMenusByAppId } = menuStore;

const { Item, useForm } = Form;

const { RangePicker } = DatePicker;

const steps = [{ title: '设置版本和有效期' }, { title: '菜单权限' }, { title: '按钮权限' },];

// 商业直租个人免费版
const APP_VERSION_FREE = 1;
const AuthorizeApp: React.FC<AuThorizeAppProps> = ({ modalParams, onClose, onSearch }) => {
  const [options, setOptions] = useState<{ branList: any[]; industryList: [] }>({ branList: [], industryList: [] });
  const [current, setCurrent] = useState(0);
  const [appVersion, setAppVersion] = useState<any[]>([]);
  const { time, id, brandId, brandName, industryId, industryName } = modalParams;
  const [form] = useForm();
  const brand = Form.useWatch('brandId', form);
  const industry = Form.useWatch('industryId', form);

  const appVersionValue = Form.useWatch('appVersion', form);

  const showAppVersion = useMemo(() => id === AppId.LOCATION || id === AppId.PMS || id === AppId.LOCATIONS_SPACE, [id]); // 只有pms和location显示授权版本
  // 展开节点
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // 已选中的父节点的id
  const [data, setData] = useState<{ treeData: any[]; loading: boolean }>({
    treeData: [],
    loading: true,
  });
  // 版本和有效期formData
  const [formData, setFormData] = useState<any>({});

  const treeMap = useRef(new Map());
  // 选中的节点
  const [checkedKeys, setCheckedKeys] = useState<any>({
    moduleIds: null,
    permissionIds: [],
    halfCheckedKeys: [],
  });

  // 当前所在步数选中的keys
  const checkCurrent = useMemo(() => {
    if (current === 1) return checkedKeys.moduleIds;
    if (current === 2) return checkedKeys.permissionIds;
    return checkedKeys.roleIds;
  }, [current, checkedKeys]);

  // 当前所在步tree需要的filenames
  const treeFilenames = useMemo(() => {
    if (current === 2) return { title: 'name', key: 'key', children: 'children' };
    return { title: 'name', key: 'id', children: 'children' };
  }, [current]);

  // 所有的key，可用于全部勾选/选中所有操作
  const allKeys = useMemo(() => {
    if (!data.treeData.length) return [];
    return getKeys(data.treeData, [], treeFilenames.key, treeFilenames.children, true);
  }, [treeFilenames.key, data.treeData]);

  // allKeys变更的时候重新set
  useEffect(() => {
    setExpandedKeys(allKeys);
  }, [allKeys]);

  useEffect(() => {
    // 弹窗打开的时候，根据当前选中请求数据
    if (modalParams.visible) {
      switch (current) {
        case 1:
          loadPermissionTree();
          break;
        case 2:
          loadPermissionButtonTree();
          break;
        default:
          break;
      }
    } else {
      setCurrent(0);
      setData({ loading: true, treeData: [] });
    }
  }, [modalParams.visible, current]);


  // 步骤改变
  const changeStep = (type: string) => {
    setData({ loading: true, treeData: [] });
    // 表单放在第一个，需要先把表单校验通过且存值才能进行下一步
    form.validateFields().then((values: any) => {
      const { time = [] } = values;
      const _brandId = typeof values.brandId === 'string' ? brandId : brand;
      const _industryId = typeof values.industryId === 'string' ? industryId : industry;
      const start = dayjs(time[0]).format('YYYY-MM-DD');
      const end = dayjs(time[1]).format('YYYY-MM-DD');
      const params:any = {
        appId: modalParams.id,
        tenantId: Number(modalParams.tenantId),
        brandId: _brandId,
        industryId: _industryId,
        appVersion: values.appVersion,
        start,
        end,
      };
      isNotEmptyAny(values) && setFormData(params); // 有值才set
      setCurrent(type === 'next' ? current + 1 : current - 1);
    });
  };

  // 筛选出树的所有父节点
  const filterParentById = (tree) => {
    for (let i = 0; i < tree.length; i++) {
      const { id, children } = tree[i];
      if (!treeMap.current.has(id)) {
        if (children.length) {
          treeMap.current.set(id, id);
        }
      }
      if (children.length) {
        filterParentById(children);
      }
    }
  };

  // 请求菜单权限树
  const loadPermissionTree = async () => {
    const moduleList: any = await getMenusByAppId(modalParams.id as any);
    setData({ loading: false, treeData: dealWithTree(moduleList, 'children') });
    getInfo(moduleList);
  };

  // 获取角色授权信息
  const getInfo = async (moduleList: any) => {

    // 权限管理不需要数据回显
    if (!modalParams.roleId) {
      return;
    }
    const { moduleIds, permissionIds } = await getAuthorizedInfoByTenatInfo({
      appId: modalParams.id,
      tenantId: modalParams.tenantId
    });
    filterParentById(moduleList);
    const newModuleIds: any = [];
    const halfCheckedKeys: any = [];
    for (let i = 0; i < moduleIds.length; i++) {
      if (!treeMap.current.has(moduleIds[i])) {
        newModuleIds.push(moduleIds[i] as any);
      } else {
        halfCheckedKeys.push(moduleIds[i] as any);
      }
    }

    // 数据第一次加载
    if (!checkedKeys.moduleIds) {
      setCheckedKeys({ ...checkedKeys, moduleIds: newModuleIds, permissionIds: permissionIds, halfCheckedKeys });
      return;
    }

  };

  // 请求按钮权限树
  const loadPermissionButtonTree = async () => {
    if (!((checkedKeys.moduleIds || []).concat(checkedKeys.halfCheckedKeys)).length) {
      setData({ loading: false, treeData: [] });
      return;
    }
    const moduleList: any = await listByModuleIds({
      moduleIds: (checkedKeys.moduleIds as any).concat(checkedKeys.halfCheckedKeys as any),
    });
    const addTreeKeyList = dealWithTree(moduleList || [], 'children', false);
    setData({ loading: false, treeData: addTreeKeyList });

  };

  // 关闭弹窗-重置state
  const onCancel = () => {
    onClose({ ...modalParams, visible: false });
    setCurrent(0);
    setCheckedKeys({ moduleIds: null, permissionIds: [] });
    form.resetFields();
  };

  const typeCheckKeys = (type: string, keys?: number[]) => {
    switch (type) {
      case 'checkAll':
        return allKeys;
      case 'cancelCheck':
        return [];

      default:
        return keys || [];
    }
  };

  // 更改选中的id
  const changeCheckKeys = (type: string, keys?: number[], halfCheckedKeys?: number[]) => {
    const checkKeys = typeCheckKeys(type, keys);
    switch (current) {
      case 1:
        setCheckedKeys({ ...checkedKeys, moduleIds: checkKeys, halfCheckedKeys: halfCheckedKeys || [] });
        break;
      case 2:
        setCheckedKeys({ ...checkedKeys, permissionIds: checkKeys });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!time) {
      return;
    }

    if (!time[0] || !time[1]) {
      return;
    }
    form.setFieldsValue({ time: [dayjs(time[0]), dayjs(time[1])] });
  }, [form, time]);

  useEffect(() => {
    if (modalParams.visible) {
      form.setFieldsValue({
        brandId: brandName,
        industryId: industryName,
        appVersion: modalParams.appVersion || appVersion?.[0]?.value,
      });
    }
  }, [modalParams.visible, appVersion]);

  // 展开所有/收起所有
  const expendKeys = (type: string) => {
    switch (type) {
      case 'expendAll':
        setExpandedKeys(allKeys);
        break;
      case 'foldAll':
        setExpandedKeys([]);
        break;
      default:
        break;
    }
  };

  // 确定
  const onOk = () => {
    if (isNotEmptyAny(formData)) {
      // 将表单值与树的值合并
      const _params = {
        ...formData,
        moduleIds: (checkedKeys.moduleIds as any).concat(checkedKeys.halfCheckedKeys as any),
        permissionIds: checkedKeys.permissionIds.filter((item) => typeof item === 'number'),
      };

      const monthlyCardExperience = form.getFieldValue('monthlyCardExperience');
      Promise.all([
        // http://yapi.lanhanba.com/project/289/interface/api/33088
        post('/tenant/grantApp', { ..._params }, { needHint: true, proxyApi: '/mirage' }),
        // https://yapi.lanhanba.com/project/560/interface/api/63657
        id === AppId.LOCATIONS_SPACE && post('/admin/user/tenant/updateExperience', { tenantId: Number(modalParams.tenantId), type: monthlyCardExperience }, { proxyApi: '/zhizu-api' })
      ]).then(() => {
        message.success('权限设置成功');
        onCancel();
        onSearch();
      });
    }
  };



  const methods = useMethods({
    // 获取品牌、行业列表
    async getOptions() {
      const brandResult = await brandList({ type: 1 });
      const industryResult = await industryList({});
      setOptions({
        branList: brandResult?.objectList || [],
        industryList: industryResult?.industryResponseList || [],
      });
    },
    // 获取应用版本下拉框列表
    getAppVersionList() {
      appVersionList({ appId: modalParams.id }).then((res:any[]) => {
        const _res = res.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.value,
          };
        });
        setAppVersion((_res));
      });
    },
    // 获取商业直租vip月卡体验权限
    getTenantVipExperience() {
      // https://yapi.lanhanba.com/project/560/interface/api/63664
      get('/admin/user/tenant/experience', { tenantId: Number(modalParams.tenantId) }, { proxyApi: '/zhizu-api' }).then((res) => {
        form.setFieldValue('monthlyCardExperience', +res);
      });
    }
  });

  useEffect(() => {
    if (modalParams.visible) {
      methods.getOptions();
      methods.getAppVersionList();
      id === AppId.LOCATIONS_SPACE && methods.getTenantVipExperience();
    }
  }, [modalParams]);

  function showTips() {
    // 有数据时
    if (Array.isArray(data.treeData) && data.treeData.length) {
      return null;
    } else if (current !== 2) {
      return null;
    }
    return <Alert message='未选择菜单权限会导致按钮权限下暂无数据' type='warning' />;
  }


  return (
    <Modal
      className={styles.authorizeModal}
      title={modalParams.type === ModalStatus.ADD ? '授权应用' : '编辑应用授权'}
      footer={null}
      open={modalParams.visible}
      width={800}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <p>
        {modalParams.type === ModalStatus.ADD
          ? ` 确定为「${modalParams.tenantName}」授权「${modalParams.appName}」应用？`
          : '请进行应用授权的相应配置，勾选该租户可以使用的相关功能模块'}
      </p>
      <div className={styles.operateWrap}>
        <OperatePermission
          treeData={data.treeData}
          changeCheckKeys={changeCheckKeys}
          expendKeys={expendKeys}
          steps={steps.length}
          current={current}
          changeStep={changeStep}
          onOk={onOk}
        />
      </div>

      <Steps
        className={styles.siteNavigationSteps}
        size='small'
        type='navigation'
        current={current}
        items={steps}/>
      {/** 历史遗留只能使用step进行判断 */}
      {

        current === 0
          ? (
            <div className={styles.formWrapper}>
              <Form form={form} >

                {showAppVersion && <V2FormRadio
                  label='授权版本'
                  name='appVersion'
                  options={appVersion}
                  required
                  rules={[{ required: true, message: '请选择授权版本' }]}
                  formItemConfig={{
                    colon: true,
                    extra: id === AppId.LOCATIONS_SPACE && '设置完成后，请勿在个人版和企业版之间修改切换'
                  }}
                />}

                {id === AppId.LOCATIONS_SPACE && appVersionValue === APP_VERSION_FREE && <V2FormRadio
                  label='开启体验月卡授权'
                  name='monthlyCardExperience'
                  options={[{ label: '是', value: 1 }, { label: '否', value: 0 }]}
                  required
                  rules={[{ required: true, message: '请选择授权版本' }]}
                  formItemConfig={{
                    colon: true
                  }}
                />}
                <Item
                  name='time'
                  label='应用授权有效期'
                  rules={[
                    {
                      required: true,
                      message: '应用授权有效期不能为空'
                    }
                  ]}
                >
                  <RangePicker/>
                </Item>
                {id === AppId.LOCATION && <>
                  {/* <FormBrand
                    label='企业品牌'
                    placeholder='请选择'
                    rules={[{ required: true, message: '请选择企业品牌' }]}
                    name='brandId'/> */}
                  <FormTreeSelect
                    label='所属行业'
                    name='industryId'
                    treeData={options.industryList}
                    rules={[{ required: true, message: '请选择所属行业' }]}
                    config={{
                      fieldNames: { label: 'name', value: 'id', children: 'childList' },
                    }}
                  />
                </>}
              </Form>
            </div>
          )
          : <div className={styles.treeWrap}>
            {showTips()}
            <PermissionTree
              treeData={data.treeData}
              expandedKeys={expandedKeys}
              changeExpandedKeys={setExpandedKeys}
              checkedKeys={checkCurrent}
              changeCheckedKeys={changeCheckKeys}
              fieldNames={treeFilenames}/>
          </div>
      }
    </Modal>
  );
};

export default AuthorizeApp;
