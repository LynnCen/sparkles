import { LngLat } from '@/common/components/Map/V2AMap';
import { FC } from 'react';

interface MapMarkerProps {
  center?: LngLat;
  position?: LngLat;
  address?: string;
}

const MapMarker: FC<MapMarkerProps> = ({ center, address }) => {
  // const [visible, setVisible] = useState<boolean>(true);
  const { longitude, latitude }: any = center;


  const handleClick = () => {
    window.open(`https://ditu.amap.com/regeo?lng=${longitude}&lat=${latitude}&name=${address}&src=uriapi&callnative=1&innersrc=uriapi`);
  };


  return (
    // <div style={{ height: 200 }}>
    //   <Map
    //     amapkey={process.env.REACT_APP_AMAP_KEY}
    //     center={center}
    //     events={{ click: onClick }}
    //     zoom={15}>
    //     <Marker
    //       position={position }
    //       events={{ click: onClick }}
    //     />
    //     {/* <InfoWindow
    //       closeWhenClickMap
    //       autoMove
    //       events={{ close: onClose }}
    //       visible={visible}
    //       content={`${address}`}
    //       position={center!}/> */}
    //   </Map>
    // </div>
    <a onClick={handleClick} type='link'>{address}</a>
  );
};

export default MapMarker;
