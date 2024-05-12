/**
 * @Description
 */
import { FC } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';

const VideoCom: FC<any> = ({
  videoRef,
  url,
}) => {

  return (
    <video
      ref={videoRef}
      preload='auto'
      // controls
      src={url}
      // width='100%'
      // height='100%'
      // playsInline
      // controlsList={'nofullscreen'}
      // muted={false}
      // disablePictureInPicture
      className={styles.videoCon}
    >
    </video>
  );
};

export default VideoCom;
