// 需求详情-跟进记录
import { FC, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Col, Form, Popover, Row, Typography, message } from 'antd';
import { refactorSelection, replaceEmpty } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { postRequirementSaveFollowRecord, getRequirementFollowRecords } from 'src/common/api/demand-management';
import dayjs from 'dayjs';
import cs from 'classnames';
import style from '../index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Tag from '@/common/components/Data/V2Tag';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import FormFollowerList from 'src/common/components/FormBusiness/FormFollowerList';
import FormVisitPlaceProject from 'src/common/components/FormBusiness/FormVisitPlaceProject';
import V2LogRecord from 'src/common/components/SpecialBusiness/V2LogRecord';
import IconFont from '@/common/components/IconFont';
import EditLabel from './EditLabel';
import V2Container from '@/common/components/Data/V2Container';
import AudioOutlined from '@ant-design/icons/lib/icons/AudioOutlined';

const Component:FC<{
  selection: any,
  onRef?: any,
  id: string|number,
  requirementStageId: string|number
  internalLabels: Array<any>
  onRefresh: any,
  handleRightExtra?:(id:number|string, visible:boolean)=>void
}> = ({
  selection,
  onRef,
  id,
  requirementStageId,
  internalLabels,
  onRefresh,
  handleRightExtra
}) => {
  const [form] = Form.useForm();
  const curSelection = {
    recordsTypes: [{ value: 1, label: '需求跟进' }, { value: 2, label: '看场跟进' }], // 跟进记录类型
    followStages: [{ value: 1, label: '有意向' }, { value: 2, label: '已看场' }], // 跟进阶段
  };
  const [mode, setMode] = useState('detail');
  const [requesting, setRequesting] = useState(false);
  const TYPE_DEMAND = 1;// 需求跟进
  // const TYPE_PLACE=2;//看场跟进
  const VISIT_PLACE_STAGE_HAS_INTENTION = 1;// 有意向
  const type = Form.useWatch('type', form);
  const visitStage = Form.useWatch('visitStage', form);
  const visitPlaceProjectRef = useRef<any>(null);
  const [curVisitPlaceProject, setCurVisitPlaceProject] = useState({});
  const [followRecords, setFollowRecords] = useState<any>([]);
  const [editLabelData, setEditLabelData] = useState<any>({ visible: false });
  const [showLabelDetail, setShowLabelDetail] = useState<any>(false);
  const [mainHeight, setMainHeight] = useState<number>(0);

  useEffect(() => {
    if (id) {
      methods.getFollowRecords();
    }
  }, [id]);

  const methods = useMethods({
    init() {
      form.resetFields();
      form.setFieldsValue({ 'type': TYPE_DEMAND, requirementStageId });
      setMode('detail');
      setCurVisitPlaceProject({});
    },
    submit() {
      setRequesting(true);
      form.validateFields().then((values) => {
        const params = type === TYPE_DEMAND
          ? Object.assign(values, { locxxRequirementId: id, remindDate: values.remindDate ? dayjs(values.remindDate).format('YYYY-MM-DD') : null, remindUsers: [values.remindUsers] })
          : Object.assign(values, curVisitPlaceProject, { locxxRequirementId: id, visitPlaceDate: values.visitPlaceDate ? dayjs(values.visitPlaceDate).format('YYYY-MM-DD') : null })
        ;
        postRequirementSaveFollowRecord(params).then(() => {
          message.success(`添加${type === TYPE_DEMAND ? '跟进' : '看场'}记录成功`);
          methods.init();
          methods.getFollowRecords();
        }).finally(() => {
          setRequesting(false);
        });
      }).catch(() => {
        setRequesting(false);
      });
    },
    changeVisitPlaceProject() {
      const curVisitPlaceProject = visitPlaceProjectRef.current.getItem(form.getFieldValue('tntPlaceId'));
      setCurVisitPlaceProject((state) => ({ ...state, tntPlaceName: curVisitPlaceProject?.placeName, tntPlaceContact: curVisitPlaceProject?.contact?.userName }));
    },
    formatRcord(item) {
      const { creator, createTime, typeName, content, type, visitContent, tapingUrl, callInstanceId } = item;
      return {
        name: creator,
        time: dayjs(createTime).format('YYYY-MM-DD'),
        description: content,
        titleExtra: <V2Tag color={ type === TYPE_DEMAND ? 'orange' : 'green' } className={cs(style.recordTag, 'ml-8')}>{typeName || '-'}</V2Tag>,
        status: 'finish',
        middleExtra: type === TYPE_DEMAND ? (tapingUrl ? <Button type='link' onClick={() => handleRightExtra?.(callInstanceId, true)} className={style.recordBtn}><AudioOutlined />录音地址</Button> : '') : <span className={style.recordOther}>
          <Typography.Text
            ellipsis={{ tooltip: <pre className={style.pretext}>{replaceEmpty(visitContent)}</pre> }}
            style={{ maxWidth: '224px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
          >
            <span>{replaceEmpty(visitContent)}</span>
          </Typography.Text>
        </span>
      };
    },
    getFollowRecords() {
      if (!id) {
        console.log('没有需求id');
        return;
      }
      getRequirementFollowRecords({ locxxRequirementId: id }).then((res) => {
        setFollowRecords(Array.isArray(res) ? res.map(item => methods.formatRcord(item)) : []);
      });
    },
    editLabel() {
      setEditLabelData((state) => ({ ...state, visible: true }));
    },
    renderLabel() {
      return <div className={style.showInLabels}>
        {Array.isArray(internalLabels) && internalLabels.length ? internalLabels.map((item, index) => (
          <V2Tag color='blue' key={index} className={style.inLabelTag}>{item.name || '-'}</V2Tag>
        )) : '-'}
      </div>;
    },
    onRefresh() {
      methods.getFollowRecords();
      onRefresh?.();
      methods.init();
    }
  });

  useImperativeHandle(onRef, () => ({
    init: methods.init
  }));

  return <div className={style.followRecord}>
    <V2Container
      className={style.container}
      style={{ height: 'calc(100vh - 250px - 80px)' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: <>
          <div className={style.followRecordForm} >
            <V2Title className='mb-16 ft-14'>跟进记录</V2Title>
            {mode === 'detail' ? <>
              <div className={style.inLabel}>
                <div className={style.inLabels}>
                  {Array.isArray(internalLabels) && internalLabels.length ? internalLabels.map((item, index) => (
                    <V2Tag color='blue' key={index} className={style.inLabelTag}>{item.name || '-'}</V2Tag>
                  )) : '-'}
                </div>
                <div className={style.oprateIcon} style={{ width: Array.isArray(internalLabels) && internalLabels.length ? '50px' : '100px' }}>
                  {Array.isArray(internalLabels) && internalLabels.length ? <Popover
                    align={{
                      offset: [18, 0]
                    }}
                    content={methods.renderLabel()}
                    trigger='click'
                    placement='bottomRight'
                    onOpenChange={() => { setShowLabelDetail(!showLabelDetail); }}>
                    <IconFont
                      iconHref='pc-common-icon-a-iconarrow_down'
                      className={cs(style.labelIcon, showLabelDetail ? style.rotate : '', showLabelDetail ? style.active : '')}/>
                  </Popover> : ''}
                  {Array.isArray(internalLabels) && internalLabels.length ? '' : <div className={style.editText}>编辑内部标签</div>}
                  <IconFont iconHref='pc-common-icon-ic_edit' onClick={() => methods.editLabel()} className={style.labelIcon}></IconFont>
                </div>
              </div>
              <div className={style.box} onClick={() => setMode('edit')}>
                <span>待跟进</span>
              </div>
            </> : <>
              <V2Form form={form} initialValues={{ type: 1 }}>
                <V2FormRadio
                  form={form}
                  canClearEmpty
                  name='type'
                  options={curSelection.recordsTypes}
                  required
                  noStyle={true}
                />
                <div className={style.box2}>
                  <Row gutter={24}>
                    { type === TYPE_DEMAND ? <>
                      <Col span={12}>
                        <V2FormSelect
                          label=''
                          name='requirementStageId'
                          placeholder='跟进阶段'
                          options={refactorSelection(selection.locxxRequirementStages)}
                        />
                      </Col>
                      <Col span={12}>
                        <V2FormDatePicker
                          label=''
                          name='remindDate'
                          placeholder='提醒时间'
                          config={{ format: 'YYYY/MM/DD' }} />
                      </Col>
                      <Col span={12}>
                        <FormFollowerList
                          name='remindUsers'
                          placeholder='提醒人'
                          allowClear={true}
                        />
                      </Col>
                    </> : <>
                      <Col span={24}>
                        <FormVisitPlaceProject
                          ref={visitPlaceProjectRef}
                          label=''
                          name='tntPlaceId'
                          placeholder='看场项目'
                          required
                          formItemConfig={{ rules: [{ required: true, message: '请选择看场项目' }] }}
                          onChange={() => methods.changeVisitPlaceProject()}
                        />
                      </Col>
                      <Col span={12}>
                        <V2FormSelect
                          label=''
                          name='visitStage'
                          placeholder='阶段'
                          required
                          rules={[{ required: true, message: '请选择阶段' }]}
                          options={curSelection.followStages}
                        />
                      </Col>
                      <Col span={12}>
                        <V2FormDatePicker
                          label=''
                          name='visitPlaceDate'
                          placeholder='时间'
                          required={visitStage !== VISIT_PLACE_STAGE_HAS_INTENTION}
                          rules={[{ required: visitStage !== VISIT_PLACE_STAGE_HAS_INTENTION, message: '请选择时间' }]}
                          config={{ format: 'YYYY/MM/DD' }} />
                      </Col>
                    </>}
                    <Col span={24}>
                      <V2FormTextArea
                        name='content'
                        maxLength={500}
                        config={{ showCount: true }}
                        className='record'
                        rules={[{ required: type === TYPE_DEMAND, whitespace: true, message: '请填写跟进记录' }]}
                      />
                    </Col>
                    <Col span={24}>
                      <Button type='primary' disabled={requesting} className='mr-8' onClick={() => methods.submit()}>提交</Button>
                      <Button onClick={() => setMode('detail')}>取消</Button>
                    </Col>
                  </Row>
                </div>
              </V2Form>
            </>}
          </div>
        </>
      }}
    >
      <div className={style.recordList} style={{ maxHeight: mainHeight }}>
        <V2LogRecord items={followRecords}></V2LogRecord>
      </div>
    </V2Container>

    <EditLabel
      editLabelData={editLabelData}
      setEditLabelData={setEditLabelData}
      locxxRequirementId={id}
      internalLabels={internalLabels}
      onRefresh={methods.onRefresh}
    />
  </div>;
};

export default Component;
