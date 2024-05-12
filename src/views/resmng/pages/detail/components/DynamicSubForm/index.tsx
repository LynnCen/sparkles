/**
 * @Description 子表单
 */
import { PlusOutlined } from '@ant-design/icons';
// import type { InputRef } from 'antd';
import { Button, Form, Table } from 'antd';
import type { FormListOperation } from 'antd/es/form';
import React, { useMemo } from 'react';
import SubFormDynamicComponent from './components/SubFormDynamicComponent';
import { useMethods } from '@lhb/hook';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { getKeysFromObjectArray } from '@lhb/func';
import { ControlType } from '@/common/enums/control';

import styles from './index.module.less';


type EditableTableProps = Parameters<typeof Table>[0];


type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const DynamicSubForm: React.FC<any> = ({
  form,
  label,
  valuePropName,
  restriction,
  formConfigList = []
}) => {
  // 时间区间选择器宽 260
  const columnWidth: Array<string | number> = [ControlType.TIME.value];

  const subFormRequired = useMemo(() => {
    const required = getKeysFromObjectArray(formConfigList, 'required').includes(1);
    return required;
  }, [formConfigList]);


  const columns = useMemo(() => {
    const _columns = formConfigList.map((col) => {
      const renderName = () => {
        // 有别名先取别名
        const name = col.anotherName ? col.anotherName : col.name;
        return <Form.Item
          className={styles.columnTitle}
          label={name}
          required={col.required === 1}
          colon={false}
          labelCol={{
            span: 24
          }}
          wrapperCol={{
            span: 0
          }}
        />;
      };
      return {
        title: renderName(),
        dataIndex: String(col.id), // 不使用propertyId是因为组件可以重复，id 不会重复
        ellipsis: true,
        width: columnWidth.includes(col.controlType) ? 260 : 220,
        render(_, { field }) {
          return (
            <SubFormDynamicComponent
              valuePropName={[field.name, String(col.id), String(col.propertyId)]}
              prop={{ ...col }}
            />
          );
        },
      };
    }).concat({
      title: '操作',
      width: 100,
      dataIndex: 'operation',
      render: (_, { field, operation }) => {
        return <Button type='link' onClick={() => operation.remove(field.name)}>删除</Button>;
      }
    },);

    return [{
      title: '序号',
      width: 50,
      dataIndex: 'key',
      render: (_, { field }) => {
        return <span>{field.name + 1}</span>;
      }
    }, ..._columns];
  }, [formConfigList]);


  const methods = useMethods({
    addRow(operation: FormListOperation) {
      const limitRows = restriction?.maxRows || 20;
      const rows = form.getFieldValue([...valuePropName, 'subForm'])?.length || 0;
      if (rows >= limitRows) {
        V2Message.warning(`最多添加${limitRows}行`);
      } else {
        operation.add();
      }
    },
  });


  return (
    <div>
      {/* <V2Title type='H3' text={label} className='mb-12' /> */}
      <Form.Item label={label} required={subFormRequired} className='mb-12' >
        <Form.List
          name={[...valuePropName, 'subForm']}
          // initialValue={[{ subForm: [] }]} // 暂时有问题，未填写列可能会没带入
          rules={[
            {
              validator: async (_, names) => {
                if (subFormRequired && (!names || !names.length)) {
                  return Promise.reject(new Error(`请填写${label.props.children.props.children}！`));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(fields, operation) => {
            // 映射数据，用于渲染表格
            const dataSources = fields.map((field) => ({
              field,
              operation, // 把操作方法提供给每一行
            }));
            return (<>
              <Table
                className={styles.subFormTable}
                bordered
                dataSource={dataSources}
                columns={columns as ColumnTypes}
                rowKey={(row: any) => row.field.key}
                pagination={false}
                scroll={{ x: 600, y: 600 }}
              />
              <div className={styles.subFormFooter}>
                <Button
                  type='link'
                  onClick={() => methods.addRow(operation)}
                  icon={<PlusOutlined />}>
                  新增行
                </Button>
              </div>
            </>
            );
          }}
        </Form.List>
      </Form.Item>
    </div >
  );
};

export default DynamicSubForm;
