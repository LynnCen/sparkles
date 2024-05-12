import { FC } from 'react';
import styles from './index.module.less';
import { Col, Row, Image } from 'antd';
import IconFont from '@/common/components/Base/IconFont';
import { DownloadOutlined } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';
import { deepCopy, downloadFile } from '@lhb/func';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Empty from '@/common/components/Data/V2Empty';
import { post } from '@/common/request';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
/*
  品牌详情-门店照片Tab
*/
const ShopImages: FC<any> = ({
  info,
  id,
  permissions,
  changeDetail
}) => {
  const methods = useMethods({
    download(item) {
      downloadFile({ name: item.name || item.url, downloadUrl: item.url + '?attname=' + (item.name || encodeURIComponent(item.url)) });
    },
    remove(item, index) {
      V2Confirm({
        content: '此操作将永久删除该数据, 是否继续？',
        onSure(modal: any) {
          post('/brand/deleteStorePic', {
            url: item.url,
            brandId: id
          }, {
            isMock: false,
            proxyApi: '/mdata-api',
            needHint: true
          }).then(() => {
            V2Message.success('删除成功');
            const mdBrandPictureDtos = deepCopy(info);
            mdBrandPictureDtos.splice(index, 1);
            changeDetail({
              brandPicture: [...mdBrandPictureDtos]
            }, false);
            modal.destroy();
          });
        }
      });
    }
  });
  return (
    info.length ? (
      <Row className={styles.shopImages} gutter={[16, 16]}>
        {
          info.map((item, index) => {
            return (
              <Col key={index} span={8}>
                <div className={styles.shopImagesItem}>
                  <Image
                    width='100%'
                    height='100%'
                    src={item.url}
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                  <div className={styles.shopImagesMask}></div>
                  <div className={styles.shopImagesBtn}>
                    <span onClick={() => methods.download(item)}>
                      <DownloadOutlined className={styles.shopImagesIcon} /> 下载
                    </span>
                    {
                      permissions?.find(item => item.event === 'brandLibrary:update') && <>
                        <div className={styles.shopImagesBtnDivider}></div>
                        <span onClick={() => methods.remove(item, index)}>
                          <IconFont className={styles.shopImagesIcon} iconHref='pc-common-icon-ic_delete'/> 删除
                        </span>
                      </>
                    }
                  </div>
                </div>
                <div className={styles.shopImagesItemTitle}>
                  {item.name || item.url}
                </div>
              </Col>
            );
          })
        }
      </Row>
    ) : <V2Empty customTip='暂无图片' imgStyle={{ marginTop: '80px' }}/>
  );
};

export default ShopImages;
