/**
 * @Description 机会点详情-核心信息模块
 */

import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { FC } from 'react';
import { isArray, isNotEmpty } from '@lhb/func';

import { Col, Row } from 'antd';
import styles from '../index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { parseValueCatch } from '@/common/components/business/DynamicComponent/config';
import LocationMap from '@/common/components/business/StoreDetail/components/LocationMap';
import {
  ControlType,
  decodeTextValue,
} from '@/common/components/business/StoreDetail/components/DynamicDetail/config';
import V2Empty from '@/common/components/Data/V2Empty';
import { ModuleDetailsType } from '../type';
import { dispatchNavigate } from '@/common/document-event/dispatch';
// import Surround from '@/common/components/business/StoreDetail/components/Surround';


/** 核心信息组件传参类型 */
interface CoreInfomationProps {
  data: ModuleDetailsType;
  detail?
  detailInfoConfig?;
  [p: string]: any;
}

/** 核心信息组件 */
const CoreInfomation: FC<CoreInfomationProps> = ({ data, detailInfoConfig = { span: 12 } }) => {
  /** 不同类型字段*/
  const FieldItem = ({ item }) => {
    const textValue = decodeTextValue(item?.controlType, item?.textValue); // textValue值结构
    const name = item.anotherName || item.name; // 获取表单label
    const { templateRestriction } = item;
    let templateRestrictionVal: any = {};
    // 解析json格式的textValue
    if (templateRestriction) {
      templateRestrictionVal = parseValueCatch(item, 'templateRestriction');
    }
    // 是否是换行显示
    const { nextLine } = templateRestrictionVal;

    switch (item.controlType) {
      // 文件类
      case ControlType.UPLOAD.value:
        // 判断是否全是图片
        const PICTURE_REG = /(\.gif|\.jpeg|\.png|\.jpg|\.bmp|\.svg)$/; // 验证文件是图片格式的正则
        const isAllImage = textValue?.every(file => PICTURE_REG.test(file.name));
        return (
          <>
            {nextLine ? <Col span={24}></Col> : null}
            <Col {...detailInfoConfig}>
              {isAllImage ? (
                <V2DetailItem
                  label={name}
                  type='images'
                  assets={textValue.filter(item => !!item.url)}
                />
              ) : (
                <V2DetailItem
                  label={name}
                  type='files'
                  assets={textValue.filter(item => !!item.url)}
                />
              )}
            </Col>
          </>
        );
      // 地图类
      case ControlType.ADDRESS.value:
        return (
          <>
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
        return (
          <>
            {nextLine ? <Col span={24}></Col> : null}
            <Col {...detailInfoConfig}>
              <V2DetailItem
                label={name}
                value={textValue?.length ? textValue?.map(item => item.name || '-').join('') : ''}
              />
            </Col>
          </>
        );
      // 数字，带后缀
      case ControlType.INPUT_NUMBER.value:
        return (
          <>
            {nextLine ? <Col span={24}></Col> : null}
            <Col {...detailInfoConfig}>
              <V2DetailItem
                label={name}
                value={`${isNotEmpty(textValue?.value) ? textValue?.value : '-'} ${
                  textValue?.suffix || ''
                }`}
              />
            </Col>
          </>
        );
      // 单选
      case ControlType.SINGLE_RADIO.value:
        return (
          <>
            {nextLine ? <Col span={24}></Col> : null}
            <Col {...detailInfoConfig}>
              <V2DetailItem label={name} value={textValue?.name} />
            </Col>
          </>
        );
      // 多选
      case ControlType.CHECK_BOX.value:
        return (
          <>
            {nextLine ? <Col span={24}></Col> : null}
            <Col {...detailInfoConfig}>
              <V2DetailItem label={name} value={textValue?.map(value => value.name).join('、')} />
            </Col>
          </>
        );
      case ControlType.TEXT_AREA.value:
        // 多行文本类
        return (
          <>
            {nextLine ? <Col span={24}></Col> : null}
            <Col {...detailInfoConfig}>
              <V2DetailItem label={name} value={textValue} type='textarea' />
            </Col>
          </>
        );
      case ControlType.SURROUND_SEARCH.value:
        const value = JSON.parse(textValue);
        if (value === null) {
          return <></>;
        }
        // 周边查询
        return (
          <>
            <Col span={24}></Col>
            <Col span={24}>
              <V2DetailItem label={name} value={value?.address} />
            </Col>
            <Col span={24}>
              <V2DetailItem>
                <LocationMap lng={value?.lng} lat={value?.lat} />
              </V2DetailItem>
            </Col>
            {isArray(value?.surround) &&
              value?.surround?.length &&
              value?.surround?.map(item => (
                <Col span={12}>
                  <V2DetailItem label={item?.categoryName} value={item?.text} />
                </Col>
              ))}
            <Col span={24}></Col>
          </>
        );
      case ControlType.FOOTPRINT.value: // ui说不展示踩点
        return <></>;
      default:
        // 文本类
        return (
          <>
            {nextLine ? <Col span={24}></Col> : null}
            <Col {...detailInfoConfig}>
              <InputDetailItem item={item} />
              {/* <V2DetailItem label={name} value={textValue} /> */}
            </Col>
          </>
        );
    }
  };

  /** 链接跳转到拓店任务详情 */
  const clickLink = id => {
    id && dispatchNavigate(`/expandstore/expansiontask?id=${id}`);
  };

  /**
   * 文本类别特殊处理
   * */
  const InputDetailItem = ({ item }) => {
    const textValue = decodeTextValue(item?.controlType, item?.textValue); // textValue值结构
    const name = item.anotherName || item.name; // 获取表单label

    if (item.identification === 'basicChancePointRelationTask') {
      //   拓店任务链接类型
      const { id } = textValue && JSON.parse(textValue);
      console.log('textValue', textValue, id);
      return (
        <V2DetailItem
          label={name}
          value='点击查看拓店任务信息'
          type='link'
          onClick={() => clickLink(id)}
        />
      );
    } else {
      return <V2DetailItem label={name} value={textValue} />;
    }
  };

  return (
    <div>
      <TitleTips name={data.moduleTypeName} showTips={false} />
      {isArray(data.importModule) && data.importModule.length ? (
        <div className={styles.coreInfo}>
          <Row gutter={24}>
            {data.importModule?.map((field, fieldIndex) => (
              <FieldItem item={field} key={field.name + fieldIndex} />
            ))}
          </Row>
        </div>
      ) : (
        <V2Empty />
      )}

      {/* 产品要求拿掉 */}
      {/* 周边信息 */}
      {/* {detail && <Surround detail={detail} className='mt-16' /> } */}
    </div>
  );
};

export default CoreInfomation;
