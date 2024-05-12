/**
 * @Description 机会点form内容
 */

import { FC, useEffect, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import { ControlType, parseValueCatch, relevancyShow, setComValue,
  getCalculateComs,
  calculateHandle
} from '@/common/components/business/DynamicComponent/config';
import {
  addressChangeCommon,
  handleFootprintTextValue,
} from '@/common/components/business/DynamicComponent/customize';
import styles from './index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import DynamicComponent from '@/common/components/business/DynamicComponent';
import RecoupCostPeriod from '@/common/components/business/ExpandStore/ChancePointDetail/components/FormDrawer/RecoupCostPeriod';
import { AddressChangeParams } from '@/common/components/business/DynamicComponent/components/Address';

const Main: FC<any> = ({
  formData,
  active,
  scrollAccordingTab = false,
  isLongList = false,
  form,
  tiledFormDataRef,
  setFormData,
  setHintStr,
  // mainHeight,
  supportDirectApproval,
  dynamicTabContentRefs,
  isFootprintValue// 在编辑状态下，踩点组件是否已有数据（已有数据则设置表单不可读）
}) => {
  const selfRef: any = useRef();
  const returnPeriodRef: any = useRef();
  const [businessPlanValue, setBusinessPlanValue] = useState({});
  const [businessInfoValue, setBusinessInfoValue] = useState({});

  useEffect(() => {
    // 长列表时定位到具体group模块，不执行这块处理
    if (isLongList) return;

    if (!active) return;
    const targetDom = selfRef.current;
    if (!targetDom) return;
    targetDom.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [active]);

  const showHintStr = () => {
    const { hint } = formData;
    hint && setHintStr && setHintStr(hint);
  };
  const {
    onValuesChange,
    addressChange,
    updateRelateShow,
    updateCompValue,
    computationalLogic,
    getTabContentRefs,
  } = useMethods({
    /**
     * 字段值更新时触发回调事件
     * @param changedFields 当前更新的字段值，格式为{ name: value } // name为表单项的name值，value是当前的值
     */
    onValuesChange(changedFields: any) {
      const curChangedFields = Object.entries(changedFields);
      if (!(isArray(curChangedFields) && curChangedFields.length)) return;
      const targetIdentification = curChangedFields[0][0];
      const val = curChangedFields[0][1];

      handleFootprintTextValue(tiledFormDataRef, targetIdentification, val);

      // 不同二级菜单下可添加相同字段之后，需要把find改成filter
      // const targetCom = tiledFormDataRef.current.find((item: any) => item.identification === targetIdentification);
      // setComValue(targetCom, val);
      // updateRelateShow(targetCom);
      const targetComs = tiledFormDataRef.current.filter((item: any) => item.identification === targetIdentification);
      if (!(isArray(targetComs) && targetComs.length)) return;
      let isNumberInput = false; // 是否是数字输入框组件
      targetComs.forEach((targetCom: any, index: number) => {
        // 周边竞品组件通过组件回调事件更新
        if (targetCom.controlType === ControlType.CONTEND_INFO.value) {
          return;
        }
        setComValue(targetCom, val);
        const { controlType } = targetCom;
        // 相同的字段，其组件类型一定是相同的
        isNumberInput = controlType === ControlType.INPUT_NUMBER.value;
        if (index > 0) return;
        updateRelateShow(targetCom); // 只执行一次
      });

      // 只有数字输入框组件才能配置计算公式
      if (!isNumberInput) return;
      computationalLogic();
      // 回本周期定制化逻辑
      returnPeriodRef.current.valuesChange(targetIdentification, val);
    },
    // 计算公式的逻辑
    computationalLogic () {
      // 查找配置了计算公式的组件进行计算
      const calculateComs = getCalculateComs(tiledFormDataRef.current);
      // 所有的数字输入框组件
      const numberInputComs = tiledFormDataRef.current.filter((item: any) => item.controlType === ControlType.INPUT_NUMBER.value);
      calculateHandle(numberInputComs, calculateComs);
      // console.log(`tiledFormDataRef.current`, tiledFormDataRef.current, numberInputComs);
      // 计算的时候只设置了对应的textValue，还需要赋值到Form上
      numberInputComs.forEach((item: any) => {
        const { identification, textValue } = item;
        const value = textValue ? JSON.parse(textValue)?.value : ''; // 当前组件的值
        form.setFieldValue(identification, value);
      });
    },
    /**
     * @description 字段值变动时，刷新关联组件展示
     * @param targetCom 发生字段值变动的属性
     */
    updateRelateShow(targetCom) {
      if (!targetCom) return;
      // 配置了关联显示的字段时，如果重新渲染
      // const { templateRestriction } = targetCom;
      const targetConfig = parseValueCatch(targetCom, 'templateRestriction');
      if (!targetConfig) return;
      const { activeLinkageRelations } = targetConfig;
      if (isArray(activeLinkageRelations) && activeLinkageRelations.length) {
        relevancyShow(tiledFormDataRef.current);
        setFormData((state) => ({ ...state, ...formData }));
      }
    },
    /**
     * 详细地址组件的特殊逻辑
     * 通过高德的逆地址解析拿到高德的code，通过接口查找对应的省市区id，然后赋值到省市区组件上
     */
    async addressChange(params: AddressChangeParams) {
      addressChangeCommon(params, tiledFormDataRef, form, (compValue) => {
        // 将商圈规划数据传入组件
        setBusinessPlanValue(compValue);
      }, (compValue) => {
        // 将商圈信息数据传入组件
        setBusinessInfoValue(compValue);
      });

      // 目前只在手动变更地址时触发计算公式、编辑回显获取地址时不执行
      if (!params.isInitChange) {
        // 日均销售额预测参与了写死的计算公式[回本周期]的计算，动态赋值之后需要再触发一次计算公式计算
        computationalLogic();
        // 查找一次试算单店月均盈余值
        returnPeriodRef.current.valuesChange('', '');
      }
    },

    /**
     * @description 自定义组件（周边查询、商圈规划、周边竞品等）变动时，更新componentValue
     * @param params 通常为对象
     */
    updateCompValue(identification, params: any) {
      const targetCom = tiledFormDataRef.current.find((item: any) => item.identification === identification);
      setComValue(targetCom, params);
    },
    getTabContentRefs: (el: any, index: number, key: string) => {
      dynamicTabContentRefs.current[index] = {
        el,
        key
      };
    }
  });

  return (
    <>
      <div
        ref={selfRef}
        className={styles.mainCon}
        style={{
          // height: `${mainHeight}px` || 'auto'
        }}>
        <V2Form
          form={form}
          onValuesChange={onValuesChange}>
          {
            formData?.propertyGroupVOList ? <>
              {
                // 遍历一级菜单
                formData?.propertyGroupVOList.map((groupData: any, index) => (<div
                  key={index}
                  ref={(el) => getTabContentRefs(el, index, `${groupData.id}`)}
                >
                  {
                    (isLongList || groupData.id === +active) ? (<>
                      {/* 渲染动态表单用的组件 */}
                      <DynamicComponent
                        form={form}
                        wholeFormData={formData}
                        formData={groupData}
                        active={active}
                        scrollAccordingTab={scrollAccordingTab}
                        anchorCustomStyle={{
                          top: '220px',
                        }}
                        isEvaluation={false}
                        // needCheck={true}
                        isLongList={isLongList}
                        supportDirectApproval={supportDirectApproval}
                        addressChange={addressChange}
                        updateRelateShow={updateRelateShow}
                        showHintStr={showHintStr}
                        isFootprintValue={isFootprintValue}
                        businessPlanValue={businessPlanValue}
                        businessInfoValue={businessInfoValue}
                        updateCompValue={updateCompValue}
                      />
                    </>) : null
                  }
                </div>))
              }
            </>
              : null
          }
        </V2Form>

        {/* 回本周期 */}
        <RecoupCostPeriod
          ref={returnPeriodRef}
          form={form}
          tiledFormDataRef={tiledFormDataRef}
          updateCompValue={updateCompValue}/>
      </div>
    </>
  );
};

export default Main;
