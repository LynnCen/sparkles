import { FC, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { contrast, deepCopy, floorKeep } from '@lhb/func';
import { getQuoteRelationSpot, postQuoteRelationCreate } from '@/common/api/demand-management';

import cs from 'classnames';
import styles from './index.module.less';
import { Button, Image, Spin, Typography } from 'antd';
import V2Title from 'src/common/components/Feedback/V2Title/index';
import Empty from './Empty';
import SelectPoint from './SelectPoint';
import IconFont from 'src/common/components/Base/IconFont/index';
import { getQiniuFileOriUrl } from '@/common/utils/qiniu';

const { Text } = Typography;

// 点位
export interface PointProps {
  spotId: number, // 点位 id
  spotName: string, // 点位名称
  placeId: number, // 场地 id
  placeName: string, // 场地名称
  area: string, // 点位总面积
  spotPics: string[], // 点位图片
  img: string, // 图片地址
}

const DEFAULT_SPOT_IMG = 'https://staticres.linhuiba.com/project-custom/react-pc/empty-nothing.png';

/**
 * @description 点位卡片
 * @param {*} obj.active 是否选中
 * @param {*} obj.selectable 是否可选，true 则显示单选图标
 * @param {*} obj.point 点位信息
 * @return {*}
 * @example
 */
export const PointCard:FC<{ active?: boolean, selectable?: boolean, point: PointProps, onClick?: Function }> = ({ active = false, selectable = false, point, onClick }) => {
  const info = `${point.spotName || ''}(${floorKeep(point.area, 1, 3, 2) || '-'}㎡)`;
  const spotPics = Array.isArray(point.spotPics) && point.spotPics.length ? point.spotPics.map(item => getQiniuFileOriUrl(item)) : [DEFAULT_SPOT_IMG];

  const [visible, setVisible] = useState(false);

  return (<div className={cs(styles.pointCard, selectable && styles.selectable)} onClick={() => onClick?.(point)}>
    {!!selectable && <IconFont iconHref={active ? 'icon-check-circle' : 'icon-radio'} className={styles.pointCardIcon}/>}
    <Image
      width='100%'
      height='96px'
      preview={{ visible: false }}
      src={`${spotPics[0]}?imageView2/2/w/160/h/160/q/100/format/jpg`}
      // preview={{ src: img }}
      className={styles.pointCardImg}
      onClick={e => {
        e.stopPropagation();
        setVisible(true);
      }}
    >
    </Image>
    {Array.isArray(spotPics) && !!spotPics.length && <div style={{ display: 'none' }}>
      <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
        {spotPics.map((item, index) => <Image key={index} src={item} />)}
      </Image.PreviewGroup>
    </div>}
    <Text style={{ maxWidth: '100%' }} ellipsis={{ tooltip: info }} className={styles.pointCardTitle}>{info}</Text>
  </div>);
};

const Component: FC<{
  fromAccountId: string, // 会话发起方
  toAccountId: string, // 会话接收方
  className?: string,
} & { ref?: any }> = forwardRef(({ className, fromAccountId, toAccountId }, ref) => {

  useImperativeHandle(ref, () => ({
    init: methods.init,
    getActive: () => deepCopy(selected)
  }));

  /* state */
  const selectPointRef = useRef<any>();

  const [requesting, setRequesting] = useState(false);
  // 选中的点位信息
  const [selected, setSelected] = useState<PointProps | null>(null);

  /* hooks */

  /* methods */
  const methods = useMethods({
    // 初始化
    init() {
      if (!fromAccountId || !toAccountId) {
        return;
      }

      setRequesting(true);
      getQuoteRelationSpot({ fromAccountId, toAccountId }).then((response) => {
        console.log('response', response);
        response && setSelected({
          spotId: contrast(response, 'spotId'),
          spotName: contrast(response, 'spotName'),
          placeId: contrast(response, 'placeId'),
          placeName: contrast(response, 'placeName'),
          area: contrast(response, 'area'),
          spotPics: contrast(response, 'spotPics', []),
          img: contrast(response, 'img'),
        });
      }).finally(() => {
        setRequesting(false);
      });
    },
    // 选择点位
    selectPoint() {
      selectPointRef.current?.init?.();
    },
    // 选择点位回调
    selectPointComplete(value) {
      console.log('selectPointComplete', value);

      // 保存点位和会话关系
      postQuoteRelationCreate({ fromAccountId, toAccountId, spotId: contrast(value, 'spotId') }).then((response) => {
        console.log(response);
      });

      value && setSelected({
        spotId: contrast(value, 'spotId'),
        spotName: contrast(value, 'spotName'),
        placeId: contrast(value, 'placeId'),
        placeName: contrast(value, 'placeName'),
        area: contrast(value, 'area'),
        spotPics: contrast(value, 'spotPics', []),
        img: contrast(value, 'img'),
      });
    }
  });

  return (<div className={className}>
    <V2Title type='H2' className='mb-10' extra={!!selected && <Button type='link' onClick={methods.selectPoint}>更换点位</Button>}>
      添加点位{!!selected && <span className='fn-12 c-666 ml-6'>(已选：{selected.placeName})</span>}
    </V2Title>

    <Spin spinning={requesting}>
      {selected ? <PointCard point={selected}/> : <Empty add={methods.selectPoint} text='从资源库选择点位' />}
    </Spin>

    <SelectPoint ref={selectPointRef} complete={methods.selectPointComplete} />

  </div>);
});

export default Component;
