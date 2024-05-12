/* 岗位管理 */
import { useState, FC, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import Operate from '@/common/components/Operate';
import Filter from './components/FIlter';
import PostTable from './components/PostTable';
import PostOperate from './components/Modal/PostOperate';
import { positionList } from '@/common/api/position';

import { PostModalValuesProps, PostProps, RoleListResult } from './ts-config';
import styles from './entry.module.less';
import { KeepAlive } from 'react-activation';
import { refactorPermissions } from '@lhb/func';

const PostManage: FC<PostProps> = () => {
  const [params, setParams] = useState<any>();
  // 编辑/新建岗位
  const [operatePost, setOperatePost] = useState<PostModalValuesProps>({ visible: false });
  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.icon = <PlusOutlined />;
        res.onClick = () => handleAddNew();
      }
      return res;
    });
  }, [operateExtra]);

  // 搜索
  const onSearch = (filter?: any) => {
    setParams({ ...params, ...filter });
  };

  // 新建
  const handleAddNew = () => {
    setOperatePost({ visible: true });
  };

  // 请求表格数据
  const loadData = async (params: any) => {
    const { totalNum, objectList, meta }: RoleListResult = await positionList(params);
    if (!operateList.length) {
      setOperateExtra(meta.permissions);
    }
    return {
      dataSource: objectList || [],
      count: totalNum,
    };
  };

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <Filter onSearch={onSearch} />
        <div className={styles.content}>
          <Operate operateList={operateList} />
          <PostTable params={params} loadData={loadData} setOperatePost={setOperatePost} onSearch={onSearch} />
        </div>

        <PostOperate operatePost={operatePost} setOperatePost={setOperatePost} onSearch={onSearch} />
      </div>
    </KeepAlive>
  );
};

export default PostManage;
