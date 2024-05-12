/**
 * @Description 机会点PDF
 *
 *  query: id 机会点id
 *         moduleName 枚举值 1 | 2 | 3 ... 渲染对应的模块
 *         token
 */
import { FC, useEffect, useMemo, useState } from 'react';
import { isArray, isNotEmptyAny, urlParams } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { getChancePointDetail } from '@/common/api/expandStore/chancepoint';
import { CHANCEPOINT_REPORT_PDF, PDFChanceModuleName,
  tranformPointEvalution,
  tranformProjectInfo,
} from './ts-config';
import { chancepointReportHomeData } from '@/common/api/expandStore/chancepoint';
import { ChanceDetailModule } from '@/common/components/business/ExpandStore/ts-config';
import cs from 'classnames';
import styles from './entry.module.less';
import Home from './components/Home';
import BusinessArea from './components/BusinessArea';
import Detail from './components/Detail';
import ProjectInfo from './components/ProjectInfo';
import PointEvaluation from './components/PointEvaluation';
// import Thanks from '@/views/pdf/pages/areareport/components/Thanks';

const Chancepointreport: FC<any> = () => {
  const id = urlParams(location.search)?.id; // 商圈id
  const targetModule = +urlParams(location.search)?.moduleName; // 要渲染的模块名
  const token = urlParams(location.search)?.token; // token
  const [detail, setDetail] = useState<any>({}); // 机会点详情
  const [moduleArray, setModuleArray] = useState<any[]>([]); // 分模块数据列表，核心信息、评估预测、详情等
  const [homeData, setHomeData] = useState<any>({});

  useEffect(() => {
    if (+id) {
      loadData();
      loadHomeData();
    }
  }, [id]);

  const {
    loadData,
    loadHomeData
  } = useMethods({
    loadData: async () => { // 机会点详情
      // 结尾页不需要接口请求
      // if (targetModule === PDFChanceModuleName.MODULE_END) return;
      const data = await getChancePointDetail({
        id: +id,
        pdfPageUserToken: token,
      });
      setDetail(data);
      const { moduleDetails } = data || {};
      if (!isArray(moduleDetails)) return;
      // 过滤不展示的模块：不支持提交审批时，有配置就展示；支持审批时，模块可见时才展示
      // supportDirectApproval 是否支持直接提交审批 1:支持 2:不支持
      const modules = moduleDetails.filter((mod: any) => data.supportDirectApproval === 2 || mod.isShow === 1);
      setModuleArray(modules);
    },
    loadHomeData: async() => {
      const data = await chancepointReportHomeData({
        id,
        pdfPageUserToken: token,
      });
      data.tenantLogo = data?.standardChancePointReportLogo; // 保持和商圈报告接口的字段一致。。。
      setHomeData(data);
    },
  });
  // 是否显示项目信息
  const projectinfoData = useMemo(() => {
    if (targetModule === PDFChanceModuleName.MODULE_PROJECT_INFO) {
      const projectinfo = tranformProjectInfo(moduleArray);
      return projectinfo;
    }
    return {};

  }, [moduleArray]);
  // 是否展示点位评估
  const pointEvalutionData = useMemo(() => {
    if (targetModule === PDFChanceModuleName.MODULE_POINT_EVALUATION) {
      const pointEvalution = tranformPointEvalution(moduleArray);
      return pointEvalution;
    }
    return {};

  }, [moduleArray]);
  // 是否显示商圈模块
  const showBusinessArea = useMemo(() => {
    if (targetModule === PDFChanceModuleName.MODULE_BUSINESS_AREA) {
      return !!moduleArray.find((item) => item.moduleType === ChanceDetailModule.BusinessAreaModule) && !!detail?.modelClusterId;
    }
    return false;
  }, [moduleArray, detail]);

  /**
   * @description 详细信息模块
   */
  const detailModule = useMemo(() => {
    const target = isArray(moduleArray) ? moduleArray.find(mod => mod.moduleType === ChanceDetailModule.Detail) : {};
    return target || {};
  }, [moduleArray]);

  // 是否显示详细信息模块
  const showDynamicModule = useMemo(() => {
    if (targetModule === PDFChanceModuleName.MODULE_DETAIL) {
      return isNotEmptyAny(detailModule);
    }
    return false;
  }, [detailModule]);

  return (
    <div className={cs(styles.container, CHANCEPOINT_REPORT_PDF)}>
      { // 首页
        targetModule === PDFChanceModuleName.MODULE_PRE ? <Home
          detail={detail}
          dataInfo={homeData}
        /> : <></>
      }
      { // 项目信息
        targetModule === PDFChanceModuleName.MODULE_PROJECT_INFO &&
        <ProjectInfo
          isShowModule = { isNotEmptyAny(projectinfoData) && projectinfoData.isShowModule}
          projectinfoDetail={projectinfoData.projectInfoDetail}
          homeData={homeData}
        />
      }
      { // 点位评估
        targetModule === PDFChanceModuleName.MODULE_POINT_EVALUATION &&
        isNotEmptyAny(pointEvalutionData) &&
        pointEvalutionData.isShowModule &&
        <PointEvaluation pointEvalutionData={pointEvalutionData.pointEvalutionDetail} homeData={homeData}/>
      }
      { // 商圈
        showBusinessArea ? <BusinessArea
          detail={detail}
          token={token}
          homeData={homeData}
        /> : <></>
      }
      { // 动态表单详情
        showDynamicModule ? <Detail
          homeData={homeData}
          detail={detail}
          module={detailModule}
        /> : <></>
      }
      {/* { // 尾页
        targetModule === PDFChanceModuleName.MODULE_END ? <Thanks
          targetChildClass={ChancePdfPageClass}
          homeData={homeData}
        /> : <></>
      } */}
    </div>
  );
};

export default Chancepointreport;
