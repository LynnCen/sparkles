/**
 * @Description 创建/机会点时的表单
 * 逻辑说明：
 * 1. 利用antd的Form组件的onValuesChange监听输入的变化
 * 2. 从接口获取到的组件数据，通过递归将所有组件平铺到一个对象数组中
 * 3. 根据每个表单项绑定的name（即identification），在平铺的组件对象中查找对应的组件，然后进行textValue的赋值
 */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Space, Button, Form, message } from 'antd';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { useMethods } from '@lhb/hook';
import { isArray, isNotEmptyAny, refactorPermissions } from '@lhb/func';
import {
  formDataComsToTiled,
  formDataEcho,
  parseValueCatch,
  relevancyShow,
} from '@/common/components/business/DynamicComponent/config';
import {
  pcdIdentification,
  addressIdentification,
  AlwaysRequiredChanceIndentifications
} from '@/common/components/business/DynamicComponent/customize';
import cs from 'classnames';
import styles from './index.module.less';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Container from '@/common/components/Data/V2Container';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Operate from '@/common/components/Others/V2Operate';
import { ImportModalValuesProps } from '@/views/fishtogether/pages/chancepointmanage/ts-config';
import Main from './Main';
import ImportChancePointHistoryModal from './ImportChancePointHistoryModal';
import moment from 'moment';
import { radioEnum } from '@/common/components/business/DynamicComponent/components/Footprint';
import { footprintCreate, getFormDetail, getTemplateDetail, saveChancePoint } from '@/common/api/expandStore/chancepoint';
import { useSelector } from 'react-redux';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const FormDrawer: FC<any> = ({
  drawerData,
  closeHandle,
  onSearch,
  update
}) => {
  const dynamicOtherFormNameArr = useSelector((state: any) => state.common.dynamicOtherFormNameArr); // 存放“其他”表单的formName

  /*
    是否点位评估表单，是的话字段参照拓店模板设置，而不是流程配置
    请求formDetail后，按照有无绑定taskId来决定，有则true
    默认值必须是false，新建机会点时不请求formDetail，会使用默认值
  */
  const [isEvaluation, setIsEvaluation] = useState<boolean>(false);

  const tiledFormDataRef = useRef<any[]>([]); // 所有组件字段平铺后的对象数组
  const lockRef = useRef(false);
  const topRef: any = useRef(); // 吸顶部分
  const tabActiveRef: any = useRef();
  const tabContentRefs: any = useRef([]);
  const [form] = Form.useForm();
  const { open, templateId, id, importPermission } = drawerData;
  const [formData, setFormData] = useState<any>({}); // 接口返回的动态表单源数据
  const [tabActive, setTabActive] = useState<string>(''); // 当前tab值
  const [importModalProps, setImportModalProps] = useState<ImportModalValuesProps>({ visible: false });
  // supportDirectApproval 是否支持直接提交审批 1:支持 2:不支持
  const [supportDirectApproval, setSupportDirectApproval] = useState<number>(2);
  const [refreshCurrentDrawer, setRefreshCurrentDrawer] = useState<number>(0);
  const [isFootprintValue, setIsFootprintValue] = useState<boolean>(false);// 编辑状态下踩点任务是否已创建
  const [allComps, setAllComps] = useState<any[]>([]);
  const [scrollAccordingTab, setScrollAccordingTab] = useState<boolean>(false); // 是否按照tab点击滚动页面，第一次点击tab后才为true，避免初始化内容后就滚动

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

  /**
   * @description 是否以长列表展示，总字段数<=120时使用
   */
  const isLongList = useMemo(() => {
    const res = isArray(allComps) && allComps.length <= 120;
    return res;
  }, [allComps]);

  const {
    getTempleteDetail,
    getDetail,
    addressComWhenEdit,
    tabChange,
    confirmHandle,
    closeDrawer,
    confirmClose,
    handleFootprintValue,
    ...methods
  } = useMethods({
    getDetail() {
      getFormDetail({ id }).then((res: any) => {
        // dynamicRelationId需要特殊赋值
        const { templateDetailResponse, dynamicRelationId, supportDirectApproval, taskId } = res;
        setIsEvaluation(!!taskId);

        templateDetailResponse.dynamicRelationId = dynamicRelationId;
        const { propertyGroupVOList } = templateDetailResponse;
        // 设置tabs默认值
        if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
          setTabActive(`${propertyGroupVOList[0].id}`);
          tabActiveRef.current = `${propertyGroupVOList[0].id}`;
          formDataComsToTiled(propertyGroupVOList, tiledFormDataRef.current); // 将组件对象平铺到数组中
          // 表单赋值
          const allComs = tiledFormDataRef.current;
          setAllComps(allComps);
          addressComWhenEdit(allComs); // 特殊逻辑，拿到省市区组件的值后，将城市信息塞到地址组件中
          relevancyShow(allComs); // 关联显示
          const values = {};
          allComs.forEach((item: any) => {
            const { identification } = item;
            // 根据组件类型，将表单数据set到form上
            values[identification] = formDataEcho(item);
            // 设置踩点组件数据回显
            handleFootprintValue(item);
          });

          form.setFieldsValue(values);
        }
        setSupportDirectApproval(supportDirectApproval);
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
      // 创建时的踩点任务必然是没有的
      setIsFootprintValue(false);
      // 获取模板详情
      getTemplateDetail({ id: templateId }).then((data: any) => {
        const { propertyGroupVOList, supportDirectApproval } = data;

        // 设置tabs默认值
        if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
          setTabActive(`${propertyGroupVOList[0].id}`);
          formDataComsToTiled(propertyGroupVOList, tiledFormDataRef.current); // 将组件对象平铺到数组中
          setAllComps(tiledFormDataRef.current);
          relevancyShow(tiledFormDataRef.current); // 关联显示
        }
        setFormData(data);
        setSupportDirectApproval(supportDirectApproval);
      });
    },
    tabChange(active: string) {
      setScrollAccordingTab(true);
      setTabActive(active);
      tabActiveRef.current = active;
      const targetEle = tabContentRefs.current?.find((refItem) => refItem?.id === +active);
      // 注意这里的behavior不要设置为smooth，会影响子组件中的handleScroll逻辑
      targetEle?.el?.scrollIntoView({ behavior: 'instant', block: 'start' });
    },
    /**
     * 表单提交，目前的写法只能校验当前表单页的必填项，因为渲染的时候只渲染对应的tab下的表单项
     */
    confirmHandle() {
      // 无论任何情况下，机会点表单必须检查必填的特殊字段
      let checkFields: any[] = [];
      if (isArray(tiledFormDataRef.current)) {
        const allIndentifications = tiledFormDataRef.current.map(itm => itm.identification);
        checkFields = AlwaysRequiredChanceIndentifications.filter((itm: any) => allIndentifications.includes(itm));
      }

      // 全部字段检查时传undefined即无入参
      form
        .validateFields([...checkFields, ...dynamicOtherFormNameArr])
        .then(async () => {
          // 拿到踩点组件的值，校验信息是否填写完全（对目前的写法只能校验当前表单页的必填项的校验补充）
          const footprintItem:any = tiledFormDataRef.current.filter((item) => {
            return item.identification === 'locationFootprint';
          });
          let footprintValue;
          if (footprintItem.length !== 0 && isArray(footprintItem)) {
            footprintValue = JSON.parse(footprintItem[0]?.textValue || null);
          }
          // 与产品大鹏确认，对于审批流程配置和可见可写不为空配置中，在supportDirectApproval===1情况下（支持审批流程配置)仅当access===2（可写）的状态下需要校验踩点组件是否不为空；supportDirectApproval===2情况下，表单都可见，所以也需要判断是否填写踩点组件
          let access;
          if (footprintItem.length !== 0 && isArray(footprintItem)) {
            access = JSON.parse(footprintItem[0]?.access || null);
          }
          // footprintItem不为空数组，选了是没填消息，或者没选
          if ((isArray(footprintItem) && footprintItem.length) &&
          ((supportDirectApproval === 1 && access === 2) || supportDirectApproval === 2) &&
          (footprintValue?.dynamicComponent_footprint_isStart === radioEnum.AGREE || !isNotEmptyAny(footprintValue))) {
            // 判断踩点组件信息是否填写完全
            if (!isNotEmptyAny(footprintValue?.dynamicComponent_footprint_checkRule) ||
                    !isNotEmptyAny(footprintValue?.dynamicComponent_footprint_checkPeriod)) {
              message.error('踩点信息填写不完全');
              return;
            }
          }

          if (lockRef.current) return;
          lockRef.current = true;

          const propertyValues = tiledFormDataRef.current.map((item: any) => ({
            id: item.id,
            propertyId: item.propertyId,
            identification: item.identification,
            textValue: item.textValue,
          }));
          const params: any = {
            // type: formData.type,
            customerTypeId: formData.customerTypeId,
            dynamicRelationId: formData.dynamicRelationId,
            propertyValues,
          };
          if (id) {
            params.id = id;
          }
          const data = await saveChancePoint(params).finally(() => {
            lockRef.current = false;
          });

          // 拿到机会点的 id=>data，需要创建踩点任务 且不是在编辑机会点情况下 再创建踩点任务
          if (footprintValue?.dynamicComponent_footprint_isStart === radioEnum.AGREE && !isFootprintValue) {
            if (!data) {
              message.error('机会点尚未保存');
              return;
            }
            await footprintCreate({
              chancePointId: data,
              propertyValues,
              checkRule: footprintValue.dynamicComponent_footprint_checkRule,
              checkPeriod: [{
                start: footprintValue.dynamicComponent_footprint_checkPeriod[0],
                end: footprintValue.dynamicComponent_footprint_checkPeriod[1],
              }]
            });

          }

          form.resetFields(); // 清空表单
          // 编辑时更新机会点详情
          if (id) {
            update && update();
          }
          onSearch && onSearch({}); // 刷新列表
          confirmClose(); // 关闭抽屉
        })
        .catch((errorInfo: any) => {
          console.log(`errorInfo1`, errorInfo);
          if (isArray(errorInfo?.errorFields) && errorInfo?.errorFields.length && isArray(errorInfo?.errorFields[0].errors) && errorInfo?.errorFields[0].errors.length) {
            V2Message.warning(errorInfo?.errorFields[0].errors[0]);
          }
        });
    },
    confirmClose() {
      form.resetFields(); // 表单清空
      closeHandle();
      tiledFormDataRef.current = [];
      setAllComps([]);
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
    // 处理踩点组件回显
    handleFootprintValue(item) {
      // locationFootprint 后端返回的踩点组件唯一标识
      if (item.identification === 'locationFootprint') {

        const textValue = JSON.parse(item?.textValue || null);
        if (!isNotEmptyAny(textValue)) return;
        // 判断是否已经有踩点任务
        setIsFootprintValue(textValue.dynamicComponent_footprint_isStart === radioEnum.AGREE);

        const values = {};
        // 数据回显
        values['dynamicComponent_footprint_isStart'] = textValue.dynamicComponent_footprint_isStart;
        form.setFieldsValue(values);
        // 如果踩点任务未创建，就不往下进行
        if (textValue.dynamicComponent_footprint_isStart === radioEnum.DENY) {
          return;
        }
        // 回显踩点日期规则
        values['dynamicComponent_footprint_checkRule'] = textValue?.dynamicComponent_footprint_checkRule;
        // 回显踩点时间
        values['dynamicComponent_footprint_checkPeriod'] =
        [
          moment(textValue?.dynamicComponent_footprint_checkPeriod[0], 'HH:mm'),
          moment(textValue?.dynamicComponent_footprint_checkPeriod[1], 'HH:mm'),
        ];
        form.setFieldsValue(values);

      }
    },
  });

  return (
    <div>
      <V2Drawer
        open={open}
        onClose={() => closeDrawer()}
        destroyOnClose
        className={cs('dynamicComponent', styles.formDrawer)}
      >
        <V2Container
          // 24px上padding
          style={{ height: 'calc(100vh - 24px)' }}
          extraContent={{
            top: (
              <div ref={topRef}>
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
                <V2Tabs
                  items={tabs}
                  activeKey={tabActive}
                  onChange={tabChange}
                  className={styles.tabsCon}
                />
              </div>
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
          <Main
            form={form}
            formData={formData}
            isEvaluation={isEvaluation}
            supportDirectApproval={supportDirectApproval}
            setFormData={setFormData}
            topRef={topRef}
            tabActiveRef={tabActiveRef}
            tabContentRefs={tabContentRefs}
            tabs={tabs}
            active={tabActive}
            setTabActive={setTabActive}
            scrollAccordingTab={scrollAccordingTab}
            isLongList={isLongList}
            tiledFormDataRef={tiledFormDataRef}
            isFootprintValue={isFootprintValue}
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
