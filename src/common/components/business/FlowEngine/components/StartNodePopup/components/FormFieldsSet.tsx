/**
 * @Description 开始节点的 表单权限 字段配置
 */
import { deepCopy } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { Checkbox, Radio, Space, Tree } from 'antd';
import { FC } from 'react';
import { v4 } from 'uuid'; // 用来生成不重复的key

import ContainerHeader from '../../ContainerHeader';
import styles from './index.module.less';

const radioOptions: any[] = [
  { label: '不可见', value: 3 },
  { label: '仅可见', value: 1 },
  { label: '可写', value: 2 },
];

// 递归遍历树节点，更新节点单选值
function updateNodeValue(data: any[], key: string, newValue: any): any {
  return data.map((node: any) => {
    if (node.key === key) {
      return { ...node, access: { ...node.access, ...newValue } }; // 找到目标节点，更新值
    } else if (node.children) {
      // 遍历子节点
      return {
        ...node,
        children: updateNodeValue(node.children, key, newValue),
      };
    } else {
      return node;
    }
  });
}

const FormFieldsSet: FC<any> = ({ objRef, setCopyObjRef }) => {
  const methods = useMethods({
    onCheckChange(e: { target: { checked: any } }, key: string) {
      const required = e.target.checked;
      objRef.fields = updateNodeValue(deepCopy(objRef.fields), key, {
        required,
      });
      setCopyObjRef({ ...objRef });
    },
    onRadioChange(e: { target: { value: any } }, key: string) {
      const value = e.target.value;
      if (value === 1 || value === 3) {
        // 如果仅可见或者不可见，清空不为空的值
        objRef.fields = updateNodeValue(deepCopy(objRef.fields), key, {
          value,
          required: null,
        });
      } else {
        objRef.fields = updateNodeValue(deepCopy(objRef.fields), key, {
          value,
        });
      }
      setCopyObjRef({ ...objRef });
    },
  });
  return (
    <>
      <ContainerHeader title={'字段配置'} />
      <div className={styles.container}>
        {objRef && !!objRef.fields?.length && (
          <Tree
            defaultExpandAll
            treeData={objRef.fields}
            fieldNames={{ title: 'name', key: 'key', children: 'children' }}
            titleRender={(nodeData: any) => (
              <Space align='start'>
                {nodeData.name}&nbsp;
                <Radio.Group
                  value={nodeData.access.value}
                  onChange={(e) => {
                    methods.onRadioChange(e, nodeData.key);
                  }}
                >
                  {radioOptions.map((item) => (
                    <Radio key={v4()} value={item.value}>
                      {item.label}
                    </Radio>
                  ))}
                </Radio.Group>
                {nodeData.access.value === 2 && (
                  <Checkbox
                    checked={nodeData.access.required}
                    onChange={(e) => {
                      methods.onCheckChange(e, nodeData.key);
                    }}
                  >
                  不为空
                  </Checkbox>
                )}
              </Space>
            )}
          />
        )}
      </div>
    </>
  );
};

export default FormFieldsSet;
