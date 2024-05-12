/**
 * @Description 新增商圈
 */
import { FC, useState } from 'react';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import cs from 'classnames';
import DrawTool from './DrawTool';
import { Tooltip } from 'antd';

const DrawShape:FC<any> = ({
  mapIns,
  isSelectToolBox,
  setIsSelectToolBox,
  setIsShape,
  // isShape,
  setIsDraw,
  setIsReset,
  setLeftDrawerVisible,
  setRightDrawerVisible,
  polygonData,
  firstLevelCategory,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return <div>
    <span
      className={styles.drawCard}
      onClick={() => {
        setOpen((state) => !state);
      }}>
      <span>新增商圈</span>
      <Tooltip
        placement='right'
        overlayInnerStyle={{ width: 350 }}
        title={<div >
          <div>新增商圈：支持自定义位置新增商圈</div>
          <div>关于大小：圆形半径100~500m，不规则面积在10000㎡~800000㎡内</div>
          <div>关于评分：新增成功后，评分计算约等待8个小时</div>
        </div>}>
        <span>
          <IconFont iconHref={'iconxq_ic_shuoming_normal'} className='fs-12 ml-4 c-999'/>
        </span>
      </Tooltip>
      <IconFont
        iconHref='pc-common-icon-a-iconarrow_down'
        className={cs(open ? styles.arrowIconUp : styles.arrowIcon, 'ml-4')}
      />
    </span>
    {/* 绘制工具 */}
    <DrawTool
      expand={open}
      mapIns={mapIns}
      isSelectToolBox={isSelectToolBox}
      setIsSelectToolBox={setIsSelectToolBox} // 工具箱与新增商圈互斥，设置工具箱中的按钮是否激活
      setIsShape={setIsShape}
      setIsDraw={setIsDraw} // 是否已经绘制出图形信息，graphInfo有数据则为true
      setIsReset={setIsReset}
      setLeftDrawerVisible={setLeftDrawerVisible}
      setRightDrawerVisible={setRightDrawerVisible}
      polygonData={polygonData}
      firstLevelCategory={firstLevelCategory}
    />
  </div>;
};
export default DrawShape;
