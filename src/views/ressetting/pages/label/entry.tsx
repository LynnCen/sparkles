import { labelClassificationList } from '@/common/api/label';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { PlusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { FC, useMemo, useState } from 'react';
import Filters from './components/Filters';
import LabelClassificationModal from './components/Modal/LabelClassificationModal';
import LabelModal from './components/Modal/LabelModal';
import styles from './entry.module.less';
import { LabelClassificationModalInfo, LabelModalInfo } from './ts-config';
import { KeepAlive } from 'react-activation';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { refactorPermissions } from '@lhb/func';

const Label: FC<any> = () => {
  const { Text } = Typography;
  const columns = [
    {
      key: 'name',
      title: '分类名称',
      render: (_, record) => {
        if (record.isLabel) {
          return null;
        } else {
          return <Text strong>{record.name}</Text>;
        }
      },
    },
    // {
    //   key: 'id',
    //   title: '标签ID',
    //   render: (_, record) => {
    //     if (record.isLabel) {
    //       return record.id;
    //     } else {
    //       return null;
    //     }
    //   },
    // },
    {
      key: 'name',
      title: '标签名称',
      width: 80,
      render: (_, record) => {
        if (record.isLabel) {
          return record.name;
        } else {
          return null;
        }
      },
    },
    {
      title: '操作',
      key: 'permissions',
      render: (_, record) => {
        return (
          <Operate
            showBtnCount={5}
            operateList={refactorPermissions(record.permissions)}
            onClick={(btn: any) => methods[btn.func](record)}
          />
        );
      },
    },
  ];
  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const [params, setParams] = useState({});
  const [labelClassificationModalInfo, setLabelClassificationModalInfo] = useState<LabelClassificationModalInfo>({
    visible: false,
  });
  const [labelModalInfo, setLabelModalInfo] = useState<LabelModalInfo>({ visible: false });
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      if (item.event === 'create') {
        res.icon = <PlusOutlined />;
      }
      return res;
    });
  }, [operateExtra]);

  const { loadData, loop, onSearch, ...methods } = useMethods({
    loadData: async (params) => {
      const result = await labelClassificationList(params);
      setOperateExtra(result?.meta?.permissions || []);
      return { dataSource: loop(result.objectList) };
    },
    // 子分类和子标签组装成树状结构
    loop(objectList) {
      if (!objectList) {
        return [];
      }
      objectList.forEach((item) => {
        item.isLabel = false;
        item.oid = item.id;
        item.children = [];

        if (item.childList && item.childList.length) {
          item.children = item.children.concat(loop(item.childList));
        }
        if (item.labelResponseList && item.labelResponseList.length) {
          item.labelResponseList.forEach((label) => {
            label.oid = 'label-' + label.id;
            label.isLabel = true;
          });
          item.children = item.children.concat(item.labelResponseList);
        }
      });
      return objectList;
    },
    handleCreateClassification() {
      setLabelClassificationModalInfo({ visible: true });
    },
    handleCreateSubClassification(record) {
      setLabelClassificationModalInfo({ visible: true, parentId: record.id });
    },
    handleUpdateClassification(record) {
      setLabelClassificationModalInfo({ ...record, visible: true });
    },
    handleDeleteClassification(record) {
      V2Confirm({
        onSure: () => {
          post('/labelClassification/delete', { id: record.id }, true).then(() => {
            onSearch();
          });
        },
        content: '此操作将永久删除该数据, 是否继续？'
      });
    },
    handleCreateLabel(record) {
      setLabelModalInfo({ labelClassificationId: record.id, visible: true });
    },
    handleUpdate(record) {
      setLabelModalInfo({
        labelClassificationId: record.labelClassificationId,
        id: record.id,
        name: record.name,
        visible: true,
      });
    },
    handleDelete(record) {
      V2Confirm({
        onSure: (modal) => {
          post('/label/delete', { id: record.id }, true).then(() => {
            modal.destroy();
            onSearch();
          });
        },
        content: '此操作将永久删除该数据, 是否继续？'
      });
    },

    // 查询/重置
    onSearch(filter: any) {
      setParams({ ...params, ...filter });
    },
  });

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <div className={styles.content}>
          <Filters onSearch={onSearch} />
          <div style={{ marginBottom: '10px' }}>
            <Operate operateList={operateList} onClick={(btn) => methods[btn.func](params)} />
          </div>
          <Table
            rowKey='oid'
            onFetch={loadData}
            pagination={false}
            filters={params}
            defaultExpendAll={false}
            // rowSelection={{
            //   onChange: (_, selectedRows) => {
            //     console.log(selectedRows);
            //   },
            //   checkStrictly: false,
            // }}
            columns={columns}
          />
          <LabelClassificationModal
            labelClassificationModalInfo={labelClassificationModalInfo}
            setLabelClassificationModalInfo={setLabelClassificationModalInfo}
            onSearch={onSearch}
          />
          <LabelModal labelModalInfo={labelModalInfo} setLabelModalInfo={setLabelModalInfo} onSearch={onSearch} />
        </div>
      </div>
    </KeepAlive>
  );
};

export default Label;
