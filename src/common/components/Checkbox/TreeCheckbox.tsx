/**
 * 树状多选
 *
 *
  const options = [{
    label: '日均客流画像',
    value: '日均客流画像',
    children: [
      {
        label: '日均客流量',
        value: '日均客流量',
        options: [
          {
            label: '0-500',
            value: '0-500',
          },
          {
            label: '500-1000',
            value: '500-1000',
          },
          {
            label: '1000-5000',
            value: '1000-5000',
          },
          {
            label: '5000-10000',
            value: '5000-10000',
          },
          {
            label: '100000-50000',
            value: '100000-50000',
          },
          {
            label: '500000-100000',
            value: '500000-100000',
          }
        ]
      },
      {
        label: '日均客流男性占比',
        value: '日均客流男性占比',
        options: [
          {
            label: '高',
            value: '男-高',
          },
          {
            label: '中',
            value: '男-中',
          },
          {
            label: '底',
            value: '男-底',
          }
        ]
      }
    ],

  }];
 */
import { gatherMethods } from '@lhb/func';
import { Checkbox, Col, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import React, { useState } from 'react';

import styles from './index.module.less';
import TreeCheckboxGroup from './TreeCheckboxGroup';
import { TreeCheckboxProps } from './ts-config';

const TreeCheckbox: React.FC<TreeCheckboxProps> = ({ content, checkedList, setCheckedList, style }) => {

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(uniqueCheckedList(list));
    setIndeterminate(!!list.length && list.length < (content.options?.length || 0));
    setCheckAll(list.length === content.options?.length);
  };

  // 不在选项中的选中项
  const onNotfindOptionsCheckedList = (list) => {
    return gatherMethods(checkedList, onFindOptionsCheckedList(list), 2);
  };

  // 选项中的选中项
  const onFindOptionsCheckedList = (list) => {
    const findOptionsCheckedList: CheckboxValueType[] = [];
    if (!checkedList.length) {
      return list;
    } else {
      checkedList.map(item => {
        content.options?.map(iitem => {
          if (typeof iitem === 'object') {
            iitem.value === item && findOptionsCheckedList.push(item);
          } else if (iitem === item) {
            findOptionsCheckedList.push(item);
          }
        });
      });
    }
    return findOptionsCheckedList;
  };

  // 获取唯一选中项
  const uniqueCheckedList = (list) => {
    return gatherMethods(list, onNotfindOptionsCheckedList(list));
  };

  // 选择所有
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const children: Array<string> = Array.from(getChildrenOptions(content));
    setCheckedList(e.target.checked ? Array.from(new Set(checkedList.concat(children))) : removeAllChildrenOption(children, checkedList));
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  /**
   * 全选移除
   * @param children
   * @param checkedList
   * @returns
   */
  const removeAllChildrenOption = (children, checkedList) => {
    return checkedList.filter(item => !children.includes(item));
  };

  /**
   * 获取当前节点的子节点
   * @param content
   * @param child
   * @returns
   */
  const getChildrenOptions = (content, child: Set<string> = new Set()) => {
    content?.options?.map(item => child.add(item.value));

    if (content?.children) {
      for (let i = 0; i < content.children.length; i++) {
        getChildrenOptions(content.children[i], child);
      }
    }
    return child;
  };

  return (
    <div style={style}>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        {content.label}
      </Checkbox>
      <div className={styles.checkbox} >
        {content?.options?.length
          ? <Checkbox.Group value={checkedList} onChange={onChange} style={style} >
            <Row gutter={[24, 10]}>
              {content.options?.map((item:any, index) =>
                <Col span={6} key={'options' + '' + index}>
                  <Checkbox value={ typeof (item) === 'object' && item.value ? item.value : item}>{ typeof (item) === 'object' && item.value ? item.label : item}</Checkbox>
                </Col>
              )}
            </Row>
          </Checkbox.Group>
          : ''
        }

        {content?.children &&
          <TreeCheckboxGroup
            style={style}
            data={content?.children}
            checkedList={checkedList}
            setCheckedList={setCheckedList}/>
        }

      </div>
    </div>
  );
};

export default TreeCheckbox;
