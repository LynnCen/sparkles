import { FC, useState, useEffect } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col, Button, Tooltip } from 'antd';
import EditModal from '@/views/brandCenter/components/EditModal';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';

const spanHalf = {
  span: 12,
};

const Main: FC<any> = ({
  detail,
  brandId,
  // container,
  style = {},
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  changeDetail,
}) => {
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [isToolTipShow, setIsToolTipShow] = useState<boolean>(false);
  const [detailTest, setDetailTest] = useState('');
  useEffect(() => {
    // TODO：测试表现形式
    const industryInit = () => {
      let industryNames = '';
      // 生成包含所有的产业的字符串
      if (detail?.industryList) {
        detail.industryList.forEach((item, index) => {
          if (item.oneIndustryName) {
            industryNames += item.oneIndustryName;
            industryNames += ' > ';
          }
          if (item.twoIndustryName) {
            industryNames += item.twoIndustryName;
            item.threeIndustryName ? industryNames += ' > ' : '';
          }
          if (item.threeIndustryName) {
            industryNames += item.threeIndustryName;
          }
          if (index + 1 !== detail.industryList.length) {
            industryNames += '、';
          }
        });
        // 控制所属产业悬浮提示是否开启
        if (detail.industryList.length >= 2) {
          setIsToolTipShow(true);
        } else {
          setIsToolTipShow(false);
        }
      }
      setDetailTest(industryNames);
    };
    industryInit();
  }, [detail]);
  const methods = useMethods({
    // 编辑信息后，用回调数据刷新详情显
    onLocalEdit(params, additionInfo) {
      const tmpDetail = {
        name: params.name,
        industryList: additionInfo.industryList,
        type: params.type,
        typeName: additionInfo.typeName,
        brandEstablishTime: params.brandEstablishTime,
        cityId: params.cityId,
        cityName: params.cityName,
        provinceId: params.provinceId,
        provinceName: params.provinceName,
        companyName: params.companyName,
        logo: params.logo,
        icon: params.icon,
        brandIntroduce: params.brandIntroduce,
        mdBrandAnnexDtos: params.mdBrandAnnexDtos,
        mdBrandPictureDtos: params.mdBrandPictureDtos,
      };
      changeDetail({
        ...detail,
        ...tmpDetail,
      });
    }
  });

  const currentAssets = () => {
    const assets: any = [];
    if (detail?.logo) {
      assets.push({ url: detail?.logo });
    }
    if (detail?.icon) {
      assets.push({ url: detail?.icon });
    }
    return assets;
  };

  return (
    <div className={styles.detailMain} style={{
      width: '80%',
      height: mainHeight || 'auto',
      overflowY: 'scroll',
      overflowX: 'hidden',
      marginTop: '20px',
      marginBottom: '32px',
      ...style
    }}>
      <V2Title type='H2' text='品牌信息' divider extra={
        // 待审核且有权限时，允许编辑
        detail?.status === 0 && !!detail?.permissions.find(item => item.event === 'brandLibrary:update') &&
        <Button onClick={() => setEditVisible(true)}>编辑信息</Button>
      }/>
      <V2DetailGroup>
        <Row gutter={16}>
          <Col {...spanHalf}>
            <V2DetailItem label='品牌名称' value={detail?.name}/>
          </Col>
          <Col {...spanHalf}>
            <Tooltip
              trigger={isToolTipShow ? 'hover' : 'contextMenu'}
              placement='top'
              title={detailTest.replace(/、/g, '\n')}
              overlayInnerStyle={{ whiteSpace: 'pre-line' }}
              arrowPointAtCenter={true} >
              <V2DetailItem
                label='所属行业'
                rows={1}
                value={detailTest}
                tooltipConfig={{
                  overlayInnerStyle: { display: 'none' },
                  overlayStyle: { display: 'none' },
                }}
                className={styles.industryNameTest} />
            </Tooltip>
          </Col>
          <Col {...spanHalf}>
            <V2DetailItem label='品牌类型' value={detail?.typeName}/>
          </Col>
          <Col {...spanHalf}>
            <V2DetailItem label='成立时间' value={detail?.brandEstablishTime ? (
              detail.brandEstablishTime.indexOf('年') > -1 ? detail.brandEstablishTime : detail.brandEstablishTime + '年'
            ) : undefined}/>
          </Col>
          <Col {...spanHalf}>
            <V2DetailItem label='发源地' value={detail?.cityName}/>
          </Col>
          <Col {...spanHalf}>
            <V2DetailItem label='所属公司' value={detail?.companyName}/>
          </Col>
          <Col {...spanHalf}>
            <V2DetailItem label='品牌标识' type='images' assets={currentAssets()}/>
          </Col>
          <Col {...spanHalf}>
            <V2DetailItem label='品牌简介' value={detail?.brandIntroduce} type='textarea' textAreaRows={3}/>
          </Col>
          <Col {...spanHalf}>
            <V2DetailItem label='门店照片' assets={detail?.mdBrandPictureDtos} type='images'/>
          </Col>
          <Col {...spanHalf}>
            <V2DetailItem label='附件' assets={detail?.mdBrandAnnexDtos} type='files'/>
          </Col>
        </Row>
      </V2DetailGroup>
      <EditModal
        visible={editVisible}
        setVisible={setEditVisible}
        isEdit
        brandId={brandId}
        localDetail={detail}
        onLocalEdit={methods.onLocalEdit}/>
    </div>
  );
};

export default Main;
