/**
 * @Description 机会点PDF-详细信息
 */

import { FC, useMemo } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { getPropertyItemMap } from '@/common/components/business/StoreDetail/components/DynamicDetail/config';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Property from './Property';
import { ChancePdfPageClass } from '../../ts-config';
import { ControlType } from '@/common/components/business/DynamicComponent/config';
import { PageLayout } from '../../../areareport/components/Layout';

const Detail: FC<any> = ({
  homeData,
  module,
}) => {
  const propertyGroupVOList = useMemo(() => {
    if (!isNotEmptyAny(module)) return [];

    return isArray(module?.infoModule?.propertyGroupVOList) ? module.infoModule.propertyGroupVOList : [];
  }, [module]);

  /**
   * @description 是否展示该第一级tab
   * @param fieldList 所有属性的值对象，不分等级，平铺到对象
   * @param firstLevel 以及数据
   * @return 是否展示
   */
  const isShowFirstLevel = (fieldList, firstLevel) => {
    const show = Array.isArray(firstLevel?.childList) &&
    firstLevel?.childList.length > 0 &&
    firstLevel?.childList.some(secondLevel => isShowSecondLevel(fieldList, secondLevel));
    // console.log('isShowFirstLevel', firstLevel.name, show);
    return show;
  };

  /**
   * @description 是否展示该第二级组
   * @param fieldList 所有属性的值对象，不分等级，平铺到对象
   * @param secondLevel 二级数据
   * @return 是否展示，至少有一个字段满足展示
   */
  const isShowSecondLevel = (fieldList, secondLevel) => {
    const show = Array.isArray(secondLevel?.propertyConfigVOList) &&
    secondLevel?.propertyConfigVOList.length > 0 &&
    secondLevel.propertyConfigVOList.some(field => isShowPropertyItem(fieldList, field));
    // console.log('isShowSecondLevel', secondLevel.name, show, secondLevel?.propertyConfigVOList);
    return show;
  };

  /**
   * @description 是否展示该属性
   * @param fieldList 所有属性的值对象，不分等级，平铺到对象
   * @param field 属性数据
   * @return 是否展示，满足（isShow为true）并且（textValue有值或是必填项目，如果是竞品信息类型还要确保 竞品对象内至少一个字段有值）
   */
  const isShowPropertyItem = (fieldList, field) => {
    const show = !!fieldList[field.propertyId].isShow && ((isNotEmptyAny(field.textValue) && !isEmptyContendTypeValue(field)) || !!field.required);
    // console.log('isShowPropertyItem', field.name, show);
    return show;
  };

  /**
   * @description 是否是竞品类型，但是没有任何一个字段有值
   * @param field
   * @return 是否是空的竞品类型数据
   */
  const isEmptyContendTypeValue = (field) => {
    if (field.controlType !== ControlType.CONTEND_INFO.value) return false;

    const info = JSON.parse(field.textValue);
    const isEmptyContend = !isArray(info) || !info.length || !info.some(contend => Object.values(contend).some(field => !!field));
    // console.log('isEmptyContendTypeValue', isEmpty);
    return isEmptyContend;
  };

  /**
   * @description pdf展示的tabs，将过滤其下无展示字段的tab、和二级标题
   * @return
   */
  const tabs = useMemo(() => {
    const items: any = [];
    if (Array.isArray(propertyGroupVOList)) {
      const fieldList = getPropertyItemMap(propertyGroupVOList);
      // console.log('fieldList', fieldList);

      propertyGroupVOList.filter((tab) => isShowFirstLevel(fieldList, tab)).forEach((tab, index) => {
        const children = Array.isArray(tab.childList)
          ? (<div>
            {
              tab.childList.map((secondLevel, itemIndex) => {
                return (
                  <div key={secondLevel.name + itemIndex}>
                    {isShowSecondLevel(fieldList, secondLevel) && <V2Title
                      type='H2'
                      divider
                      text={secondLevel.name}
                      // tab数为1且是tab下第一个组时 不需要margin-top
                      className={cs((propertyGroupVOList.length > 1 || itemIndex) && 'mt-24', 'mb-16')}/>}
                    {/* 字段遍历 */}
                    {Array.isArray(secondLevel.propertyConfigVOList) && secondLevel.propertyConfigVOList.map((field, fieldIndex) => {
                      return fieldList[field.propertyId].isShow && (
                        <Property item={field} key={field.name + fieldIndex} />
                      );
                    })}
                  </div>
                );
              })
            }
          </div>) : <></>;

        items.push({
          label: tab.name,
          key: tab.name + index,
          child: children
        });
      });
    }
    return items;
  }, [propertyGroupVOList]);

  return (
    <>
      {
        // 每个tab作为pdf的一页
        // tabs.map((tabItem: any, index: number) => <div key={index} className={cs(ChancePdfPageClass, styles.pdfPage)}>
        //   <V2Tabs
        //     items={tabs}
        //     activeKey={tabItem.key}
        //   />
        //   {tabItem.child}
        // </div>)
        tabs.map((tabItem: any, index: number) => <PageLayout
          key={index}
          title='详细信息'
          logo={homeData?.standardChancePointReportLogo}
          childClass={cs(ChancePdfPageClass, styles.pdfPage)}
        >
          <V2Tabs
            items={tabs}
            activeKey={tabItem.key}
          />
          {tabItem.child}
        </PageLayout>)
      }
    </>
  );
};

export default Detail;
