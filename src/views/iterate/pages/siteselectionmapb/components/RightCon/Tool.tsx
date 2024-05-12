/**
 * @Description 右下角工具栏
 */

import { FC } from 'react';
import { debounce } from '@lhb/func';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

const Tool: FC<any> = ({
  mapIns,
  locationInfo,
  openList
}) => {
  const clickLocation = () => {
    const { lng, lat } = locationInfo;
    if (!(+lng && +lat)) return;
    mapIns && mapIns.setZoomAndCenter(17, [+lng, +lat], false, 100);
  };
  const zoomChangeAdd = debounce(() => {
    if (!mapIns) return;
    const zoom = mapIns.getZoom();
    mapIns.setZoom(zoom + 1);
  }, 200);
  const zoomChangeMinus = debounce(() => {
    if (!mapIns) return;
    const zoom = mapIns.getZoom();
    mapIns.setZoom(zoom - 1);
  }, 200);
  return (
    <div className={cs(styles.toolCon, openList ? '' : styles.isRight)}>
      <div
        className={styles.toolItem}
        onClick={clickLocation}
      >
        <IconFont
          iconHref='iconic_mendiangengzhong'
          className='c-666'
        />
      </div>
      <div
        className={styles.toolItem}
        onClick={zoomChangeAdd}
      >
        <IconFont
          iconHref='iconadd'
          className='c-666'
        />
      </div>
      <div
        className={styles.toolItem}
        onClick={zoomChangeMinus}
      >
        <IconFont
          iconHref='iconminus'
          className='c-666'
        />
      </div>
    </div>
  );
};

export default Tool;
