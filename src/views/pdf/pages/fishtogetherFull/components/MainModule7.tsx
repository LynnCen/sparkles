import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import V2Title from '@/common/components/Feedback/V2Title';
import { replaceEmpty } from '@lhb/func';
const MainModule7: FC<any> = ({
  number,
  res = {}
}) => {
  return (
    <div className={cs(styles.mainModule, styles.mainModule7)}>
      <TopTitle number={number}>七、基础信息</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <V2Title divider type='H3' text='商圈信息' style={{ marginBottom: '10px' }}/>
        <table>
          <tbody>
            <tr>
              <td>所在商圈层级</td>
              <td>{replaceEmpty(res?.bizDistrict?.rptBizBusinessDistrictRating)}</td>
              <td className={styles.tdBase}>500米范围内是否有地铁</td>
              <td>{replaceEmpty(res?.bizDistrict?.rptBizSubwayWithin)}</td>
              <td className={styles.tdBase2}>地铁与商铺或商场实际步行距离</td>
              <td>{replaceEmpty(res?.bizDistrict?.rptBizActualWalkingDistance)}</td>
              <td className={styles.tdBase3}>影院票房万元</td>
              <td>{replaceEmpty(res?.bizDistrict?.rptBizCinemaBoxOffice)}</td>
            </tr>
            <tr>
              <td>500米内销售推动要素</td>
              <td colSpan={7}>{replaceEmpty(res?.bizDistrict?.rptBizSalesDrivingFactors)}</td>
            </tr>
            <tr>
              <td>200米范围内客单价高于25快餐品牌数量</td>
              <td colSpan={7}>{replaceEmpty(res?.bizDistrict?.rptBizFastFoodBrandsHigherNumber)}</td>
            </tr>
            <tr>
              <td>200米范围内鱼类快餐品牌名称及客单价</td>
              <td colSpan={7}>{replaceEmpty(res?.bizDistrict?.rptBizBrandUnitPrice)}</td>
            </tr>
          </tbody>
        </table>
        <V2Title divider type='H3' text='商场店信息' style={{ marginBottom: '10px', marginTop: '10px' }}/>
        <table>
          <tbody>
            <tr>
              <td className={styles.tdBase2}>位置评级</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallLocationRating)}</td>
              <td className={styles.tdBase8}>商场名称</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallMallName)}</td>
              <td className={styles.tdBase9}>店面地址</td>
              <td colSpan={3}>{replaceEmpty(res?.mallInfo?.basicMallStoreAddress)}</td>
            </tr>
            <tr>
              <td className={styles.tdBase2}>运营商运营能力</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallOperatorOperationCapability)}</td>
              <td className={styles.tdBase8}>商场定位</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallShoppingMallPositioning)}</td>
              <td className={styles.tdBase9}>招商负责人联系方式</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallInvestmentPromotionTelephone)}</td>
              <td className={styles.tdBase}>商业体量商业面积万m²</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallCommercialVolume)}</td>
            </tr>
            <tr>
              <td className={styles.tdBase2}>商店是否已经开业</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallWhetherToOpenOrNot)}</td>
              <td className={styles.tdBase8}>商场整体开业时间</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallOpeningTime)}</td>
              <td className={styles.tdBase9}>所在商场周边3公里内人气或竞争排名</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallCompetitivenessRanking)}</td>
              <td className={styles.tdBase}>商场周中及周末人流量预估</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallEstimationOfHumanFlow)}</td>
            </tr>
            <tr>
              <td className={styles.tdBase2}>门头宽度尺寸</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallHeadWidth)}</td>
              <td className={styles.tdBase8}>主入口宽度尺寸</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallMainEntranceWidth)}</td>
              <td className={styles.tdBase9}>层高</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallStoreyHeight)}</td>
              <td className={styles.tdBase}>人流主动线</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallFlowLinePosition)}</td>
            </tr>
            <tr>
              <td className={styles.tdBase2}>是否在通往聚客点的强制动线上</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallForcedLine)}</td>
              <td className={styles.tdBase8}>可视性评估</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallVisibilityEvaluation)}</td>
              <td className={styles.tdBase8}>接近性评估</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallProximityEvaluation)}</td>
              <td className={styles.tdBase9}>在本楼其他快餐品牌日营业额</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallDailyTurnoverOfOtherFastFoodBrands)}</td>
            </tr>
            <tr>
              <td className={styles.tdBase}>品牌存活率</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallBrandSurvivalRate)}</td>
              <td className={styles.tdBase2}>商场规划餐饮品牌酸菜鱼是否有品类保护</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallCategoryProtection)}</td>
              <td className={styles.tdBase8}>商场的开业率</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallOpeningRate)}</td>
              <td className={styles.tdBase9}>新商场目前的招商率及计划开业率</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallInvestmentRate)}</td>
            </tr>
            <tr>
              <td className={styles.tdBase2}>室内广告</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallIndoorAdvertisingSpace)}</td>
              <td className={styles.tdBase8}>商场户外广告位</td>
              <td>{replaceEmpty(res?.mallInfo?.basicMallOutdoorAdvertisingSpace)}</td>
              <td className={styles.tdBase9}>停车位数量</td>
              <td colSpan={3}>{replaceEmpty(res?.mallInfo?.basicMallNumberOfParkingSpaces)}</td>
            </tr>
          </tbody>
        </table>
        <V2Title divider type='H3' text='文件确认' style={{ marginBottom: '10px', marginTop: '10px' }}/>
        <table>
          <tbody>
            <tr>
              <td className={styles.tdBase7}>房产证</td>
              <td>{replaceEmpty(res?.files?.rptFileHouseCertificate)}</td>
              <td className={styles.tdBase7}>是否核实过产权证</td>
              <td>{replaceEmpty(res?.files?.rptFilePropertyCertificate)}</td>
              <td className={styles.tdBase6}>合同甲方是大房东还是二房东</td>
              <td>{replaceEmpty(res?.files?.rptFileIsSecondLandlord)}</td>
              <td className={styles.tdBase3}>房屋有无抵押</td>
              <td>{replaceEmpty(res?.files?.rptFilePropertyMortgaged)}</td>
            </tr>
            <tr>
              <td className={styles.tdBase7}>大房东转租同意函/二房东是否有转租权</td>
              <td>{replaceEmpty(res?.files?.rptFileLetterLandlord)}</td>
              <td>是否可以新办营业执照及卫生许可证</td>
              <td className={styles.tdBase6}>{replaceEmpty(res?.files?.rptFileNewBusinessLicense)}</td>
              <td>商家商户是否工商注销，如未注销何时注销</td>
              <td colSpan={3}>{replaceEmpty(res?.files?.rptFileBusinessRegistrationCancel)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule7;
