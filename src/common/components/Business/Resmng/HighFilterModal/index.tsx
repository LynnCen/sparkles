import { getLabels } from '@/common/api/place';
import Modal from '@/common/components/Modal/Modal';
import { ModalCustomProps } from '@/common/components/Modal/ts-config';
import StateTab from '@/common/components/Tabs/StateTab';
import { gatherMethods } from '@lhb/func';

import { Alert, Col, Row } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, { useEffect, useState } from 'react';
import LabelLists from './LabelLists';
import SelectedLabels from './SelectedLabels';

export interface HighFilterModalProps extends ModalCustomProps {
  channelCode?: 'KA' | 'RESOURCES';
  filterData: {
    visible: boolean;
    checkedList: Array<any>;
  };
  setFilterData: Function;
  onSubmit?: Function;
  resourceType: Number;
}

const HighFilterModal: React.FC<HighFilterModalProps> = ({ filterData, setFilterData, onSubmit, channelCode = 'KA', resourceType = 0 }) => {

  const [checkedList, setCheckedList] = useState<string[]>(filterData.checkedList);
  const [treeData, setTreeData] = useState<DataNode[]>([]); // 获取tabs对应下的树状数据
  const [allTreeData, setAllTreeData] = useState<DataNode[]>([]); // 获取所有树状数据
  const [typeAllChildrenData, setTypeAllChildrenData] = useState<{[key: string | number]: Array<{[key: string | number]: any}>}>({}); // 分类下的所有子节点
  const [statuses, setStatuses] = useState<Array<{value: Number, label: String}>>([]);// tabs 状态
  const [status, setStatus] = useState('');
  const [currentTab, setCurrentTab] = useState(''); // 当前状态
  const [currentTabCheckedList, setCurrentTabCheckedList] = useState<React.Key[]>([]); // 当前tab下选中值列表


  // 当前tab下的所有的keys
  const currentTabKeys = typeAllChildrenData && typeAllChildrenData[currentTab] ? Object.keys(typeAllChildrenData[currentTab]) : [];

  /**
   * 关闭
   */
  const onCancel = () => {
    setFilterData({ ...filterData, visible: false });
  };

  /**
   * 初始化
   */
  const loadData = async () => {
    try {
      const all = await getLabels({ type: 'full', channelCode: channelCode, tab: resourceType === 0 ? 'placeTab' : 'spotTab' });
      setAllTreeData(all);

      getAllChildrenData(all);// 获取所有节点下的自己的

      setStatuses(all.map((item) => {
        return {
          key: item.key,
          label: item.title,
        };
      }));

    } catch (e) {
      console.log(e);
    }
  };

  const getAllChildrenData = (all) => {
    const allChildrenObj = {};
    all.map(item => {
      const { child } = getChildrenOptions(item, true);
      allChildrenObj[item.key] = child;
    });
    setTypeAllChildrenData(allChildrenObj);
  };


  /**
   * 获取当前节点的子节点
   * @param content
   * @param child
   * @returns
   */
  const getChildrenOptions = (content, ifFirst: boolean = false, child: {[key: string]: string} = {}, titleArr: Array<String> = []) => {

    if (!ifFirst) {
      titleArr.push(content.title);
    }

    if (content?.children) {
      for (let i = 0; i < content.children.length; i++) {
        getChildrenOptions(content.children[i], false, child, titleArr);
      }
      titleArr.pop();
    } else {
      child[content['key']] = titleArr.join('/');
      titleArr.pop();
    }
    return { child, titleArr };
  };

  /**
   * 获取分类下选中
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTypeChildData = () => {
    setCurrentTabCheckedList(gatherMethods(currentTabKeys, checkedList, 1)); // 获取当前tab下的所有keys与选中项的交集
  };

  /**
   * 提交完成
   */
  const onModalSubmit = () => {

    onSubmit && onSubmit(checkedList);
  };

  useEffect(() => {
    getTypeChildData();
    setStatus(currentTab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedList, currentTab]);

  useEffect(() => {
    setCheckedList(filterData.checkedList);
  }, [setCheckedList, filterData.checkedList]);

  useEffect(() => {
    if (filterData.visible) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.visible]);

  useEffect((val: string = '01') => {
    handleTabsChange(val);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTreeData]);

  /**
   * tabber切换
   * @param val tab值
   */
  const handleTabsChange = (val) => {
    setCurrentTab(val);

    let childrenData: DataNode[] = [];
    allTreeData.map(item => {
      if (item.key === val) {
        childrenData = item.children || [];
      }
    });
    setTreeData([{
      title: '全选',
      key: '全选',
      children: childrenData
    }]);


  };

  return (
    <Modal
      title='高级筛选'
      width='1456px'
      bodyStyle={{ height: '750px' }}
      open={filterData.visible}
      onCancel={onCancel}
      onOk={onModalSubmit}>
      <Alert message='使用高级查询后将清空普通查询的条件' type='info' style={{ marginBottom: '10px' }} />
      <Row gutter={24} style={{ height: '100%' }}>
        <Col span={14}>
          <StateTab options={statuses} onChange={handleTabsChange} activeKey={status + ''}></StateTab>
          <LabelLists
            currentTab={currentTab}
            checkedList={checkedList}
            currentTabCheckedList={currentTabCheckedList}
            setCheckedList={setCheckedList}
            treeData={treeData}
            typeAllChildrenData={typeAllChildrenData}/>
        </Col>
        <Col span={10}>
          <SelectedLabels typeAllChildrenData={typeAllChildrenData} checkedList={checkedList} setCheckedList={setCheckedList} />
        </Col>
      </Row>
    </Modal>
  );
};

export default HighFilterModal;
