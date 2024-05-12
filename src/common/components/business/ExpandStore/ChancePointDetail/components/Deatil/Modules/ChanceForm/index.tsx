/**
 * @Description 创建/机会点时的表单
 * 逻辑说明：
 * 1. 利用antd的Form组件的onValuesChange监听输入的变化
 * 2. 从接口获取到的组件数据，通过递归将所有组件平铺到一个对象数组中
 * 3. 根据每个表单项绑定的name（即identification），在平铺的组件对象中查找对应的组件，然后进行textValue的赋值
 */

import { FC, useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, message, Affix } from 'antd';
import { useMethods } from '@lhb/hook';
import { isArray, isNotEmptyAny } from '@lhb/func';
import {
  formDataComsToTiled,
  formDataEcho,
  isPropertyItemVisibleEditable,
  parseValueCatch,
  relevancyShow,
} from '@/common/components/business/DynamicComponent/config';
import {
  pcdIdentification,
  addressIdentification,
  AlwaysRequiredChanceIndentifications
} from '@/common/components/business/DynamicComponent/customize';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Main from './Main';
import moment from 'moment';
import { radioEnum } from '@/common/components/business/DynamicComponent/components/Footprint';
import { footprintCreate, saveChancePoint } from '@/common/api/expandStore/chancepoint';
import { chancepointApprovalSave } from '@/common/api/expandStore/approveworkbench';
import { useSelector } from 'react-redux';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const ChanceForm: FC<any> = forwardRef(({
  id,
  chanceDetail,
  isApproval,
  approvalId,
  onSearch,
  update,
  setHintStr,
  setHasEditableProperty,
  container,
  dynamicTabActiveRef,
  dynamicTabContentRefs,
  dynamicTabsRef,
  dynamicTabsActive,
  fixedHeight,
  setDynamicTabsActive,
}, ref) => {
  // 外部调用保存机会点
  useImperativeHandle(ref, () => ({
    saveChance: (needCheck: boolean, cb: Function) => {
      saveHandle(needCheck, cb);
    },
  }));

  const dynamicOtherFormNameArr = useSelector((state: any) => state.common.dynamicOtherFormNameArr); // 存放“其他”表单的formName

  const tiledFormDataRef = useRef<any[]>([]); // 所有组件字段平铺后的对象数组
  const lockRef = useRef(false);
  const dynamicForms:any = useRef(null);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>({}); // 接口返回的动态表单源数据
  const [tabActive, setTabActive] = useState<string>(''); // 当前tab值
  // supportDirectApproval 是否支持直接提交审批 1:支持 2:不支持
  const [supportDirectApproval, setSupportDirectApproval] = useState<number>(2);
  const [isFootprintValue, setIsFootprintValue] = useState<boolean>(false);// 编辑状态下踩点任务是否已创建
  const [allComps, setAllComps] = useState<any[]>([]);
  const [scrollAccordingTab, setScrollAccordingTab] = useState<boolean>(false); // 是否按照tab点击滚动页面，第一次点击tab后才为true，避免初始化内容后就滚动

  /**
   * @description 机会点表单中提取表单详情
   */
  useEffect(() => {
    if (!isNotEmptyAny(chanceDetail)) return;

    const {
      customerTypeId,
      dynamicRelationId,
      id,
      supportDirectApproval,
      moduleDetails,
    } = chanceDetail;

    const module = isArray(moduleDetails) ? moduleDetails.find((itm: any) => itm.moduleType === 4) : {};
    if (!module || !module.infoModule) return;

    const formDetail = {
      customerTypeId,
      dynamicRelationId,
      id,
      supportDirectApproval,
      templateDetailResponse: module.infoModule,
    };
    onFormDetail(formDetail);
  }, [chanceDetail]);

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

  useEffect(() => {
    dynamicTabsRef && (dynamicTabsRef.current = tabs);
  }, [tabs]);

  // 父容器滚动到对应位置时设置tabs选中项
  useEffect(() => {
    if (!dynamicTabsActive) return;
    setTabActive(dynamicTabsActive);
  }, [dynamicTabsActive]);

  /**
   * @description 是否以长列表展示，总字段数<=120时使用
   */
  const isLongList = useMemo(() => {
    const res = isArray(allComps) && allComps.length <= 120;
    return res;
  }, [allComps]);

  const {
    onFormDetail,
    addressComWhenEdit,
    tabChange,
    confirmClose,
    saveHandle,
    handleFootprintValue,
  } = useMethods({
    /**
     * @description 解析表单详情
     */
    onFormDetail(formDetail: any) {
      // dynamicRelationId需要特殊赋值
      const { templateDetailResponse, dynamicRelationId, supportDirectApproval } = formDetail;

      templateDetailResponse.dynamicRelationId = dynamicRelationId;
      const { propertyGroupVOList } = templateDetailResponse;
      // 设置tabs默认值
      if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
        setTabActive(`${propertyGroupVOList[0].id}`);
        tiledFormDataRef.current = []; // 设计不完美，方法有可能多次被触发，暂对策需清空数组
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

        // 判断是否至少有一个字段可见且可写
        const hasEditableItem = isArray(allComs) && allComs.some((itm:any) => isPropertyItemVisibleEditable(
          itm,
          formDetail.supportDirectApproval,
          true, // 详情页面内支持动态表单编辑的一定是机会点表单
          false, // 详情页面内支持动态表单编辑的一定是机会点表单，且不是点位评估
        ));
        setHasEditableProperty && setHasEditableProperty(hasEditableItem);
      }
      setSupportDirectApproval(supportDirectApproval);
      setFormData(templateDetailResponse);
      // console.log('做成templateDetailResponse', templateDetailResponse);
    },
    /**
     * @description 获取表单详情
     */
    // getDetail() {
    //   getFormDetail({ id }).then((res: any) => {
    //     console.log('onFormDetail getdetail', res);
    //     res && onFormDetail(res);
    //   });
    // },
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
    tabChange(active: string) {
      setScrollAccordingTab(true);
      setTabActive(active);
      setDynamicTabsActive && setDynamicTabsActive(active);
      dynamicTabActiveRef && (dynamicTabActiveRef.current = active);
      if (dynamicTabContentRefs) {
        const targetEle = dynamicTabContentRefs.current?.find((refItem) => refItem.key === active);
        const topVal = (targetEle?.el?.offsetTop || 0) + (dynamicForms.current?.offsetTop || 0);
        container?.current?.scrollTo({
          top: (topVal - (fixedHeight || 0)),
          behavior: 'instant'
        });
      }
    },
    // 处理保存参数
    dealParams() {
      const propertyValues = tiledFormDataRef.current.map((item: any) => ({
        id: item.id,
        propertyId: item.propertyId,
        identification: item.identification,
        textValue: item.textValue,
      }));

      if (isApproval) { // 审批详情页保存
        return {
          approvalId,
          /* 属性值 [{ id, propertyId, textValue }] */
          propertyValues,
        };
      } else { // 机会点详情页保存
        return {
          id, // 机会点 id
          dynamicRelationId: formData.dynamicRelationId,
          /* 属性值 [{ id, propertyId, textValue }] */
          propertyValues,
        };
      }
    },

    /**
     * @description 表单提交，目前的写法只能校验当前表单页的必填项，因为渲染的时候只渲染对应的tab下的表单项
     * @param needCheck 是否做完整表单必填项检查，注意false时也需要检查机会点名称等特殊字段
     * @param cb 表单保存成功的回调，带上回调参数propertyValues供“发起审批”以及“通过审批”操作用
     * @return
     */
    saveHandle(needCheck: boolean, cb: Function) {
      // 无论任何情况下，机会点表单必须检查必填的特殊字段
      let checkFields: any[] = [];
      if (!needCheck && isArray(tiledFormDataRef.current)) {
        const allIndentifications = tiledFormDataRef.current.map(itm => itm.identification);
        checkFields = AlwaysRequiredChanceIndentifications.filter((itm: any) => allIndentifications.includes(itm));
      }

      // 全部字段检查时传undefined即无入参
      form
        .validateFields(needCheck ? undefined : [...checkFields, ...dynamicOtherFormNameArr])
        .then(async () => {
          this.saveInner(cb);
        })
        .catch((errorInfo: any) => {
          console.log(`errorInfo 123`, errorInfo);
          if (isArray(errorInfo?.errorFields) && errorInfo?.errorFields.length && isArray(errorInfo?.errorFields[0].errors) && errorInfo?.errorFields[0].errors.length) {
            V2Message.warning(errorInfo?.errorFields[0].errors[0]);
          }
        });
    },
    async saveInner(cb: Function) {
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

      const api = isApproval ? chancepointApprovalSave : saveChancePoint;
      const params = this.dealParams();
      const data = await api(params).finally(() => {
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
          propertyValues: params.propertyValues,
          checkRule: footprintValue.dynamicComponent_footprint_checkRule,
          checkPeriod: [{
            start: footprintValue.dynamicComponent_footprint_checkPeriod[0],
            end: footprintValue.dynamicComponent_footprint_checkPeriod[1],
          }]
        });
      }
      // 编辑时更新机会点详情
      update && update();
      onSearch && onSearch({}); // 刷新列表
      // 传回propertyValues，发起审批请求中使用，通过审批目前用不到这个
      cb && cb(params.propertyValues);
      // 详情页编辑表单时保存成功后不需要关闭，所以注释掉

      if (!isApproval) {
        confirmClose(); // 非审批时需要清空数据
      }
    },
    confirmClose() {
      form.resetFields(); // 表单清空
      tiledFormDataRef.current = [];
      setAllComps([]);
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
    <div ref={dynamicForms}>
      <Affix
        offsetTop={0}
        target={() => container?.current}
      >
        <V2Tabs items={tabs} activeKey={tabActive} onChange={tabChange} />
      </Affix>
      <Main
        form={form}
        formData={formData}
        isEvaluation={false}
        // needCheck={true}
        supportDirectApproval={supportDirectApproval}
        setFormData={setFormData}
        active={tabActive}
        scrollAccordingTab={scrollAccordingTab}
        dynamicTabContentRefs={dynamicTabContentRefs}
        isLongList={isLongList}
        setHintStr={setHintStr}
        tiledFormDataRef={tiledFormDataRef}
        isFootprintValue={isFootprintValue}
      />
    </div>
  );
});

export default ChanceForm;
