/**
 * 数据字典页
 */
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { dictionaryList } from './api';
import { DictionaryListItem } from './ts-config';
import { Permission } from '@/common/components/Operate/ts-config';
import { DictionaryDataContextProvider } from './context';
import { useMethods } from '@lhb/hook';
import styles from './entry.module.less';
import Sidebar from './components/Sidebar/index';
import Core from './components/Core/index';
import { KeepAlive } from 'react-activation';

const { Sider, Content } = Layout;
const Dictionary: React.FC = () => {
  const [dictionaryData, setDictionaryData] = useState<Array<DictionaryListItem>>([]); // 字典分类列表数据
  const [dictionaryId, setDictionaryId] = useState<number>(0); // 字典分类数据列表
  const [managePermissions, setManagePermissions] = useState<Permission[]>([]); // 字典分类数据列表

  const { loadData, onSelectTree } = useMethods({
    // 获取字典分类数据列表
    loadData: async () => {
      const { objectList, meta: { permissions } }: any = await dictionaryList();
      const defaultTargetId = objectList[0] && objectList[0].id; // 默认的字典分类
      setDictionaryData(objectList);
      setManagePermissions(permissions);
      defaultTargetId && setDictionaryId(defaultTargetId);
    },
    // 选择左侧树状数据时，获取对应的id
    onSelectTree: (id: number) => {
      setDictionaryId(id);
    }
  });

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeepAlive saveScrollPosition>
      <Layout className={styles.dictionaryPage}>
        {/* 左侧树状菜单栏 */}
        <Sider theme='light'>
          <DictionaryDataContextProvider dictionaryData={dictionaryData}>
            <Sidebar
              loadData={loadData}
              managePermissions={managePermissions}
              onSelectTree={onSelectTree}
              dictionaryId={dictionaryId}/>
          </DictionaryDataContextProvider>
        </Sider>
        <Layout className='ml-12'>
          {/* 右侧表格页 */}
          <Content>
            <Core dictionaryId={dictionaryId}/>
          </Content>
        </Layout>
      </Layout>
    </KeepAlive>
  );
};

export default Dictionary;

