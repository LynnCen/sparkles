

import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import { useMethods } from '@lhb/hook';
import { Col, Divider, Row, Spin } from 'antd';
import { get } from '@/common/request/index';
import { useState, FC, useImperativeHandle, forwardRef } from 'react';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import { HandleResult, FeedbackType } from 'src/views/feedback/pages/index/ts-config';

// 详情抽屉
const Component:FC<any& { ref?: any }> = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.init
  }));
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const typeId = detail?.type?.id;

  const methods = useMethods({
    init(id) {
      setVisible(true);
      setLoading(true);
      // https://yapi.lanhanba.com/project/307/interface/api/61823
      get('/saas/advice/detail', { id }, { proxyApi: '/lcn-api' }).then((res) => {
        console.log(res);
        setDetail(res);
      }).finally(() => {
        setLoading(false);
      });
    },
  });


  return <V2Drawer
    open={visible}
    onClose={() => setVisible(false)}
    contentWrapperStyle={{
      minWidth: 'auto',
      width: '824px',
    }}
  >
    <Spin spinning={loading}>
      <V2Title text='问题反馈'/>
      <Divider className='mt-16 mb-16'/>
      <V2DetailGroup block>
        <Row gutter={24}>
          <Col span={12}>
            <V2DetailItem label='反馈类型' value={detail.type?.name}/>
          </Col>
          { typeId === FeedbackType.BUSINESS_COMPLAIN && <Col span={12}>
            <V2DetailItem label='被投诉对象' value={detail.targetName}/>
          </Col> }
          <Col span={12}>
            <V2DetailItem label={typeId === FeedbackType.BUSINESS_COMPLAIN ? '被投诉内容' : '问题描述'} type='textarea' value={detail.remark}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='处理结果' value={detail.resultName}/>
          </Col>
          { detail.result === HandleResult.refuse && <Col span={12}>
            <V2DetailItem label='拒绝原因' type='textarea' value={detail.refuseReason}/>
          </Col> }
          { typeId === FeedbackType.BUSINESS_COMPLAIN && detail.result === HandleResult.accept && <>
            <Col span={12}>
              <V2DetailItem label='快捷标签' value={detail.detailTypeVOList?.map(item => item.name).join('，')}/>
            </Col>
            <Col span={12}>
              <V2DetailItem label='相关项目' value={detail.projectVO?.name} type='link' onClick={() => detail.projectVO?.id && window.open(`${process.env.LHB_ADMIN_URL}/#/project/detail?id=${detail.projectVO?.id}`)}/>
            </Col>
          </> }
          <Col span={12}>
            <V2DetailItem label='提交人' value={detail.creatorName}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='提交时间' value={detail.gmtCreate}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='处理人' value={detail.handlePersonName}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='处理时间' value={detail.gmtResolve}/>
          </Col>
        </Row>
      </V2DetailGroup>
    </Spin>
  </V2Drawer>;
});

export default Component;
