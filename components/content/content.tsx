import { useTranslation } from "next-i18next";
import Image from "next/image";
import { Space } from "antd";
import styles from './content.module.scss'
interface props {
  title?: string;
  src?: StaticImageData;
  moreSrc?: StaticImageData;
  imageWidth?: number;
  imageHeight?: number;
}
const RenderContent = (props: props) => {
  const { t } = useTranslation("faqmenu");
  const { title, src, moreSrc, imageWidth = 240, imageHeight = 520 } = props;
  return (
    <>
      {title ? <h4>{t(title)}</h4> : void 0}

      {src ? (
        <h4>
          <Space>
            <Image
              src={src}
              alt="Setup page"
              width={imageWidth}
              height={imageHeight}
              className={styles.img}
            />
            {moreSrc ? (
              <Image
                src={moreSrc}
                alt="Setup page"
                width={imageWidth}
                height={imageHeight}
                className={styles.img}
              />
            ) : (
              void 0
            )}
          </Space>
        </h4>
      ) : (
        void 0
      )}
    </>
  );
};
export default RenderContent;
