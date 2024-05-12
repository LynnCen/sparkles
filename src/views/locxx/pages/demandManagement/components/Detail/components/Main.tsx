// 详情的主体内容
import { FC, forwardRef, useImperativeHandle, useRef } from 'react';
import { Col, Form, Row, Space } from 'antd';
import { getKeysFromObjectArray, parseArrayToString, replaceEmpty } from '@lhb/func';
import style from '../index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import FollowRecord from './FollowRecord';
import V2Tag from '@/common/components/Data/V2Tag';
import CopyTextIcon from '@/common/components/Text/CopyTextIcon';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { EnterpriseLevelColor } from '../../../ts-config';
import { post } from '@/common/request';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const Component:FC<{
  detailData: any
  setDetail: any
  selection: any
  ref: any,
  onRefresh: any,
  handleRightExtra?:(id:number|string, visible:boolean)=>void
}> = forwardRef(({ detailData = {}, setDetail, selection, onRefresh, handleRightExtra }, ref) => {
  const TYPE_OPEN = 1; // 类型-开店需求
  // const TYPE_SPREAD = 2; // 类型-推广计划
  const followRecordRef = useRef() as any;
  const [form] = Form.useForm();
  const isOpen = detailData?.purposeType === TYPE_OPEN;
  const backgroundColor = EnterpriseLevelColor[detailData.enterpriseLevel] && EnterpriseLevelColor[detailData.enterpriseLevel][0] || EnterpriseLevelColor['default'][0];

  useImperativeHandle(ref, () => ({
    init: followRecordRef.current.init
  }));

  /* methods */
  const targetCRM = (showMsg:any, id:string, type:string) => {
    return (
      !id ? <span>{showMsg || '-'}</span> : <span className={'pointer color-primary' } onClick={() => openUrl(id, type)}>{showMsg}</span>
    );
  };
  const openUrl = (id:string, type:string) => {
    let openUrl = '';
    if (type === 'customer') {
      openUrl = `${process.env.CRM_URL}/#/crm/customer/detail?id=${id}`;
    } else {
      openUrl = `${process.env.CRM_URL}/#/crm/contacts/detail?id=${id}`;
    }
    window.open(openUrl);
  };
  const getContact = () => {
    if (!detailData?.contactVO) {
      return '-';
    }
    const { mobile, name } = detailData?.contactVO;
    const contactText = mobile && name ? `${name || ''}-${replaceEmpty(mobile)}` : replaceEmpty(mobile);
    // 不支持跳转，暂时注释
    // if (detailData.requirementFrom === 1) {
    //   return targetCRM(contactText, id, 'contacts');
    // }
    return contactText;
  };

  const getEnterprise = () => {
    if (!detailData?.enterpriseName) return '-';
    if (detailData.requirementFrom === 1) return targetCRM(detailData.enterpriseName, detailData.enterpriseId, 'customer');
    return detailData.enterpriseName;
  };

  return <div className={style.detailMain}>
    <div className={style.detailMainLeft}>
      <Form form={form} validateTrigger={['onChange', 'onBlur']}>
        <V2Title divider type='H2'>客户信息</V2Title>
        <V2DetailGroup direction='vertical' block>
          <Row gutter={24}>
            { !isOpen && (
              <Col span={12}>
                {
                  detailData.enterpriseLevel?.length ? <V2DetailItem label='企业名称'>{
                    <div style={{ padding: '6px 0', marginTop: ' 4px' }}>
                      {getEnterprise()}<div className={style.enterpriseLevel} style={{ backgroundColor }}>{detailData.enterpriseLevel}</div>
                    </div>
                  }</V2DetailItem> : <V2DetailItem label='企业名称' value={getEnterprise()}></V2DetailItem>
                }
              </Col>
            )}
            <Col span={12}>
              <V2DetailItem label='联系人' value={getContact()} rightSlot={{ icon: <CopyTextIcon value={getContact()} className='ml-4'/> }}/>
            </Col>
            <Col span={12}>
              <V2DetailItem label='品牌业态' value={`${replaceEmpty(detailData.brands?.[0]?.name)}(${replaceEmpty(detailData.commercialFormName)})`} />
            </Col>
            <Col span={12}>
              <V2DetailItem label='品牌介绍' labelLength={6} flexAlignItems='center'>
                <V2DetailItem noStyle exonOneFile type='files' direction='vertical' assets={detailData?.schemes || []}></V2DetailItem>
              </V2DetailItem>
            </Col>
            <Col span={12}>
              <V2DetailItem label='品牌文件' labelLength={6} flexAlignItems='center'>
                <V2DetailItem noStyle exonOneFile type='files' direction='vertical' assets={detailData?.brandFiles || []}></V2DetailItem>
              </V2DetailItem>
            </Col>
            { isOpen && (
              <>
                <Col span={12}>
                  <V2DetailItem label='开店周期' value={replaceEmpty(parseArrayToString(getKeysFromObjectArray(detailData?.tenancies, 'name'), '、'))} />
                </Col>
                <Col span={12}>
                  <V2DetailItem useMoreBtn type='textarea' label='其它说明' value={replaceEmpty(detailData?.remark)} />
                </Col>
              </>
            ) }
            <Col span={12}>
              <V2DetailItem useMoreBtn type='textarea' label='期望商圈' value={replaceEmpty(detailData?.expectedBusinessCircle)} />
            </Col>
          </Row>
        </V2DetailGroup>
        <V2Title divider type='H2'><Space className={style.detailTitleCustom}>内部信息{!!detailData.internalLabels?.length && <V2Tag className='h-20'>{parseArrayToString(getKeysFromObjectArray(detailData.internalLabels, 'name'), '、')}</V2Tag>}</Space></V2Title>
        <V2DetailGroup direction='vertical' block>
          <Row gutter={24}>
            <Col span={12}>
              <V2DetailItem label='需求ID' value={detailData.id} rightSlot={{ icon: <CopyTextIcon value={detailData.id} className='ml-4'/> }} />
            </Col>
            <Col span={12}>
              <V2DetailItem label='创建人' value={detailData.crtorName} />
            </Col>
            <Col span={12}>
              <V2DetailItem label='创建时间' value={detailData.gmtCreate} />
            </Col>
            <Col span={12}>
              <V2DetailItem label='需求类型' value={detailData.purposeTypeName} />
            </Col>
            <Col span={12}>
              <V2DetailItem label='来源渠道' value={replaceEmpty(detailData.sourceChannelName)} />
            </Col>
            <Col span={12}>
              <V2DetailItem
                label='跟进阶段'
                value={replaceEmpty(detailData.requirementStageName)}
                allowEdit
                editConfig={{
                  formCom: <V2FormSelect
                    label='跟进阶段'
                    name='requirementStageId'
                    options={selection.locxxRequirementStages}
                    config={{ optionFilterProp: 'label' }}
                    placeholder='请选择跟进阶段'
                  />,
                  onCancel() {
                    form.setFieldValue('requirementStageId', detailData.requirementStageId);
                  },
                  onOK() {
                    // TODO crq: 待接口联调
                    const requirementStageId = form.getFieldValue('requirementStageId');
                    post('/locxx/requirement/updateStage', { locxxRequirementId: detailData.id, requirementStageId }, { proxyApi: '/lcn-api' }).then(() => {
                      V2Message.success('更新跟进阶段成功');
                      setDetail({
                        ...detailData,
                        requirementStageName: selection.locxxRequirementStages.find(item => item.value === requirementStageId)?.label,
                        requirementStageId: form.getFieldValue('requirementStageId'),
                      });
                    });
                  }
                }}
              />
            </Col>
            <Col span={12}>
              <V2DetailItem label='跟进人' value={replaceEmpty(detailData.follower)} />
            </Col>
            { !isOpen && (
              <>
                <Col span={12}>
                  <V2DetailItem label='预计签约时间' value={replaceEmpty(detailData.expectSignDate)} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='预估销售额（元）' value={detailData.estimatedSales ? `¥${detailData.estimatedSales}` : '-'} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='预估毛利（元）' value={detailData.estimatedGrossProfit ? `¥${detailData.estimatedGrossProfit}` : '-'} />
                </Col>
                <Col span={12}>
                  <V2DetailItem label='预期成单率' value={replaceEmpty(detailData.successRateOption)} />
                </Col>
              </>
            ) }
          </Row>
        </V2DetailGroup>
      </Form>
    </div>
    <div className={style.detailMainRight}>
      <FollowRecord selection={selection} onRef={followRecordRef} id={detailData?.id} requirementStageId={detailData.requirementStageId} internalLabels={detailData.internalLabels} onRefresh={onRefresh} handleRightExtra={handleRightExtra}></FollowRecord>
    </div>
  </div>;
});

export default Component;
