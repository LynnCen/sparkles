import React from 'react';
import styles from './index.module.less';
import { Col, Row } from 'antd';
import V2Title from '@/common/components/Feedback/V2Title';
import { PageLayout } from '../../../areareport/components/Layout';
import { ChancePdfPageClass } from '../../ts-config';
import { ChanceDetailModule } from '@/common/components/business/ExpandStore/ts-config';
import { decodeTextValue } from '@/common/components/business/StoreDetail/components/DynamicDetail/config';
import { beautifyThePrice, isDef, isNotEmptyAny } from '@lhb/func';
import Property from '../Detail/Property';
interface ProjectInfoProps{
  [k:string]:any;
}
const ProjectInfo:React.FC<ProjectInfoProps> = ({ projectinfoDetail, homeData, isShowModule }) => {
  return <PageLayout
    title='项目信息'
    isUnShow={!isShowModule}
    logo={homeData?.standardChancePointReportLogo}
    // moduleCount={Number('03')}
    // totalPage={32}
    // currentPage={Number('04')}
    childClass={ChancePdfPageClass}
  >
    {isShowModule &&
 <Row gutter={[16, 32]}>
   {projectinfoDetail.map((item) => {
     if (item.moduleType === ChanceDetailModule.Overview && isNotEmptyAny(item.projectOverviewModule)) {
       return item?.projectOverviewModule?.textValue && <Col span={24} key={item.id}>
         <V2Title divider type='H2' text='项目综述' style={{ marginBottom: 16 }}/>
         <div className={styles.desc}>
           {item?.projectOverviewModule?.textValue}
           <img src='https://staticres.linhuiba.com/project-custom/locationpc/chancepoint_overview_illustration@2x.png'/>
         </div>
       </Col>;
     }
     if (item.moduleType === ChanceDetailModule.Benifit && isNotEmptyAny(item.earnEstimateModule)) {
       return <Col span={24} key={item.id}>
         <V2Title divider type='H2' text='收益预估'/>
         <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
           {
             item.earnEstimateModule.map((eran, index) => {
               const textValue = decodeTextValue(eran?.controlType, eran?.textValue);
               const count = textValue?.value; // 数字
               const unit = textValue?.suffix || ''; // 单位
               const name = eran.anotherName || eran.name; // 衡量名称
               return <Col span={12} key={index}>
                 <div className={styles.earningItem}>
                   <div className={styles.count}>
                     <span className={styles.countText}>{isDef(count) ? beautifyThePrice(Number(count), ',', 0) : '-' }</span>
                     <span className={styles.unit}>{unit}</span>
                   </div>
                   <div className={styles.description}>{name}</div>
                 </div>
               </Col>;
             })
           }

         </Row>
       </Col>;
     }
     if (item.moduleType === ChanceDetailModule.Basic && isNotEmptyAny(item.importModule)) {
       console.log();
       return <Col span={24} key={item.id}>
         <V2Title divider type='H2' text='核心信息' style={{ marginBottom: 16 }}/>
         {
           item?.importModule.map((info) => <Property item={info} key={info.id}/>)
         }
       </Col>;
     }
     return null;
   })}
 </Row>
    }


  </PageLayout>;
};

export default ProjectInfo;
