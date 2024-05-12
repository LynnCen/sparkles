/**
 * @Description 商圈详情-顶部栏(非商场类型的商圈)
 */

import { FC, useEffect, useMemo, useState, useRef } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Typography, Tooltip } from 'antd';
import { bigdataBtn } from '@/common/utils/bigdata';
import styles from './index.module.less';
import cs from 'classnames';
import LabelRow from './LabelRow';
import DataInfoModal from './DataInfoModal';
// import TaskHistory from '@/common/components/business/ExpandStore/CircleTaskDetailDrawer/components/TaskHistory';
import Entrance from '@/views/iterate/pages/siteselectionmapb/components/CreateFavorite/Entrance';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { exportModelClusterPDFAsync } from '@/common/api/siteselectionmap';
import { downloadFile } from '@lhb/func';
import { ARE_AREPORT_CONTAINER_CLASS, AreaReportModule, ChildreClass } from '@/views/pdf/pages/areareport/ts-config';
import { getCookie } from '@lhb/cache';
// import CircleTaskCreateDrawer from '@/common/components/business/ExpandStore/CircleTaskCreateDrawer';
// import { TaskStatus } from '../../ts-config';
import IconFont from '@/common/components/IconFont';

// const dataLimit = '2023年3月'; // 目前固定数据更新日期
// import HintModal from '@/common/components/Pdf/HintModal';
const { Text } = Typography;

const Top: FC<any> = ({
  id,
  detail,
  rank,
  onLabelChanged, // 标签编辑后回调
  labelOptionsChanged,
  pdfDataStatus, // pdf状态
  getPDFStatus, // 轮训接口,
  // onRefresh, // 回调刷新商圈详情
  createTaskPermission, // 创建拓店任务按钮权限
  disabledCreateTask, // 拓店任务按钮禁用权限
  historyTaskPermission, // 拓店任务历史按钮权限
  setHistoryVisible, // 拓店任务历史
  setShowCreateDrawer, // 创建拓店任务抽屉
}) => {
  const intervalRef: any = useRef();
  const { isFavourate } = detail;
  const [openDataInfo, setOpenDataInfo] = useState(false); // 打开数据说明弹窗
  const [collectStatus, setCollectStatus] = useState(isFavourate);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  // const [showCreateDrawer, setShowCreateDrawer] = useState<boolean>(false); // 创建拓店任务是否可见
  // const [showHintModal, setShowHintModal] = useState<boolean>(false);
  // const [historyVisible, setHistoryVisible] = useState<boolean>(false); // 任务历史弹框

  // 导出权限
  const exportPermission = useMemo(() => {
    return detail?.permissions?.find((item) => item.event === 'siteselectionmapb:export');
  }, [detail?.permissions]);
  // const createTaskPermission = useMemo(() => {
  //   return detail?.permissions?.find((item) => item.event === 'expandShopDirect:create');
  // }, [detail?.permissions]);

  // const disabledCreateTask = useMemo(() => detail?.taskStatus === TaskStatus.PROCESSING, [detail?.taskStatus]);
  // const historyTaskPermission = useMemo(() => {
  //   return isArray(detail?.permissions) && refactorPermissions(detail?.permissions).find((item) => item.event === 'history');
  // }, [detail?.permissions]);

  const showDownloadBtn = useMemo(() => {
    const { exportStatus, name, url } = pdfDataStatus || {};
    return exportStatus === 2 && name && url;
  }, [pdfDataStatus]);

  useEffect(() => {
    const { exportStatus } = pdfDataStatus || {};
    if (exportStatus === 3) {
      setIsExporting(true);
      if (intervalRef.current) return; // 如果还未创建定时器说明是第一次进来
      setProgress(99);
    } else {
      setIsExporting(false);
      setProgress(0);
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [pdfDataStatus]);

  const jumpToTarget = () => {
    const { servicePlaceId } = detail;
    if (!servicePlaceId) {
      V2Message.warning('数据异常，未获取到资源id');
      return;
    }
    bigdataBtn('abcfb807-a1f8-4aaf-9db9-6ab09f9546b5', '选址地图', '商圈详情-案例及订单', '点击商圈详情-案例及订单');
    window.open(`${process.env.LINHUIBA_ADMIN}lhb-micro-pms/placeMng/detail?tenantPlaceId=${servicePlaceId}`);
    // https://lhb.lanhanba.com/#/lhb-micro-pms/placeMng/detail?tenantPlaceId=40474
  };

  const exportPDF = async() => {
    const token = getCookie('flow_token');
    const tenantId = getCookie('flow_token');
    setIsExporting(true);
    intervalRef.current = setInterval(() => {
      if (progress === 99) {
        intervalRef.current && clearInterval(intervalRef.current);
        return;
      }
      setProgress((state) => {
        if (state < 95) return state + 5;
        return 99;
      });
    }, 600);
    const params = {
      name: detail.areaName || '商圈报告',
      options: [
        { // 定制化模块，并合并至最终的pdf里
          url: [
            `${process.env.CONSOLE_PC_URL}/pdf/areareport?id=${detail.id}&moduleName=${AreaReportModule.MODULE_1}&token=${token}&tenantId=${tenantId}`,
            `${process.env.CONSOLE_PC_URL}/pdf/areareport?id=${detail.id}&moduleName=${AreaReportModule.MODULE_2}&token=${token}&tenantId=${tenantId}`,
          ],
          containerClass: ARE_AREPORT_CONTAINER_CLASS,
          childClass: ChildreClass,
        }
      ],
      type: 1, // 导出类型：1:商圈 2:机会点
      id: detail.id,
      needPageTable: true
    };
    // 接口异步下载
    await exportModelClusterPDFAsync(params).finally(() => {
      // setIsExporting(false);
      // setShowHintModal(true);
      V2Message.success('报告正在生成中...，请稍后查看');
      // 轮训状态
      getPDFStatus();
    });
  };

  const handleDownload = () => {
    const { name, url } = pdfDataStatus;
    downloadFile({
      name,
      url
    });
  };

  useEffect(() => {
    setCollectStatus(!!detail?.isFavourate);
  }, [detail]);
  return (
    <div className={styles.containerTop}>
      <div className={styles.titleRow}>
        {/* <div className='fs-20 c-222 bold'>
          {rank ? `${rank}.` : ''}
          {detail.areaName}
        </div> */}
        <Text
          style={{ width: 330 }}
          ellipsis={{ tooltip: detail.areaName }}>
          <span className='fs-20 c-222 bold'>
            {rank ? `${rank}.` : ''}
            {detail.areaName}
          </span>
        </Text>
        <div className={styles.flexCon}>
          <div className='fs-12 c-666 mr-8'>
            <span className='pr-4'>数据说明</span>
            <QuestionCircleOutlined
              className='pointer'
              onClick={() => setOpenDataInfo(true)}
            />
          </div>
          {
            detail?.orderAndCase ? <div className='mr-8'>
              <Button
                type='primary'
                onClick={jumpToTarget}
              >
              案例及订单
              </Button>
            </div> : <></>
          }
          {/* 导出商圈报告PDF */}
          {
            exportPermission
              ? <>
                {
                  showDownloadBtn
                    ? <div className='c-006 pointer mr-8 fs-14' onClick={handleDownload}>查看报告</div> : <></>
                }
                <Button
                  loading={isExporting}
                  onClick={exportPDF}
                  disabled={pdfDataStatus?.exportStatus === 3}
                  className='inline-block mr-8'
                >
                  {isExporting ? '正在' : ''}导出报告
                </Button>
              </>
              : <></>
          }
          {
            createTaskPermission && <Button
              disabled={disabledCreateTask}
              onClick={() => setShowCreateDrawer(true)}
              className='inline-block mr-8 '
            >
              {disabledCreateTask ? '任务进行中' : '发起拓店'}
            </Button>
          }
          {
            historyTaskPermission && <Tooltip title='任务历史'>
              <div
                onClick={() => setHistoryVisible(true)}
                className={cs(styles.historyBtn, 'mr-8')}>
                <IconFont iconHref='iconic_lishirenwu' className={styles.icon} />
              </div>
            </Tooltip>
          }
          <Entrance
            clusterId={id}
            collectStatus={collectStatus}
            setCollectStatus={setCollectStatus}
            eventId='5df36e4f-11df-4860-b522-e428e9b92505'
            wrapperClassName={styles.favourBtn}
            iconClassName='fs-14'
          />
          {/* 任务历史 */}
          {/* <TaskHistory
            open={historyVisible}
            setOpen={setHistoryVisible}
            id={detail.taskId}
          /> */}
        </div>
      </div>

      <LabelRow
        id={id}
        onLabelChanged={onLabelChanged}
        labelOptionsChanged={labelOptionsChanged}
      />
      {/* 数据说明弹窗 */}
      <DataInfoModal
        open={openDataInfo}
        setOpen={setOpenDataInfo}
      />
      {/* {
        showCreateDrawer && <CircleTaskCreateDrawer
          showDrawer={showCreateDrawer}
          setShowDrawer={setShowCreateDrawer}
          businessInfo={detail}
          refresh={onRefresh}
          isBusiness
        />
      } */}
      {/* 导出弹窗提醒 */}
      {/* <HintModal
        open={showHintModal}
        setOpen={setShowHintModal}
      /> */}
    </div>
  );
};

export default Top;
