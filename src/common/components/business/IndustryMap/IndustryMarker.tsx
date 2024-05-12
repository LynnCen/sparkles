import { attentionBrand, attentionBrandShare } from '@/common/api/selection';
import { CITY_LEVEL, CITY_ZOOM } from '@/common/components/AMap/ts-config';
import { valueFormat } from '@/common/utils/ways';
import { isArray, urlParams, isMobile } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useRef, useState } from 'react';
import { zoomStyleMapping } from '../../../../views/selection/pages/industry/ts-config';

const IndustryMarker: FC<any> = ({
  _mapIns,
  city,
  level,
  industryCheck
}) => {
  const isShare = urlParams(location.search)?.isShare;
  const { tenantId } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const labelMarkerRef = useRef<any>(null);
  const [labelsLayer, setLabelsLayer] = useState<any>(null);
  useEffect(() => {
    if (!_mapIns) return;
    labelMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      map: _mapIns,
      anchor: 'top-left',
      offset: [-34, 6]
    });
  }, [_mapIns]);
  useEffect(() => {
    if (!_mapIns) return;
    if (industryCheck.length === 0) {
      labelsLayer && labelsLayer.hide();
      labelsLayer && labelsLayer.clear();
      return;
    }
    if (level < CITY_LEVEL) return;
    drawMasssMarker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_mapIns, city, level, industryCheck]);
  const {
    drawMasssMarker,
    createMarker
  } = useMethods({
    drawMasssMarker: async () => {
      let layer = labelsLayer;
      if (!labelsLayer) {
        layer = new window.AMap.LabelsLayer({
          zooms: [CITY_ZOOM, 20],
          collision: false
        });
        _mapIns.add(layer);
        setLabelsLayer(layer);
      } else {
        layer.clear();
        layer.show();
      }
      const markers: any[] = [];
      const res = await (isShare ? attentionBrandShare({ cityId: city.id, tenantId: tenantId }) : attentionBrand({ cityId: city.id }));
      if (isArray(res) && res.length === 0) return;
      res.forEach(item => {
        const marker = createMarker(item);
        markers.push(marker);
      });
      layer.add(markers);
    },
    createMarker: (data) => {
      const size = zoomStyleMapping[parseInt(_mapIns.getZoom())];
      const icon = {
        type: 'image',
        image: data.logo,
        size: size,
        imageSize: size,
        anchor: 'bottom-center',
      };
      const curData = {
        position: [data.lng, data.lat],
        icon,
        extData: data
      };
      const marker = new window.AMap.LabelMarker(curData);
      marker.on('mouseover', function () {
        let labelContent = `<div class='label'><div class='trangle'></div><div class='title'>${valueFormat(data.storeName)}</div>`;
        labelContent += `<div class='marker'><div class='itemlabel'>品牌名称：</div><div>${valueFormat(data.name)}</div></div>`;
        labelContent += `<div class='marker'><div class='itemlabel'>地址：</div><div>${valueFormat(data.address)}</div></div>`;
        labelContent += '</div>';
        labelMarkerRef.current.setMap(_mapIns);
        labelMarkerRef.current.setPosition([data.lng, data.lat]);
        labelMarkerRef.current.setContent(labelContent);
      });
      marker.on('mouseout', () => {
        labelMarkerRef.current.setContent(' ');
      });
      if (isMobile() && isShare) {
        marker.on('click', function () {
          let labelContent = `<div class='label'><div class='trangle'></div><div class='title'>${valueFormat(data.storeName)}</div>`;
          labelContent += `<div class='marker'><div class='itemlabel'>品牌名称：</div><div>${valueFormat(data.name)}</div></div>`;
          labelContent += `<div class='marker'><div class='itemlabel'>地址：</div><div>${valueFormat(data.address)}</div></div>`;
          labelContent += '</div>';
          labelMarkerRef.current.setMap(_mapIns);
          labelMarkerRef.current.setPosition([data.lng, data.lat]);
          labelMarkerRef.current.setContent(labelContent);

          setTimeout(() => {
            labelMarkerRef.current.setContent(' ');
          }, 3000);
        });
      }
      return marker;
    }
  });
  return <></>;
};

export default IndustryMarker;
