/**
 * @Description 机会点详情-周边信息入口
 */
import { FC, useState } from 'react';
import IconFont from '@/common/components/IconFont';
import SurroundDrawer from '@/common/components/business/SurroundDrawer';
import styles from './index.module.less';
import cs from 'classnames';
import { isDef } from '@lhb/func';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

interface SurroundProps {
  detail: any; // 点位详情、或机会点详情
  className?: string;
}

const SURROUND_RADIUS = 1000; // 机会点周边固定半径范围为1km

const Surround: FC<SurroundProps> = ({
  detail,
  className,
}) => {
  const [aroundVisible, setAroundVisible] = useState<boolean>(false);

  const onViewDetail = () => {
    if (isDef(detail.lat) && isDef(detail.lng)) {
      setAroundVisible(true);
    } else {
      V2Message.warning('经纬度数据缺失，无法查看');
    }
  };

  return (
    <>
      <div className={cs(styles.surroundInfo, className)} onClick={onViewDetail}>
        <div className={styles.imageBox}><img src='https://staticres.linhuiba.com/project-custom/custom-flow/ic_surround_entrace.png'/></div>
        <div className={cs(styles.desc, 'ml-16 bg-fff')}>
          <div className='fs-12 c-222'>综合分析周边环境，查看详细信息</div>
          <div className='fs-12 c-666 mt-6'>潜客人群的分布、商场超市等商业分布、地铁公交停车场、周边人群、城市信息</div>
        </div>
        <IconFont iconHref='iconarrow-right' className='fs-12 c-999 ml-16' />
      </div>
      <SurroundDrawer
        inputDetail={{
          lat: detail.lat,
          lng: detail.lng,
          radius: SURROUND_RADIUS, // 半径米
          // name对应组件内的查询地点，从外部传入的时候注意入口有很多地方，这里可能需要手动构造；鱼你取chancePointName，标准版取name
          name: detail.chancePointName || detail.name || detail.shopAddress || detail.address,
          cityId: detail.cityId,
          cityName: detail.cityName,
          // address字段，鱼你取shopAddress，标准版取address
          address: detail.shopAddress || detail.address,
          poiSearchType: 1, // 1圆形 2多边形
          borders: [], // 多边形时才用到
          area: Math.PI * (SURROUND_RADIUS / 1000.0) * (SURROUND_RADIUS / 1000.0), // 面积：平方千米
        }}
        open={aroundVisible}
        setOpen={setAroundVisible}/>
    </>
  );
};

export default Surround;
