/**
 * @Description 标题行
 */
import { FC, useMemo } from 'react';
import { Typography } from 'antd';
import { isNotEmpty } from '@lhb/func';
import { leftIcon } from '@/views/recommend/pages/detail/ts-config';
import { fixNumber } from '@/common/utils/ways';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import { businessStatus } from '../../../ts-config';

const { Text } = Typography;
const Title: FC<any> = ({
  mapIns,
  listRef,
  item,
  index,
  listData,
  // itemData,
  setItemData,
}) => {
  const showRank = useMemo(() => {
    const { rank } = item;
    if (+rank) {
      return +rank + 1;
    }
    return '';
  }, [item]);
  const endExpandChange = () => {
    item.isFrontEndExpanded = !item.isFrontEndExpanded;
    listRef.current && listRef.current.resetAfterIndex(index);
    setItemData({
      visible: item.isFrontEndExpanded, // 是否显示详情
      id: item.isFrontEndExpanded ? item?.id : null,
      detail: item.isFrontEndExpanded ? item : null, // 存放详情相关字段
      isFirst: false
    });
    if (item.isFrontEndExpanded) {
      const { lng, lat } = item;
      mapIns && +lng && +lat && mapIns.setZoomAndCenter(17, [+lng, +lat], false, 100);
    }
    // }
    // 将其余项收起
    const len = listData.length;
    for (let i = 0; i < len; i++) {
      if (i !== index && listData[i]?.isFrontEndExpanded) {
        listData[i].isFrontEndExpanded = false;
        listRef.current.resetAfterIndex(i);
      }
    }

  };

  return (
    <div
      className={styles.titRow}
      onClick={endExpandChange}
    >
      {/* <Text
        style={ { width: isNotEmpty(item?.distance) ? 160 : 220 }}
        ellipsis={ { tooltip: item?.areaName }}
        className='c-132 bold fs-14'
      >
        <div className={styles.leftSection}>
          <div>
            {
              item?.rank < 3 ? <div className={styles.topImg}>
                <img
                  src={leftIcon[item.rank].url}
                  width='100%'
                  height='100%'
                />
              </div> : <div className={cs(
                'c-132 bold fs-14',
                showRank ? 'pr-2 pl-4' : '')
              }
              >
                {showRank}{showRank ? '.' : ''}
              </div>
            }
          </div>
          <div className='ml-5'>
            {item?.areaName || '-'}
          </div>
        </div>
      </Text> */}
      <div className={cs(
        styles.leftSection,
        isNotEmpty(item?.distance) ? styles.short : ''
      )}
      >
        <div>
          {
            item?.status === businessStatus.NEW ? <span className={styles.newCreate}>新增</span>
              : item?.rank < 3 ? <div className={styles.topImg}>
                <img
                  src={leftIcon[item.rank].url}
                  width='100%'
                  height='100%'
                />
              </div> : <div className={cs(
                'c-132 bold fs-14',
                showRank ? 'pr-2 pl-4' : '')
              }
              >
                {showRank}{showRank ? '.' : ''}
              </div>
          }
        </div>
        <Text
          ellipsis={ { tooltip: item?.areaName }}
          className={'c-132 bold fs-14 ml-5'}
        >
          {item?.areaName || '-'}
        </Text>
        {/* <div className='ml-5'>
            {item?.areaName || '-'}
          </div> */}
      </div>
      {
        isNotEmpty(item?.distance)
          ? <Text
            style={ { width: 65 }}
            // ellipsis={ { tooltip: item?.areaName }}
            ellipsis={ { tooltip: `${fixNumber(item?.distance / 1000)}km` }}
            className='c-666 ml-10 fs-12'
          >
            <IconFont iconHref='icon-ui-lib-dingwei1'/>
            <span className='pl-2'>{ `${fixNumber(item?.distance / 1000)}km` }</span>
          </Text> : <></>
      }
      <div className={cs('ml-4', styles.rightSection)}>
        <IconFont
          iconHref='pc-common-icon-a-iconarrow_down'
          className={cs(item?.isFrontEndExpanded ? styles.arrowIconUp : styles.arrowIcon, 'c-959 fs-12')}
        />
      </div>
    </div>
  );
};

export default Title;
