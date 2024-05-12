/**
 * @Description 顶部行
 */

import { FC } from 'react';
import { Typography, Tooltip } from 'antd';
import { bigdataBtn } from '@/common/utils/bigdata';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

const { Text } = Typography;

const Row: FC<any> = ({
  total,
  openList,
  setOpenList,
  targetCity,
  districtCluster, // 点击区时的数据
  setDistrictCluster,
}) => {

  return (
    <div
      className={styles.infoCon}
      onClick={() => {
        bigdataBtn('fef66ec9-d368-22a1-8be1-4f74ccd05f25', '选址地图', '推荐商圈折叠按钮', '点击推荐商圈折叠按钮');
        setOpenList(!openList);
      }}
    >
      <span>
        {
          districtCluster.data ? <Tooltip
            placement='top'
            title='返回市级列表'
          >
            <span onClick={(e) => {
              setDistrictCluster({ data: null, isBack: true });
              e.stopPropagation();
            }}>
              <IconFont
                iconHref='iconmove-down-copy'
                className={cs('c-006 fs-14 mr-4')}
              />
            </span>
          </Tooltip> : <></>
        }
        <span>
          <Text
            style={ { width: targetCity?.name?.length > 4 ? 70 : 'auto' }}
            ellipsis={ { tooltip: targetCity.name }}
            className='fs-14 c-222'
          >
            {
              districtCluster?.data?.districtName ? districtCluster.data.districtName : targetCity.name
            }
          </Text>
          为您推荐<span className={cs('c-006 bold', styles.spanSpace)}>{total}</span>个商圈
        </span>
      </span>
      <IconFont
        iconHref='pc-common-icon-a-iconarrow_down'
        className={cs('c-959', openList ? styles.arrowIconUp : styles.arrowIcon)}
      />
    </div>
  );
};

export default Row;
