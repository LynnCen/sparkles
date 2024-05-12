/**
 * @Description 商圈规划组件
 *  控件 提交、回显的参数格式
 *
 * zdj TODO 按实际数据更新注释内容
 {
      isInCluster: true,
      clusterId: 1,
      clusterName: '钱江新城商圈',
      clusterTypeName: '一级商圈',
      clusterScore: '95分',
      distance: 3333,
      openStores: 0,
      planStores: 1,
      lat: 30,
      lng: 120,
  }
 */
import { FC, useEffect, useState } from 'react';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { Row, Col } from 'antd';
import { isNotEmptyAny } from '@lhb/func';
import { parseValueCatch } from '../config';
import IconFont from '@/common/components/IconFont';
import AreaDetailDrawer from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer';

/**
 * @Description 商圈信息组件
 */
const BusinessInfo: FC<any> = ({
  form,
  formItemData,
  businessInfoValue, // 地址变动时外部传入的商圈数据
}) => {
  // console.log('BusinessInfo render', form, businessInfoValue);
  const identification = formItemData.identification; // 字段

  const [curCompValue, setCurCompValue] = useState<any>(null); // 自定义组件的值
  const [drawerData, setDrawerData] = useState<any>({ // 选址地图详情抽屉
    open: false,
    id: ''
  });

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
    });
    setCurCompValue(curVal);
    // console.log('useEffect formItemData.textValue=====', curVal);

  }, [formItemData.textValue]);

  /**
   * @description 地址变动时重新设置组件内容
   */
  useEffect(() => {
    // 初次渲染时，传入的空信息，会把编辑用详情更新掉，不予处理
    if (!isNotEmptyAny(businessInfoValue)) return;

    // console.log('useEffect businessInfoValue', businessInfoValue);

    form.setFieldsValue({
      [`${identification}-clusterName`]: businessInfoValue?.clusterName,
      [`${identification}-clusterTypeName`]: businessInfoValue?.clusterTypeName,
      [`${identification}-clusterScore`]: businessInfoValue?.clusterScore,
    });
    setCurCompValue(businessInfoValue);
    // console.log('useEffect businessInfoValue=====', businessInfoValue);
  }, [businessInfoValue]);

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
            placeholder='该机会点不在商圈内'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormInput
            label='商圈类型'
            placeholder='-'
            disabled
          />
        </Col>
        <Col span={12}>
          <V2FormInput
            label='商圈评分'
            placeholder='-'
            disabled
          />
        </Col>
      </Row>
    );
  };

  const renderInCluster = () => {
    return (
      <Row gutter={24}>
        <Col span={12}>
          <V2FormInput
            name={`${identification}-clusterName`}
            label='所属商圈'
            disabled
            config={{
              // zdj TODO 确认交互
              addonAfter: <IconFont
                iconHref='iconic_next_black_seven'
                onClick={() => { // 展示商圈详情
                  setDrawerData({
                    open: true,
                    id: curCompValue.clusterId
                  });
                }}
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
        <AreaDetailDrawer
          drawerData={drawerData}
          setDrawerData={setDrawerData}
          viewChanceDetail={false}
        />
      </Row>
    );
  };

  if (!curCompValue) {
    // 还未选地址
    return renderNoAddress();
  } else if (!curCompValue.isInCluster) {
    // 无商圈
    return renderNoData();
  } else {
    // 有所属商圈
    return renderInCluster();
  }
};

export default BusinessInfo;
