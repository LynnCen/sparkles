/**
 * @Description 列表
 */
import { isArray } from '@lhb/func';
import { FC, useEffect, useMemo, useState } from 'react';
import { List as ListCom } from 'antd';
import { v4 } from 'uuid'; // 用来生成不重复的key
// 以后不要再用这个第三方了，bug特别多
import VirtualList from 'rc-virtual-list';
import Item from './Item';
import V2Empty from '@/common/components/Data/V2Empty';
import styles from '../index.module.less';
import { getSourroundPois } from '@/common/api/surround';
import MapMarker from './MapMarker';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

interface Props {
  params:any;// 列表数据
  code:string; // 二级类目字段
  mainHeight?:number; // 动态高度
  _mapIns;
  icon
}

const List: FC<Props> = ({
  params,
  code,
  _mapIns,
  icon,
  mainHeight // TODO: 动态高度的获取逻辑
}) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getData();
  }, []);

  /** 获取该二级类目下的poi点位 */
  const getData = async () => {
    try {
      setLoading(true);
      const res = await getSourroundPois({
        ...params, code, size: 10000
      });
      const { objectList } = res || {};
      const listData = isArray(objectList) ? objectList.map((item: any) => ({
        ...item,
        customId: v4()
      })) : [];
      setData(listData);
    } catch (error) {
      V2Message.error('加载数据出错了,请稍候再试');
    } finally {
      setLoading(false);
    }
  };

  const dynamicHeight = useMemo(() => {
    if (mainHeight) {
      return mainHeight - 395;
    }
    return 450;
  }, [mainHeight]);

  return (
    <div>
      { isArray(data) && data.length
        ? <ListCom>
          {/* 虚拟列表 */}
          <VirtualList
            data={data}
            height={dynamicHeight}
            itemHeight={69}
            itemKey='customId'
            // onScroll={methods.onScroll} //TODO:
            className={styles.listCon}
          >
            {(item: any) => (
              // VirtualList的itemKey要和key匹配，用lng只是权宜之计
              <ListCom.Item key={item.customId}>
                <Item itemData={item}/>
              </ListCom.Item>
            )}
          </VirtualList>
        </ListCom>
        : <V2Empty className='mt-100'
          type={loading ? 'search' : 'nothing'}
          customTip={loading ? '加载中' : '暂无内容'}
        />}

      {_mapIns && <MapMarker
        icon={icon}
        data={data}
        params={params} // 经纬度，半径，围栏
        _mapIns={_mapIns}

      />}
    </div>
  );
};

export default List;
