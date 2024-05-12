/**
 * @Description 点位匹配情况
 *    目前看来卡旺卡和普通拓店任务处理的差异：modelClusterId参数
 */

import { FC, useState } from 'react';
import { Button, Image, Progress } from 'antd';
// import V2Title from '@/common/components/Feedback/V2Title';
import V2Table from '@/common/components/Data/V2Table';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Empty from '@/common/components/Data/V2Empty';
import { isNotEmptyAny } from '@lhb/func';
import styles from '../index.module.less';
import cs from 'classnames';
import PointDetail from '@/common/components/business/ExpandStore/ChancePointDetail';
import FormDrawer from '@/common/components/business/ExpandStore/ChancePointDetail/components/FormDrawer';
import { checkApprovalForm, taskChancePointInfo } from '@/common/api/expandStore/expansiontask';
import CreatePointMatching from './CreatePointMatching';
import InitiateApprovalModal from './InitiateApprovalModal';
import { ChancePointStatusColor } from '@/common/components/business/ExpandStore/ts-config';

interface Props {
  id: number; // 任务ID
  modelClusterId: number;
  chancePointInfo: any; // 匹配点位信息
  setChancePointInfo:Function;// 设置机会点数据
  isView: boolean; // 是否只能查看（审批详情时只能查看）
  refresh: Function;
}

const PointMatching: FC<Props> = ({
  id,
  modelClusterId,
  chancePointInfo,
  isView,
  setChancePointInfo,
  refresh,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>(); // 筛选参数
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false); // 是否显示新建弹窗
  const [pointId, setPointId] = useState<number>(); // 机会点id
  const [showPointDetail, setShowPointDetail] = useState<boolean>(false); // 是否显示机会点详情弹窗
  const [refreshDetail, setRefreshDetail] = useState<number>(0); // 刷新机会点详情
  const [formDrawerData, setFormDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  }); // 机会点详情上的编辑
  const [drawerData, setDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  }); // 完善点位评估编辑
  const [approvalModal, setApprovalModal] = useState<any>({
    show: false,
    id: undefined, // 机会点ID
    type: undefined, // 审批类型
    typeValue: undefined, // 审批子类
  }); // 提交审批弹窗


  /** 点击操作 */
  const clickProcessBtn = async (item, record) => {

    if (isView || !item.isHighlight) return; // 审批详情时不可编辑，或者按钮不高亮的内容不可点击

    const res = await checkApprovalForm({
      type: item.approvalType,
      typeValue: item.approvalTypeValue,
      relationId: record.id
    });
    if (res) {
      // 必填校验通过的时候打开发起审批弹窗
      setApprovalModal({
        show: true,
        type: item.approvalType,
        typeValue: item.approvalTypeValue,
        id: record.id
      });
    } else {
      // 必填校验未通过
      V2Confirm({
        onSure: (modal: any) => {
          setDrawerData({
            open: true,
            templateId: '', // 模板id
            id: record.id, // 编辑时的id
          });
          modal.destroy();
        },
        okText: '去补充',
        title: '信息提示',
        content: '您的机会点暂未填写完整，请去补充机会点信息' });
    }
  };

  // 操作编辑
  const clickEdit = (record) => {
    // 编辑
    // onClickDetail(record);
    onClickEdit(record);

  };

  /**
   * @description 加载表格数据
   */
  const loadData = async() => {
    if (!id) return;
    const data = await taskChancePointInfo({ id });
    setChancePointInfo(data);
    setIsLoading(false);
    return {
      dataSource: data?.objectList,
      count: data?.totalNum,
    };
  };

  /**
		 * @description 点击名称查看详情
		 * @param record 当前选中点击某一行的数据
		 */
  const onClickDetail = (record) => {
    setPointId(record.id); // 机会点ID
    setShowPointDetail(true); // 显示弹窗
  };
  // 直接进入机会点编辑
  const onClickEdit = (record) => {
    setFormDrawerData({
      id: record.id,
      open: true,
      templateId: '',
    });
  };

  // 打开详情页时的编辑表单的刷新详情页
  const updateHandle = () => {
    const curVal = refreshDetail + 1;
    setRefreshDetail(curVal);
  };

  const defaultColumns = [
    {
      key: 'shopImgUrls',
      title: '点位图片',
      width: 140,
      render: (value) =>
        value ? <Image
          width={108}
          height={81}
          src={value?.[0]}
        /> : <img
          src='https://staticres.linhuiba.com/project-custom/locationpc/task/icon_not_found.png'
          style={{
            width: 108,
            height: 81
          }}
        />
    },
    {
      key: 'name',
      title: '点位名称',
      width: 'auto',
      dragChecked: true,
      render: (value, record) => {
        return isNotEmptyAny(value) ? (
          <span
            className={styles.name}
            onClick={() => { onClickDetail(record); }}
          >
            {value}
          </span>
        ) : (
          '-'
        );
      },
    }, {
      key: 'address',
      title: '详细地址',
      width: 242,
      importWidth: true,
      dragChecked: true,
      render: (value) => isNotEmptyAny(value) ? value : '-',
    }, {
      key: 'statusName',
      title: '状态',
      width: 'auto',
      dragChecked: true,
      render: (value, record) => isNotEmptyAny(value) ? <span
        style={{
          color: ChancePointStatusColor[record?.status]
        }}
      >{value}</span> : '-',
    },
    {
      key: 'process',
      title: '填写进度',
      width: 'auto',
      render: (value, record) => (
        <>
          <Progress
            percent={record.requiredNum / record.requiredTotalNum * 100}
            showInfo={false}
            trailColor='#ddd'
            style={{
              width: '64px',
              marginRight: 8
            }}/>
          {record.requiredNum}/{record.requiredTotalNum}
        </>
      )
    },
    {
      key: 'processButton',
      title: '操作',
      width: 'auto',
      dragChecked: true,
      render: (value, record) => (
        value.length ? value.map((item) => (item.code === 'standardChancePoint:edit'
          ? <span className='c-244 pointer' onClick={() => clickEdit(record)}>
            {item.name}
          </span>
          : <span
            key={item.id}
            className={cs(styles.processButton, value.isComplete && styles.complete, (!isView && item.isHighlight) ? styles.highlight : styles.grayout)}
            onClick={() => clickProcessBtn(item, record)}
          >
            {item.name}
          </span>
        )) : '-'
      )
    }
  ];

  return (
    <>
      <div className={styles.pointMatching} >
        {/* <V2Title type='H2' text='匹配机会点情况' divider/> */}
        {!isView && chancePointInfo?.objectList?.length ? <span className={styles.addInfo}
          onClick={() => setShowCreateModal(true)}>+ 关联机会点</span> : <></>}
        <V2Table
          filters={filters}
          loading={false}
          rowKey='id'
          type='easy'
          pagination={false}
          defaultColumns={defaultColumns}
          hideColumnPlaceholder
          onFetch={loadData}
          className={cs(chancePointInfo?.objectList?.length ? '' : styles.hide, 'mt-12')}
        />
        {/* loading结束且没数据才会显示空状态 */}
        { chancePointInfo?.objectList?.length || isLoading ? <></> : <V2Empty
          className='mt-100'
          customTip={!isView ? <Button
            onClick={() => setShowCreateModal(true)}
            type='primary'>关联机会点</Button> : '暂无点位'}
        />
        }
      </div>

      {/* 匹配机会点 */}
      <CreatePointMatching
        id={id}
        modelClusterId={modelClusterId}
        refresh={() => {
          refresh();
          setFilters({});
        }}
        open={showCreateModal}
        setOpen={setShowCreateModal}
      />

      {/* 机会点详情 */}
      <PointDetail
        pointId={pointId}
        detailVisible={showPointDetail}
        setDetailVisible={setShowPointDetail}
        setFormDrawerData={setFormDrawerData}
        refreshDetail={refreshDetail}
        formDrawerData={formDrawerData}
        updateHandle={updateHandle}
        onSearch={() => {
          refresh();
          setFilters({});
        }}
        refreshOuter={() => {
          refresh();
          setFilters({});
        }}
      />

      {/* 完善点位评估时打开机会点编辑弹窗 */}
      <FormDrawer
        drawerData={drawerData}
        onSearch={() => {
          refresh();
          setFilters({});
        }}
        update={() => {
          refresh();
          setFilters({});
        }}
        closeHandle={() =>
          setDrawerData({
            open: false,
            templateId: '', // 模板id
            id: '', // 编辑时的id
          })
        }
      />

      {/* 提交审批弹窗 */}
      <InitiateApprovalModal
        refresh={() => {
          refresh();
          setFilters({});
        }} // 刷新
        approvalModal={approvalModal}
        setApprovalModal={setApprovalModal}
      />

    </>

  );
};

export default PointMatching;
