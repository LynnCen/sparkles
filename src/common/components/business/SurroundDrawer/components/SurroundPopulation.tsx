/**
 * @Description 周边详情-周边人群tab
 * 注意，生成图片/imageserve/attachment也用到了该组件
 */

import { FC, useEffect, useState } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import V2Empty from '@/common/components/Data/V2Empty';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { surroundPopulation } from '@/common/api/surround';
import { isNotEmpty, isDef } from '@lhb/func';
import { fixNumberSE } from '@/common/utils/ways';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd'; // Button List

const SurroundPopulation: FC<any> = ({
  fromSurroundSearch,
  lat,
  lng,
  cityId,
  address,
  isActiveTab,
  isFromImageserve // 图片服务
}) => {
  const navigate = useNavigate();
  const [list, setList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    isActiveTab && lat && lng && loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveTab]);

  const loadData = async () => {
    const tmpList = await surroundPopulation({ lat, lng, cityId, address }).finally(() => {
      setIsLoading(false);
    });
    const data = Array.isArray(tmpList) && tmpList.length ? tmpList : [];
    setList(data);
  };

  const fetchData = () => {
    return {
      dataSource: list,
      count: list.length,
    };
  };

  const jumpRecords = () => {
    navigate('/surround/history');
  };

  const defaultColumns = [
    { key: 'radius', title: '查询范围', render: (radius) => isDef(radius) ? (+radius < 1000 ? `${+radius}m` : `${fixNumberSE(radius / 1000.0)}km`) : '-' },
    { key: 'populationSize', title: '居住人口', render: (text) => isNotEmpty(text) ? `${text}万人` : '-' },
    // { key: 'populationProportion', title: '全市占比', render: (text) => isNotEmpty(text) ? `${text}%` : '-' },
  ];
  return isLoading ? <></>
    : Array.isArray(list) && !!list.length
      ? <>
        {
          isFromImageserve
            ? <Row className='mb-20'>
              <Col span={10}>
                <V2DetailItem label='查询地点' value={address} />
              </Col>
            </Row>
            : null
        }
        <V2Table
          type='easy'
          rowKey='radius'
          pagination={false}
          defaultColumns={defaultColumns}
          hideColumnPlaceholder={true}
          onFetch={fetchData}
        />
      </>
      : <div style={{ height: 315 }}>
        <V2Empty
          type='search'
          customTip={
            fromSurroundSearch ? <span>暂无数据<span className='c-006' onClick={jumpRecords}>查询历史</span></span> : '暂无数据'
          }
          centerInBlock
        />
      </div>;
};

export default SurroundPopulation;
