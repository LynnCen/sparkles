/**
 * @Description 部门岗位绑定
 */
import React, { FC, useEffect, useRef, useState } from 'react';
import { Modal, Divider, Row, Col, message } from 'antd';
import { deepCopy, isArray } from '@lhb/func';
import {
  roleBindOfDepartmentAndPost,
  roleDetail
} from '@/common/api/role';
// import cs from 'classnames';
// import styles from './entry.module.less';
import Item from './components/Item';
import IconFont from '@/common/components/IconFont';

function initItem() {
  return {
    departmentIds: [], // 部门ids
    positionId: '' // 岗位id
  };
}
const ModalOfBindPosition: FC<any> = ({
  modalData, // 弹窗数据
  onCancel, // 取消
  departmentListData, // 部门列表
  postListData, // 岗位列表
}) => {
  const itemRefs: any = useRef([
    React.createRef()
  ]);
  const lockRef = useRef(false);
  const { visible, roleId } = modalData;
  // const [detailData, setDetailData] = useState<any>({}); // 详情数据
  const maxGroup = 5; // 最大组数
  const [itemArr, setItemArr] = useState<any[]>([ // 部门岗位分组
    initItem()
  ]);

  useEffect(() => {
    if (!visible) return;
    if (!roleId) return;
    loadData();
  }, [visible, roleId]);

  const loadData = async () => {
    const detail = await roleDetail({ id: roleId }); // 角色详情
    const { departList } = detail || {};
    if (!isArray(departList)) return;
    const itemIdArr = departList.map((item: any) => {
      const { departments, position } = item;
      return {
        departmentIds: departments.map((depart: any) => depart.id),
        positionId: position?.id || '',
      };
    });
    setItemArr(itemIdArr);
  };
  const addHandle = () => { // 添加分组
    const itemArrGroup = [...itemArr, initItem()];
    itemRefs.current.push(React.createRef());
    setItemArr(itemArrGroup);
  };
  const deleteHandle = (index: number) => { // 删除分组
    const itemArrGroup = deepCopy(itemArr);
    itemArrGroup.splice(index, 1);
    itemRefs.current.splice(index, 1);
    setItemArr(itemArrGroup);
  };
  const changeHandle = (index: number, changedValues: any) => { // 表单数据和数组项同步
    const itemArrGroup = [...itemArr];
    itemArrGroup[index] = changedValues;
    setItemArr(itemArrGroup);
  };
  const onSubmit = async () => { // 保存
    const itemPromiseArr: any[] = [];
    itemRefs.current.forEach((item: any) => {
      itemPromiseArr.push(item.current.submit());
    });
    await Promise.all(itemPromiseArr);
    if (lockRef.current) return;
    lockRef.current = true;
    roleBindOfDepartmentAndPost({
      roleId,
      list: itemArr
    }).then(() => {
      message.success('绑定成功');
      cancelHandle();
    }).finally(() => {
      lockRef.current = false;
    });
  };
  const cancelHandle = () => {
    setItemArr([ // 部门岗位分组
      initItem()
    ]);
    onCancel();
  };

  return (
    <Modal
      title='部门岗位绑定'
      onCancel={cancelHandle}
      destroyOnClose
      onOk={onSubmit}
      open={visible}
      keyboard={false}
      maskClosable={false}
      width={400}
    >
      {
        isArray(itemArr) ? itemArr.map((item: any, index: number) => <>
          <Row
            gutter={20}
            align='middle'>
            <Col span={19}>
              <Item
                ref={itemRefs.current[index]}
                index={index}
                item={item}
                departmentListData={departmentListData}
                postListData={postListData}
                changeHandle={changeHandle}
              />
            </Col>
            <Col span={5} className='fs-18 ct'>
              {
                index === ((itemArr?.length || 1) - 1) && index < maxGroup - 1 ? <IconFont
                  iconHref='iconadd-car'
                  className='c-006'
                  onClick={addHandle}/> : null
              }
              {
                index > 0 || (itemArr?.length > 1) ? <span className='pl-12'>
                  <IconFont
                    iconHref='iconremove-circle'
                    className='color-danger'
                    onClick={() => deleteHandle(index)}/>
                </span> : null
              }
            </Col>
          </Row>
          {
            index < ((itemArr?.length || 1) - 1) ? <Divider style={{
              borderTopColor: '#eee',
              margin: '12px 0'
            }}/> : null
          }
        </>) : <></>
      }
    </Modal>
  );
};

export default ModalOfBindPosition;
