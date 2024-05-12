
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import { useMethods } from '@lhb/hook';
import { Divider, Typography, Form, Row, Col, Space, Button, Spin, Image, message } from 'antd';
import { useState, FC, forwardRef, useImperativeHandle } from 'react';
import styles from './index.module.less';
import { contrast, replaceEmpty } from '@lhb/func';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2Form from '@/common/components/Form/V2Form';
import FormUserList from '@/common/components/FormBusiness/FormUserList';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { get, post } from '@/common/request';
import { refactorSelection } from '@/common/utils/ways';
import { HandleResult, FeedbackType } from 'src/views/feedback/pages/index/ts-config';
import FormProject from 'src/common/components/FormBusiness/FormProject';
const { Text } = Typography;
const { PreviewGroup } = Image;

// 问题反馈，处理抽屉
const Component:FC<any& { ref?: any }> = forwardRef(({ onConfirm }, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.init
  }));

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState<any>({});
  const [selection, setSelection] = useState<any>({});
  const result = Form.useWatch('result', form);
  const typeId = detail?.type?.id;

  const methods = useMethods({
    init(id) {
      setVisible(true);
      form.resetFields();
      methods.getDetail(id);
      methods.getSelection();
    },
    getDetail(id) {
      setLoading(true);
      // https://yapi.lanhanba.com/project/307/interface/api/61823
      get('/saas/advice/detail', { id }, { proxyApi: '/lcn-api' }).then((res) => {
        console.log(res);
        setDetail(res);
        form.setFieldsValue({
          detailTypeIds: res?.detailTypeVOList?.map(item => item.id) || [],
          targetIds: res?.targetIds || []
        });
      }).finally(() => {
        setLoading(false);
      });
    },
    getSelection() {
      // https://yapi.lanhanba.com/project/307/interface/api/33552
      get('/requirement/selection', { modules: 'problemFeedbackLabel,adviceType' }, { proxyApi: '/lcn-api' }).then((res) => {
        setSelection(val => ({ ...val,
          types: contrast(res, 'adviceType', []),
          problemFeedbackLabels: contrast(res, 'problemFeedbackLabels', []),
        }));
      });
    },
    confirm() {
      form.validateFields().then((values) => {
        setRequesting(true);
        // https://yapi.lanhanba.com/project/307/interface/api/61893
        post('/saas/advice/handle', { id: detail.id, ...values }, { proxyApi: '/lcn-api' }).then(() => {
          message.success('处理成功！');
          setVisible(false);
          onConfirm && onConfirm();
        }).finally(() => {
          setRequesting(false);
        });
      });
    },
    refactorQiniuImageUrl(url: string) {
      if (typeof url === 'string') {
        if (url.indexOf('?') > -1) {
          const query = url.split('?')[1];
          if (query?.indexOf('imageView') > -1) { // 如果用户设置了，就不去管他
            return url;
          } else {
            return url + '&imageView2/1/w/45/h/48';
          }
        } else {
          return url + '?imageView2/1/w/45/h/48';
        }
      }
      return url;
    }
  });

  const InfoItem:FC<any> = ({ title, value, width, children }) => {
    return <div className='info-item' style={{ width: width }}>
      <div className='info-title'>{ replaceEmpty(title) }</div>
      { children || <div className='info-value'>
        <Text ellipsis={{ tooltip: value }} style={{ maxWidth: '100%' }}>{replaceEmpty(value)}</Text>
      </div> }
    </div>;
  };

  return <V2Drawer
    open={visible}
    onClose={() => setVisible(false)}
    className={styles.container}
    contentWrapperStyle={{
      minWidth: 'auto',
      width: '824px',
    }}
  >
    <Spin spinning={loading}>
      <V2Title text='问题反馈'></V2Title>
      <Divider className='mt-16 mb-16'/>
      <div className='info' >
        <div className='info-wrapper'>
          <InfoItem title='问题类型' value={detail.type?.name} width='56px'></InfoItem>
          <InfoItem title='定位' width='100px'>
            <div className={detail.positionUrl ? 'info-link' : 'info-value'} onClick={() => detail.positionUrl && window.open(detail.positionUrl)}>{replaceEmpty(detail.position)}</div>
          </InfoItem>
          { typeId === FeedbackType.BUSINESS_COMPLAIN && <InfoItem title='反馈类型' value={detail.detailTypeVOList?.map(item => item.name).join('，')} width='120px'/> }
          <InfoItem title='提交人'value={detail.creatorName} width='50px'></InfoItem>
          <InfoItem title='提交时间' value={detail.gmtCreate} width='220px'></InfoItem>
        </div>
        <div className='info-wrapper'>
          <InfoItem title='问题描述' width='55%' value={detail.remark}></InfoItem>
          <InfoItem title='截图页面' width='40%'>
            { detail.pictures?.length ? <PreviewGroup preview={{ getContainer: false }} >
              { detail.pictures?.map((item) =>
                <div className='mr-8 inline-block'>
                  <Image src={methods.refactorQiniuImageUrl(item.url)} preview={{ src: item.url }} width={45} height={48} />
                </div>
              ) }
            </PreviewGroup> : '-' }
          </InfoItem>
        </div>
      </div>
      <Divider/>

      <V2Form form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <V2FormRadio
              label='处理结果'
              name='result'
              required
              options={[
                { value: HandleResult.accept, label: '采纳' },
                { value: HandleResult.refuse, label: '拒绝' },
              ]}/>
          </Col>
          { result === HandleResult.refuse && <Col span={12} >
            <V2FormTextArea
              label='拒绝原因'
              name='refuseReason'
              required
              maxLength={500}
              config={{ autoSize: { minRows: 4, maxRows: 6 }, showCount: true }}
            />
          </Col> }
          { typeId === FeedbackType.BUSINESS_COMPLAIN && result === HandleResult.accept && <>
            <Col span={12}>
              <FormUserList
                config={{ mode: 'multiple' }}
                label='被投诉对象'
                name='targetIds'
                placeholder='请选择吐槽对象'
                formItemConfig={{ rules: [{ required: true, message: '请选择吐槽对象' }] }}
                allowClear={true}
                form={form}
              />
            </Col>
            <Col span={12}>
              <V2FormSelect
                label='快捷标签'
                name='detailTypeIds'
                placeholder='请选择被投诉类型'
                mode='multiple'
                options={refactorSelection(selection.problemFeedbackLabels)}
              />
            </Col>
            <Col span={12}>
              <FormProject
                label='选择项目'
                name='projectId'
                formItemConfig={{ rules: [{ required: true, message: '请选择吐槽对象' }] }}
                placeholder='请选择项目'
              />
            </Col>
            <Col span={12}>
              <V2FormTextArea
                label='被投诉内容'
                name='handleRemark'
                required
                maxLength={500}
                config={{ autoSize: { minRows: 4, maxRows: 6 }, showCount: true }}
              />
              <Button onClick={() => {
                form.setFieldValue('handleRemark', detail.remark);
                form.validateFields(['handleRemark']);
              }}>复制问题描述</Button>
            </Col>
          </> }
        </Row>
      </V2Form>
    </Spin>

    <div className={styles.drawerFooter}>
      <Space size={12}>
        <Button onClick={() => setVisible(false)}>取消</Button>
        <Button type='primary' loading={requesting} disabled={loading} onClick={methods.confirm}>确定</Button>
      </Space>
    </div>
  </V2Drawer >;
});

export default Component;
