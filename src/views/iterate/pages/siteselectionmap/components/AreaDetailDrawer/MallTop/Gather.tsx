/**
 * @Description 数据说明/案例及订单/收藏
 */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// import cs from 'classnames';
import styles from './index.module.less';
import Entrance from '@/views/iterate/pages/siteselectionmapb/components/CreateFavorite/Entrance';
import DataInfoModal from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer/DataInfoModal';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { bigdataBtn } from '@/common/utils/bigdata';
import { exportModelClusterPDFAsync } from '@/common/api/siteselectionmap';
import { downloadFile } from '@lhb/func';
import { ARE_AREPORT_CONTAINER_CLASS, AreaReportModule, ChildreClass } from '@/views/pdf/pages/areareport/ts-config';
import { getCookie } from '@lhb/cache';
// import HintModal from '@/common/components/Pdf/HintModal';
import IconFont from '@/common/components/IconFont';

const Gather: FC<any> = ({
  detail,
  pdfDataStatus,
  getPDFStatus,
  createTaskPermission, // 创建拓店任务按钮权限
  disabledCreateTask, // 拓店任务按钮禁用权限
  historyTaskPermission, // 拓店任务历史按钮权限
  setHistoryVisible,
  setShowCreateDrawer,
}) => {
  const intervalRef: any = useRef();
  const { isFavourate, id } = detail;
  const [openDataInfo, setOpenDataInfo] = useState(false); // 打开数据说明弹窗
  const [collectStatus, setCollectStatus] = useState(isFavourate);
  const [progress, setProgress] = useState<number>(0);
  // const [showHintModal, setShowHintModal] = useState<boolean>(false);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  // 导出权限
  const exportPermission = useMemo(() => {
    return detail?.permissions?.find((item) => item.event === 'siteselectionmapb:export');
  }, [detail?.permissions]);

  useEffect(() => {
    setCollectStatus(!!detail?.isFavourate);
  }, [detail]);

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

  const showDownloadBtn = useMemo(() => {
    const { exportStatus, name, url } = pdfDataStatus || {};
    return exportStatus === 2 && name && url;
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
    const token = getCookie('flow_token');
    const tenantId = getCookie('flow_token');
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
      type: 1,
      id: detail.id,
      needPageTable: true
    };

    await exportModelClusterPDFAsync(params).finally(() => {
      // setShowHintModal(true);
      V2Message.success('报告正在生成中...，请稍后查看');
      // 轮训状态
      getPDFStatus();
      // setIsExporting(false);
    });
  };
  const handleDownload = () => {
    const { name, url } = pdfDataStatus;
    downloadFile({
      name,
      url
    });
  };
  return (
    <>
      <div className={styles.gatherCon}>
        <div className={styles.targetOffset}>
          <div className='fs-12 c-666 mr-8'>
            <span className='pr-4'>数据说明</span>
            <QuestionCircleOutlined
              className='pointer'
              onClick={() => setOpenDataInfo(true)}
            />
          </div>
          {
            detail?.orderAndCase ? <div
              className='pointer c-006 fs-14'
              onClick={jumpToTarget}
            >
              案例及订单
            </div> : <></>
          }
        </div>
        {/* 导出商圈报告PDF */}
        {
          exportPermission
            ? <>
              {
                showDownloadBtn
                  ? <div className='c-006 pointer mr-8 fs-14' onClick={handleDownload}>查看报告</div>
                  : <></>
              }
              <Button
                // loading={isExporting}
                disabled={pdfDataStatus?.exportStatus === 3}
                onClick={exportPDF}
                className='inline-block mr-8'
              >
                导出{isExporting ? '中' : '报告'} {
                  isExporting ? <span className='pl-4' style={{
                    display: 'inline-block',
                    width: '38px'
                  }}>{progress}%</span> : <></>
                }
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
            <Button
              onClick={() => setHistoryVisible(true)}
              className='mr-8'>
              <IconFont iconHref='iconic_lishirenwu' className={styles.icon} />
            </Button>
          </Tooltip>
        }
        <Entrance
          clusterId={id}
          collectStatus={collectStatus}
          setCollectStatus={setCollectStatus}
          wrapperClassName={styles.iconCon}
          iconClassName={styles.icon}
        />
      </div>
      <DataInfoModal
        open={openDataInfo}
        setOpen={setOpenDataInfo}
      />
      {/* 导出弹窗提醒 */}
      {/* <HintModal
        open={showHintModal}
        setOpen={setShowHintModal}
      /> */}
    </>
  );
};

export default Gather;
