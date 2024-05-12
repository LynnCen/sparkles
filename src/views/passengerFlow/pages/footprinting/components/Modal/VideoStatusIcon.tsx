/**
 * @Description 视频分析状态icon
 */

import IconFont from '@/common/components/IconFont';

const VideoStatusIcon = ({ status }) => {
  switch (status) {
    case 0:
      return <IconFont iconHref='icon-ic_weikaishi1' style={{ fontSize: '14px' }} />;
    case 1:
    case 2:
      return <IconFont iconHref='icon-ic_jinxingzhong1' style={{ fontSize: '14px' }} />;
    case 3:
      return <IconFont iconHref='icon-ic_fail1' style={{ fontSize: '14px' }} />;
    case 4:
      return <IconFont iconHref='icon-ic_complete1' style={{ fontSize: '14px' }} />;
    default:
      return null;
  }
};

export default VideoStatusIcon;
