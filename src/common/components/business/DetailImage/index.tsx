import { FC, useMemo, ReactNode } from 'react';
import { isArray, isObject } from '@lhb/func';
import { Image } from 'antd';

interface DetailImageProps {
  imgs: Array<any>; // 图片， 支持字符串数组或对象数组，对象数组时targetFieldsName
  width?: number;
  height?: number;
  targetFieldsName?: string;
  empty?: ReactNode
}

const DetailImage: FC<DetailImageProps> = ({
  imgs = [],
  width = 100,
  height = 80,
  targetFieldsName,
  empty,
}) => {

  const targetImgs = useMemo(() => {
    if (!isArray(imgs)) return [];
    const isStrArr = imgs.every((img: any) => Object.prototype.toString.call(img) === '[object String]');
    if (isStrArr) return imgs; // 字符串数组
    const isObjArr = imgs.every((img: any) => isObject(img));
    if (isObjArr && targetFieldsName) return imgs.map((img: any) => img[targetFieldsName]); // 对象数组
    return [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgs]);

  return (
    <>
      {
        targetImgs.length
          ? (
            <Image.PreviewGroup>
              {
                targetImgs.map((item: string, index: number) => (
                  <Image
                    rootClassName='mr-16 mb-8'
                    key={index}
                    width={width}
                    height={height}
                    src={item}/>
                ))
              }
            </Image.PreviewGroup>
          )
          : empty || '-'
      }
    </>
  );
};

export default DetailImage;
