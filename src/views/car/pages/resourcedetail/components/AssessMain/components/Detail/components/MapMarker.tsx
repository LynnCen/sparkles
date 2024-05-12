import { FC } from 'react';
// import { LngLat } from 'react-amap';

interface MapMarkerProps {
  center?: any;
  position?: any;
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
    //     amapkey={'788e08def03f95c670944fe2c78fa76f'}
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
    //       open={visible}
    //       content={`${address}`}
    //       position={center!}/> */}
    //   </Map>
    // </div>
    <a onClick={handleClick} type='link'>{address}</a>
  );
};

export default MapMarker;
