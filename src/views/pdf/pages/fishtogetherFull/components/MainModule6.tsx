import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import V2Title from '@/common/components/Feedback/V2Title';
import { replaceEmpty } from '@lhb/func';
import IconFont from '@/common/components/Base/IconFont';
const MainModule6: FC<any> = ({
  number,
  name,
  res = {}
}) => {
  return (
    <div className={cs(styles.mainModule, styles.mainModule6)}>
      <TopTitle number={number}>六、项目投资财务测算表</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <div className={styles.mainModuleTotal}>
          <V2Title type='H3' text={name} style={{ marginBottom: '10px' }}/>
          <div className={styles.moduleTotal}>
            <div className={styles.moduleTotalItem}>
              <div className={styles.totalItemBottom}>门店类别</div>
              <div className={styles.totalItemTop}>{replaceEmpty(res.info?.basicShopCategory)}</div>
            </div>
            <div className={styles.moduleTotalItem}>
              <div className={styles.totalItemBottom}>楼层属性</div>
              <div className={styles.totalItemTop}>{replaceEmpty(res.info?.basicFloor)}</div>
            </div>
            <div className={styles.moduleTotalItem}>
              <div className={styles.totalItemBottom}>价格带</div>
              <div className={styles.totalItemTop}>{replaceEmpty(res.info?.finCalcBasicPriceGroup)}</div>
            </div>
            <div className={styles.moduleTotalItem}>
              <div className={styles.totalItemBottom}>项目等级</div>
              <div className={styles.totalItemTop}>{replaceEmpty(res.info?.finCalcBasicProjectLevel)}</div>
            </div>
          </div>
        </div>
        <V2Title divider type='H3' text='商场店信息' style={{ marginBottom: '8px', marginTop: '10px' }}/>
        <table>
          <tbody>
            <tr>
              <td>面积（㎡）</td>
              <td>月租金物业费（元/㎡）</td>
              <td>月营业额</td>
              <td>外卖占比%（月单量）</td>
              <td>租售比</td>
              <td>纯利润</td>
              <td>ROI（年）</td>
              <td>投资回收耗时（月）</td>
            </tr>
            <tr>
              <td>{replaceEmpty(res.info?.basicUsableArea)}</td>
              <td>{replaceEmpty(res.info?.finCalcNewShopMonthlyRentAndProperty)}</td>
              <td>{replaceEmpty(res.info?.finCalcNewShopMonthlyTurnover)}</td>
              <td>{replaceEmpty(res.info?.finCalcNewShopDeliveryRatio)}</td>
              <td>{replaceEmpty(res.info?.finCalcNewShopRentalSalesRatio)}</td>
              <td>{replaceEmpty(res.info?.finCalcNewShopProfit)}</td>
              <td>{replaceEmpty(res.info?.finCalcNewShopShopRoi)}</td>
              <td>{replaceEmpty(res.info?.finCalcNewShopInvestmentReturnTime)}</td>
            </tr>
          </tbody>
        </table>
        <V2Title divider type='H3' text='新店指标' style={{ marginBottom: '8px', marginTop: '10px' }}/>
        <div className={cs(styles.module6Flex, 'mb-8')}>
          <table>
            <tbody>
              <tr>
                <td colSpan={4}>新店KPI</td>
              </tr>
              {
                res?.newShopKpi?.map((item, index) => {
                  return <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.standard}</td>
                    <td>{item.scope}</td>
                    <td style={{
                      background: item.judgment ? '#FFBF00' : '#F23030',
                      color: '#fff',
                    }}><IconFont iconHref={item.judgment ? 'iconIC_quan' : 'iconic_close_colour_seven'}/></td>
                  </tr>;
                })
              }
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td colSpan={3}>KPI</td>
              </tr>
              {
                res?.kpi?.map((item, index) => {
                  return <tr key={index}>
                    <td>{item.name}</td>
                    <td>{replaceEmpty(item.value)}</td>
                    <td>{item.unit}</td>
                  </tr>;
                })
              }
            </tbody>
          </table>
        </div>
        <div className={styles.module6Flex}>
          <table>
            <tbody>
              <tr>
                <td colSpan={3}>财测表</td>
              </tr>
              {
                res?.calculation?.map((item, index) => {
                  return <tr key={index}>
                    <td>{item.name}</td>
                    <td>{replaceEmpty(item.value)}</td>
                    <td>{item.rate}</td>
                  </tr>;
                })
              }
            </tbody>
          </table>
          <div>
            <table>
              <tbody>
                <tr>
                  <td colSpan={3}>装修相关</td>
                </tr>
                {
                  res?.fitment?.map((item, index) => {
                    return <tr key={index}>
                      <td>{item.name}</td>
                      <td>{replaceEmpty(item.value)}</td>
                      <td>{item.unit}</td>
                    </tr>;
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule6;
