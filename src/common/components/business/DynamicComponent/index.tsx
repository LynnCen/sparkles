/**
 * @Description 动态表单组件
 * 区分不同的组件类型
 * supportDirectApproval的说明 该字段是通用审批流中，用来控制字段的可读/可写
 */

import { FC, useMemo, Fragment } from 'react';
import { Row } from 'antd';
import { isArray } from '@lhb/func';
import V2Title from '@/common/components/Feedback/V2Title';
// import V2Anchor from '@/common/components/Others/V2Anchor';
import PropertyComponent from './PropertyComponent';
import cs from 'classnames';
import styles from './index.module.less';
import { isShowWhenApprovalProcess } from './hooks/useAccessIsShow';

// const { Link } = Anchor;

const DynamicComponent: FC<any> = ({
  formData,
  wholeFormData,
  // anchorCustomStyle = {},
  // tabContentRefs,
  // active = '', // 目前处理在isLongList为true时才有用到
  // scrollAccordingTab = false, // 长列表tab点击时自动滚动，目前处理在isLongList为true时且初始化完成后手动点击时才为true
  // 以下参数单纯都是给PropertyCompoennt使用的
  form,
  isChancepoint = true,
  isEvaluation = false, // 是否点位评估表单，是的话字段参照拓店模板设置，而不是流程配置
  // needCheck = true, // 表单是否检查必填项，true检查，false只检查特定identification必填字段
  isLongList = false, // 是否长表单形式展示
  addressChange,
  updateCompValue,
  updateRelateShow,
  supportDirectApproval, // 是否支持直接提交审批 1:支持 2:不支持，默认值是2
  isFootprintValue = false, // 在编辑状态下，踩点组件是否已有数据（已有数据则设置表单不可读）
  businessPlanValue = {},
  showHintStr
}) => {
  const { childList } = formData;

  /**
   * @description 是否是长列表展示时的第一group
   *    长列表时只有第一group下需要展示group的锚点
   * @return
   */
  const firstGroupOfLongList = useMemo(() => {
    return (isLongList && formData && isArray(wholeFormData.propertyGroupVOList) && wholeFormData.propertyGroupVOList.length && wholeFormData.propertyGroupVOList[0].id === formData.id);
  }, [wholeFormData, formData]);

  const anchorItems = useMemo(() => {
    if (firstGroupOfLongList) {
      // 长列表展示第一个tab时，将完整formData各tab下childList进行合并
      const items: any[] = [];
      wholeFormData.propertyGroupVOList.forEach((grp: any) => {
        isArray(grp.childList) && grp.childList.forEach((child: any) => {
          items.push({
            id: `title${child.id}`,
            title: child.name,
          });
        });
      });
      return items;
    }
    // 非长列表展示、或者长列表的第2个及以后group时，取tab下childList
    return childList.map((child: any) => ({
      id: `title${child.id}`,
      title: child.name,
    }));
  }, [childList]);

  // useEffect(() => {
  //   if (isLongList && scrollAccordingTab && active && +active === formData.id) {
  //     // 长表单tab切换时，自动滚动到tab对应内容
  //     // const element = document.getElementById(`group${formData.id}`);
  //     const targetEle = tabContentRefs.current.find((refItem) => refItem?.id === +active);
  //     targetEle?.el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //     // console.log('滚到到element', element);
  //   }
  // }, [isLongList, active]);

  return (
    <div className={cs('dynamicComCon', styles.dynamicComponent)}>
      {
        isArray(childList) ? (<>
          {
            childList.map((childItem: any, index: number) => (isArray(childItem?.propertyConfigVOList) && childItem?.propertyConfigVOList.some(property => property.isShow && isShowWhenApprovalProcess({
              supportDirectApproval,
              propertyItem: property,
              isEvaluation,
              isChancepoint
            })) ? <Fragment key={index}>
                <V2Title
                  id={anchorItems[index].id}
                  type='H2'
                  divider
                  text={childItem.name}
                  className='pt-16 pb-16'
                />
                <Row gutter={24}>
                  {
                    isArray(childItem?.propertyConfigVOList)
                      ? childItem.propertyConfigVOList.map((item: any, idx: number) => <Fragment key={idx}>
                        <PropertyComponent
                          item={item}
                          form={form}
                          isChancepoint={isChancepoint}
                          isEvaluation={isEvaluation}
                          addressChange={addressChange}
                          updateCompValue={updateCompValue}
                          updateRelateShow={updateRelateShow}
                          supportDirectApproval={supportDirectApproval}
                          isFootprintValue={isFootprintValue}
                          businessPlanValue={businessPlanValue}
                          showHintStr={showHintStr}
                        />
                      </Fragment>) : null
                  }
                </Row>

              </Fragment> : null))
          }
        </>) : null
      }

      {/* <V2Anchor
        getContainer={() => {
          // 长列表时关联包含了各tabs的dom，单tab内容时对应只包含该tab的dom
          const selectors: string = isLongList ? '.dynamicComponent' : '.dynamicComponent .dynamicComCon';
          const target: HTMLElement = document.querySelector(selectors) || document.body;
          // const target: HTMLElement = document.querySelector('.ant-drawer-content-wrapper .ant-drawer-body .dynamicComCon') || document.body;
          return target;
        }}
        className={cs(styles.anchorCon, anchorItems.length > 1 && (!isLongList || firstGroupOfLongList) ? '' : 'hide', isNotEmptyAny(anchorCustomStyle) ? '' : styles.defaultPostion)}
        style={isNotEmptyAny(anchorCustomStyle) ? anchorCustomStyle : {}}
      >
        { anchorItems.map(item => <Link key={item.id} href={`#${item.id}`} title={item.title} />) }
      </V2Anchor> */}
    </div>
  );
};

export default DynamicComponent;
