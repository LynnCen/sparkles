import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
import { urlParams } from '@lhb/func';
import { Breadcrumb, Spin } from 'antd';
import NotFound from '@/common/components/NotFound';
import Base from './components/Base';
import DetailTable from './components/DetailTable';
import FailTable from './components/FailTable';
import { Link } from 'react-router-dom';
import { radarDetail } from '@/common/api/radar';

const Detail: FC<any> = ({ location }) => {
  const { id } = urlParams(location.search);
  const [detail, setDetail] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTaskDetail();
  }, [id]);

  const getTaskDetail = () => {
    if (!id) return;
    radarDetail({ id }).then((data) => {
      setDetail({
        ...data,
      });
      setLoading(false);
    });

    // setLoading(false);

    // const mock = {
    //   progress: '201/302',
    //   addresses: [
    //     { code: 1, name: '北京' },
    //     { code: 2, name: '杭州' },
    //   ],
    //   categories: [
    //     { categoryCode: 1, categoryName: '餐饮' },
    //     { categoryCode: 2, categoryName: '服装' },
    //   ],
    //   failureSubTasks: [
    //     {
    //       address: { code: 1, name: '北京' },
    //       category: { categoryCode: 1, categoryName: '餐饮' },
    //       errorMessage: '未知原因1',
    //     },
    //     {
    //       address: { code: 2, name: '杭州' },
    //       category: { categoryCode: 2, categoryName: '服装' },
    //       errorMessage: '未知原因2',
    //     },
    //   ],
    // };
  };

  return (
    <div className={styles.container}>
      <Breadcrumb className={styles.nav}>
        <Breadcrumb.Item>
          <Link to='/radarmng'>资源管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>详情</Breadcrumb.Item>
      </Breadcrumb>
      <Spin spinning={loading}>
        {id ? (
          <>
            <Base detail={detail} />
            <DetailTable detail={detail} />
            <FailTable detail={detail} />
          </>
        ) : (
          <NotFound text='暂无数据' />
        )}
      </Spin>
    </div>
  );
};

export default Detail;
