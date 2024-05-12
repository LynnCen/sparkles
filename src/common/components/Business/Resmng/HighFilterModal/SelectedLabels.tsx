import React, { useEffect, useState } from 'react';
import Module from '@/common/components/Module/Module';
import { Popconfirm, Tag } from 'antd';

const SelectedLabels: React.FC<{
  typeAllChildrenData?: {[key: string | number]: Array<{[key: string | number]: any}>};
  checkedList: React.Key[];
  setCheckedList: any;
}> = ({ checkedList, setCheckedList, typeAllChildrenData }) => {
  const [allChildrenData, setAllChildrenData] = useState<{[key: string]: string}>({});
  /**
   * 点击某个进行关闭
   * @param tag 具体项
   */
  const handleClose = (tag) => {
    setCheckedList(checkedList.filter(item => item !== tag));
  };
  /**
   * 全部清空
   */
  const handleCloseAll = () => {
    setCheckedList([]);
  };

  /**
   * 获取标题
   * @returns string 标题
   */
  const getModuletitle = () => {
    let title = '已选标签';
    if (checkedList && checkedList.length) {
      title += '（' + checkedList.length + '）';
    }
    return title;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAllChildrenData = () => {
    const allObj = {};
    // eslint-disable-next-line guard-for-in
    for (const item in typeAllChildrenData) {
      Object.assign(allObj, typeAllChildrenData[item]);
    }
    setAllChildrenData(allObj);
  };

  useEffect(() => {
    getAllChildrenData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeAllChildrenData]);

  return (
    <Module
      style={{ height: '700px' }}
      title={getModuletitle()}
      titleRight={
        <Popconfirm
          placement='topRight'
          title='确定全部清除吗？'
          onConfirm={handleCloseAll}
          okText='确认'
        >
          <span className='color-btn-primary pointer'>清空</span>
        </Popconfirm>
      }>
      <div style={{
        height: '607px',
        overflowY: 'scroll',
      }}>
        {checkedList.map((item:any, index) =>
          <Tag
            key={item + ' ' + index}
            style={{ marginBottom: '10px', marginRight: '10px', }}
            closable
            onClose={e => {
              e.preventDefault();
              handleClose(item);
            }}
          >
            {allChildrenData[item]}
          </Tag>
        )}
      </div>
    </Module>
  );
};

export default SelectedLabels;
