

import { FC, useMemo } from 'react';
import IconFont from '@/common/components/Base/IconFont';

import styles from './index.module.less';
import { HomeConfigChildrenModuleEnum } from '../../ts-config';
import { isNotEmpty, replaceEmpty } from '@lhb/func';

const Card:FC<any> = ({
  data = {}
}) => {

  const iconHref = useMemo(() => {

    switch (data.id) {
      case HomeConfigChildrenModuleEnum.ADD_OPPORTUNITIES:
        return 'iconadd_opportunities';
      case HomeConfigChildrenModuleEnum.ADD_NEW_STORE_EXPANSION_TASKS:
        return 'iconadd_new_store_expansion_tasks';
      case HomeConfigChildrenModuleEnum.ADD_NEW_FRANCHISEE:
        return 'iconadd_new_franchisee';
      case HomeConfigChildrenModuleEnum.ADD_NUMBER_OF_NEW_OPENINGS:
        return 'iconadd_number_of_new_openings';
      case HomeConfigChildrenModuleEnum.NUMBER_OF_OPPORTUNITY_POINTS_PASSED:
      case HomeConfigChildrenModuleEnum.OPPORTUNITY_POINT_PASS_RATE:
        return 'iconnumber_of_opportunity_points_passed';
      case HomeConfigChildrenModuleEnum.POINT_EVALUATION_PASS_NUMBER:
      case HomeConfigChildrenModuleEnum.POINT_ASSESSMENT_PASS_RATE:
        return 'iconpoint_evaluation_pass_number';
      case HomeConfigChildrenModuleEnum.NUMBER_OF_STORES_LOCATED:
        return 'iconnumber_of_stores_located';
      case HomeConfigChildrenModuleEnum.AVERAGE_PLACEMENT_PERIOD:
        return 'iconaverage_placement_period';

      default:
        return 'iconadd_opportunities';
    }

  }, [data.id]);

  return <div className={styles.cardCon}>
    <div className={styles.leftCon}>
      <IconFont
        iconHref={iconHref}
        style={{ width: '48px', height: '48px' }} />
    </div>
    <div className={styles.rightCon}>
      <div className={styles.title}>
        {replaceEmpty(data.name)}
      </div>
      <div className={styles.content}>
        <div className={styles.count}> {replaceEmpty(data.value)}</div>
        {isNotEmpty(data?.extraValue) && <div className={styles.description}>累计<span>{replaceEmpty(data.extraValue)}</span></div>}
      </div>
    </div>
  </div>;
};

export default Card;
