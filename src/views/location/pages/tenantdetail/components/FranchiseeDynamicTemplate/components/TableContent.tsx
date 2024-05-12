/**
 * @Description Table内容
 */
import { FC } from 'react';
import { Table } from 'antd';
import { getRestriction } from '../ways';
import IconFont from '@/common/components/IconFont';
import ShowMore from '@/common/components/Data/ShowMore';
import Row from './Row';
import Rechristen from './Rechristen';
import FieldSwitch from './FieldSwitch';
import Permission from './Permission';

const TableContent: FC<any> = ({
  templateId, // 模板id
  expandedRowKeys, // 展开行的keys
  dataSource, // 数据源
  propertyTreeDrawInfo, // 选择字段的弹窗数据
  setRechristenData, // 设置重命名
  setExpandedRowKeys, // 设置展开行
  setPropertyTreeDrawInfo, // 设置选择字段的弹窗数据
  setLimitData, // 设置限制弹窗数据
  setFormulaData, // 设置计算公式
  setAssociatedDisplayData, // 设置关联显示
  loadData
}) => {

  const columns = [
    {
      title: '模块信息',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 220,
      render: (value: any) => <div className='bold'>{value}</div>,
    },
    { title: '字段名', dataIndex: 'propertyName', key: 'propertyName', width: 150, ellipsis: true },
    { title: '属性标识', dataIndex: 'identification', key: 'identification', width: 150, ellipsis: true, render: (text) => <ShowMore maxWidth='130px' text={text} /> },
    {
      title: '说明',
      dataIndex: 'remark',
      key: 'remark',
      width: 80,
      render: (text) => <ShowMore maxWidth='220px' text={text} />,
    },
    {
      title: '重命名',
      dataIndex: 'anotherName',
      key: 'anotherName',
      width: 120,
      render: (value: any, row) => (<>
        {
          !row.isGroup ? <Rechristen
            row={row}
            setRechristenData={setRechristenData}
          /> : <></>
        }
      </>)
    },
    {
      title: '设为必填',
      dataIndex: 'required',
      key: 'required',
      width: 78,
      render: (value, row) => {
        return <>
          {
            !row.children && row?.isFixed === 1
              ? <FieldSwitch
                templateId={templateId}
                row={row}
                type='required'
                loadData={loadData}
                isChecked={!!value}
              />
              : <></>
          }
        </>;
      },
    },
    {
      title: '换行显示',
      dataIndex: 'nextLine',
      key: 'nextLine',
      width: 80,
      render: (_, row) => {
        return <>
          {
            !row.children
              ? <FieldSwitch
                templateId={templateId}
                row={row}
                type='nextLine'
                loadData={loadData}
                isChecked={!!(getRestriction(row)?.nextLine)}
              />
              : <></>
          }
        </>;
      },
    },
    {
      title: '禁止编辑',
      dataIndex: 'disable',
      key: 'disable',
      width: 80,
      render: (_, row) => {
        return <>
          {
            !row.children
              ? <FieldSwitch
                templateId={templateId}
                row={row}
                type='disable'
                loadData={loadData}
                isChecked={!!(getRestriction(row)?.disable)}
              />
              : <></>
          }
        </>;
      },
    },
    {
      title: '操作',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 210,
      render: (value: any, record) => (
        <Permission
          templateId={templateId}
          value={value}
          record={record}
          propertyTreeDrawInfo={propertyTreeDrawInfo}
          setExpandedRowKeys={setExpandedRowKeys}
          setPropertyTreeDrawInfo={setPropertyTreeDrawInfo}
          setLimitData={setLimitData}
          setFormulaData={setFormulaData}
          setAssociatedDisplayData={setAssociatedDisplayData}
          loadData={loadData}
        />
      ),
    },
  ];

  return <>
    {/* 暂时先不换V2Table */}
    <Table
      components={{
        body: {
          row: (props) => Row({ ...props, templateId, loadData }),
        },
      }}
      bordered
      rowKey='key'
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      expandable={{
        expandedRowKeys: expandedRowKeys,
        onExpandedRowsChange: (expandedRows) => {
          setExpandedRowKeys(expandedRows);
        },
        // 只有需要折叠操作的table，才开始iconfont替换
        expandIcon: ({ expanded, onExpand, record }) => {
          return expanded ? (
            record.children && record.children.length ? (
              <IconFont
                style={{ color: '#006AFF', marginRight: '5px', marginBottom: '1px' }}
                iconHref='pc-common-icon-ic_open'
                onClick={(e) => onExpand(record, e)}
              />
            ) : (
              <span className='mr-18' />
            )
          ) : record.children && record.children.length ? (
            <IconFont
              style={{ color: '#AAAAAA', marginRight: '5px', marginBottom: '1px' }}
              iconHref='pc-common-icon-a-ic_fold'
              onClick={(e) => onExpand(record, e)}
            />
          ) : (
            <span className='mr-18' />
          );
        },
      }}
      className='mt-20'
    />
  </>;
};

export default TableContent;
