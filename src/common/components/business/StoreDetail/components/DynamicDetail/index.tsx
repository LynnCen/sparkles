import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Row, Col, Affix } from 'antd'; // Button List
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
// import V2Anchor from '@/common/components/Others/V2Anchor';
import LocationMap from '../LocationMap';
import FootprintDetail from './components/FootprintDetail';
import BusinessPlanningDetail from './components/BusinessPlanningDetail';
import BusinessInfoDetail from './components/BusinessInfoDetail';
import DailyFlowDetail from './components/DailyFlowDetail';
import { getPropertyItemMap, ControlType, decodeTextValue, checkNumberInputIsRed, checkRadioIsRed, checkboxCheckIsRed } from './config';
import { otherId, parseValueCatch } from '@/common/components/business/DynamicComponent/config';
import { isArray, isNotEmpty } from '@lhb/func';
import styles from './index.module.less';
import cs from 'classnames';
import CustomizedOfAttachment from './components/CustomizedOfAttachment';
// import Surround from './components/Surround';
import ContendInfoDetail from './components/ContendInfoDetail';
import RefConversionDetail from './components/RefConversionDetail';

// const { Link } = Anchor;

// const targetConfigType = [
//   ControlType.SINGLE_RADIO.value,
//   ControlType.CHECK_BOX.value,
//   ControlType.INPUT_NUMBER.value
// ];

// 附加tab
export interface AdditionalTabProps {
  name: string; // tab标题
  children: ReactNode; // tab下自定义组件
}

interface IProps {
  title: string;
  data: any;
  detailInfoConfig?: any; // 属性项
  anchorCustomStyle?: any; // 锚点样式
  isStandard?: boolean;// 是否为标准版本
  additionTabs?: AdditionalTabProps []; // 额外的tabs，显示在动态tabs后面
  isApproval?: boolean; // 是否是审批工作台加载的
  ignoreAttach?: boolean; // 是否忽略附件资料Tab，不需要附件资料Tab时设置true
  notUseTemplate?: boolean; // 是否不使用模板，而只是按动态类型格式返回数据。这种情况下item中一般只确保字段controlType,name,textValue有值
  isTopSticky?: boolean; // tabbar是否置顶
  setHintStr?: Function; // 是否显示页面提示语
  topRef?: any;
  container?: any;
  dynamicTabContentRefs?: any;
  dynamicTabActiveRef?: any; // 点击tab时实时获取active项
  dynamicTabsRef?: any; // 同步动态表单tabs的ref
  dynamicTabsActive?: string; // 同步动态表单tabActive的state
  setDynamicTabsActive?:any; // 同步动态表单tabActive的setState
  fixedHeight?: number;
}

// 动态表单详情
const DynamicDetail: FC<IProps> = ({
  data,
  title,
  isStandard = false,
  detailInfoConfig = { span: 12 },
  // anchorCustomStyle = {},
  additionTabs = [],
  isApproval = false,
  ignoreAttach = false,
  notUseTemplate = false,
  isTopSticky = true,
  setHintStr,
  container,
  dynamicTabContentRefs,
  dynamicTabActiveRef,
  dynamicTabsRef,
  dynamicTabsActive,
  setDynamicTabsActive,
  fixedHeight,
}) => {
  const dynamicDetail:any = useRef(null);
  // const dynamicTabContentRefs: any = useRef([]);
  const [tabActive, setTabActive] = useState<string>(''); // 当前tab值
  const propertyGroupVOList =
  data?.templateDetailResponse?.propertyGroupVOList ||
  data?.infoModule?.propertyGroupVOList; // 标准版本机会点详情获取数据结构
  // console.log('🚀 ~ file: index.tsx:24 ~ propertyGroupVOList:', propertyGroupVOList);
  //   字段列表，增加是否显示字段
  const fieldList = useMemo(() => getPropertyItemMap(propertyGroupVOList), [propertyGroupVOList]);

  // 不同类型字段
  const FieldItem = ({ item }) => {
    const textValue = decodeTextValue(item?.controlType, item?.textValue);
    const name = item.anotherName || item.name;
    // 详情页目前用不到restriction
    const { templateRestriction } = item;
    let templateRestrictionVal: any = {};
    if (templateRestriction) {
      templateRestrictionVal = parseValueCatch(item, 'templateRestriction');
    }
    const { redMark } = templateRestrictionVal;
    const hintStr = data?.infoModule?.hint; // 页面提示语
    // 是否是换行显示
    const { nextLine } = templateRestrictionVal;
    const { controlType } = item;
    let colorVal = '';
    switch (controlType) {
      // 文件类
      case ControlType.UPLOAD.value:
        // 判断是否全是图片
        const PICTURE_REG = /(\.gif|\.jpeg|\.png|\.jpg|\.bmp|\.svg)$/; // 验证文件是图片格式的正则
        const isAllImage = textValue?.every((file) => PICTURE_REG.test(file.name));
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col {...detailInfoConfig}>
            {isAllImage ? (
              <V2DetailItem label={name} type='images' assets={textValue.filter((item) => !!item.url)}/>
            ) : (
              <V2DetailItem label={name} type='files' assets={textValue.filter((item) => !!item.url)}/>
            )}
          </Col>
        </>);
      // 地图类
      case ControlType.ADDRESS.value:
        return (<>
          <Col span={24}></Col>
          <Col span={24}>
            <V2DetailItem label={name} value={textValue?.address} />
          </Col>
          <Col span={24}>
            <V2DetailItem>
              <LocationMap lng={textValue?.lng} lat={textValue?.lat} />
            </V2DetailItem>
          </Col>
        </>
        );
      // 省市区
      case ControlType.AREA.value:
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col {...detailInfoConfig}>
            <V2DetailItem label={name} value={textValue?.length ? textValue?.map((item) => item.name || '-').join('') : ''}/>
          </Col>
        </>);
      // 数字，带后缀
      case ControlType.INPUT_NUMBER.value:
        colorVal = checkNumberInputIsRed(templateRestrictionVal, textValue?.value) ? '#f23030' : '';
        colorVal && redMark?.isPageTip && setHintStr && hintStr && setHintStr(hintStr);
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col {...detailInfoConfig}>
            <V2DetailItem
              labelStyle={{
                color: colorVal
              }}
              valueStyle={{
                color: colorVal
              }}
              label={name}
              verticalMiddleHelp={<>
                {
                  colorVal && redMark?.isItemTip && redMark?.itemTip ? <div className='c-f23 fs-12'>{redMark?.itemTip}</div> : null
                }
              </>}
              value={`${isNotEmpty(textValue?.value) ? textValue?.value : '-'} ${textValue?.suffix || ''}`}/>
          </Col>
        </>);
      // 单选
      case ControlType.SINGLE_RADIO.value:
        const targetOption = checkRadioIsRed(templateRestrictionVal, textValue?.id);
        // 注意这里有坑，decodeTextValue中把selectedId转成了id
        colorVal = targetOption ? '#f23030' : '';
        colorVal && targetOption?.isPageTip && setHintStr && hintStr && setHintStr(hintStr);
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col {...detailInfoConfig}>
            <V2DetailItem
              labelStyle={{
                color: colorVal
              }}
              valueStyle={{
                color: colorVal
              }}
              verticalMiddleHelp={<>
                {
                  colorVal && targetOption?.isItemTip && targetOption?.itemTip ? <div className='c-f23 fs-12'>{targetOption?.itemTip}</div> : null
                }
              </>}
              label={name}
              value={
                textValue?.id === otherId
                  ? `${textValue.name}(${textValue?.input})`
                  : textValue?.name
              }/>
          </Col>
        </>);
      // 多选
      case ControlType.CHECK_BOX.value:
        const targetOptions: any[] = checkboxCheckIsRed(templateRestrictionVal, textValue);
        const targetStr = targetOptions?.reduce((acc, cur, curIndex) => {
          const { isRedMark, isItemTip, itemTip } = cur;
          if (isRedMark && isItemTip && itemTip) return `${acc}${itemTip || ''}${curIndex < (targetOptions.length - 1) ? '、' : ''}`;
          return '';
        }, '');
        // 注意这里有坑，decodeTextValue中把textValue中的selectedId转成了id
        colorVal = isArray(targetOptions) && targetOptions.length > 0 ? '#f23030' : '';
        const targetIsPageTip = targetOptions?.find((item) => item.isPageTip);
        colorVal && !!targetIsPageTip && setHintStr && hintStr && setHintStr(hintStr);
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col {...detailInfoConfig}>
            <V2DetailItem
              labelStyle={{
                color: colorVal
              }}
              valueStyle={{
                color: colorVal
              }}
              verticalMiddleHelp={<>
                {
                  targetStr ? <div className='c-f23 fs-12'>{targetStr}</div> : null
                }
              </>}
              label={name}
              value={textValue?.map((value) => value?.id === otherId
                ? `${value.name}(${value?.input})`
                : value?.name).join('、')}/>
          </Col>
        </>);
      case ControlType.TEXT_AREA.value:
        // 多行文本类
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col {...detailInfoConfig}>
            <V2DetailItem label={name} value={textValue} type='textarea' />
          </Col>
        </>);
      case ControlType.SURROUND_SEARCH.value:
        const value = JSON.parse(textValue);
        if (value === null) {
          return <></>;
        }
        // 周边查询
        return (<>
          <Col span={24}></Col>
          <Col span={24}>
            <V2DetailItem label={name} value={value?.address} />
          </Col>
          <Col span={24}>
            <V2DetailItem>
              <LocationMap lng={value?.lng} lat={value?.lat} />
            </V2DetailItem>
          </Col>
          {isArray(value?.surround) && value?.surround?.length &&
          value?.surround?.map((item, idx) => (
            <Col key={idx} span={12}>
              <V2DetailItem label={item?.categoryName} value={item?.text} />
            </Col>
          ))}
          <Col span={24}></Col>
        </>
        );
      case ControlType.FOOTPRINT.value:// 踩点设置
        const fpValue = JSON.parse(textValue);
        if (fpValue === null) {
          return <></>;
        }
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <FootprintDetail info={fpValue} />
        </>);
      case ControlType.CONTEND_INFO.value:// 店铺周边竞品
        const contendInfo = JSON.parse(textValue);
        if (contendInfo === null) {
          return <></>;
        }
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col span={24}>
            <ContendInfoDetail value={contendInfo} />
          </Col>
        </>);
      case ControlType.BUSINESS_PLANNING.value: // 商圈规划
        const bpValue = JSON.parse(textValue);
        if (bpValue === null) {
          return <></>;
        }
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col span={24}>
            <BusinessPlanningDetail info={bpValue} />
          </Col>
        </>);
      // 销售额预测
      case ControlType.SALE_AMOUNT.value:
        const saleValue = JSON.parse(textValue);
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col span={12}>
            <V2DetailItem label={name} value={saleValue?.saleAmount} />
          </Col>
        </>);
      case ControlType.MATCH_BUSINESS_CIRCLE.value: // 商圈信息
      {
        const bpValue = JSON.parse(textValue);
        if (bpValue === null) {
          return <></>;
        }
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col span={24}>
            <BusinessInfoDetail info={bpValue} />
          </Col>
        </>);
      }
      case ControlType.DAILY_FLOW_PREDICT.value:
      {
        const info = JSON.parse(textValue);
        // 日均客流预测
        return (
          <DailyFlowDetail info={info} />
        );
      }
      // 参考转化率、参考租金等查看文件的类型
      case ControlType.REFERENCE_CONVERSION.value:
      case ControlType.REFERENCE_RENT.value:
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col {...detailInfoConfig}>
            <RefConversionDetail label={name} propertyItem={item}/>
          </Col>
        </>);
      default:
        // 文本类
        return (<>
          {
            nextLine ? <Col span={24}></Col> : null
          }
          <Col {...detailInfoConfig}>
            <V2DetailItem label={name} value={textValue} />
          </Col>
        </>);
    }
  };

  const tabChange = (active: string) => {
    setTabActive(active);
    setDynamicTabsActive && setDynamicTabsActive(active);
    dynamicTabActiveRef && (dynamicTabActiveRef.current = active);
    if (dynamicTabContentRefs) {
      const targetEle = dynamicTabContentRefs.current?.find((refItem) => refItem.key === active);
      const topVal = (targetEle?.el?.offsetTop || 0) + (dynamicDetail.current?.offsetTop || 0);
      container?.current?.scrollTo({
        top: (topVal - ((fixedHeight || 0) - 3)),
        behavior: 'instant'
      });
    }
  };

  const getTabContentRefs = (el: any, index: number, key: string) => {
    if (!dynamicTabContentRefs?.current) return;
    dynamicTabContentRefs.current[index] = {
      el,
      key
    };
  };

  /**
   * @description 是否展示该第一级tab
   * @param fieldList 所有属性的值对象，不分等级，平铺到对象
   * @param firstLevel 以及数据
   * @return 是否展示
   */
  const isShowFirstLevel = (fieldList, firstLevel) => {
    return Array.isArray(firstLevel?.childList) &&
    firstLevel?.childList.length > 0 &&
    firstLevel?.childList.some(secondLevel => isShowSecondLevel(fieldList, secondLevel));
  };

  /**
   * @description 是否展示该第二级组
   * @param fieldList 所有属性的值对象，不分等级，平铺到对象
   * @param secondLevel 二级数据
   * @return 是否展示
   */
  const isShowSecondLevel = (fieldList, secondLevel) => {
    return Array.isArray(secondLevel?.propertyConfigVOList) &&
    secondLevel?.propertyConfigVOList.length > 0 &&
    (notUseTemplate || secondLevel.propertyConfigVOList.some(field => !!fieldList[field.propertyId].isShow));
  };

  const tabs = useMemo(() => {
    const items: any = [];

    if (Array.isArray(propertyGroupVOList)) {
      propertyGroupVOList.filter((tab) => isShowFirstLevel(fieldList, tab)).forEach((tab, index) => {
        // 渲染一个动态tab
        // const anchorItems = Array.isArray(tab.childList) ? tab.childList.map((item: any) => ({
        //   id: `title${item.id}`,
        //   title: item.name,
        // })) : [];

        const children = Array.isArray(tab.childList)
          ? (<div /* className='dynamicComCon'*/>
            {
              tab.childList.map((item, itemIndex) => {
                return (
                  <div key={item.name + itemIndex}>
                    {isShowSecondLevel(fieldList, item) && <V2Title
                      // id={anchorItems[itemIndex].id}
                      type='H2'
                      divider
                      text={item.name}
                      // tab数为1且是tab下第一个组时 不需要margin-top
                      className={(propertyGroupVOList.length > 1 || itemIndex) && 'mt-24'}/>}
                    {/* 字段遍历 */}
                    <Row gutter={24}>
                      {Array.isArray(item.propertyConfigVOList) && item.propertyConfigVOList.map((field, fieldIndex) => {
                        if (notUseTemplate) {
                          return <FieldItem item={field} key={field.name + fieldIndex} />;
                        } else {
                          return fieldList[field.propertyId].isShow && (
                            <FieldItem item={field} key={field.name + fieldIndex} />
                          );
                        }
                      })}
                    </Row>
                  </div>
                );
              })
            }
            {/* <V2Anchor
              getContainer={() => {
                const target:any = dynamicDetail.current || document.body;
                return target;
              }}
              className={
                cs(styles.anchorCon,
                  anchorItems.length > 1 ? '' : 'hide',
                  isNotEmptyAny(anchorCustomStyle) ? '' : styles.defaultPostion)}
              style={
                isNotEmptyAny(anchorCustomStyle) ? anchorCustomStyle : {}
              }
            >
              { anchorItems.map(item => <Link
                key={item.id}
                href={`#${item.id}`}
                title={item.title}
              />) }
            </V2Anchor> */}
          </div>) : <></>;

        items.push({
          label: tab.name,
          key: tab.name + index,
          child: children
        });
      });
    }

    if (Array.isArray(additionTabs)) {
      // 渲染一个额外tab
      additionTabs.forEach((tab, index) => {
        items.push({
          label: tab.name,
          key: tab.name + index,
          child: tab.children
        });
      });
    }
    // 0707版本 https://confluence.lanhanba.com/pages/viewpage.action?pageId=67533495 十一： 快速生成三张截图 ，需要添加一个写死的Tab
    // 0727 标准版本拓店不需要渲染【附件资料】tab项
    !ignoreAttach && items.push({
      label: '附件资料',
      key: 'customizedOfAttachment',
      child: <CustomizedOfAttachment
        detail={data}
        isApproval={isApproval}
        isStandard={isStandard}
      />
    });
    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyGroupVOList]);

  /**
   * @description tabs变动时，设置默认选中tab
   */
  useEffect(() => {
    dynamicTabsRef && (dynamicTabsRef.current = tabs);
    if (Array.isArray(additionTabs) && additionTabs.length) {
      // 有附加tab，定位到最后一个tab
      // setTabActive(tabs[tabs.length - 1].key);
      // 0707 末尾新增了一个写死的Tab，故这里需要减2
      const active = ignoreAttach ? tabs.length - 1 : tabs.length - 2;
      setTabActive(tabs[active].key);
      return;
    }
    if (Array.isArray(tabs) && tabs.length) {
      // 有tab，定位到第一个tab
      setTabActive(tabs[0].key);
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);
  // 父容器滚动到对应位置时设置tabs选中项
  useEffect(() => {
    if (!dynamicTabsActive) return;
    setTabActive(dynamicTabsActive);
  }, [dynamicTabsActive]);

  return (
    <div
      ref={dynamicDetail}
      className={
        cs(styles.dynamicDetail,
          isTopSticky && styles.topSticky,
          // 只有一个tab的时候隐藏tab项 //TODO: 顶部遮挡
          propertyGroupVOList && propertyGroupVOList.length === 1 && styles.hideTab)
      }>
      {title && (
        <div className={styles.topCon}>
          <div className={styles.topTitle}>{title}</div>
        </div>
      )}

      {Array.isArray(tabs) && !!tabs.length ? <>
        <Affix
          offsetTop={0}
          target={() => container?.current}
        >
          <V2Tabs
            items={tabs}
            activeKey={tabActive}
            onChange={tabChange}
          />
        </Affix>
        {/* Tab content 内容 */}
        {
          tabs.map((tabItem: any, index: number) => <div
            ref={(el) => getTabContentRefs(el, index, tabItem.key)}
            key={index}
          >
            {tabItem.child}
          </div>)
        }
      </> : <></>
      }
    </div>
  );
};

export default DynamicDetail;
