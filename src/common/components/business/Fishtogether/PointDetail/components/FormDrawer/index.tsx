/**
 * @Description 创建/机会点时的表单
 * 逻辑说明：
 * 1. 利用antd的Form组件的onValuesChange监听输入的变化
 * 2. 从接口获取到的组件数据，通过递归将所有组件平铺到一个对象数组中
 * 3. 根据每个表单项绑定的name（即identification），在平铺的组件对象中查找对应的组件，然后进行textValue的赋值
 */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Space, Button, Form } from 'antd';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { templateDetailOfYN, savePointOfYN, pointDetailOfYN } from '@/common/api/fishtogether';
import { useMethods } from '@lhb/hook';
import { isArray, refactorPermissions } from '@lhb/func';
import {
  formDataComsToTiled,
  formDataEcho,
  parseValueCatch,
  relevancyShow,
} from '@/common/components/business/DynamicComponent/config';
import cs from 'classnames';
import styles from './index.module.less';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Container from '@/common/components/Data/V2Container';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Main from './components/Main';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Operate from '@/common/components/Others/V2Operate';
import { ImportModalValuesProps } from '@/views/fishtogether/pages/chancepointmanage/ts-config';
import ImportChancePointHistoryModal from '../Modal/ImportChancePointHistoryModal';

const FormDrawer: FC<any> = ({ drawerData, closeHandle, onSearch, update }) => {
  const tiledFormDataRef = useRef<any[]>([]); // 所有组件字段平铺后的对象数组
  const lockRef = useRef(false);
  const [form] = Form.useForm();
  const { open, templateId, id, importPermission } = drawerData;
  const [formData, setFormData] = useState<any>({}); // 接口返回的动态表单源数据
  const [tabActive, setTabActive] = useState<string>(''); // 当前tab值
  // 省市区组件的唯一标识符
  const pcdIdentification = 'area';
  const addressIdentification = 'basicAddress'; // 地址组件的唯一标识符
  const [importModalProps, setImportModalProps] = useState<ImportModalValuesProps>({ visible: false });
  const [refreshCurrentDrawer, setRefreshCurrentDrawer] = useState<number>(0);
  useEffect(() => {
    // 编辑
    if (id) {
      getDetail();
      return;
    }
    // 创建时获取模板详情
    if (templateId) {
      getTempleteDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, templateId, refreshCurrentDrawer]);

  // useEffect(() => {
  //   console.log(`formData变化了`, formData);
  //   console.log(`tiledFormDataRef`, tiledFormDataRef.current);
  // }, [formData]);

  // 一级菜单
  const tabs = useMemo(() => {
    if (!Object.keys(formData).length) return [];
    const { propertyGroupVOList } = formData;
    if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
      return propertyGroupVOList.map((item: any) => ({
        label: item.name,
        key: `${item.id}`, // tabs组件的activeKey是string类型
      }));
    }
    return [];
  }, [formData]);

  const {
    getTempleteDetail,
    getDetail,
    addressComWhenEdit,
    tabChange,
    confirmHandle,
    closeDrawer,
    confirmClose,
    ...methods
  } = useMethods({
    getDetail() {
      // 编辑时的获取详情
      pointDetailOfYN(id).then((res: any) => {
        // dynamicRelationId需要特殊赋值
        const { templateDetailResponse, dynamicRelationId } = res;
        templateDetailResponse.dynamicRelationId = dynamicRelationId;
        const { propertyGroupVOList } = templateDetailResponse;
        // 设置tabs默认值
        if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
          setTabActive(`${propertyGroupVOList[0].id}`);
          formDataComsToTiled(propertyGroupVOList, tiledFormDataRef.current); // 将组件对象平铺到数组中
          // 表单赋值
          const allComs = tiledFormDataRef.current;
          addressComWhenEdit(allComs); // 特殊逻辑，拿到省市区组件的值后，将城市信息塞到地址组件中
          relevancyShow(allComs); // 关联显示
          const values = {};
          allComs.forEach((item: any) => {
            const { identification } = item;
            // 根据组件类型，将表单数据set到form上
            values[identification] = formDataEcho(item);
          });

          form.setFieldsValue(values);
        }
        setFormData(templateDetailResponse);
      });
    },
    addressComWhenEdit(allComs: any[]) {
      // 编辑时的地址组件的特殊逻辑处理
      const pcdCom = allComs.find((itemCom: any) => itemCom.identification === pcdIdentification);
      const addressCom = allComs.find((itemCom: any) => itemCom.identification === addressIdentification);
      if (!(pcdCom && addressCom)) return;
      const pcdVal = parseValueCatch(pcdCom);
      const addressVal = parseValueCatch(addressCom);
      if (!pcdVal) return;
      if (addressVal) {
        addressCom.textValue = JSON.stringify(Object.assign({}, addressVal, pcdVal));
      }
    },
    getTempleteDetail() {
      // 获取模板详情
      templateDetailOfYN({ id: templateId }).then((data: any) => {
        const { propertyGroupVOList } = data;
        // 设置tabs默认值
        if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
          setTabActive(`${propertyGroupVOList[0].id}`);
          formDataComsToTiled(propertyGroupVOList, tiledFormDataRef.current); // 将组件对象平铺到数组中
          relevancyShow(tiledFormDataRef.current); // 关联显示
        }
        setFormData(data);
      });
    },
    tabChange(active: string) {
      setTabActive(active);
    },
    /**
     * 表单提交，目前的写法只能校验当前表单页的必填项，因为渲染的时候只渲染对应的tab下的表单项
     */
    confirmHandle() {
      if (lockRef.current) return;
      lockRef.current = true;
      form
        .validateFields()
        .then(async () => {
          // console.log(`values`, values);
          const propertyValues = tiledFormDataRef.current.map((item: any) => ({
            id: item.id,
            propertyId: item.propertyId,
            identification: item.identification,
            textValue: item.textValue,
          }));
          const params: any = {
            type: formData.type,
            dynamicRelationId: formData.dynamicRelationId,
            propertyValues,
          };
          if (id) {
            params.id = id;
          }
          // console.log(`params`, params);
          await savePointOfYN(params);
          form.resetFields(); // 清空表单
          // 编辑时更新机会点详情
          if (id) {
            update && update();
          }
          onSearch({}); // 刷新列表
          confirmClose(); // 关闭抽屉
        })
        .catch((errorInfo: any) => {
          console.log(`errorInfo`, errorInfo);
        })
        .finally(() => {
          lockRef.current = false;
        });
    },
    confirmClose() {
      form.resetFields(); // 表单清空
      closeHandle();
      tiledFormDataRef.current = [];
    },
    closeDrawer() {
      // 关闭弹窗时
      V2Confirm({
        onSure: () => {
          confirmClose();
        },
        zIndex: 1010,
        title: '操作提示',
        content: '退出后将不保存当前操作，请确认是否退出。',
      });
    },
    handleImport() {
      setImportModalProps({ visible: true, id });
    },
  });

  return (
    <div>
      <V2Drawer
        open={open}
        zIndex={1001}
        onClose={() => closeDrawer()}
        className={cs('dynamicComponent', styles.formDrawer)}
      >
        <V2Container
          // 24px上padding
          style={{ height: 'calc(100vh - 24px)' }}
          extraContent={{
            top: (
              <>
                <V2Title
                  text='机会点'
                  extra={
                    <div className='mr-40'>
                      <V2Operate
                        operateList={refactorPermissions(importPermission)?.map((item) => ({
                          ...item,
                          type: 'primary',
                        }))}
                        onClick={(btn) => methods[btn.func]()}
                      />
                    </div>
                  }
                ></V2Title>
                {/* 一级菜单 */}
                <V2Tabs items={tabs} activeKey={tabActive} onChange={tabChange} />
              </>
            ),
            bottom: (
              <div className={styles.footerCon}>
                <Space size={12}>
                  <Button onClick={closeDrawer}>取消</Button>
                  <Button type='primary' onClick={confirmHandle}>
                    确定
                  </Button>
                </Space>
              </div>
            ),
          }}
        >
          {/* 动态表单内容 */}
          <Main
            form={form}
            formData={formData}
            pcdIdentification={pcdIdentification}
            setFormData={setFormData}
            active={tabActive}
            tiledFormDataRef={tiledFormDataRef}
          />
        </V2Container>
      </V2Drawer>
      {/* 导入审批表弹窗 */}
      <ImportChancePointHistoryModal
        visible={importModalProps.visible}
        importChancePointId={id}
        closeHandle={() => {
          setImportModalProps({ visible: false });
        }}
        confirmHandle={() => {
          setImportModalProps({ visible: false });
          onSearch({});
          setRefreshCurrentDrawer(refreshCurrentDrawer + 1);
        }}
      />
    </div>
  );
};

export default FormDrawer;
