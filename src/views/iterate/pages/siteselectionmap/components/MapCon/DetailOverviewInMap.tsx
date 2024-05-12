/**
 * @Description 地图中的详情概览
 */
import { FC, useEffect, useRef } from 'react';
import { v4 } from 'uuid';
import { businessAreaOverview } from '@/common/api/siteselectionmap';
// import cs from 'classnames';
// import styles from './entry.module.less';
import ReactDOM from 'react-dom';
import TargetOverview from './TargetOverview';
const uid:any = v4();
const targetNode = `<div id="${uid}"></div>`;

const DetailOverviewInMap: FC<any> = ({
  mapIns, // 地图实例
  detailData, // 详情
  labelOptionsChanged,
  setAreaChangedLabels,
}) => {
  const detailMarker: any = useRef(); // 详情覆盖物

  useEffect(() => {
    if (!mapIns) return;
    const { visible, id } = detailData;
    if (visible && id) { // 详情
      loadOverviewData();
      return;
    }
    close();
  }, [mapIns, detailData]);

  const loadOverviewData = async () => {
    const data = await businessAreaOverview({ id: detailData?.id });
    const target = Object.assign({}, detailData?.detail, data);
    const { lng, lat } = target;
    if (!(+lng && +lat)) return;
    if (detailMarker.current) {
      detailMarker.current.setPosition([+lng, +lat]);
      detailMarker.current.setContent(targetNode);
    } else {
      const marker = new window.AMap.Marker({
        position: [+lng, +lat],
        offset: [40, -10],
        content: targetNode,
        zIndex: 100
      });
      detailMarker.current = marker;
      mapIns.add(detailMarker.current);
    }
    ReactDOM.render(<TargetOverview
      detail={target}
      close={close}
      labelOptionsChanged={labelOptionsChanged}
      setAreaChangedLabels={setAreaChangedLabels}
    />,
    document.getElementById(uid));
  };

  const close = () => {
    detailMarker.current && detailMarker.current.setContent('<div></div>');
  };

  return (
    <>
    </>
  );
};

export default DetailOverviewInMap;
