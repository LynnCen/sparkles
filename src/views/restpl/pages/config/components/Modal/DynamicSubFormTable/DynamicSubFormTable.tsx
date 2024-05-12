import V2Title from '@/common/components/Feedback/V2Title';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { PlusOutlined, MenuOutlined } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';
import { Button, Popconfirm, Space, Table } from 'antd';
import React, { useState } from 'react';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import PropertyTreeDraw, { PropertyTreeDrawInfo } from './Draw/PropertyTreeDraw';
import { SubFormPropertyConfigModalInfo } from '../../../ts-config';
import SubFormPropertyConfigModal from './SubFormPropertyConfigModal';
import { deepCopy } from '@lhb/func';
import styles from './index.module.less';

type EditableTableProps = Parameters<typeof Table>[0];

export interface SubFormDataType {
  rowKey: React.Key;
  name: string;
  identification: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />)
const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

const DynamicSubFormTable: React.FC<any> = ({
  csName = 'templateRestriction',
  subFormData = [],
  setSubFormData,
  propertyConfigId
}) => {

  const [count, setCount] = useState(0);
  const [propertyTreeDrawInfo, setPropertyTreeDrawInfo] = useState<PropertyTreeDrawInfo>({
    visible: false,
    propertyId: undefined,
    propertyConfigId: '',
  }); // 子表单新增字段弹窗
  const [subFormPropertyConfigModalInfo, setSubFormPropertyConfigModalInfo] = useState<SubFormPropertyConfigModalInfo>({
    visible: false,
  }); // 修改属性配置弹窗

  const defaultColumns: (ColumnTypes[number] & { dataIndex: string })[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 50,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '属性名称',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: '属性标识',
      dataIndex: 'identification',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record: any, index: number) =>
        subFormData.length >= 1 ? (
          <Space size='small'>
            <Button type='link' onClick={() => methods.handleEdit(record)}>编辑</Button>
            <Popconfirm title="确定删除吗?" onConfirm={() => methods.handleDelete(index)}>
              <Button type='link'>删除</Button>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  const methods = useMethods({
    /**打开编辑子表单属性配置弹窗 */
    handleEdit(record: any) {
      setSubFormPropertyConfigModalInfo({
        ...record,
        propertyConfigId,
        visible: true,
      });
    },
    /**编辑子表单属性配置修改配置 */
    handleUpdate(row: any) {
      let _subFormData = deepCopy(subFormData).map((item) => {
        if (item.rowKey === row.rowKey) {
          return item = row;
        } else {
          return item
        }
      });
      setSubFormData(_subFormData)
      setSubFormPropertyConfigModalInfo({
        ...subFormPropertyConfigModalInfo,
        visible: false,
      });
    },
    /**点击新增字段 */
    handleAdd() {
      setPropertyTreeDrawInfo({
        ...propertyTreeDrawInfo,
        propertyConfigId,
        visible: true
      });
    },
    addRow(row: any) {
      if (subFormData.length >= 10) {
        V2Message.warning('添加失败，子表单最多添加10个字段~')
      } else {
        setSubFormData([...subFormData, row]);
        setCount(count + 1);
        V2Message.success('添加成功');
      }
    },
    handleDelete(ind: number) {
      const newData = subFormData.filter((item, index) => index !== ind);
      setSubFormData(newData);
    },
    onSortEnd({ oldIndex, newIndex }: SortEnd) {
      if (oldIndex !== newIndex) {
        const newData = arrayMoveImmutable(subFormData.slice(), oldIndex, newIndex).filter(
          (el) => !!el,
        );
        setSubFormData(newData);
      }
    }
  })

  const DraggableContainer = (props: SortableContainerProps) => {
    return (
      <SortableBody
        useDragHandle
        // disableAutoscroll
        helperClass={styles.rowDragging}
        onSortEnd={methods.onSortEnd}
        {...props}
      />
    )
  };

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    const index = subFormData.findIndex(x => x.rowKey === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };


  return (
    <>
      <div>
        <V2Title>子表单设置</V2Title>
        <V2FormInputNumber
          className='mt-12'
          label="限制行数"
          name={[csName, 'maxRows']}
          min={1}
          max={20}
          precision={0}
          required
          placeholder='请填写最大行数，最大 20 行'
          formItemConfig={{
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
          }}
        />
        <Table
          rowKey='rowKey'
          bordered
          dataSource={subFormData}
          columns={defaultColumns as ColumnTypes}
          pagination={false}
          scroll={{ y: 220 }}
          className={styles.customTable}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
        <Button disabled={subFormData.length >= 10} onClick={methods.handleAdd} style={{ marginTop: 16, width: '100%' }}>
          <PlusOutlined /> 新增字段
        </Button>
      </div>
      <PropertyTreeDraw
        onAddRow={methods.addRow}
        propertyTreeDrawInfo={propertyTreeDrawInfo}
        setPropertyTreeDrawInfo={setPropertyTreeDrawInfo}
      />
      <SubFormPropertyConfigModal
        subFormPropertyConfigModalInfo={subFormPropertyConfigModalInfo}
        setSubFormPropertyConfigModalInfo={setSubFormPropertyConfigModalInfo}
        onSuccessCb={methods.handleUpdate}
      />
    </>
  );
};

export default DynamicSubFormTable;