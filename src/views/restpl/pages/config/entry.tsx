import { Breadcrumb, Tabs } from 'antd';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import SpecTab from './components/SpecTab';
import styles from './entry.module.less';
import { urlParams } from '@lhb/func';
import LabelConfigTab from './components/LabelConfigTab';
import PropertyConfigTab from './components/PropertyConfigTab';
import { CloseOutlined } from '@ant-design/icons';

const Config: FC<any> = ({ location }) => {
  /* data */
  const categoryId: string | number = urlParams(location.search)?.categoryId || -1;
  const parentCategoryId: string | number = urlParams(location.search)?.parentCategoryId || -1;
  const categoryTemplateId: string | number = urlParams(location.search)?.categoryTemplateId || -1;

  const categoryName: string = urlParams(location.search)?.categoryName;
  const tplName: string = urlParams(location.search)?.tplName;
  const resourceTypeName: string = urlParams(location.search)?.resourceTypeName;

  return (
    <div className={styles.container}>
      <Breadcrumb className={styles.nav}>
        <Breadcrumb.Item>
          <Link to='/restpl'>{decodeURI(resourceTypeName)}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{decodeURI(tplName)}</Breadcrumb.Item>
        <Breadcrumb.Item>{decodeURI(categoryName)}</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.close}>
        <Link to='/restpl'>
          <CloseOutlined />
        </Link>
      </div>
      <Tabs defaultActiveKey='1' items={[
        {
          label: '属性配置', key: '1', children: <div className={styles.tab}>
            <PropertyConfigTab
              categoryId={categoryId}
              categoryTemplateId={categoryTemplateId}
              parentCategoryId={parentCategoryId}
            />
          </div>
        },
        {
          label: '标签配置', key: '2', children: <div className={styles.tab}>
            <LabelConfigTab categoryId={categoryId} categoryTemplateId={categoryTemplateId} />
          </div> 
        },
        {
          label: '规格配置', key: '3', children:<div className={styles.tab}>
            <SpecTab categoryId={categoryId} categoryTemplateId={categoryTemplateId} />
          </div>
        }
      ]}/>
    </div>
  );
};

export default Config;
