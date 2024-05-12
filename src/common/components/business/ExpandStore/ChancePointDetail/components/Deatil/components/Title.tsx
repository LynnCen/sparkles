/**
 * @Description 标准版本-机会点详情-顶部
 * 1109 标准版数据迁移引用该组件，添加参数 hideOperate 隐藏顶部导入编辑等相关按钮
 */
import { FC, useEffect, useRef, useState, useMemo } from 'react';
import { Space, message, Button } from 'antd';
import styles from '../index.module.less';
import IconFont from '@/common/components/IconFont';
import { useMethods } from '@lhb/hook';

import {
  importChancePoint,
  exportTemplateChancePoint,
  importChancePointStatus,
  importChancePointRecords,
  // importChancePointRecords
} from '@/common/api/expandStore/chancepoint';
import { getApprovalDetail } from '@/common/api/expandStore/approveworkbench';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

import V2Operate from '@/common/components/Others/V2Operate';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { downloadFile, isArray, isNotEmpty, refactorPermissions } from '@lhb/func';
import { createApproval, revokeApproval } from '@/common/api/expandStore/approveworkbench';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2ImportModal from '@/common/components/business/V2ImportModal';
import ApprovalNodes from '@/common/components/business/ExpandStore/ApprovalNodes';
import CreateApprovalDialog from './CreateApprovalDialog';
import { ChangePonitDetailType } from '../type';
import { ApprovalType, ApprovalTypeValue, ChanceDetailModule, ChanceDetailPermission } from '@/common/components/business/ExpandStore/ts-config';
import { exportModelClusterPDFAsync } from '@/common/api/siteselectionmap';
import { CHANCEPOINT_REPORT_PDF, ChancePdfPageClass, PDFChanceModuleName } from '@/views/pdf/pages/chancepointreport/ts-config';
import { getCookie } from '@lhb/cache';
import { getPDFExportStatus } from '@/common/api/networkplan';
import HintModal from '@/common/components/Pdf/HintModal';

/** 模块组件映射关系 采用map映射方便后期维护 添加/删除 模块*/
const targetMap = {
  [ChanceDetailModule.Radar]: PDFChanceModuleName.MODULE_POINT_EVALUATION, // 点位评分
  [ChanceDetailModule.Detail]: PDFChanceModuleName.MODULE_DETAIL, // 动态表单
  [ChanceDetailModule.BusinessAreaModule]: PDFChanceModuleName.MODULE_BUSINESS_AREA, // 商圈
  [ChanceDetailModule.Basic]: PDFChanceModuleName.MODULE_PROJECT_INFO, // 核心信息
  [ChanceDetailModule.Benifit]: PDFChanceModuleName.MODULE_PROJECT_INFO, // 收益预估
  [ChanceDetailModule.Overview]: PDFChanceModuleName.MODULE_PROJECT_INFO, // 项目综述
};

/** 组件传递参数类型 */
interface TitleProps {
  detail: ChangePonitDetailType;
  setFormDrawerData;
  canEditForm: boolean; // 是否可编辑机会点详情表单
  onClose;
  updateHandle;
  saveHandle;
  refreshOuter,
  hintStr?: string;
  hideOperate? :boolean;
  titleHeightRef: any;
}

/** 标题/操作/审批 */
const Title: FC<TitleProps> = ({
  detail,
  setFormDrawerData,
  canEditForm,
  onClose,
  updateHandle,
  saveHandle,
  refreshOuter,
  hintStr,
  hideOperate = false,
  titleHeightRef,
}) => {
  const selfRef: any = useRef();
  const intervalForPdfRef: any = useRef();
  const [operateList, setOperateList] = useState<any>([]); // 按钮权限列表【导入审批表 编辑】
  const [showImportModal, setShowImportModal] = useState<boolean>(false); // 是否显示导入弹窗
  const templateAssets = [
    {
      // 数据占位符
      url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/开店计划导入模板.xlsx',
      name: '机会点模板.xlsx',
    },
  ];
  const [importModalWidth, setimportModalWidth] = useState<number>(340); // 导入组件宽度
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [approvalDetail, setApprovalDetail] = useState<any>({});
  const [approvalVisible, setApprovalVisible] = useState<boolean>(false);
  const [approvalPropertyValues, setApprovalPropertyValues] = useState<any>({});
  const isLockRef = useRef<boolean>(false);
  const [pdfDataStatus, setPdfDataStatus] = useState<any>(); // 机会点报告
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const { moduleDetails } = detail || {};
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // 过滤不展示的模块：不支持提交审批时，有配置就展示；支持审批时，模块可见时才展示
  // supportDirectApproval 是否支持直接提交审批 1:支持 2:不支持
  const moduleDetailsArray = isArray(moduleDetails) ? moduleDetails.filter((module: any) => detail.supportDirectApproval === 2 || module.isShow === 1) : [];

  const methods = useMethods({
    /* 点击 导入审批表 */
    async handleImport() {
      // 判断有没有上传历史
      await methods.getHistoy();
      setShowImportModal(true);
    },

    /*
      点击 编辑
      可在详情页内直接编辑表单时，保存表单；页面内不可编辑时，去编辑页
    */
    handleEdit() {
      if (canEditForm) {
        // saveHandle入参分别为needCheck，成功回调
        // 最终方法saveHandle在 src/common/components/business/ExpandStore/ChancePointDetail/components/Deatil/Modules/ChanceForm/index.tsx
        saveHandle(false, () => {
          V2Message.success('保存成功');
          onClose();
        });
        return;
      }
      setFormDrawerData({
        id: detail.id,
        open: true,
        templateId: '',
      });
    },

    /** 点击发起审批 */
    async handleSubmitApproval() {
      if (canEditForm) {
        // saveHandle入参分别为needCheck，成功回调
        // 最终方法saveHandle在 src/common/components/business/ExpandStore/ChancePointDetail/components/Deatil/Modules/ChanceForm/index.tsx
        saveHandle(true, (propertyValues: any) => {
          // 机会点保存成功后，执行发起处理
          setApprovalPropertyValues(propertyValues || {});
          setApprovalVisible(true);
        });
      } else {
        setApprovalVisible(true);
      }
    },
    /**
     * @description 确认提交弹框填写后提交事件
     * @param values 确认提交弹框的表单对象
     */
    async confirmApprovalDialog(values: any) {
      if (isLockRef.current) return;
      isLockRef.current = true;
      const res = await createApproval({
        id: detail.id, // 机会点id
        type: ApprovalType.ChancePoint,
        typeValue: ApprovalTypeValue.ChancePointEvaluate,
        propertyValues: approvalPropertyValues,
        ...values,
      }).finally(() => {
        isLockRef.current = false;
      });
      if (res) {
        V2Message.success('提交审批成功');
        onClose();
      }
    },

    /** 点击撤销审批 */
    async handleRevokeApproval() {
      // 一个机会点可能会被多个审批节点绑定，但是只有一项在审批中，撤销审批只撤销在【审批中 item.approvalStatus === 0】的审批
      const approvalingItem = detail?.approvalInfos.find(element => element.approvalStatus === 0); // 正在审批中的元素

      if (approvalingItem) {
        const { approvalId, approvalType, approvalTypeValue } = approvalingItem || {};
        revokeApproval({
          id: approvalId,
          relationType: approvalType,
          typeValue: approvalTypeValue,
        }).then(() => {
          V2Message.success('撤销审批成功');
          refreshOuter && refreshOuter();
          onClose();
        }).catch(() => {
          V2Message.success('撤销审批失败，请稍后再试');
        });
      }
    },

    // 导出报告
    handleReportExport: async () => {
      setIsExporting(true);
      const targetUrls = methods.getTargetUrls();
      await exportModelClusterPDFAsync({
        name: `${detail.name || ''}点位评估报告`,
        options: [
          { // 定制化模块，并合并至最终的pdf里
            url: targetUrls,
            containerClass: CHANCEPOINT_REPORT_PDF,
            childClass: ChancePdfPageClass,
          }
        ],
        type: 2, // 导出类型：1:商圈 2:机会点
        id: detail.id,
        needPageTable: true,
      }).finally(() => {
        setShowHintModal(true);
        // 轮训状态
        methods.getPDFStatus();
      });
    },

    getTargetUrls: () => {
      const token = getCookie('flow_token');
      const urls = [
        `${process.env.CONSOLE_PC_URL}/pdf/chancepointreport?id=${detail.id}&moduleName=${PDFChanceModuleName.MODULE_PRE}&token=${token}` // 首页
      ];
      let falg = false;
      // 只显示部分配置的模块
      moduleDetailsArray.forEach((item: any) => {
        if (targetMap[item.moduleType]) {
          if (falg && targetMap[item.moduleType] === PDFChanceModuleName.MODULE_PROJECT_INFO) return; // 核心信息 + 收益预估 + 项目综述只添加一次
          if (targetMap[item.moduleType] === PDFChanceModuleName.MODULE_PROJECT_INFO) {
            falg = true;
          }
          if (item.moduleType === ChanceDetailModule.BusinessAreaModule && !detail.modelClusterId) return; // 配置了商圈但是没有商圈id时不显示
          const url = `${process.env.CONSOLE_PC_URL}/pdf/chancepointreport?id=${detail.id}&moduleName=${targetMap[item.moduleType]}&token=${token}`;
          urls.push(url);
        }
      });
      // 尾页
      // urls.push(`${process.env.CONSOLE_PC_URL}/pdf/chancepointreport?id=${detail.id}&moduleName=${PDFChanceModuleName.MODULE_END}&token=${token}`);
      return urls;
    },

    // 下载报告
    handleDownload: () => {
      const { name, url } = pdfDataStatus;
      downloadFile({
        name,
        url
      });
    },

    getPDFStatus: async () => {
      const data = await getPDFExportStatus({
        id: detail.id,
        type: 2, // 1:商圈 2:机会点
      });
      // exportStatus: 1:未导出 2: 导出完成 3: 导出中
      const { exportStatus } = data;
      setPdfDataStatus(data);
      // 当前是导出中而且还未创建定时器轮训
      if (exportStatus === 3 && !intervalForPdfRef.current) {
        intervalForPdfRef.current = setInterval(() => {
          methods.getPDFStatus();
        }, 5000);
      } else if (exportStatus === 2) { // 导出完成后，清空定时器
        intervalForPdfRef.current && clearInterval(intervalForPdfRef.current);
        intervalForPdfRef.current = null;
      }
    },

    // 获取模板
    async getTemplateAssets() {
      const { url } = await exportTemplateChancePoint({ id: detail?.id });
      if (!url) return;
      // url && setTemplateAssets([{
      //   url,
      //   name: '机会点模板.xlsx'
      // }]);
      downloadFile({
        url,
        name: '机会点模板.xlsx',
      });
    },

    // 自定义逻辑
    async customUploadFetch(values, callbackFn) {
      const target = values?.url?.[0];
      if (!target) return;
      const { url, name } = target;
      const urlStr = `${url}?attname=${name}`;
      const params = { url: urlStr, excelName: name, chancePointId: detail.id };
      // importCheck(param);
      try {
        const result = await importChancePointStatus(params);
        if (result?.status === 1) {
          message.warn('当前导入的数据和上一版数据完全一致，请确认导入数据是否正确');
          callbackFn({ isError: true });
        } else {
          V2Confirm({
            onSure: () => {
              methods.importFile(params, callbackFn);
            },
            content: '当前导入的数据和上一版数据不一致，请确认导入数据是否正确',
            zIndex: 1003,
          });
        }
      } catch (e) {
        callbackFn({ isError: true });
      }
    },

    /** 上传文件 */
    importFile(params: any, callbackFn) {
      importChancePoint(params).then(
        () => {
          message.success('导入完成');
          callbackFn && callbackFn();
          updateHandle();
        },
        () => {
          callbackFn && callbackFn({ isError: true });
        }
      );
    },

    /** 获取导入历史 */
    getHistoy() {
      importChancePointRecords({ id: detail.id }).then((data: any) => {
        if (isArray(data) && data.length) {
          setHistoryData(data.splice(0, 5)); // 展示最近的5条
          setimportModalWidth(720);
          return;
        }
        setHistoryData([]);
      });
    },

    /** 获取审批详情 */
    getApprovalDetailData(target: any) {
      const { approvalId } = target;
      getApprovalDetail({ id: approvalId }).then((data) => {
        if (data && isNotEmpty(data.status) && isNotEmpty(data.statusName)) { // 审批撤销的情况下status与statusName为空，撤销情况下不需要展示审批信息
          setApprovalDetail(data);
        } else {
          setApprovalDetail({});
        }
      }).finally(() => {
        methods.getHeight();
      });
    },

    /**
     * 获取高度
     */
    getHeight: () => {
      setTimeout(() => {
        titleHeightRef.current = selfRef.current?.getBoundingClientRect()?.height || 0;
      }, 0);
    }
  });

  const showDownloadBtn = useMemo(() => {
    const { exportStatus, name, url } = pdfDataStatus || {};
    return exportStatus === 2 && name && url;
  }, [pdfDataStatus]);

  // 编辑/导入权限
  useEffect(() => {
    if (Array.isArray(detail?.permissions)) {
      // const permissions = detail.permissions.filter(
      //   (item) => item.event === 'standardChancePoint:edit' || item.event === 'standardChancePoint:import'
      // );
      if (Array.isArray(detail?.permissions) && detail?.permissions.length) {
        let refactorPerms = refactorPermissions(detail?.permissions);
        if (canEditForm) {
          // 如果可以编辑表单，将edit权限替换为保存按钮
          // refactorPerms = refactorPerms.filter((itm: any) => itm.event !== ChanceDetailPermission.Edit);
          refactorPerms = refactorPerms.map((itm: any) => itm.event === ChanceDetailPermission.Edit ? { ...itm, name: '保存' } : itm);
        }

        setOperateList(
          refactorPerms.map((item) => ({
            ...item,
            // 编辑按钮 蓝色
            type: item.event === 'edit' ? 'primary' : 'default',
          }))
        );
      }
    }
    // 判断是否有审批
    const { approvalInfos } = detail || {};
    if (isArray(approvalInfos) && approvalInfos.length) {
      const target = approvalInfos[0]; // 目前只有一种类型只需要取第一个就行
      target && methods.getApprovalDetailData(target);
    } else {
      setApprovalDetail({}); // 重置审批信息
    }
    methods.getHeight();

    detail && methods.getPDFStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  useEffect(() => {
    return () => {
      intervalForPdfRef.current && clearInterval(intervalForPdfRef.current);
      intervalForPdfRef.current = null;
    };
  }, []);

  useEffect(() => {
    const { exportStatus } = pdfDataStatus || {};
    if (exportStatus === 3) {
      setIsExporting(true);
    } else {
      setIsExporting(false);
    }
  }, [pdfDataStatus]);
  return detail ? (
    <div ref={selfRef} className={styles.detailTop}>
      {/* 点位名称以及操作按钮 */}
      <V2Title
        text={detail.name}
        extra={
          (!hideOperate
            ? <div>
              <Space>
                <V2Operate operateList={operateList} onClick={(btn) => methods[btn.func]()} />
                <Button
                  loading={isExporting}
                  disabled={pdfDataStatus?.exportStatus === 3}
                  onClick={methods.handleReportExport}
                >
                  导出报告
                </Button>
                {
                  showDownloadBtn
                    ? <span className='c-006 pointer mr-8 fs-14' onClick={methods.handleDownload}>查看报告</span> : <></>
                }
              </Space>
            </div> : <></>)
        }
      ></V2Title>
      <div className='c-f23'>{hintStr}</div>

      <V2ImportModal
        isOpen={showImportModal}
        closeModal={() => setShowImportModal(false)}
        title='导入机会点'
        modalWidth={importModalWidth}
        templateAssets={templateAssets}
        firstStepTemplateContent={
          <div className={styles.item}>
            <V2DetailItem
              type='files'
              filePreviewHide
              fileDownloadHide
              assets={templateAssets}
              rightSlot={{
                icon: <IconFont iconHref='icondownload' className='c-006' />,
                onIconClick: () => methods.getTemplateAssets(),
              }}
            />
          </div>
        }
        rightSlot={
          historyData?.length > 0 ? (
            <>
              {historyData.map((item: any, index: number) => (
                <V2DetailItem
                  key={index + item.name}
                  type='files'
                  assets={[
                    {
                      url: item.url,
                      name: item.name,
                    },
                  ]}
                />
              ))}
            </>
          ) : null
        }
        customUploadFetch={(values, callbackFn) => methods.customUploadFetch(values, callbackFn)}
      />
      {/* 当含有审批状态的时候渲染 */}
      {
        approvalDetail && Object.keys(approvalDetail).length > 0 ? <ApprovalNodes detail={approvalDetail} /> : null
        // <ApprovalTab
        //   id={detail.id}
        //   briefDetail={detail.approvalInfos}
        //   className={styles.approvalTab}
        // />
      }
      <CreateApprovalDialog
        visible={approvalVisible}
        setVisible={setApprovalVisible}
        onSubmit={methods.confirmApprovalDialog}/>
      {/* 导出弹窗提醒 */}
      <HintModal
        open={showHintModal}
        setOpen={setShowHintModal}
      />
    </div>
  ) : null;
};

export default Title;
