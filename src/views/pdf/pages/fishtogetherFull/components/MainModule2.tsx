import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import V2Title from '@/common/components/Feedback/V2Title';
import Item from './Base/Item';
import { replaceEmpty } from '@lhb/func';
import { imgUrlSuffix } from '../ts-config';

const MainModule2: FC<any> = ({
  number,
  res = {}
}) => {
  return (
    <div className={cs(styles.mainModule, styles.mainModule2)}>
      <TopTitle number={number}>二、加盟商信息</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <V2Title divider type='H3' text='加盟商基本信息' style={{ marginBottom: '10px' }}/>
        <table>
          <tbody>
            <tr>
              <td>客户类别</td>
              <td>{replaceEmpty(res.category)}</td>
              <td className={styles.tdBase}>授权号</td>
              <td>{replaceEmpty(res.franchiseeNo)}</td>
              <td className={styles.tdBase}>姓名</td>
              <td>{replaceEmpty(res.franchiseeName)}</td>
              <td className={styles.tdBase}>加盟日期</td>
              <td>{replaceEmpty(res.franchiseeDate)}</td>
            </tr>
            <tr>
              <td>从事过的行业</td>
              <td>{replaceEmpty(res.workedIndustry)}</td>
              <td className={styles.tdBase}>年龄</td>
              <td>{replaceEmpty(res.franchiseeAge)}</td>
              <td className={styles.tdBase}>加盟商万元</td>
              <td>{replaceEmpty(res.franchiseeAmount)}</td>
              <td className={styles.tdBase}>地址缴费情况</td>
              <td>{replaceEmpty(res.evaluationAmount)}</td>
            </tr>
            <tr>
              <td>店面类型</td>
              <td>{replaceEmpty(res.shopCategory)}</td>
              <td className={styles.tdBase}>加盟商实际投资能力</td>
              <td>{replaceEmpty(res.investmentAbility)}</td>
              <td className={styles.tdBase}>运营能力评估</td>
              <td>{replaceEmpty(res.operationalAbility)}</td>
              <td className={styles.tdBase}>状态</td>
              <td>{replaceEmpty(res.customerType)}</td>
            </tr>
            <tr>
              <td>《选址服务告知书》确认情况</td>
              <td>{replaceEmpty(res.notificationConfirm)}</td>
              <td className={styles.tdBase}>该城市累计落位数量</td>
              <td>{replaceEmpty(res.count)}</td>
              <td className={styles.tdBase}>提报日期</td>
              <td>{replaceEmpty(res.reportedAt)}</td>
              <td className={styles.tdBase}>是否符合区域保护</td>
              <td>{replaceEmpty(res.isProtected)}</td>
            </tr>
            <tr>
              <td>该城市的营业门店总数</td>
              <td>{replaceEmpty(res.shopCount)}</td>
              <td className={styles.tdBase}>是否首店</td>
              <td>{replaceEmpty(res.isFirstShop)}</td>
              <td className={styles.tdBase}>风险认知</td>
              <td colSpan={3}>{replaceEmpty(res.riskKnowledge)}</td>
            </tr>
            <tr>
              <td>加盟商看过的点位</td>
              <td colSpan={7}>{replaceEmpty(res.seenPoints)}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.module2Bottom}>
          <div className={styles.conLeft}>
            <V2Title divider type='H3' text='客户项目认知' style={{ marginBottom: '10px' }}/>
            <Item className='mb-10' label='客户项目认知'>{replaceEmpty(res.knowledge)}</Item>
            <Item className='mb-10' label='是否明确告知客户该商业有过经营失败的门店（有则展示）：'>{res.failedConfirmed || '无'}</Item>
            {
              res.confirmedRecord && <img src={`${res.confirmedRecord}${imgUrlSuffix.size220}`} alt='' />
            }
          </div>
          <div className={styles.conRight}>
            <V2Title divider type='H3' text='沟通记录' style={{ marginBottom: '10px' }}/>
            {res.meetingRecords?.length ? res.meetingRecords?.slice(0, 5).map((item, index) => {
              return <div key={index} className={cs(styles.conRightFlex, 'mb-16')}>
                <div className={styles.conFlexLeft}>
                  <Item label={`第 ${index + 1} 次沟通时间：`}>{item.meetAt}</Item>
                </div>
                <div className={styles.conFlexRight}>
                  <Item label='沟通内容'>{item.content}</Item>
                </div>
              </div>;
            }) : '暂无'}
          </div>
        </div>
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule2;
