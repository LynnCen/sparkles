import { Breadcrumb } from 'antd';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import DetailForm from './components/DetailForm';
import styles from './entry.module.less';
import { urlParams } from '@lhb/func';

interface IProps {
  location: any;
}

const Detail: FC<IProps> = ({ location }) => {
  /* data */
  const resourceType: number = urlParams(location.search)?.resourceType || -1;
  const categoryId: number = urlParams(location.search)?.categoryId || -1;
  const id: number = urlParams(location.search)?.id || -1;
  const placeId: number = urlParams(location.search)?.placeId || -1;
  const categoryTemplateId: number = urlParams(location.search)?.categoryTemplateId || -1;
  const disabled: boolean = urlParams(location.search)?.disabled || false;
  const categoryName: string = urlParams(location.search)?.categoryName || '';
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Breadcrumb className={styles.nav}>
          <Breadcrumb.Item>
            <Link to='/resmngka'>KA场地管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <DetailForm
          categoryId={categoryId}
          resourceType={resourceType}
          id={id}
          placeId={placeId}
          categoryTemplateId={categoryTemplateId}
          disabled={disabled}
          location={location}
          categoryName={categoryName}
        />
      </div>
    </div>
  );
};

export default Detail;
