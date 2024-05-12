import { getTemplateDetail, getTemplateSelection, saveTemplate } from '@/common/api/common';
import IconFont from '@/common/components/IconFont';
import { Button, Drawer, Form, Input, InputNumber, message, Select, Table } from 'antd';
import React, { useContext, useRef } from 'react';
import { FC, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import styles from '../../entry.module.less';
import cs from 'classnames';
import { urlParams } from '@lhb/func';

const EditableContext = React.createContext(null);

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form as any}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  isNumber,
  isSelect,
  isFixed,
  children,
  dataIndex,
  record,
  handleSave,
  options,
  ...restProps
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const form = useContext<any>(EditableContext);
  const placeholder = `请输入${title}`;
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable && !isFixed) {
    childNode = editing ? (
      (
        <>
          <Form.Item
            name={dataIndex}
          >
            {isNumber
              ? <InputNumber
                ref={inputRef}
                min={1}
                max={999}
                onPressEnter={save}
                onBlur={save}
                precision={0}
              />

              : isSelect
                ? <Select
                  ref={inputRef}
                  options={options}
                  placeholder={placeholder}
                  defaultOpen
                  onBlur={save}
                />
                : <Input
                  ref={inputRef}
                  onPressEnter={save}
                  onBlur={save}
                  placeholder={placeholder}
                  maxLength={20}
                />}
          </Form.Item>
        </>
      )
    ) : (
      <div
        className='editable-cell-value-wrap'
        onClick={toggleEdit}
      >
        <div>
          {children}

        </div>
        {
          isSelect ? <DownOutlined className='color-info'/> : null
        }
      </div>
    )
    ;
  }
  return <td {...restProps} className={cs(isFixed && 'isFixed')}>{childNode}</td>;
};

const DefineDrawer:FC<any> = ({
  open,
  setOpen,
  id,
  onSearch
}) => {
  const tenantId = urlParams(location.search)?.id;
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [current, setCurrent] = useState<number>(1);
  const [options, setOptions] = useState<any>();
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    getTemplateSelection({ keys: ['componentType'] }).then((val) => {
      const res = val.componentType.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.name
        };
      });
      setOptions(res);
    });
    getTemplateDetail({ id: id, tenantId: +tenantId, }).then((val) => {
      const arr = val.components.map((item) => {
        return {
          ...item,
          minLen: item.checkRule?.minLen,
          maxLen: item.checkRule?.maxLen
        };
      });
      setDataSource(arr);
      setData(val);
    });
  }, [id]);

  const onClose = () => {
    setOpen(false);
    onSearch();
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter(item => !key.includes(item.index));
    setDataSource(newData);
  };
  // 处理“MB0123”的加一
  const handleStrAdd = (val) => {
    const arr = val.split('');
    // 判断是否往前进一位
    let flag = true;
    for (let i = arr.length - 1; i >= 0; i--) {
      // 排除当前位不是数字的情况
      if (Number.isNaN(+arr[i])) {
        if (flag) {
          arr.splice(i, 0, 1);
        } else {
          return arr;
        }
        return arr;
      }

      if (flag) {
        arr[i] = +arr[i] + 1;
        if (+arr[i] === 10) {
          flag = true;
          arr[i] = 0;
          arr[i - 1] = +arr[i - 1] + 1;
        }
      }
      flag = false;
    }
    return arr;
  };

  const handleAdd = () => {
    if (dataSource.length >= 20) {
      message.error('最多支持20个字段的自定义');
      return;
    }
    const lastData = dataSource[dataSource.length - 1];
    const indexName = handleStrAdd(lastData.indexName).join('');
    const newData:any = {
      key: lastData.id,
      id: lastData.id + 1,
      index: lastData.index + 1,
      indexName: `${indexName}`,
      isFixed: 0,
      minLen: 0,
      maxLen: 1,
      name: '请输入字段名称',
      templateId: lastData.templateId,
      typeName: '文本框',

    };
    setCurrent(Math.floor(dataSource.length / 10) + 1);
    // @ts-ignore
    setDataSource([...dataSource, newData]);

  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.index === item.index);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };


  const defaultColumns:any = [
    {
      title: '序号',
      dataIndex: 'indexName',
      width: 187,
      editable: false,
      render: (value) =>
        <span className='indexContent'>
          {value}
        </span>
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      width: 290,
      editable: true,
    },
    {
      title: '字段类型',
      dataIndex: 'typeName',
      width: 180,
      editable: true,
      isSelect: true
    },
    {
      title: '最大字符数',
      dataIndex: 'maxLen',
      width: 265,
      editable: true,
      isNumber: true
    },
  ];

  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        isSelect: col.isSelect,
        isNumber: col.isNumber,
        isFixed: record.isFixed,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        options
      }),
    };
  });

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: record => ({
      disabled: record.isFixed // 配置无法勾选的列
    }),
  };
  // 保存并导入
  const handleImport = () => {
    const res = dataSource.map((item) => {
      // delete item.key;
      const type = options.filter((val) => item.typeName === val.name)[0].id;
      return {
        ...item,
        checkRule: {
          minLen: item?.minLen,
          maxLen: item?.maxLen,
        },
        type
      };
    });

    saveTemplate({
      id: id,
      tenantId: +tenantId,
      code: data?.code,
      name: data?.name,
      excelUrl: data?.excelUrl,
      remark: data?.remark,
      components: [...res]
    }).then((val) => {
      if (val) {
        onClose();
      }
    });
  };
  return (
    <div className={styles.definerDrawerCon}>
      <div className={styles.closeIcon}>
        <IconFont iconHref={'iconic-closexhdpi'} />
      </div>
      <Drawer
        className='definerDrawer'
        title='模板定义'
        placement='right'
        onClose={onClose}
        open={open}
        width={1008}
      >
        <div>
          <Button onClick={handleAdd} type='primary' style={{ marginBottom: 13 }}>
          新增一行
          </Button>
          <Button className={styles.deleteBtn} style={{ marginBottom: 13 }} onClick={() => handleDelete(selectedRowKeys)}>
            删除
          </Button>
          <Table
            rowSelection={rowSelection}
            rowKey={record => record.index}
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={{
              current: current,
              onChange: (e) => setCurrent(e)
            }}
          />
        </div>
        <div className='bottomBtn'>
          <span className='count'>
            共
            <span className='num'>{dataSource.length}</span>
             条
          </span>
          <Button
            className='cancelBtn'
            onClick={() => onClose()}
          >取消</Button>
          <Button
            type='primary'
            onClick={() => handleImport()}
          >保存并导入</Button>
        </div>
      </Drawer>

    </div>
  );
};
export default DefineDrawer;
