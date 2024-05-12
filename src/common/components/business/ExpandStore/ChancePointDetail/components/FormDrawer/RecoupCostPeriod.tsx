/**
 * @Description 回本周期
 * https://confluence.lanhanba.com/pages/viewpage.action?pageId=104595546
 * 后期迭代中，转让费已经不参与计算了
 * https://confluence.lanhanba.com/pages/viewpage.action?pageId=109325922
 */
import {
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo,
  useEffect,
  useRef
} from 'react';
import { AreaValLevel, areaMapVal } from '@/common/components/business/DynamicComponent/config';
import { isNotEmpty } from '@lhb/func';
import { fixNumber } from '@/common/utils/ways';
import { parseValueCatch } from '@/common/components/business/DynamicComponent/config';
// import cs from 'classnames';
// import styles from './entry.module.less';

const RecoupCostPeriod: any = forwardRef<any, any>(({
  tiledFormDataRef,
  form,
  updateCompValue
}, ref) => {
  const calculability: any = useRef(false); // 编辑时不会触发valuesChange，所以不需要触发form.setFieldValue
  const targetReturnperiod = 'returnperiod'; // 回本周期标识符
  const targetMonthlyaverageprofitperstore = 'monthlyaverageprofitperstore'; // 试算单店月均盈余值
  const [saleableAreaVal, setSaleableAreaVal] = useState<string | number>(''); // 实用面积
  // const [finCalcTransferFeeVal, setFinCalcTransferFeeVal] = useState<string | number>(''); // 转让费
  const [monthlyaverageprofitperstoreVal, setMonthlyaverageprofitperstoreVal] = useState<string | number>(''); // 试算单店月均盈余值
  // 根据输入的实用面积，获取对应的值
  const saleableAreaTargetVal = useMemo(() => {
    const targetVal = +saleableAreaVal;
    let level = '';
    if (targetVal >= 15 && targetVal < 20) {
      level = AreaValLevel.Level1;
    } else if (targetVal >= 20 && targetVal < 30) {
      level = AreaValLevel.Level2;
    } else if (targetVal >= 30 && targetVal < 40) {
      level = AreaValLevel.Level3;
    } else if (targetVal >= 40 && targetVal < 60) {
      level = AreaValLevel.Level4;
    } else if (targetVal >= 60) {
      level = AreaValLevel.Level5;
    }
    const target: any = level ? areaMapVal[level] : {
      renovationCosts: 0,
      equipmentCosts: 0,
      selfBuyingCosts: 0,
      franchiseFee: 80000,
    };
    if (target) {
      const { renovationCosts, equipmentCosts, selfBuyingCosts, franchiseFee } = target;
      return renovationCosts + equipmentCosts + selfBuyingCosts + franchiseFee;
    }
    return 0;
  }, [saleableAreaVal]);

  // 获取回本周期计算出来的值
  // const recoupCostPeriodVal = useMemo(() => {
  //   if (isNotEmpty(saleableAreaTargetVal) || isNotEmpty(finCalcTransferFeeVal) || isNotEmpty(monthlyaverageprofitperstoreVal)) {
  //     const total = ((+saleableAreaTargetVal) + (+finCalcTransferFeeVal)) / (+monthlyaverageprofitperstoreVal || 1);
  //     return fixNumber(total, 1);
  //   }
  //   return '';
  // }, [saleableAreaTargetVal, finCalcTransferFeeVal, monthlyaverageprofitperstoreVal]);
  const recoupCostPeriodVal = useMemo(() => {
    if (isNotEmpty(saleableAreaTargetVal) || isNotEmpty(monthlyaverageprofitperstoreVal)) {
      const total = (+saleableAreaTargetVal) / (+monthlyaverageprofitperstoreVal || 1);
      return fixNumber(total);
    }
    return '';
  }, [saleableAreaTargetVal, monthlyaverageprofitperstoreVal]);

  useEffect(() => {
    if (!calculability.current) return; // 编辑状态初始化时不执行后面的逻辑
    updateCompValue(targetReturnperiod, recoupCostPeriodVal);
    form.setFieldValue(targetReturnperiod, recoupCostPeriodVal);
  }, [recoupCostPeriodVal]);

  // 将load方法暴露给父组件，可在父组件中使用该方法
  useImperativeHandle(ref, () => ({
    valuesChange: valuesChange
  }));

  useEffect(() => {
    return () => {
      calculability.current = false;
    };
  }, []);

  // 字段值变化时触发
  const valuesChange = (identification: string, val: any) => {
    calculability.current = true;
    if (identification === 'saleableArea') { // 实用面积
      setSaleableAreaVal(val);
    }
    // else if (identification === 'finCalcTransferFee') { // 转让费
    //   setFinCalcTransferFeeVal(val);
    // }

    // 查找试算单店月均盈余值的值
    const target = tiledFormDataRef.current?.find((item: any) => item.identification === targetMonthlyaverageprofitperstore);
    if (!target) return;
    const { textValue } = target;
    if (!isNotEmpty(textValue)) return;
    const { value } = parseValueCatch(target);
    setMonthlyaverageprofitperstoreVal(value);
    // 编辑状态时，实用面积和转让费如果没有触发，会导致saleableAreaVal和finCalcTransferFeeVal未赋值，导致相关计算中的取值为0
    if (!saleableAreaVal) { // 没有值的时候说明是编辑（不用考虑清空输入的情况，因为重复执行这里面也没关系）
      const targetSaleableArea = tiledFormDataRef.current?.find((item: any) => item.identification === 'saleableArea');
      if (isNotEmpty(targetSaleableArea?.textValue)) {
        const { value: saleableAreaValue } = parseValueCatch(targetSaleableArea);
        setSaleableAreaVal(saleableAreaValue);
      }
    }
    // 转让费的处理，同实用面积一样的道理
    // if (!finCalcTransferFeeVal) {
    //   const targetFinCalcTransferFee = tiledFormDataRef.current?.find((item: any) => item.identification === 'finCalcTransferFee');
    //   if (isNotEmpty(targetFinCalcTransferFee?.textValue)) {
    //     const { value: finCalcTransferFeeValue } = parseValueCatch(targetFinCalcTransferFee);
    //     setFinCalcTransferFeeVal(finCalcTransferFeeValue);
    //   }
    // }
  };

  return (
    <></>
  );
});

export default RecoupCostPeriod;
