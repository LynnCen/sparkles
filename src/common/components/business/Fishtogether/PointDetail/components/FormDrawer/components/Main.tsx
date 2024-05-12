/**
 * @Description 机会点form内容
 */

import { FC, useEffect, useRef } from 'react';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import { getLngLatAddress } from '@/common/utils/map';
import { parseValueCatch, relevancyShow, setComValue } from '@/common/components/business/DynamicComponent/config';
import { codeToPCD } from '@/common/api/common';
// import cs from 'classnames';
import styles from '../index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import DynamicComponent from '@/common/components/business/DynamicComponent';
import { AddressChangeParams } from '@/common/components/business/DynamicComponent/components/Address';

const Main: FC<any> = ({
  formData,
  active,
  pcdIdentification,
  form,
  tiledFormDataRef,
  setFormData,
  mainHeight,
}) => {
  const selfRef: any = useRef();

  useEffect(() => {
    if (!active) return;
    const targetDom = selfRef.current;
    if (!targetDom) return;
    targetDom.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [active]);
  const {
    onValuesChange,
    addressChange,
    updateRelateShow
  } = useMethods({
    /**
     * 字段值更新时触发回调事件
     * @param changedFields 当前更新的字段值，格式为{ name: value } // name为表单项的name值，value是当前的值
     */
    onValuesChange(changedFields: any) {
      // console.log(`变化的字段`, changedFields, tiledFormDataRef);
      const curChangedFields = Object.entries(changedFields);
      if (!(isArray(curChangedFields) && curChangedFields.length)) return;
      const targetIdentification = curChangedFields[0][0];
      const val = curChangedFields[0][1];
      // 不同二级菜单下可添加相同字段之后，需要把find改成filter
      // const targetCom = tiledFormDataRef.current.find((item: any) => item.identification === targetIdentification);
      const targetComs = tiledFormDataRef.current.filter((item: any) => item.identification === targetIdentification);
      if (!(isArray(targetComs) && targetComs.length)) return;
      targetComs.forEach((targetCom: any, index: number) => {
        setComValue(targetCom, val);
        if (index > 0) return;
        updateRelateShow(targetCom); // 只执行一次
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
      // console.log(`此时的formData`, formData);
    },
    /**
     * 详细地址组件的特殊逻辑
     * 通过高德的逆地址解析拿到高德的code，通过接口查找对应的省市区id，然后赋值到省市区组件上
     */
    async addressChange(params: AddressChangeParams) {
      // console.log(`params`, params);
      // 回显时的地址字段变更暂时不处理，与之前处理一致；后续有需要再修改
      if (params.isInitChange) return;

      const {
        lng,
        lat,
        cityName,
        name,
        poiId,
        identification
      } = params;
      const addressInfo: any = await getLngLatAddress([lng, lat], cityName, false).catch((err) => console.log(`查询具体地址信息：${err}`));
      if (!addressInfo) return;
      const { addressComponent, formattedAddress } = addressInfo;
      const textVal = {
        // 这里之所以用name，是因为用formattedAddress数据那边大多数时候查不到
        address: name || formattedAddress,
        longitude: lng,
        latitude: lat,
        poiId,
        poiName: name
      };
      const addressCom = tiledFormDataRef.current.find((item: any) => item.identification === identification);
      setComValue(addressCom, textVal); // 存储地址的的数据
      // 通过code查找对应的省市区id，然后赋值到省市区组件上
      const { adcode } = addressComponent || {};
      if (!adcode) return;
      const pcdInfo = await codeToPCD({
        districtCode: adcode,
        cityName
      });
      // 省市区组件
      const pcdCom = tiledFormDataRef.current.find((item: any) => item.identification === pcdIdentification);
      const { provinceId, cityId, districtId } = pcdInfo;
      setComValue(pcdCom, pcdInfo); // 存储省市区的数据
      // setFieldValue 不会触发onValuesChange
      form.setFieldValue(pcdIdentification, [provinceId, cityId, districtId]); // 组件显示值
    }
  });

  return (
    <>
      <div
        ref={selfRef}
        className={styles.mainCon}
        style={{
          height: `${mainHeight}px` || 'auto'
        }}>
        <V2Form
          form={form}
          onValuesChange={onValuesChange}>
          {
            formData?.propertyGroupVOList ? <>
              {
                // 遍历一级菜单
                formData?.propertyGroupVOList.map((groupData: any, index: number) => (<div key={index}>
                  {
                    groupData.id === +active ? (<>
                      {/* 渲染动态表单用的组件 */}
                      <DynamicComponent
                        form={form}
                        wholeFormData={formData}
                        formData={groupData}
                        addressChange={addressChange}
                        updateRelateShow={updateRelateShow}/>
                    </>) : null
                  }
                </div>))
              }
            </>
              : null
          }
        </V2Form>
      </div>
    </>
  );
};

export default Main;
