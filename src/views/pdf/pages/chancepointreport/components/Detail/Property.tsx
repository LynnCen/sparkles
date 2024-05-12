/**
 * @Description 机会点PDF-详细信息中一个property
 */

import { FC, useMemo } from 'react';
import { isArray, isNotEmpty, isNotEmptyAny } from '@lhb/func';
import { decodeTextValue } from '@/common/components/business/StoreDetail/components/DynamicDetail/config';
import { ControlType, otherId } from '@/common/components/business/DynamicComponent/config';
import styles from './index.module.less';
import cs from 'classnames';
import {
  RowData,
  assembleFileData,
  assembleImageData,
  assembleTextData,
  assembleTextDataNoCheck,
  businessInfo,
  contendInfo,
  dailyFlowInfo,
  referenceFileInfo
} from './config';
import { footprintInfos } from './footprint';
import { businessPlanningInfos } from './businessPlanning';
import { useAccessIsRequired } from '@/common/components/business/DynamicComponent/hooks/useAccessIsRequired';


const Property: FC<any> = ({
  item, // 属性
}) => {
  /**
   * @description 是否必填
   */
  const required = useAccessIsRequired({
    propertyItem: item,
    isChancepoint: true,
  });

  /**
   * @description 不同类型字段的渲染
   * @param item
   * @return 返回null 则不渲染
   *         返回RowData 则渲染一行
   *         返回RowData[] 则渲染多行
   */
  const assemblePropertyData = (item) : RowData | RowData[] | null => {
    const textValue = decodeTextValue(item?.controlType, item?.textValue);
    const name = item.anotherName || item.name;

    // 是否是换行显示
    const { controlType } = item;
    switch (controlType) {
      // 单选
      case ControlType.SINGLE_RADIO.value:
        return assembleTextData(name, textValue?.id === otherId
          ? `${textValue.name}(${textValue?.input})`
          : textValue?.name, required);
      // 多选
      case ControlType.CHECK_BOX.value:
        return assembleTextData(name, textValue?.map((value) => value?.id === otherId
          ? `${value.name}(${value?.input})`
          : value?.name).join('、'), required);
      case ControlType.INPUT.value: // 单行文本
      case ControlType.TEXT_AREA.value: // 多行文本类
        return assembleTextData(name, textValue, required);
      // 文件类
      case ControlType.UPLOAD.value:
      {
        // 判断是否全是图片
        const PICTURE_REG = /(\.gif|\.jpeg|\.png|\.jpg|\.bmp|\.svg)$/; // 验证文件是图片格式的正则
        const isAllImage = textValue?.every((file) => PICTURE_REG.test(file?.name?.toLowerCase()));
        return isAllImage ? assembleImageData(name, textValue.filter((item) => !!item.url), required) : assembleFileData(name, textValue.filter((item) => !!item.url), required);
      }
      // 数字，带后缀
      case ControlType.INPUT_NUMBER.value:
      {
        let showText = isNotEmpty(textValue?.value) ? textValue?.value : '';
        if (showText && textValue?.suffix) { // 有值时才把后缀带出
          showText = `${showText} ${textValue?.suffix}`;
        }
        return assembleTextData(name, showText, required);
      }
      case ControlType.TIME.value:
        return assembleTextData(name, textValue, required);
      // 地图类
      case ControlType.ADDRESS.value:
        return assembleTextData(name, textValue?.address, required);
      // 省市区
      case ControlType.AREA.value:
        return assembleTextData(name, textValue?.length ? textValue?.map((item) => item.name || '-').join('') : '', required);
      // 周边查询
      case ControlType.SURROUND_SEARCH.value:
      {
        const value = JSON.parse(textValue);
        if (value === null && !required) {
          return null;
        }
        const infos: any[] = [];
        if (value?.address || required) {
          infos.push(assembleTextDataNoCheck(name, value?.address));
        }
        isArray(value?.surround) && value?.surround?.length &&
          value?.surround?.map((item) => {
            infos.push(assembleTextDataNoCheck(item?.categoryName, item?.text));
          });
        return infos;
      }
      // 踩点设置
      case ControlType.FOOTPRINT.value:
      {
        const fpValue = JSON.parse(textValue);
        return footprintInfos(name, fpValue, required);
      }
      // 店铺周边竞品
      case ControlType.CONTEND_INFO.value:
      {
        const info = JSON.parse(textValue);
        if (info === null) {
          return null;
        }
        return contendInfo(name, info);
      }
      // 商圈规划
      case ControlType.BUSINESS_PLANNING.value:
      {
        const bpValue = JSON.parse(textValue);
        if (bpValue === null) {
          return null;
        }
        return businessPlanningInfos(name, bpValue, required);
      }
      // 销售额预测
      case ControlType.SALE_AMOUNT.value:
      {
        const saleValue = JSON.parse(textValue);
        return assembleTextData(name, saleValue?.saleAmount, required);
      }
      case ControlType.MATCH_BUSINESS_CIRCLE.value:
      // 商圈信息
      {
        const bpValue = JSON.parse(textValue);
        return businessInfo(name, bpValue, required);
      }
      // 日均客流预测
      case ControlType.DAILY_FLOW_PREDICT.value:
      {
        const info = JSON.parse(textValue);
        return dailyFlowInfo(name, info, required);
      }
      // 参考转化率、参考租金等查看文件的类型
      case ControlType.REFERENCE_CONVERSION.value:
      case ControlType.REFERENCE_RENT.value:
        return referenceFileInfo(name, item, required);
      default:
        // 文本类
        return assembleTextData(name, textValue, required);
    }
  };

  const rowsData = useMemo(() => {
    if (!isNotEmptyAny(item)) return [];
    const data = assemblePropertyData(item);
    return isArray(data) ? data : data ? [data] : null;
  }, [item]);

  return isArray(rowsData) && rowsData.length ? (<>
    {rowsData.map((row: RowData, index: number) => (
      <div key={index} className={styles.property}>
        <div className={cs(styles.propertyTitle, 'fs-14 c-222 pd-12')}>
          {row.title}
        </div>
        <div className={cs(styles.propertyValue, 'fs-14 c-666 pd-12')}>
          {
            row.type === 'text' ? <span className={styles.textCon}>{row.text}</span> : null
          }
          {
            row.type === 'image' && isArray(row.images) && row.images.length ? row.images.map((itm, idx) => (<div key={idx} className={cs(idx && 'mt-8', styles.imgBox)}>
              <img src={itm.url} />
            </div>)) : null
          }
          {
            row.type === 'file' && isArray(row.files) && row.files.length ? row.files.map((itm, idx) => (<div key={idx} className={idx ? 'mt-6' : ''}>
              <a href={itm.url}>{itm.name}</a>
            </div>)) : null
          }
        </div>
      </div>
    ))}
  </>) : <></>;
};

export default Property;
