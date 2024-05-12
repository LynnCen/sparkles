import { Breadcrumb } from 'antd';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import DetailForm from './components/DetailForm';
import styles from './entry.module.less';
import { urlParams } from '@lhb/func';

// import { resTemplateList } from '@/common/api/template';
// import { dispatchNavigate } from '@/common/document-event/dispatch';

interface IProps {
  location: any;
}

const Detail: FC<IProps> = ({ location }) => {
  /* data */
  const resourceType: string = urlParams(location.search)?.resourceType || -1;
  const categoryId: number = urlParams(location.search)?.categoryId || -1;
  const id: number = urlParams(location.search)?.id || -1;
  const placeId: number = urlParams(location.search)?.placeId || -1;
  const categoryTemplateId: number = urlParams(location.search)?.categoryTemplateId || -1;
  const { isKA } = urlParams(location.search);
  const disabled: boolean = urlParams(location.search)?.disabled || false;
  const categoryName: string = urlParams(location.search)?.categoryName || '';
  // const [pointTreeData, setPointTreeData] = useState<Array<any>>([]);
  // const [pointValue, setPointValue] = useState<number>(categoryId);



  // 编辑
  // const handleUpdate = (categoryId) => {
  //   resTemplateList({ resourcesType: resourceType, useType: isKA === 'true' ? 4 : 0 }).then((result) => {
  //     if (result.objectList && result.objectList.length) {
  //       dispatchNavigate(
  //         `/resmng/detail?id=${id}&resourceType=${resourceType}&categoryId=${categoryId}&categoryTemplateId=${categoryTemplateId}&isKA=${isKA}`
  //       );
  //     }
  //   });
  // };


  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <Breadcrumb className={styles.nav}>
            <Breadcrumb.Item>
              {isKA === 'true' ? <Link to='/resmngka'>KA场地管理</Link> : <Link to='/resmng'>资源管理</Link>}
            </Breadcrumb.Item>
            <Breadcrumb.Item>编辑</Breadcrumb.Item>
          </Breadcrumb>
          {/* <TreeSelect
              style={{ width: 150 }}
              fieldNames={{ label: 'name', value: 'id', children: 'childList' }}
              treeData={pointTreeData}
              placeholder='请选择其他点位'
              onChange={onPointChange}
              value={pointValue}
            /> */}

        </div>
        <DetailForm
          categoryId={categoryId}
          resourceType={resourceType}
          id={id}
          placeId={placeId}
          categoryTemplateId={categoryTemplateId}
          isKA={isKA}
          disabled={disabled}
          location={location}
          categoryName={categoryName}
        />
      </div>

    </div>
  );
};

export default Detail;
