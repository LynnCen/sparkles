/**
 * @Description 创建/编辑加盟商时的表单
 * 逻辑说明：
 * 1. 利用antd的Form组件的onValuesChange监听输入的变化
 * 2. 从接口获取到的组件数据，通过递归将所有组件平铺到一个对象数组中
 * 3. 根据每个表单项绑定的name（即identification），在平铺的组件对象中查找对应的组件，然后进行textValue的赋值
 */

import { FC, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Form } from 'antd';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import {
  formDataComsToTiled,
  formDataEcho,
  parseValueCatch,
  relevancyShow,
} from '@/common/components/business/DynamicComponent/config';
import {
  pcdIdentification,
  addressIdentification,
} from '@/common/components/business/DynamicComponent/customize';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Main from './Main';
import { franchiseeTemplateDetail, saveFranchisee, getFranchiseeDetail } from '@/common/api/expandStore/franchisee';
import styles from './index.module.less';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const FranchiseeForm: FC<any> = forwardRef(({
  drawerData,
  mainHeight,
  setLoading,
  setSubmitting,
  onSuccess,
  wrapperStyle = {},
  contentStyle = {},
}, ref) => {
  // 外部调用保存
  useImperativeHandle(ref, () => ({
    confirmHandle: () => {
      confirmHandle();
    },
    confirmClose: () => {
      confirmClose();
    },
  }));

  const tiledFormDataRef = useRef<any[]>([]); // 所有组件字段平铺后的对象数组
  const lockRef = useRef(false);
  const [form] = Form.useForm();
  const { open, templateId, id } = drawerData;
  const [formData, setFormData] = useState<any>({}); // 接口返回的动态表单源数据
  const [tabActive, setTabActive] = useState<string>(''); // 当前tab值
  const [allComps, setAllComps] = useState<any[]>([]);
  const [scrollAccordingTab, setScrollAccordingTab] = useState<boolean>(false); // 是否按照tab点击滚动页面，第一次点击tab后才为true，避免初始化内容后就滚动

  useEffect(() => {
    if (!open) return;
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
  }, [id, templateId]);

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
    confirmClose,
  } = useMethods({
    getTempleteDetail() {
      // 获取模板详情
      setLoading(true);
      franchiseeTemplateDetail({ id: templateId }).then((data: any) => {
        const { propertyGroupVOList } = data;

        // 设置tabs默认值
        if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
          setTabActive(`${propertyGroupVOList[0].id}`);
          formDataComsToTiled(propertyGroupVOList, tiledFormDataRef.current); // 将组件对象平铺到数组中
          setAllComps(tiledFormDataRef.current);
          relevancyShow(tiledFormDataRef.current); // 关联显示
        }
        setFormData(data);
      }).finally(() => {
        setLoading(false);
      });
    },
    getDetail() {
      setLoading(true);
      getFranchiseeDetail({ id }).then((data: any) => {
        // dynamicRelationId需要特殊赋值
        const { propertyGroupVOList } = data;
        // 设置tabs默认值
        if (isArray(propertyGroupVOList) && propertyGroupVOList.length) {
          setTabActive(`${propertyGroupVOList[0].id}`);
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
          });

          form.setFieldsValue(values);
        }
        setFormData(data);
      }).finally(() => {
        setLoading(false);
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
    tabChange(active: string) {
      setScrollAccordingTab(true);
      setTabActive(active);
    },
    /**
     * 表单提交，
     * 长表单时(isLongList为true)能检查所有字段；
     * 除此以外时只能校验当前表单页的必填项，因为渲染的时候只渲染对应的tab下的表单项
     */
    confirmHandle() {
      // 全部字段检查时传undefined即无入参
      form.validateFields().then(async () => {
        if (lockRef.current) return;
        lockRef.current = true;
        setSubmitting(true);

        const params = this.dealParams();
        saveFranchisee(params).then((data) => {
          V2Message.success('保存成功');
          form.resetFields(); // 清空表单
          onSuccess && onSuccess(data);
        }).finally(() => {
          lockRef.current = false;
          setSubmitting(false);
        });
      }).catch((errorInfo: any) => {
        console.log(`errorInfo1`, errorInfo);
        if (isArray(errorInfo?.errorFields) && errorInfo?.errorFields.length && isArray(errorInfo?.errorFields[0].errors) && errorInfo?.errorFields[0].errors.length) {
          V2Message.warning(errorInfo?.errorFields[0].errors[0]);
        }
      });
    },
    confirmClose() {
      form.resetFields(); // 表单清空
      tiledFormDataRef.current = [];
      setAllComps([]);
    },
    // 处理保存参数
    dealParams() {
      const propertyValues = tiledFormDataRef.current.map((item: any) => ({
        id: item.id,
        propertyId: item.propertyId,
        identification: item.identification,
        textValue: item.textValue,
      }));
      const params: any = {
        dynamicRelationId: formData.dynamicRelationId,
        propertyValues,
      };
      if (id) {
        params.id = id;
      }
      return params;
    }
  });

  return (
    <div className={styles.franchiseeForm} style={{
      ...wrapperStyle
    }}>
      {isArray(tabs) && !tabs.length ? <V2Tabs items={tabs} activeKey={tabActive} onChange={tabChange} /> : <></>}
      <Main
        form={form}
        formData={formData}
        setFormData={setFormData}
        active={tabActive}
        scrollAccordingTab={scrollAccordingTab}
        isLongList={isLongList}
        tiledFormDataRef={tiledFormDataRef}
        // 上层传入的动态高度再减去tabbar高度
        mainHeight={mainHeight ? Math.max(mainHeight - 56, 0) : mainHeight}
        style={{
          ...contentStyle
        }}
      />
    </div>
  );
});

export default FranchiseeForm;
