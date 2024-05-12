import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import { getQiNiuToken } from '@/common/api/common';
import { Bucket } from '@/common/enums/qiniu';
// html2canvas 2000ms
// import html2canvas from 'html2canvas';

// htmlToImage 20ms
import * as htmlToImage from 'html-to-image';
import { UploadToQiniu } from '@/common/utils/ways';
import { urlParams } from '@lhb/func';
import { getBrandList, saveOptimizeLogo } from '@/common/api/massImage';

const Canvas: FC<any> = () => {

  const ids = JSON.parse(urlParams(location.search)?.id || null);


  const [imgList, setImgList] = useState<any[]>([]);// 图片列表
  const [token, setToken] = useState<any>('');


  const canvasRefs = useRef<any[]>([]);
  const resultListRef = useRef<any[]>([]);// 保存结果

  const createPoster = async(ref, index) => {
    const width = ref.offsetWidth;
    const height = ref.offsetHeight + 40;
    const options = {
      scale: window.devicePixelRatio && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1,
      width,
      height,
      useCORS: true,
      allowTaint: false,
      logging: false
    };
    let data;
    try {
      data = await htmlToImage.toCanvas(ref, options);
    } catch (err) {
      console.error(err);
    }
    const base64Data = data?.toDataURL() || null;
    if (base64Data) {
      UploadToQiniu(base64Data, token).then((res:any) => {
        // 获取到结果，在传出去
        const oldData = resultListRef.current;
        resultListRef.current = [...oldData, {
          id: imgList[index]?.id,
          optimizeLogo: res.url
        }];
      });
    }

    // 将优化后的图片上报给服务端
    if (index === imgList.length - 1) {
      saveOptimizeLogo({
        optimizeLogos: resultListRef.current
      });
      return;
    } else {
      createPoster(canvasRefs.current[index + 1], index + 1);
    }
  };
  useEffect(() => {
    // 获取图片
    getBrandList({ ids }).then((value) => {
      setImgList(value);
    });
    // 获取七牛云token--都永久存，不用临时的bucket
    getQiNiuToken({ bucket: Bucket.Certs }).then(({ token }) => {
      setToken(token);
    });
  }, []);
  useEffect(() => {
    if (imgList.length > 0 && canvasRefs.current.length && token) {
      // 开始第一个
      createPoster(canvasRefs.current[0], 0);
    }
  }, [imgList, token]);


  return (
    <div className={styles.container}>
      {
        imgList.map((item, index) => <div
          key={index}
          className={styles.card}>
          <div
            ref={(el) => (canvasRefs.current[index] = el)}
            className={styles.box}>
            <div
              className={styles.imgBox}
            >
              <div className={styles.triangle}></div>
              {item?.logo ? <img src={item?.logo}/> : <span className='fs-48'>{item?.name || '-'}</span>}
            </div>
          </div>
        </div>)
      }

    </div>
  );
};

export default Canvas;
