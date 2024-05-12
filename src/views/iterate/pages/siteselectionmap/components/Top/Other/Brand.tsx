/**
 * @Description 本品牌
 */

import { FC, useEffect, useMemo, useState } from 'react';
import { Checkbox, Typography, Tooltip } from 'antd';
import { formatUnitTenThousand } from '@/common/utils/ways';
import { isArray } from '@lhb/func';
import { storePointCountStandard } from '@/common/api/storemap';
// import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import OwnBrandDistributionInMap from '@/common/components/business/OwnBrandDistributionInMap';

const { Text } = Typography;
const Brand: FC<any> = ({
  mapIns, // 地图实例
  mapHelpfulInfo
}) => {
  const { city } = mapHelpfulInfo;
  const [listData, setListData] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // 选中项
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false); // 全选

  useEffect(() => {
    if (city?.id) {
      loadData();
    }
  }, [city?.id]);

  // 默认设置全部选中
  // useEffect(() => {
  //   if (isArray(listData) && listData.length) {
  //     onCheckAllChange({
  //       target: {
  //         checked: true
  //       }
  //     });
  //     return;
  //   }
  //   setSelectedIds([]);
  //   setIndeterminate(false);
  //   setCheckAll(false);
  // }, [listData]);

  const dataIds = useMemo(() => {
    return listData.map((item) => item.id);
  }, [listData]);

  const loadData = async () => {
    const params = {
      provinceId: city.provinceId,
      cityId: city.id
    };
    const res = await storePointCountStandard(params);
    const data = isArray(res) ? res : [];
    setListData(data);
  };
  // 全选
  const onCheckAllChange = (e: any) => {
    const { checked } = e?.target || {};
    setSelectedIds(checked ? dataIds : []);
    setIndeterminate(false);
    setCheckAll(checked);
  };
  // 监听复选框的变化
  const onChange = (ids: number[]) => {
    setSelectedIds(ids);
    setIndeterminate(!!ids?.length && (ids?.length < dataIds?.length));
    setCheckAll(ids?.length === dataIds?.length);
  };

  return (
    <>
      {
        isArray(listData) && listData.length > 0
          ? <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
            className='mt-8'
          >
          全部
          </Checkbox>
          : <></>
      }
      <Checkbox.Group
        value={selectedIds}
        onChange={(ids: any[]) => onChange(ids)}
      >
        {
          isArray(listData) && listData.length > 0
            ? <>
              {
                listData.map((item: any) => <div key={item.id} className='mt-8'>
                  <Checkbox value={item.id}>
                    <IconFont
                      iconHref='iconic_mendian'
                      style={{
                        color: item.color,
                      // marginTop: '5px'
                      }}
                    />
                    <span className={styles.inlineFlex}>
                      <Text
                        style={ { width: 90 }}
                        ellipsis={ { tooltip: item.name }}
                        className='pl-4'
                      >
                        {item.name}
                      </Text>
                      {/* <span className='pl-4 fs-14'>{ item.name }</span> */}
                      <Tooltip
                        placement='top'
                        overlayInnerStyle={{
                          fontSize: '12px'
                        }}
                        title={item.comment || ''}>
                        <span>
                          <IconFont
                            iconHref='iconquestion-o'
                            className='fs-14 c-999' />
                        </span>
                      </Tooltip>
                    </span>
                    <span className='pl-4 c-bbc'>|</span>
                    <span className='pl-4 fs-12'>
                      {formatUnitTenThousand(item.count)}
                    </span>
                  </Checkbox>
                </div>
                )
              }
            </>
            : <></>
        }
      </Checkbox.Group>

      <OwnBrandDistributionInMap
        mapIns={mapIns}
        checkedIds={selectedIds}
        cityInfo={city}
      />
    </>
  );
};

export default Brand;
