import { Image } from 'antd';
import { FC } from 'react';
const PicViewer: FC<any> = ({ picViewerInfo, setVisible }) => {
  return (
    <div style={{ display: 'none' }}>
      <Image.PreviewGroup preview={{ visible: picViewerInfo.visible, onVisibleChange: setVisible }}>
        {picViewerInfo.spotPicture &&
          picViewerInfo.spotPicture.map((url: string, index: number) => <Image key={index} src={url} />)}
      </Image.PreviewGroup>
    </div>
  );
};
export default PicViewer;
