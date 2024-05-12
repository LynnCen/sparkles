import { FC } from 'react';
import { Form } from 'antd';
import styles from './entry.module.less';
import { LogoCrop } from '@/common/components/ImgCrop';
import { UploadOutlined } from '@ant-design/icons';
const FormLogo: FC<any> = ({ label, visible, setVisible, imgUrl, setImgUrl }) => {
  const onChange = (file) => {
    setImgUrl(file[0].url);
    setVisible(false);
  };
  const onClickBtn = () => {
    setVisible(true);
  };

  const onModalCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Form.Item label={label} required={true}>
        <span onClick={onClickBtn} className={styles.logoCon}>
          {imgUrl ? (
            <span className={styles.img}>
              <img src={imgUrl} alt='' />
              <span className={styles.mask}>编辑</span>
            </span>
          ) : (
            <span className={styles.upload}>
              <div>
                <UploadOutlined />
              </div>
              <div className='mt-5'>上传文件</div>
            </span>
          )}
        </span>
        <div className={styles.remark}>请上传大小为 长15px * 宽16px，且背景为透明的图片</div>
      </Form.Item>
      <LogoCrop
        size={3}
        visible={visible}
        shape='round'
        modalWidth={468}
        onChange={onChange}
        onModalCancel={onModalCancel}
        label='只能上传jpg、jpeg、png格式的图片，大小不超过3MB'
      />
    </div>
  );
};

export default FormLogo;
