/**
 * @Description 媒体资源幻灯片
 */

import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import cs from 'classnames';
import { isNotEmptyAny } from '@lhb/func';
import { Image } from 'antd';
import { QiniuImageUrl, getQiniuFileOriSuffix } from '@/common/utils/qiniu';
import V2VideoPlayer from '@/common/components/Data/V2VideoPlayer';
import { unstable_batchedUpdates } from 'react-dom';
// import { MainAppContext } from '@/index';
// import empty360 from '@/assets/image/360.png';
// import { dispatchWindowOpen } from '@/common/document-event/dispatch';
import V2Empty from '../Data/V2Empty';

interface SlideMediaProps{
  /**
   * @description 照片
   */
  images?: Array<{url: string; [k: string]: any}>;
  /**
   * @description 视频
   */
  videos?: Array<{url: string; [k: string]: any}>;
  /**
   * @description 全景图
   */
  panoramas?: Array<{url: string; [k: string]: any}>;
  /**
   * @description 长度
   */
  width?: string;
  /**
   * @description 高度
   */
  height?: string;
  /**
   * @description 平面图
   */
  floorPlans?: Array<{url: string; [k: string]: any}>;
}

const SlideMedia: React.FC<SlideMediaProps> = ({ images, videos, panoramas, floorPlans, width = '300px', height = '240px' }) => {

  // const { container } = useContext(MainAppContext);

  const [currentType, setCurrentType] = useState<'image' | 'video' | 'panorama' | 'floorPlan'>(); // 当前类型
  const [count, setCount] = useState<number>(0); //
  const [medias, setMedias] = useState<any>();

  useEffect(() => {
    initCurrentType();
  }, [images, videos]);

  /**
   * 初始化当前媒体类型
   */
  const initCurrentType = () => {
    if (images?.length) {
      unstable_batchedUpdates(() => {
        setCurrentType('image');
        setMedias(images);
        setCount(0);
      });
    } else if (videos?.length) {
      unstable_batchedUpdates(() => {
        setCurrentType('video');
        setMedias(videos);
        setCount(0);
      });
    } else if (panoramas?.length) {
      unstable_batchedUpdates(() => {
        setCurrentType('panorama');
        setMedias(panoramas);
        setCount(0);
      });
    } else if (floorPlans?.length) {
      unstable_batchedUpdates(() => {
        setCurrentType('floorPlan');
        setMedias(floorPlans);
        setCount(0);
      });
    }
  };

  const handleLeft = () => {
    if (count === medias.length - 1) {
      setCount(0);
      return;
    }

    setCount(count + 1);
  };

  const handleRight = () => {
    if (count === 0) {
      setCount(medias.length - 1);
      return;
    }
    setCount(count - 1);
  };

  const handleChangeType = (obj) => {
    unstable_batchedUpdates(() => {
      if (obj.value === 'image') {
        setMedias(images);
      } else if (obj.value === 'video') {
        setMedias(videos);
      } else if (obj.value === 'panorama') {
        setMedias(panoramas);
      } else if (obj.value === 'floorPlan') {
        setMedias(floorPlans);
      }
      setCurrentType(obj.value);
      setCount(0);
    });
  };
  /**
   * 渲染VR
   * @param url 链接
   * @param index key
   * @param current 当前顺序
   */
  // const renderPanorama = () => {
  //   return <div
  //     style={{
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       width: width,
  //       height: height,
  //       background: '#F6F7F9',
  //       cursor: 'pointer',
  //       display: 'flex'
  //     }}
  //     // onClick={() => dispatchWindowOpen(medias[current].url)}
  //   >
  //     <div
  //       style={{
  //         width: 50,
  //         height: 50,
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         borderRadius: '50%',
  //         background: '#000000',
  //       }}
  //     >
  //       <Image preview={false} src={empty360} />
  //     </div>
  //   </div>;
  // };

  /**
   * 渲染媒体
   */
  const renderMedia = () => {
    if (!medias || !medias[count]) return <div style={{ width: width, height: height }}><V2Empty imgStyle={{ width: '200px', height: '160px' }} centerInBlock/></div>;
    if (currentType === 'image') {
      return <Image.PreviewGroup>
        {medias.map((item, index) =>
          <Image src={QiniuImageUrl(item.coordinateUrl || item.url)} preview={{ src: item.url + getQiniuFileOriSuffix(item.url) }} style={{ width: width, height: height, display: index !== count ? 'none' : undefined }} key={ index } />
        )}
      </Image.PreviewGroup>;
    } else if (currentType === 'video') {
      return <>
        {medias.map((item, index) =>
          index === count && <V2VideoPlayer src={item.url} width={width} height={height} key={ index } />
        )}
      </>;

      // <V2VideoPlayer src={medias[count].url} width={width} height={height}/>;
    } else if (currentType === 'panorama') { // 全景图
      // return renderPanorama(count);
    } else if (currentType === 'floorPlan') { // 平面图
      return <Image.PreviewGroup>
        {medias.map((item, index) =>
          <Image src={QiniuImageUrl(item.coordinateUrl || item.url)} preview={{ src: item.url + getQiniuFileOriSuffix(item.url) }} style={{ width: width, height: height, display: index !== count ? 'none' : undefined }} key={ item.url } />
        )}
      </Image.PreviewGroup>;
    }
    return;
  };
  /**
   * 渲染底部 tab
   */
  const renderBottomTab = () => {
    const tabs: any[] = [];
    if (isNotEmptyAny(images)) tabs.push({ label: '图片', value: 'image' });
    if (isNotEmptyAny(videos)) tabs.push({ label: '视频', value: 'video' });
    if (isNotEmptyAny(panoramas)) tabs.push({ label: 'VR', value: 'panorama' });
    if (isNotEmptyAny(floorPlans)) tabs.push({ label: '平面图', value: 'floorPlan' });

    if (tabs.length > 1) {
      return <div className={styles['slider-bottom']}>
        {tabs.map(item => <><span
          onClick={() => handleChangeType(item)}
          key={item.label}
          className={cs(styles['slider-bottom__item'],
            item.value === currentType ? styles['slider-bottom__item-active'] : ''
          )}>{item.label}</span></>)}
      </div>;
    }
    return;
  };

  /**
   * 是否显示左右切换
   */
  const showLeftRightIcon = () => {
    return isNotEmptyAny(medias) && medias?.length > 1;
  };
  return (
    <>
      <div className={styles.slider}>
        <div className={styles['slider-wrapper']}>
          {showLeftRightIcon() ? <LeftOutlined className={cs(styles['slider-block-left'], styles['slider-block'])} onClick={handleRight}/> : ''}
          {showLeftRightIcon() ? <RightOutlined className={cs(styles['slider-block-right'], styles['slider-block'])} onClick={handleLeft}/> : ''}

          <div className={styles['slider-content']}>
            {renderMedia()}
          </div>

          {renderBottomTab()}
        </div>
      </div>
    </>
  );
};

export default SlideMedia;
