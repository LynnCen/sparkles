import V2VideoPlayer from '@/common/components/Data/V2VideoPlayer';
import { Carousel, Modal } from 'antd';
import { FC } from 'react';
const VideoViewer: FC<any> = ({ videoViewerInfo, onCancel }) => {
  const bodyStyle = { background: 'black', padding: '0px 1px 0px 1px' };
  return (
    <Modal
      destroyOnClose={true}
      onCancel={onCancel}
      open={videoViewerInfo.visible}
      footer={null}
      bodyStyle={bodyStyle}
      closable={false}
      style={{ opacity: 100 }}
    >
      <Carousel dotPosition={'bottom'}>
        {videoViewerInfo.spotVideo &&
          (videoViewerInfo.spotVideo.length === 1 ? (
            <V2VideoPlayer src={videoViewerInfo.spotVideo[0]} width={532} styleType={'base'} />
          ) : (
            videoViewerInfo.spotVideo.map((url: string, index: number) => {
              return (
                <div className='mb-24'>
                  <V2VideoPlayer key={index} src={url} width={532} styleType={'base'} />
                </div>
              );
            })
          ))}
      </Carousel>
    </Modal>
  );
};
export default VideoViewer;
