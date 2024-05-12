/**
 * @Description 商圈规划组件
 *  控件 提交、回显的参数格式
 {
      isInCluster: true,
      clusterId: 1,
      planClusterId: 2, // 跳转商圈用这个
      clusterName: '钱江新城商圈',
      clusterTypeName: '一级商圈',
      clusterScore: '95分',
      planSpots: [
        { id: 1, name: '点1' },
        { id: 2, name: '点2' },
        { id: 3, name: '点3' },
      ],
      planSpotId: 2, // 用户选择
      planSpotName: '集客点2', // 用户选择
      planStores: 5,
      openStores: 3,
      distance: 3333,
      manualTypeIds: [1,102], // 1123期手动选择的商圈类型ids
      manualTypeName: 商业/餐饮, // 1123期手动选择的商圈类型名，提交时额外填充到clusterTypeName
      lat: 30,
      lng: 120,
  }
 */
import { FC, useEffect, useMemo, useState } from 'react';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { Row, Col, Form } from 'antd';
import { isArray, isDef, beautifyThePrice, isNotEmptyAny, refactorSelection } from '@lhb/func';
import { parseValueCatch } from '../config';
import IconFont from '@/common/components/IconFont';
import { getTreeSelection } from '@/common/api/networkplan';
import { getSpotRelationDetail } from '@/common/api/expandStore/chancepoint';
import V2Title from '@/common/components/Feedback/V2Title';
import V2FormUpload from '@/common/components/Form/V2FormUpload/V2FormUpload';
import React from 'react';
import { tenantCheck } from '@/common/api/common';
import LocationMap from '../../StoreDetail/components/LocationMap';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';

/**
 * @Description 商圈规划组件
 */
const BusinessPlanning: FC<any> = ({
  form,
  formItemData,
  businessPlanValue, // 地址变动时外部传入的商圈数据
  businessPlanChange,
  disabled,
}) => {
  // console.log('BusinessPlanning render', form, businessPlanValue);
  const identification = formItemData.identification; // 字段
  const planSpotId = Form.useWatch(`${identification}-planSpotId`, form);

  const [curCompValue, setCurCompValue] = useState<any>(null);
  const [manualTypeOptions, setManualTypeOptions] = useState<any[]>([]); // 手动选择用商圈选项
  const [isYiHeTang, setIsYiHeTang] = useState<boolean>(false); /** 是否为益禾堂租户 */
  const [aLocation, setALocation] = useState<any>({}); // A类坐标点位置

  useEffect(() => {
    // 商圈类型选项
    getTreeSelection({
      type: 3, // 1城市，2商圈，3 三级商圈类型
      module: 1 // module 1 网规相关，2行业商圈 （通用版）
    }).then((data: any) => {
      if (isArray(data) && data.length) {
        setManualTypeOptions(refactorSelection(data, { children: 'child' }));
      }
    });
    tenantCheck().then(({ isYiHeTang }) => {
      setIsYiHeTang(!!isYiHeTang);
    });
  }, []);

  /**
   * @description 初次渲染formItem信息
   */
  useEffect(() => {
    // console.log('useEffect formItemData.textValue', formItemData.textValue);

    const curVal = parseValueCatch(formItemData);

    form.setFieldsValue({
      [`${identification}-clusterName`]: curVal?.clusterName,
      [`${identification}-clusterTypeName`]: curVal?.clusterTypeName,
      [`${identification}-clusterScore`]: curVal?.clusterScore,
      [`${identification}-planSpotId`]: curVal?.planSpotId,
      [`${identification}-planStores`]: curVal?.planStores,
      [`${identification}-openStores`]: curVal?.openStores,
      [`${identification}-distance`]: showDistance(curVal),
      [`${identification}-manualTypeIds`]: curVal?.manualTypeIds,
      [`${identification}-manualTypeName`]: curVal?.manualTypeName,
    });
    setCurCompValue(curVal);
    // console.log('useEffect formItemData.textValue=====', curVal);

    // 获取集客点详情
    if (curVal?.clusterId && curVal?.planSpotId) {
      getSpotRelation(curVal?.clusterId, curVal.planSpotId);
    }

  }, [formItemData.textValue]);

  /**
   * @description 地址变动时重新设置组件内容
   */
  useEffect(() => {
    // 初次渲染时，传入的空信息，会把编辑用详情更新掉，不予处理
    if (!isNotEmptyAny(businessPlanValue)) return;

    // console.log('useEffect businessPlanValue', businessPlanValue);

    form.setFieldsValue({
      [`${identification}-clusterName`]: businessPlanValue?.clusterName,
      [`${identification}-clusterTypeName`]: businessPlanValue?.clusterTypeName,
      [`${identification}-clusterScore`]: businessPlanValue?.clusterScore,
      [`${identification}-planSpotId`]: businessPlanValue?.planSpotId,
      [`${identification}-planStores`]: businessPlanValue?.planStores,
      [`${identification}-openStores`]: businessPlanValue?.openStores,
      [`${identification}-distance`]: showDistance(businessPlanValue),
      [`${identification}-manualTypeIds`]: businessPlanValue?.manualTypeIds,
      [`${identification}-manualTypeName`]: businessPlanValue?.manualTypeName,
    });
    setCurCompValue(businessPlanValue);
    // console.log('useEffect businessPlanValue=====', businessPlanValue);
  }, [businessPlanValue]);

  // 展示最近商圈距离机会点
  const showDistance = (curCompValue) => {
    if (!curCompValue || !isDef(curCompValue.distance)) return '-';

    const dist = curCompValue.distance;
    return dist > 100 ? beautifyThePrice(dist / 1000.0, ',', 1) + 'km' : `${dist}m`;
  };

  /**
   * @description 集客点选择是否可点击
   *   这些情况下禁用：
   *   该定制组件配置为禁用、处在分享页(app端才有这种情况)、所选位置返回的集客点选项为空
   */
  const isPlanSpotsDisable = useMemo(() => {
    return disabled || !curCompValue || !Array.isArray(curCompValue.planSpots) || !curCompValue.planSpots.length;
  }, [disabled, curCompValue]);

  /**
   * @description 集客点选择变动
   * @param val 选项id
   * @param opt 选项
   * @return
   */
  const onPlanStoreChange = (val: any, opt: any) => {
    const newVal = {
      ...curCompValue,
      planSpotId: opt ? opt.value : null,
      planSpotName: opt ? opt.label : null,
    };
    businessPlanChange && businessPlanChange(identification, newVal);
    opt?.value && getSpotRelation(curCompValue?.clusterId, opt.value);
  };

  /**
   * @description 手动选择商圈类型是否可点击
   *   这些情况下禁用：
   *   该定制组件配置为禁用、处在分享页(app端才有这种情况)、接口返回的商圈类型选项为空
   */
  const isManualTypeDisable = useMemo(() => {
    return disabled || !Array.isArray(manualTypeOptions) || !manualTypeOptions.length;
  }, [disabled, manualTypeOptions]);

  /**
   * @description 手动选择商圈类型变动
   * @param val1
   * @param val2
   * @return
   */
  const handleManualType = (ids: any, values: any) => {
    // console.log('handleManualType', ids, values);
    if (!isArray(ids) || !ids.length || !isArray(values) || !values.length) return;

    const hasSelected = isArray(ids) && ids.length && isArray(values) && values.length;

    const manualTypeIds = hasSelected ? ids : [];
    const manualTypeName = hasSelected ? values.map((itm: any) => itm.label).join('/') : null;
    const newVal = {
      ...curCompValue,
      manualTypeIds,
      manualTypeName,
      clusterTypeName: manualTypeName,
    };
    businessPlanChange && businessPlanChange(identification, newVal);
  };
  /** 获取集客点信息 */
  const getSpotRelation = (clusterId:string|number, planSpotId:string|number) => {
    getSpotRelationDetail({ planClusterId: clusterId }).then(({ planSpots }) => {
      const curValues = planSpots.find((itm) => itm.id === planSpotId);
      planSpots.length && form.setFieldsValue({
        [`${identification}-name`]: curValues?.name,
        [`${identification}-editDescription`]: curValues?.editDescription,
        [`${identification}-pointName`]: curValues?.pointName,
        [`${identification}-estimatedDailyAmount`]: curValues?.estimatedDailyAmount,
        [`${identification}-rent`]: curValues?.rent,
        [`${identification}-assignmentFee`]: curValues?.assignmentFee,
        [`${identification}-videoUrls`]: curValues?.videoUrls,
        [`${identification}-competitors`]: curValues?.competitors,
        [`${identification}-landlords`]: curValues?.landlords,
      });
      setALocation({
        lng: curValues.lng,
        lat: curValues.lat,
      });
    });
  };

  const renderNoAddress = () => {
    return (
      <Row gutter={24}>
        <Col span={12}>
          <V2FormInput
            label='所属商圈'
            placeholder='选择详细地址后自动获取'
            disabled
          />
        </Col>
      </Row>
    );
  };

  const renderNoData = () => {
    return (
      <Row gutter={24}>
        <Col span={12}>
          <V2FormInput
            label='所属商圈'
            placeholder='该机会点不在规划商圈中'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormCascader
            label='商圈类型'
            name={`${identification}-manualTypeIds`}
            placeholder={isManualTypeDisable ? '暂无商圈类型' : '请选择商圈类型'}
            disabled={isManualTypeDisable}
            required={!isManualTypeDisable}
            options={!isManualTypeDisable ? manualTypeOptions : []}
            onChange={handleManualType}
          />
        </Col>
      </Row>
    );
  };

  const renderSpotRelation = () => {
    // 益禾堂租户显示
    if (isYiHeTang) {
      return <>
        <Col span={24}>
          <V2Title
            type='H2'
            divider
            text={'集客点信息'}
            className={'mb-12'}/>
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-name`}
            label='集客点名称'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormTextArea
            name={`${identification}-editDescription`}
            label='动线始末'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormTextArea
            name={`${identification}-pointName`}
            label='集客A类点'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-estimatedDailyAmount`}
            label='预估日均金额'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-rent`}
            label='租金单价行情'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-assignmentFee`}
            label='转让费行情'
            disabled
          />
        </Col>
        <Col span={24}>
          <Form.Item label='A类坐标点位置'>
            <LocationMap lng={aLocation?.lng} lat={aLocation?.lat} disabled/>
          </Form.Item>
        </Col>
        <Col span={24}>
          <V2FormUpload
            label='A类点视频讲解'
            name={`${identification}-videoUrls`}
            uploadType='files'
            config={{ disabled: true }}
            tipConfig={{ tooltipIconShow: false }}
          />
        </Col>
        <Form.List name={`${identification}-competitors`}>
          {fields =>
            fields.map(field => (
              <React.Fragment key={field.key}>
                <Col span={24}>
                  <V2Title
                    type='H2'
                    divider
                    text={'竞品分析'}
                    className={'mb-12'}/>
                </Col>
                <Col span={12}>
                  <V2FormInput
                    name={[field.name, 'competitorName']}
                    label='竞品名称'
                    disabled
                  />
                </Col>
                <Col span={12}>
                  <V2FormInput
                    name={[field.name, 'aveEstimatedSale']}
                    label='日均预估'
                    disabled
                  />
                </Col>
              </React.Fragment>
            ))
          }
        </Form.List>
        <Form.List name={`${identification}-landlords`}>
          {fields =>
            fields.map(field => (
              <React.Fragment key={field.key}>
                <Col span={24}>
                  <V2Title
                    type='H2'
                    divider
                    text={'店铺信息'}
                    className={'mb-12'}/>
                </Col>
                <Col span={12}>
                  <V2FormInput
                    name={[field.name, 'landlordShopName']}
                    label='店铺名称'
                    disabled
                  />
                </Col>
                <Col span={12}>
                  <V2FormInput
                    name={[field.name, 'landlordName']}
                    label='房东姓名'
                    disabled
                  />
                </Col>
                <Col span={12}>
                  <V2FormInput
                    name={[field.name, 'landlordMobile']}
                    label='房东电话'
                    disabled
                  />
                </Col>
                <Col span={12}/>
              </React.Fragment>
            ))
          }
        </Form.List>
      </>;
    }

    return <></>;
  };

  const renderInCluster = () => {
    const urlParams = {
      planClusterId: curCompValue?.planClusterId,
      lng: curCompValue?.lng,
      lat: curCompValue?.lat,
      originPath: 'chancepoint',
      isBranch: true,
      isActive: true,
    };
    return (
      <Row gutter={24}>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-clusterName`}
            label='所属商圈'
            disabled
            config={{
              addonAfter: <IconFont
                iconHref='iconic_next_black_seven'
                onClick={() => { window.open(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`); }}
              />
            }}

          />
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-clusterTypeName`}
            label='商圈类型'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-clusterScore`}
            label='商圈评分'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormSelect
            name={`${identification}-planSpotId`}
            label='所在集客点'
            disabled={isPlanSpotsDisable}
            required={!isPlanSpotsDisable}
            options={curCompValue && isArray(curCompValue.planSpots) ? curCompValue.planSpots.map(itm => ({ label: itm.name, value: itm.id })) : [] }
            placeholder={curCompValue && isArray(curCompValue.planSpots) && curCompValue.planSpots.length ? '请选择所在集客点' : '暂无集客点'}
            onChange={onPlanStoreChange}/>
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-planStores`}
            label='规划门店数量'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-openStores`}
            label='已开门店数量'
            disabled
          />
        </Col>
        {!!planSpotId && renderSpotRelation()}
      </Row>
    );
  };

  const renderNearbyCluster = () => {
    const urlParams = {
      planClusterId: curCompValue?.planClusterId,
      lng: curCompValue?.lng,
      lat: curCompValue?.lat,
      originPath: 'chancepoint',
      isBranch: true,
      isActive: true,
    };
    return (
      <Row gutter={24}>
        <Col span={12}>
          <V2FormInput
            label='所属商圈'
            placeholder='该机会点不在规划商圈中'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-clusterName`}
            label='10km最近商圈'
            disabled
            config={{
              addonAfter: <IconFont
                iconHref='iconic_next_black_seven'
                onClick={() => { window.open(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`); }}
              />
            }}
          />
        </Col>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-distance`}
            label='距离当前机会点'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormCascader
            label='商圈类型'
            name={`${identification}-manualTypeIds`}
            placeholder={isManualTypeDisable ? '暂无商圈类型' : '请选择商圈类型'}
            disabled={isManualTypeDisable}
            required={!isManualTypeDisable}
            options={!isManualTypeDisable ? manualTypeOptions : []}
            onChange={handleManualType}
          />
        </Col>
      </Row>
    );
  };

  if (!curCompValue) {
    // 还未选地址
    return renderNoAddress();
  } else if (!isDef(curCompValue.isInCluster)) {
    // 附近无商圈
    return renderNoData();
  } else if (curCompValue.isInCluster) {
    // 有所属商圈
    return renderInCluster();
  } else {
    // 附近有商圈
    return renderNearbyCluster();
  }
};

export default BusinessPlanning;
