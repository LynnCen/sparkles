// 详情的顶部内容
import { FC, useMemo, useRef, useState } from 'react';
import { Col, Image, Row, message, Carousel, Alert, Button, Card } from 'antd';
import { beautifyThePrice, getItemLabelFromObjectArray, getKeysFromObjectArray, noop, parseArrayToString, refactorPermissions, replaceEmpty } from '@lhb/func';
import { postRequirementUpdateStatus } from '@/common/api/demand-management';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import style from '../index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Tag from '@/common/components/Data/V2Tag';
import IconFont from '@/common/components/IconFont';
import V2Operate from '@/common/components/Others/V2Operate';
import { useMethods } from '@lhb/hook';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import Edit from 'src/views/locxx/pages/demandManagement/components/Edit/index';
import UpdateWeight from 'src/views/locxx/pages/demandManagement/components/UpdateWeight';
import EditRequirementStage from 'src/views/locxx/pages/demandManagement/components/EditRequirementStage';
import EditCallBoardModal from './EditCallBoardModal';
import cs from 'classnames';
import { budgetTypes } from '../../../ts-config';

const Component:FC<{
  detailData: any,
  onRefresh: any
}> = ({ detailData = {}, onRefresh }) => {
  const permissions = refactorPermissions(detailData?.permissions || []);
  const editRef = useRef<any>(null);
  const updateWeightRef = useRef<any>(null);
  const editRequirementStageRef = useRef<any>(null);
  const DEMAND_STATUS_NO_OPEN = 1;// 未开放
  const DEMAND_STATUS_OPENING = 2;// 开放中
  const TYPE_OPEN = 1; // 类型-开店需求
  const isOpen = detailData?.purposeType === TYPE_OPEN;
  const [callBoardVisible, setCallBoardVisible] = useState<boolean>(false);

  const methods = useMethods({
    handleOpen() {
      ConfirmModal({
        onSure: (modal) => {
          postRequirementUpdateStatus({
            locxxRequirementIds: [detailData?.id],
            status: DEMAND_STATUS_OPENING
          }).then(() => {
            message.success('开放需求成功');
            onRefresh?.();
            modal.destroy();
          });
        },
        content: '确认开放当前需求？',
      });
    },
    handleClose() {
      console.log('handleClose');
      ConfirmModal({
        onSure: (modal) => {
          postRequirementUpdateStatus({
            locxxRequirementIds: [detailData?.id],
            status: DEMAND_STATUS_NO_OPEN
          }).then(() => {
            message.success('关闭需求成功');
            onRefresh?.();
            modal.destroy();
          });
        },
        content: '确认关闭当前需求？',
      });
    },
    handleUpdate() {
      if (detailData.requirementFrom === 1) {
        window.open(`${process.env.LCN_WEB_URL}/demand/detail?id=${detailData?.lcnRequirementId || ''}`);
      } else {
        editRef.current?.init(detailData?.id);
      }
    },
    handleUpdateWeight() {
      console.log('handleUpdateWeight');
      updateWeightRef.current?.init(detailData);
    },
    editComplete() {
      onRefresh?.();
    },
    editRequirementStage() {
      editRequirementStageRef.current?.init(detailData);
    },
    editCallBoard() {
      setCallBoardVisible(true);
    },
  });

  // 批量操作按钮
  const batchButton = useMemo(() => {
    const searchBtns = ['open', 'close', 'update', 'updateWeight'];

    return permissions.filter(item => {
      if (searchBtns.includes(item.event)) {
        item.onClick = methods[item.func];
        item.type = 'default';
      }
      return searchBtns.includes(item.event);
    });
  }, [permissions]);

  return (
    <div className={style.detailTopWrap}>
      <div className={style.rightNav}>
        <div className={style.rightLeft}>
          <div onClick={() => detailData?.lcnRequirementId ? window.open(`${process.env.LCN_WEB_URL}/demand/detail?id=${detailData?.lcnRequirementId || ''}`) : noop()}>
            <V2Title className={cs(style.demandName, detailData?.lcnRequirementId && style.demandNameLink)}>{replaceEmpty(detailData?.name)}</V2Title>
          </div>
          <div className={style.tagContent}>
            <V2Tag color='grey' className={style.demandStage}>
              <span className={style.demandStageName}>{replaceEmpty(detailData?.levelName)}</span>
              <span className={style.demandStageText}>需求等级</span>
            </V2Tag>
            <V2Tag color='orange' className='h-20 mr-4'>{replaceEmpty(detailData?.purposeTypeName)}</V2Tag>
            <V2Tag color='grey' className='h-20 mr-4'>{replaceEmpty(detailData?.statusName)}</V2Tag>
            <V2Tag color='blue' className='h-20 mr-8'>{replaceEmpty(detailData?.requirementStageName)}</V2Tag>
            { detailData.requirementFrom === 1 && <V2Tag color='blue' className='h-20 mr-8'>LCN</V2Tag> }
            <V2Tag color='grey' className={style.editRequirementStageName} onClick={() => methods.editRequirementStage()}>
              <IconFont iconHref='pc-common-icon-ic_edit'></IconFont>
            </V2Tag>
          </div>
        </div>
        <div className={style.operations}>
          <Image width={40} height={40} src={detailData?.waQrCode}></Image>
          { !!(!isOpen && detailData.requirementFrom === 1) && <Button className='mr-12' onClick={() => window.open(`${process.env.LCN_WEB_URL}/demand/detail?id=${detailData?.lcnRequirementId || ''}&tab=fieldRecommend`)}>查看场地推荐</Button> }
          <V2Operate
            operateList={batchButton}
            showBtnCount={3}
            onClick={(btns: { func: string | number }) => methods[btns.func]()} />
        </div>
      </div>
      <div className={style.topAlertContent}>
        <Alert
          className={style.callBoard}
          message={detailData.notice || '暂无需求公告'}
          type='warning'
          showIcon
          action={(detailData.requirementFrom !== 1 && detailData.permissions?.find(item => item.event === 'demandManagement:editNotice')) ? <span className={style.callBoardBtn} onClick={methods.editCallBoard}>编辑</span> : undefined}
        />
      </div>
      { isOpen ? (
        <div className={style.detailTop}>
          <div className={style.left}>
            <Carousel autoplay={true}>
              {Array.isArray(detailData?.storePic) && detailData?.storePic.length ? detailData?.storePic?.map((item, index) => (
                <Image width={300} height={240} src={item.url} key={index}></Image>
              )) : <Image width={300} height={240} src={'https://staticres.linhuiba.com/project-custom/react-pc/empty-nothing.png'} preview={false}></Image>}
            </Carousel>
          </div>
          <div className={style.right}>
            <V2DetailGroup direction='vertical' moduleType='easy'>
              <Row gutter={24}>
                <Col span={8}>
                  <V2DetailItem label='开店城市' value={replaceEmpty(parseArrayToString(getKeysFromObjectArray(detailData.cities, 'name'), '、'))} />
                </Col>
                <Col span={8}>
                  <V2DetailItem label='目标场景' value={replaceEmpty(parseArrayToString(getKeysFromObjectArray(detailData?.categories, 'name'), '、'))} />
                </Col>
                <Col span={8}>
                  <V2DetailItem label='位置要求' value={replaceEmpty(detailData.position)} />
                </Col>
              </Row>
            </V2DetailGroup>
            <div className={style.divider}></div>
            <V2DetailGroup direction='horizontal' moduleType='easy'>
              <Row gutter={24}>
                <Col span={8}>
                  <V2DetailItem label='选址类型' value={replaceEmpty(detailData.purposeTypeName)} />
                </Col>
                <Col span={8}>
                  <V2DetailItem label='面积要求' value={detailData.minArea && detailData.maxArea ? `${detailData.minArea}-${detailData.maxArea} m²` : '-'} />
                </Col>
                <Col span={8}>
                  <V2DetailItem label='经营方式' value={replaceEmpty(parseArrayToString(getKeysFromObjectArray(detailData?.openingModes, 'name'), '、'))} />
                </Col>
                <Col span={8}>
                  <V2DetailItem label='合作方式' value={replaceEmpty(parseArrayToString(getKeysFromObjectArray(detailData?.rentModes, 'name'), '、'))} />
                </Col>
                <Col span={8}>
                  <V2DetailItem label='合作说明' value={replaceEmpty(detailData?.rentModeRemark)} />
                </Col>
                <Col span={8}>
                  <V2DetailItem label='工程条件' value={replaceEmpty(parseArrayToString(getKeysFromObjectArray(detailData?.engineeringConditions, 'name'), '、'))} />
                </Col>
              </Row>
            </V2DetailGroup>
          </div>
        </div>
      ) : (
        <Card style={{ marginBottom: 12 }}>
          <V2DetailGroup direction='vertical' moduleType='easy'>
            <Row gutter={24}>
              <Col span={6}>
                <V2DetailItem label='目标城市' value={replaceEmpty(parseArrayToString(getKeysFromObjectArray(detailData.cities, 'name'), '、'))} />
              </Col>
              <Col span={6}>
                <V2DetailItem label='场景位置' value={`${replaceEmpty(parseArrayToString(getKeysFromObjectArray(detailData?.categories, 'name'), '、'))}${detailData.position ? `-${detailData.position}` : ''}`} />
              </Col>
              <Col span={6}>
                <V2DetailItem label='面积要求' value={detailData.minArea && detailData.maxArea ? `${detailData.minArea}-${detailData.maxArea} m²` : '-'} />
              </Col>
              <Col span={6}>
                <V2DetailItem label='活动档期' value={detailData.promotionStart && detailData.promotionEnd ? `${detailData.promotionStart}~${detailData.promotionEnd}` : '-'} />
              </Col>
            </Row>
          </V2DetailGroup>
          <div className={style.divider}></div>
          <V2DetailGroup direction='horizontal' moduleType='easy'>
            <Row gutter={24}>
              <Col span={6}>
                <V2DetailItem label='选址类型' value={replaceEmpty(detailData.purposeTypeName)} />
              </Col>
              <Col span={6}>
                <V2DetailItem label='产品' value={replaceEmpty(detailData.product)} />
              </Col>
              <Col span={6}>
                <V2DetailItem label='合作方式' value={replaceEmpty(parseArrayToString(getKeysFromObjectArray(detailData?.rentModes, 'name'), '、'))} />
              </Col>
              <Col span={6}>
                <V2DetailItem label='场次天数' value={replaceEmpty((!!detailData?.singleActiveDays && !!detailData?.popUpNum)
                  ? `${detailData.popUpNum}场/每场${detailData.singleActiveDays}天`
                  : `${detailData?.popUpNum ? `${detailData.popUpNum}场` : ''}${detailData?.singleActiveDays ? `每场${detailData.singleActiveDays}天` : ''}`)}
                />
              </Col>
              <Col span={6}>
                <V2DetailItem label={getItemLabelFromObjectArray(budgetTypes, detailData.budgetType, 'value', 'label') || '预算'} value={detailData.dayActiveBudget ? `¥${beautifyThePrice(detailData.dayActiveBudget)}` : '-'} />
              </Col>
              <Col span={6}>
                <V2DetailItem label='活动方案' labelLength={4} flexAlignItems='flex-start'>
                  {/* 56%为适配小屏幕显示 */}
                  <V2DetailItem noStyle exonOneFile type='files' direction='vertical' assets={detailData?.activities || []} wrapperStyle={{ width: '56%' }}></V2DetailItem>
                </V2DetailItem>
              </Col>
              <Col span={6}>
                <V2DetailItem label='其他要求' value={replaceEmpty(detailData.remark)} />
              </Col>
              <Col span={6}>
                <V2DetailItem labelLength={6} label='反馈截止时间' value={replaceEmpty(detailData.deadline)} />
              </Col>
            </Row>
          </V2DetailGroup>
        </Card>
      ) }
      {/* 编辑 */}
      <Edit ref={editRef} onConfirm={methods.editComplete}/>
      {/* 调权弹窗 */}
      <UpdateWeight ref={updateWeightRef} onRefresh={onRefresh}></UpdateWeight>
      {/* 编辑跟进记录 */}
      <EditRequirementStage ref={editRequirementStageRef} onRefresh={onRefresh}></EditRequirementStage>
      {/* 编辑需求公告 */}
      <EditCallBoardModal
        visible={callBoardVisible}
        setCallBoardVisible={setCallBoardVisible}
        data={detailData}
        onRefresh={() => onRefresh?.()}
      />
    </div>
  );
};

export default Component;
