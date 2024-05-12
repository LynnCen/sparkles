import { FC, useEffect, useState } from 'react';
import { showTargetChart } from '@/common/utils/ways';
import styles from './entry.module.less';
import IconFont from '@/common/components/IconFont';
import Header from './Header';
import DoubleCircle from './DoubleCircle';
import cs from 'classnames';

const Catalog: FC<any> = ({
  detailInfo,
  name,
  isIntegration
}) => {
  const [data, setData] = useState<Array<any>>([]);
  useEffect(() => {
    const defaultData = [
      {
        name: '商圈评估概览',
        children: ['商圈评估']
      },
      {
        name: '城市市场评估',
        children: [
          '城市概况',
          '经济概况',
          '商业概况',
          '交通概况',
        ]
      },
      {
        name: '商业氛围评估',
        children: [
          // '餐饮业态',
          // '购物业态',
          // '机构业态',
          // '休闲业态',
          // '服务业态'
        ]
      },
      {
        name: '客群客流评估',
        children: [
          '客流概况',
          // '客群概括',
          // '客群消费水平',
          // '客群偏好'
        ]
      },
      {
        name: '交通便利评估',
        children: ['交通概况']
      },
    ];
    const { situation, preference } = detailInfo;
    if (Object.keys(situation).length) { // 商业氛围
      const { catering, shopping, agency, leisure, service } = situation;
      showTargetChart(catering) && defaultData[2].children.push('餐饮业态');
      showTargetChart(shopping) && defaultData[2].children.push('购物业态');
      showTargetChart(agency) && defaultData[2].children.push('机构业态');
      showTargetChart(leisure) && defaultData[2].children.push('休闲业态');
      showTargetChart(service) && defaultData[2].children.push('服务业态');
    }
    if (Object.keys(preference).length) { // 客群客流
      const { sex, education, age, childrenAge, industry, consumption, housePrice, visiting, app } = preference;
      (showTargetChart(sex) || showTargetChart(education) || showTargetChart(age) || showTargetChart(childrenAge) || showTargetChart(industry)) && defaultData[3].children.push('客流画像');

      (showTargetChart(consumption) || showTargetChart(housePrice)) && defaultData[3].children.push('客流消费水平');
      (showTargetChart(visiting) || showTargetChart(app)) && defaultData[3].children.push('客群偏好');
    }
    setData(defaultData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailInfo]);

  return (
    <div className={cs(styles.catalogCon, isIntegration && styles.integration)}>
      <Header name={name}/>
      <div className={styles.mainCon}>
        {
          data.map((item: any, index: number) => (
            <div key={index} className={styles.catalogItemCon}>
              <div className='fs-24 bold'>
                {item.name}
              </div>
              {
                item.children.map((child: string, keyIndex: number) => (
                  <div key={keyIndex} className='mt-12 fs-14'>
                    <IconFont
                      iconHref='iconcaret-bottom'
                      className={styles.triangleArrow}/>
                    {child}
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
      <DoubleCircle/>
    </div>
  );
};

export default Catalog;
