/**
 * @Description 点位
 */

import { FC, Fragment, useEffect, useState } from 'react';
import { getAreaPoints } from '@/common/api/siteselectionmap';
import { isArray } from '@lhb/func';
import { bigdataBtn } from '@/common/utils/bigdata';
import V2Title from '@/common/components/Feedback/V2Title';
import IconFont from '@/common/components/IconFont';
import PointItem from './PointItem';
import SpotListModal from '@/views/iterate/pages/siteselectionmapb/components/CollectDrawer/SpotListModal';


const ShopOfPoints: FC<any> = ({
  num, // 个数
  clusterId, // 商圈id
  pointDrawerData,
  setPointDrawerData, // 点位抽屉开关
}) => {
  const [list, setList] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any>({
    visible: false,
    // size: 20,
    modelClusterId: '',
  });
  useEffect(() => {
    num && getList();
  }, [num]);

  useEffect(() => {
    // 打开点位列表后关闭时，需要更新下列表
    const { visible } = modalData;
    if (!visible && num > 3) {
      getList();
    }
  }, [modalData]);

  useEffect(() => {
    const { open } = pointDrawerData || {};
    // 关闭点位详情时，更新下列表
    if (!open && num) {
      getList();
    }
  }, [pointDrawerData]);

  const getList = async () => {
    const params = {
      page: 1,
      size: 3,
      modelClusterId: clusterId
    };
    const { objectList } = await getAreaPoints(params);
    setList(isArray(objectList) ? objectList : []);
    // setList(isArray(locations) && locations.length ? locations : [
    //   {
    //     id: 1,
    //     name: 'demo-data-余杭-西溪八方城',
    //     isFavourate: false,
    //     introduction: '阿圣诞节开发束带结发卡萨收到罚款水电费阿萨德看法哦我饿漂浮物额发吗撒大声地发你代发说法',
    //     floor: '3层',
    //     locationType: '多经点位',
    //     area: 3,
    //     openTime: '08:00-22:00',
    //     dayFlow: 2000,
    //     holidayFlow: 4233,
    //     pic: 'https://img.linhuiba.com/FlNf0HPvpJgdR2QwWZUCL3xRQKKx-linhuibaoriginal.jpg',
    //   },
    //   {
    //     id: 2,
    //     name: 'demo-data-余杭-西溪八方城',
    //     isFavourate: false,
    //     introduction: '阿圣诞节开发束带结发卡萨收到罚款水电费阿萨德看法哦我饿漂浮物额发吗撒大声阿萨德烤炉发斯蒂芬时代峰峻阿斯蒂芬就阿斯对哦分地发你代发说法',
    //     floor: '3层',
    //     locationType: '多经点位',
    //     area: 3,
    //     openTime: '08:00-22:00',
    //     dayFlow: 2000,
    //     holidayFlow: 4233,
    //     pic: 'https://img.linhuiba.com/FlNf0HPvpJgdR2QwWZUCL3xRQKKx-linhuibaoriginal.jpg',
    //   },
    //   {
    //     id: 3,
    //     name: 'demo-data-余杭-西溪八方城',
    //     isFavourate: false,
    //     introduction: '阿圣诞节开发束带结发卡萨收到罚款水电费阿萨德看法哦我饿漂浮物额发吗撒大声地发你代发说法',
    //     floor: '3层',
    //     locationType: '多经点位',
    //     area: 3,
    //     openTime: '08:00-22:00',
    //     dayFlow: 2000,
    //     holidayFlow: 4233,
    //     pic: 'https://img.linhuiba.com/FlNf0HPvpJgdR2QwWZUCL3xRQKKx-linhuibaoriginal.jpg',
    //   },
    // ]);
  };
  const handleMore = () => {
    bigdataBtn('277af25e-24ac-4520-9215-c6afc2d66fbd', '选址地图', '列表-点位数', '点击列表-点位数');
    setModalData((state) => ({
      ...state,
      visible: true,
      modelClusterId: clusterId
    })
    );
  };

  return (
    <div className='mt-24'>
      <V2Title
        divider
        type='H2'
        text={`场地点位（${num}）`}
        extra={
          num > 3 ? <IconFont iconHref='iconic_next_black_seven' onClick={handleMore}/> : <></>
        }
      />
      {
        list.map((item: any, index: number) => <Fragment key={index}>
          <PointItem
            item={item}
            clusterId={clusterId}
            setPointDrawerData={setPointDrawerData}
          />
        </Fragment>)
      }
      {/* 点位列表 */}
      <SpotListModal
        modalData={modalData}
        setModalData={setModalData}
        setPointDrawerData={setPointDrawerData}
      />
    </div>
  );
};

export default ShopOfPoints;
