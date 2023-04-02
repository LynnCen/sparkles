import React, { useEffect, useRef, useState } from 'react';
import { BucketObjectTypeImg, uploadFile } from '@/services/common';
import { Button, message, Modal, Spin } from 'antd';
import { uploadAWS } from '@/utils/aws';

import styles from './index.less';
import { MinusCircleOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import generateImagePath from '@/utils/imagePath';

type imgObj = string | { url: string };

interface UploadPropType {
  onChange?: (urls: string | string[] | Record<string, any>) => void;
  value?: imgObj[] | Record<string, any>;
  multiple?: boolean;
  isAws?: boolean;
}

const Upload: React.FC<UploadPropType> = (props) => {
  const [previewImg, setPreviewImg] = useState(props.value);
  const [previewVisible, togglePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isUploading, toggleUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!props.value && props.multiple) {
      setPreviewImg([]);
    } else {
      if (props.value && props.value.bucketId) {
        const { text, bucketId, file_type } = props.value as BucketObjectTypeImg;
        const url = generateImagePath(bucketId, text, file_type);
        setPreviewImg([url]);
        return;
      }
      setPreviewImg(props.value);
    }
  }, [props.value]);

  const handleCancel = () => togglePreview(false);

  const deleteItem = (index?: number) => {
    let res: string | string[];
    if (!Array.isArray(previewImg)) {
      res = '';
    } else {
      res = (previewImg || []).filter((img, idx) => idx !== index);
    }

    if (typeof props.onChange === 'function') {
      props.onChange(res);
    }
  };

  const upload = async () => {
    const { files } = inputRef.current!;
    if (!files) return;
    const file = files[0];
    toggleUploading(true);
    try {
      const resp = await uploadFile(file);
      if (typeof props.onChange === 'function') {
        if (!Array.isArray(previewImg)) {
          props.onChange(resp.url);
        } else {
          props.onChange([...previewImg, resp]);
        }
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      toggleUploading(false);
    }
  };

  const uploadAws = async () => {
    const { files } = inputRef.current!;
    if (!files) return;
    const file = files[0];
    // setPreviewImage(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (evt) {
      const replaceSrc = evt.target.result;
      const imageObj: HTMLImageElement = new Image();
      imageObj.src = replaceSrc;
      imageObj.onload = async function () {
        const { host, key, file_type, bucketId } = await uploadAWS(file.name, file);
        const url = `${host}${key}.${file_type}`;
        setPreviewImage(url);
        if (typeof props.onChange === 'function') {
          props.onChange({
            bucketId,
            file_type,
            text: key,
            height: imageObj.height,
            width: imageObj.width,
          });
        }
      };
    };
  };

  return (
    <>
      <div className={styles.file_input_container}>
        <Button type="primary" ghost icon={<UploadOutlined />} size={'middle'}>
          {formatMessage({ id: 'table-choose-img' })}
        </Button>
        <input
          className={styles.file_input}
          ref={inputRef}
          type={'file'}
          accept={'.jpg,.png,.jpeg'}
          onChange={props.isAws ? uploadAws : upload}
        />
      </div>

      {previewImg && !Array.isArray(previewImg) && (
        <Spin spinning={isUploading}>
          <div className={styles.images}>
            <div className={styles.image_item}>
              <img
                style={{ width: 40, height: 40, objectFit: 'contain' }}
                src={previewImg}
                alt={'preview'}
                onClick={() => {
                  setPreviewImage(previewImg);
                  togglePreview(true);
                }}
              />
              <MinusCircleOutlined onClick={() => deleteItem()} />
            </div>
          </div>
        </Spin>
      )}

      {previewImg && Array.isArray(previewImg) && (
        <Spin spinning={isUploading}>
          <div className={styles.images}>
            {previewImg.map((img, index) => {
              return (
                <div key={index} className={styles.image_item}>
                  <img
                    style={{ width: 40, height: 40, objectFit: 'contain' }}
                    src={img.url || img}
                    alt={'preview'}
                    onClick={() => {
                      setPreviewImage(img.url || img);
                      togglePreview(true);
                    }}
                  />
                  <MinusCircleOutlined onClick={() => deleteItem(index)} />
                </div>
              );
            })}
          </div>
        </Spin>
      )}

      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default Upload;
