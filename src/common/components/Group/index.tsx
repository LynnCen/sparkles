// 分组
import { Button } from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { FC, useEffect } from 'react';
import styles from './index.module.less';
import { deepCopy } from '@lhb/func';
export interface GroupProps {
  value: Array<any>; // 绑定的分组数据
  setValue: Function, // 更新值
  children: any; // 插槽
  getOriData: Function; // 获取原始数据，用于新增数据
  autoReset?: boolean; // 当数据条数为0的时候，是否自动新增 autoResetLen 条数据
  autoResetLen?: number; // 自动新增的数据条数，autoReset = true 时生效
  dittoVisible?: boolean; // 显示同上按钮
  dittoCoverData?: Object;// 点击同上按钮时，从外部传入覆盖的对象内容，覆盖方式：data = Object.assign({}, preItem, dittoCoverData)
  onDel?: Function; // 删除后的回调
  onAdd?: Function; // 新增后的回调
}

const Group:FC<GroupProps> = ({
  value = [],
  setValue,
  children,
  getOriData,
  autoReset = true,
  autoResetLen = 1,
  dittoVisible = false,
  dittoCoverData = {},
  onDel,
  onAdd,
}) => {

  useEffect(() => {
    if (autoReset && (!Array.isArray(value) || value.length <= 0)) {
      setValue(new Array(autoResetLen).fill(getOriData()));
    }
  }, [value]);

  // 删除
  const del = (item, index): any => {
    if (value.length <= 1) {
      return false;
    }
    const temp = value.slice();
    temp.splice(index, 1);
    setValue(temp);
    onDel && onDel(); // 删除完成回调
    // this.$emit('del', index, item); // 一般使用 index，所以放前面
  };

  // 新增
  const add = (): any => {
    if (typeof getOriData === 'function') {
      // value.push(getOriData());
      const data = getOriData();
      const temp = value.concat(data);
      setValue(temp);
      // 为什么报错
      // setValue([
      //   ...value,
      //   data
      // ]);
      onAdd && onAdd(); // 新增完成回调
    }
  };

  // 同上
  const ditto = (item, index) => {
    if (index > 0) {
      const preItem = deepCopy(value[index - 1]);
      value.splice(index, 1, Object.assign({}, preItem, dittoCoverData));
      const temp = value.slice();
      setValue(temp);
    }
  };

  return <div className={styles.group}>
    {Array.isArray(value) ? value.map((item, index) => (
      <div key={index} className={styles['group-item']} >
        {children && <>{children(item, index)}</>}
        <div className={styles.btns}>
          {dittoVisible && index > 0 && (<Button type='text' className='color-help mr-5' onClick={() => ditto(item, index)}>同上</Button>)}
          {index === value.length - 1 && (<Button type='link' className='mr-5' onClick={() => add()}><PlusCircleOutlined/>添加</Button>)}
          {value.length > 1 && index !== value.length - 1 && (<Button type='link' className='color-help mr-5' onClick={() => del(item, index)}><DeleteOutlined />删除</Button>)}
        </div>
      </div>
    )) : null}
  </div>;
};

export default Group;
