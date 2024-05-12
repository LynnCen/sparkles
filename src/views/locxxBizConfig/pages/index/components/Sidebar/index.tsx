import React, { useState, useContext } from 'react';
import { Row, Col, Tooltip, Tree } from 'antd';
import { AppstoreFilled } from '@ant-design/icons';
import { Key } from 'rc-tree/lib/interface';
import {
  SideBarProps,
  DictionaryListItem
} from '../../ts-config';
import { useMethods } from '@lhb/hook';
import DictionaryDataContext from '../../context';
import styles from '../../entry.module.less';
import DrawerTable from './components/DrawerTable';

const Sidebar: React.FC<SideBarProps> = ({
  loadData,
  onSelectTree,
  dictionaryId,
  managePermissions
}) => {
  const dictionaryData: DictionaryListItem[] = useContext(DictionaryDataContext);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  // methods
  const { drawerChange, selectHandle, treeList } = useMethods({
    drawerChange: (val: boolean) => {
      setDrawerVisible(val);
    },
    selectHandle: (selectedKeys: Key[], e: any) => {
      const { node } = e;
      const encode = node.encode;
      const id = selectedKeys[0];
      id && onSelectTree?.(id as number, encode as string);
    },
    treeList: () => {
      if (dictionaryId) {
        return (
          <Tree
            fieldNames={{
              title: 'name',
              key: 'id'
            }}
            defaultExpandAll
            defaultSelectedKeys={[dictionaryId]}
            treeData={dictionaryData as any}
            onSelect={selectHandle}/>
        );
      }
      return null;
    }
  });

  return (
    <>
      <div className={styles.siderbarSection}>
        <div className={styles.headCon}>
          <Row align='middle'>
            <Col span={12}>字典分类</Col>
            <Col span={12} className='rt'>
              <Tooltip placement='top' title='分类管理'>
                <AppstoreFilled onClick={() => drawerChange(true)}/>
              </Tooltip>
            </Col>
          </Row>
        </div>
        {
          treeList()
        }
      </div>
      <DrawerTable
        visible={drawerVisible}
        loadData={loadData}
        tablePermissions={managePermissions}
        drawerClose={drawerChange}/>
    </>
  );
};

export default Sidebar;
