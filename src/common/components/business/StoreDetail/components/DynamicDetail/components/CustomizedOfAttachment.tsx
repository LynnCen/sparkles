/**
 * @Description 资料附件
 * 动态表单详情的Tab
 */
import { FC, useEffect, useState } from 'react';
import { Row, Col } from 'antd'; // Button List
import { getImportRecords } from '@/common/api/fishtogether';
import { downloadFile } from '@lhb/func';
import { generateImage } from '@/common/api/imageserve';
import cs from 'classnames';
// import styles from './entry.module.less';
import IconFont from '@/common/components/IconFont';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { isArray } from '@lhb/func';
import { importChancePointRecords } from '@/common/api/expandStore/chancepoint';

const CustomizedOfAttachment: FC<any> = ({
  detail, // 详情
  isStandard, // 是否为标准版本
  isApproval, // 是否是审批详情页加载的该组件
}) => {
  const [rimShopImgs, setRimShopImgs] = useState<any[]>([]);
  const [cityInfoImgs, setCityInfoImgs] = useState<any[]>([]);
  const [residentPopulationImgs, setResidentPopulationImgs] = useState<any[]>([]);
  const [targetApprovalForm, setTargetApprovalForm] = useState<any[]>([]);
  const onIconClick = () => {
    if (!targetApprovalForm?.length) return;
    downloadFile(targetApprovalForm[0]);
  };

  useEffect(() => {
    if (!Object.keys(detail).length) return;
    // shopAddress
    const { lng, lat, cityId, shopAddress } = detail;
    // 非标准版本需要请求这三个接口，标准版本需要请求审批表记录即可
    if (!isStandard) {
    // originType 1:"5公里鱼店状态"，2："城市信息"，3："周边人群"
    // 周边五公里品牌门店分布图
      rimShop({ lng, lat, cityId, originType: 1 });
      // 城市信息图
      cityInfo({ cityId, originType: 2, lng, lat, address: shopAddress });
      // 周边常住人口图
      residentPopulation({ lng, lat, cityId, shopAddress, originType: 3 });
    }
    // 获取审批表
    getRecords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  // 下载全部图片
  const downloadAllHandle = () => {
    // 下载成功后会切换tab，故加了延时
    rimShopImgs?.length && (downloadFile(rimShopImgs[0]));
    setTimeout(() => {
      cityInfoImgs?.length && (downloadFile(cityInfoImgs[0]));
    }, 100);
    setTimeout(() => {
      residentPopulationImgs?.length && (downloadFile(residentPopulationImgs[0]));
    }, 200);
  };

  // 周边五公里品牌门店分布图
  const rimShop = (params: any) => {
    const { lng, lat, cityId } = params;
    if (!(lng && lat && cityId)) return;
    generateImage(params).then(({ url, name }) => {
      url && name ? setRimShopImgs([{
        url,
        name
      }
      ]) : setRimShopImgs([]);
    });
  };

  // 城市信息图
  const cityInfo = (params) => {
    const { cityId, lng, lat } = params;
    if (!(lng && lat && cityId)) return;
    generateImage(params).then(({ url, name }) => {
      url && name ? setCityInfoImgs([{
        url,
        name
      }
      ]) : setCityInfoImgs([]);
    });
  };

  // 周边常住人口图
  const residentPopulation = (params: any) => {
    const { shopAddress, lng, lat, cityId } = params;
    if (!(lng && lat && cityId)) return;
    generateImage({ ...params, address: shopAddress }).then(({ url, name }) => {
      url && name ? setResidentPopulationImgs([{
        url,
        name
      }
      ]) : setResidentPopulationImgs([]);
    });
  };
  // 获取审批表
  const getRecords = async() => {
    // 鱼你审核被拒绝的话是没有机会点id的
    const { chancePointId, id } = detail || {};
    const targetId = isApproval ? chancePointId : id;
    if (!targetId) return;
    // 标准版本和鱼你版本调用的接口不一致
    const res = isStandard ? await importChancePointRecords({ id: targetId }) : await getImportRecords({ id: targetId });

    if (isArray(res) && res.length) {
      const target = res[0];
      const { url, name } = target || {};
      url && name && (setTargetApprovalForm([target]));
      return;
    }
    setTargetApprovalForm([]);
  };


  return (
    <>
      { !isStandard && <div>
        <V2Title
          type='H2'
          divider
          text='自动生成图'
          className={cs('mt-24')}
          extra={<div className='pointer c-244' onClick={downloadAllHandle}>下载全部图片</div>}/>
        <Row gutter={24}>
          <Col span={12}>
            <V2DetailItem label='周边五公里品牌门店分布图' type='images' assets={rimShopImgs}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='城市信息图' type='images' assets={cityInfoImgs}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='周边常住人口图' type='images' assets={residentPopulationImgs}/>
          </Col>
        </Row>

      </div> }

      <V2Title
        type='H2'
        divider
        text='审批表'
        className={cs('mt-24')}/>
      <Row gutter={24}>
        <Col span={12}>
          <V2DetailItem
            label='审批表'
            type='files'
            assets={targetApprovalForm}
            fileDownloadHide
            filePreviewHide
            rightSlot={{
              icon: targetApprovalForm?.length ? <IconFont
                iconHref='icondownload'
                className='c-006 mt-5'
              /> : null,
              onIconClick: onIconClick
            }}/>
        </Col>
      </Row>
    </>
  );
};

export default CustomizedOfAttachment;

