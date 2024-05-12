import { FC, useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { isArray, debounce, isNotEmptyAny } from '@lhb/func';
// import { Affix } from 'antd';
import { ChanceDetailModule } from '@/common/components/business/ExpandStore/ts-config';
import { useMethods } from '@lhb/hook';
import { /* ChangePonitDetailType, */ModuleDetailsType } from '../type';
import { isBottomOut } from '@/common/utils/ways';
import CoreInfomation from '../Modules/CoreInfomation';
import AreaScore from '../Modules/AreaScore';
import AsicsEstimateModule from '../Modules/AsicsEstimateModule';
import CheckSpotModule from '../Modules/CheckSpotModule';
import EarnEstimateModule from '../Modules/EarnEstimateModule';
import TabInfo from '../Modules/TabInfo';
import ChanceForm from '../Modules/ChanceForm/index';
import TaskBasic from '@/common/components/business/ExpandStore/TaskDeatil/components/TaskBasic';
import CircleBasicInfo from '@/common/components/business/ExpandStore/CircleBasicInfo';
import Overview from '../Modules/Overview';

// interface DeatilInfoProps {
//   detail: ChangePonitDetailType;
//   canEditForm?: boolean; // 是否可直接编辑机会点详情表单
//   onSearch?: Function;
//   updateHandle?: Function; // 刷新页面
// }

/** 模块组件映射关系 采用map映射方便后期维护 添加/删除 模块*/
const moduleComponentMap = {
  [ChanceDetailModule.Basic]: CoreInfomation,
  [ChanceDetailModule.Footprint]: CheckSpotModule,
  [ChanceDetailModule.Asics]: AsicsEstimateModule,
  [ChanceDetailModule.Benifit]: EarnEstimateModule,
  [ChanceDetailModule.Radar]: AreaScore,
  [ChanceDetailModule.Detail]: TabInfo,
  [ChanceDetailModule.Task]: TaskBasic,
  [ChanceDetailModule.Overview]: Overview,
};

/** 模块组合详情 */
const DeatilInfo: FC<any> = forwardRef(({
  detail,
  // mainHeight,
  canEditForm = false,
  isApproval = false,
  approvalId,
  onSearch,
  updateHandle,
  setHintStr,
  titleHeightRef,
  setHasEditableProperty,
}, ref) => {
  // 外部调用保存机会点
  useImperativeHandle(ref, () => ({
    saveChance: (needCheck: boolean, cb: Function) => {
      (chanceFormRef?.current as any).saveChance(needCheck, cb);
    },
  }));
  // title高度 + tabs高度
  const fixedHeight = (titleHeightRef?.current || 0) + 55.2; // 这里偷懒了，没有动态获取tabs的高度，所以不要随意进行tabs的自定义样式
  const chanceFormRef = useRef(null);
  const scrollContainerRef: any = useRef();
  const dynamicTabContentRefs: any = useRef([]);
  const dynamicTabActiveRef: any = useRef(''); // 同步动态表单组件tabActive
  const dynamicTabsRef: any = useRef([]); // 同步动态表单组件的tabs
  const { moduleDetails } = detail || {};
  const [dynamicTabsActive, setDynamicTabsActive] = useState<string>(''); // 动态表单详情组件tabs的active

  /** 是否需要展示周边查询组件 */
  // const { moduleDetails, permissions } = detail || {};
  // const hasSurroundPermission = permissions?.some((item: PermissionsType) => item.event === 'surroundReport:pcEntrance');

  /** 渲染模块组件 */
  const renderModuleComponent = (item: ModuleDetailsType) => {
    item.id = detail.id; // 配置一个机会点id字段给每个模块，为后续组件调用接口直接使用

    if (item.moduleType === ChanceDetailModule.Detail && canEditForm) {
      // 表单支持直接编辑时
      return <ChanceForm
        key={item.moduleType + item.moduleTypeName}
        ref={chanceFormRef}
        id={detail.id}
        chanceDetail={detail}
        isApproval={isApproval}
        approvalId={approvalId}
        onSearch={onSearch}
        update={updateHandle}
        setHintStr={setHintStr}
        // -----------tabs长列表-------------
        fixedHeight={fixedHeight}
        container={scrollContainerRef}
        dynamicTabActiveRef={dynamicTabActiveRef}
        dynamicTabsRef={dynamicTabsRef}
        dynamicTabContentRefs={dynamicTabContentRefs}
        dynamicTabsActive={dynamicTabsActive}
        setDynamicTabsActive={setDynamicTabsActive}
        // ------------------------
        setHasEditableProperty={setHasEditableProperty}
      />;
    } else if (item.moduleType === ChanceDetailModule.Task) {
      return isNotEmptyAny(item.standardDirectTaskModule) ? <CircleBasicInfo
        title='拓店任务信息'
        taskDetail={item.standardDirectTaskModule}
        className='mt-24'
      /> : <TaskBasic
        key={item.moduleType + item.moduleTypeName}
        title='拓店任务信息'
        detail={item.standardTaskModule}
        open={true}
      />;
    }

    const Component = moduleComponentMap[item.moduleType];
    if (Component) {
      return <Component
        key={item.moduleType + item.moduleTypeName}
        data={item}
        fixedHeight={fixedHeight}
        container={scrollContainerRef}
        dynamicTabActiveRef={dynamicTabActiveRef}
        dynamicTabsRef={dynamicTabsRef}
        dynamicTabContentRefs={dynamicTabContentRefs}
        dynamicTabsActive={dynamicTabsActive}
        setDynamicTabsActive={setDynamicTabsActive}
        detail={item.moduleType === ChanceDetailModule.Basic ? detail : null}
        setHintStr={setHintStr}/>;
    }
    return null;
  };

  // 过滤不展示的模块：不支持提交审批时，有配置就展示；支持审批时，模块可见时才展示
  // supportDirectApproval 是否支持直接提交审批 1:支持 2:不支持
  const moduleDetailsArray = isArray(moduleDetails) ? moduleDetails.filter((module: any) => detail.supportDirectApproval === 2 || module.isShow === 1) : [];

  useEffect(() => {
    if (!moduleDetailsArray?.length) return;
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.addEventListener('scroll', handleScroll);
    return () => scrollContainerRef.current && (scrollContainerRef.current.removeEventListener('scroll', handleScroll));
  }, [moduleDetailsArray]);

  const {
    handleScroll,
  } = useMethods({
    handleScroll: debounce(() => {
      // 所有content此时距离顶部的距离，需要减去吸顶部分的高度（标题 + tabs高度）
      const offsets = dynamicTabContentRefs.current.map((refItem) => refItem?.el?.getBoundingClientRect()?.top - fixedHeight);
      // 当前tab内容所处的索引
      const activeIndex = offsets.findIndex((offset, index) => {
        const nextOffset = offsets[index + 1] || 0;
        return offset <= 0 && nextOffset > 0;
      });
      // // 当前点击tab时，查看当前点击的tab距离顶部的距离
      const targetIndex = dynamicTabContentRefs.current.findIndex((item) => item.key === dynamicTabActiveRef.current);
      const targetOffset = targetIndex !== -1 ? offsets[targetIndex] : 0;
      if (activeIndex !== -1 && dynamicTabsRef.current?.[activeIndex]) {
        // 滚动条已经滚动到底，但是可视区域顶部还在其他tab内容区域下（最后的几个tab可能内容很少，出现在一屏）
        if (isBottomOut(scrollContainerRef.current) && targetOffset > 0) {
          setDynamicTabsActive(dynamicTabActiveRef.current);
          return;
        };
        const target = dynamicTabContentRefs.current[activeIndex];
        target && target.key && setDynamicTabsActive(target.key);
      }
    }, 50),
  });

  return moduleDetailsArray.length ? (
    <div
      ref={scrollContainerRef}
      className='pb-24'
      // style={{
      //   height: mainHeight || 'auto',
      //   overflowY: 'scroll',
      //   overflowX: 'hidden',
      //   // marginTop: '16px',
      // }}
    >
      {/* 模块组件 */}
      {moduleDetailsArray.map((item: ModuleDetailsType) => renderModuleComponent(item))}

    </div>
  ) : null;
});

export default DeatilInfo;
