/**
 * @Description 重点品牌关注信息
 */
import { Switch } from 'antd';
import { downloadFile, refactorPermissions } from '@lhb/func';
import React, { FC, useMemo, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { OperateButtonProps, Permission } from '@/common/components/Operate/ts-config';
import { brandReorder, brandSetTop, deleteIndustryBrand, exportAllBrand, getIndustryBrand, importIndustryBrand, updateIndustryBrandShowStatus } from '@/common/api/system';
import EditModal from './EditModal';
import styles from '../../entry.module.less';
import IconFont from '@/common/components/IconFont';
import ImportModal from '@/common/components/business/ImportModal';
import { competitionType } from '../../ts-config';
import V2Table from '@/common/components/Data/V2Table';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { SortableContainer, SortableContainerProps, SortableElement, SortableHandle, SortEnd } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import V2Container from '@/common/components/Data/V2Container';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import SetAreaModal from './SetAreaModal';
import { bigdataBtn } from '@/common/utils/bigdata';

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const BrandInfo: FC<any> = ({ mainHeight }) => {
  const tableRef: any = useRef(null);

  const columns: any[] = [
    {
      title: '排序',
      key: 'sort',
      width: 30,
      fixed: 'left',
      dragChecked: true,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    { key: 'name', title: '品牌名称', dragChecked: true, width: 120 },
    { key: 'shortName', title: '品牌简称', dragChecked: true, width: 120,
      render: (value) => value || '-'
    },
    { key: 'competition', title: '竞合关系', dragChecked: true, width: 120,
      render: (value) => (
        !value ? '-'
          : <span>
            {
              competitionType.map((item) =>
                item.value === value ? item.label : ''
              )
            }
          </span>
      )
    },
    {
      key: 'color', title: '聚合饼图颜色', dragChecked: true, with: 100, width: 120,
      render: (value) =>
        <div style={{
          backgroundColor: value || 'transparent',
          width: '20px',
          height: '20px',
          borderRadius: '50%'
        }}>{value ? '' : '-'}</div>
    },
    {
      key: 'logo', title: '品牌logo', dragChecked: true, width: 120,
      render: (value) => (
        value
          ? (<div className={styles.logoBorder} >
            <img src={value} />
          </div >) : <span className={styles.noLogo}> -</span>

      )
    },
    {
      key: 'url', title: '品牌数据', dragChecked: true, width: 120,
      render: (value) => {
        return (value === null ? '-' : (
          <div className={styles.brandBorder}>
            <IconFont iconHref='icon-file_icon_excel' />
            <span className={styles.brandText}>{value.split('attname=')[1]}</span>
          </div>
        ));
      }
    },
    {
      key: 'username', title: '创建人', dragChecked: true, width: 120,
    },
    {
      key: 'competitorShowStatus',
      title: '竞品分析展示',
      width: 150,
      dragChecked: true,
      fixed: 'right',
      render: (value, row) => renderSwitch(value, row, 3)
    },
    {
      key: 'showStatus',
      title: '行业地图显示状态',
      width: 150,
      dragChecked: true,
      fixed: 'right',
      render: (value, row) => renderSwitch(value, row, 1)
    },
    {
      key: 'recommendShowStatus',
      title: '开店区域推荐显示状态',
      width: 180,
      dragChecked: true,
      fixed: 'right',
      render: (value, row) => renderSwitch(value, row, 2)
    },
    {
      key: 'permissions',
      title: '操作',
      dragChecked: true,
      fixed: 'right',
      render: (value: Permission[], record) => (
        <V2Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: OperateButtonProps) => methods[btn.func as string](record)}
        />
      ),
    },
  ];

  /**
   * @description 渲染switch
   * @param value
   * @param row
   * @param type 1:行业地图显示状态 2:开店区域推荐显示状态 3:竞品分析展示
   * @return
   */
  const renderSwitch = (value: any, row: any, type: number) => {
    return <div className={styles.showSwitch}>
      <Switch
        size='small'
        onClick={(checked) => onClickSwitch(checked, row, type)}
        defaultChecked={Boolean(value)}
      />
      <span className='ml-5'>{value ? '显示' : '隐藏'}</span>
    </div>;
  };

  // 顶部按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  // 控制导入Modal
  const [showImportModal, setShowImportModal] = useState<any>({
    visible: false,
    id: 0
  });
  // 新增/编辑 Modal
  const [editModal, setEditModal] = useState<any>({
    visible: false,
    id: 0,
  });
  const [areaModal, setAreaModal] = useState<any>({
    visible: false,
    id: 0,
    branchCompanyIds: []
  });
  // 用于刷新table数据
  const [params, setParams] = useState<any>({});
  const [dataSource, setDataSource] = useState<any>([]);
  const [innerMainHeight, setInnerMainHeight] = useState<number>(0);
  const [sortList, setSortList] = useState<any>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      return res;
    });
  }, [operateExtra]);

  const methods = useMethods({
    // 编辑
    handleUpdateBrand: (record) => {
      bigdataBtn('1f2c52c0-d8dc-4891-825c-c1a2fee4a41f', '选址地图配置', '编辑品牌', '点击了编辑品牌');
      setEditModal({
        visible: true,
        id: record.id
      });
    },
    // 删除品牌
    handleDeleteBrand: (record) => {
      bigdataBtn('819db057-3dca-41c6-8309-5d6a9851611e', '选址地图配置', '删除品牌', '点击了删除品牌');
      V2Confirm({ onSure: (modal) => onDelete(modal, record.id), content: '确定删除该品牌信息' });
    },
    // 导入品牌
    handleImportBrand: (record) => {
      bigdataBtn('5ea7a9b1-8cd0-4315-9b18-c177ea6d9dc7', '选址地图配置', '导入品牌', '点击了导入品牌');
      setShowImportModal({
        visible: true,
        id: record.id
      });
    },
    // 导出品牌
    handleExportBrand: ({ url }) => {
      bigdataBtn('2ce524be-f569-49c4-8495-3f977c030e89', '选址地图配置', '导出品牌', '点击了导出品牌');
      if (!url) {
        V2Message.warning(`请检查是否已导入过行业品牌数据`);
        return;
      };
      downloadFile({
        name: '行业品牌数据',
        url
      });
    },
    // 创建品牌
    handleCreateBrand: () => {
      bigdataBtn('979cc7c5-fd16-46b8-b4f8-3d00ce6297d4', '选址地图配置', '新增品牌', '点击了新增品牌');
      setEditModal({
        visible: true,
        id: 0
      });
    },
    // 导出全部品牌
    handleExportAllBrand: () => {
      exportAllBrand().then(({ url }) => {
        downloadFile({
          name: '全部品牌数据',
          url
        });
      });
    },
    // 置顶
    handleTopBrand: (record) => {
      brandSetTop({ id: record.id }).then((res) => {
        if (res === true) {
          handleRefresh();
        }
      });
    },
    handleSetPermission: (record) => {
      const brandArr:any = [];
      record?.branchCompanyList?.map((item) => {
        brandArr.push(item.id);
      });
      setAreaModal({
        visible: true,
        id: record.id,
        branchCompanyIds: brandArr
      });
    }
  });
  const onClickSwitch = async (checked, row, type) => {
    let params:any = { id: row.id, };
    if (type === 1) {
      // 行业地图显示状态 type=1
      params = { ...params, showStatus: checked ? 1 : 0 };
    } else if (type === 2) {
      // 开店区域推荐显示状态 type=2
      params = { ...params, recommendShowStatus: checked ? 1 : 0 };
    } else if (type === 3) {
      // 竞品分析展示 type=3
      params = { ...params, competitorShowStatus: checked ? 1 : 0 };
    }
    try {
      const res = await updateIndustryBrandShowStatus({ ...params });
      if (res) {
        V2Message.success('切换成功');
        handleRefreshCurrent();
      } else {
        V2Message.error('切换失败');
      }
    } catch (error) {
      V2Message.error('切换失败');
    }
  };
  /**
   * @description 刷新列表并获取第一页
   */
  const handleRefresh = () => {
    setParams({});
  };
  /**
   * @description 刷新本页
   */
  const handleRefreshCurrent = () => {
    (tableRef.current as any).onload(true);
  };
  const onDelete = (modal, id) => {
    deleteIndustryBrand({ id }).then(() => {
      V2Message.success('删除成功');
      modal.destroy();
      handleRefreshCurrent();
    });
  };

  /**
   * @description table刷新回调
   * @param params
   * @return
   */
  const loadData = async (params: any) => {
    const data = await getIndustryBrand({ ...params });
    if (!operateList.length) {
      setOperateExtra(data?.meta?.permissions || []);
    }
    const sort:any = [];
    const _data = data.objectList.map((item) => {
      sort.push(item.sortNo);
      return {
        ...item,
        index: item.id,
        key: item.id
      };
    });
    setSortList(sort);
    setDataSource(_data || []);
    return {
      dataSource: _data || [],
      count: data.totalNum || 0,
    };
  };
  const closeHandle = () => {
    setShowImportModal({
      visible: false,
      id: 0
    });
  };

  /**
   * @description 排序,把id进行重新排序，并组装原有的排序SortNo
   * 例如原数据：[{id:1,sortNo:1},{id:2,sortNo:2},{id:3,sortNo:3},{id:4,sortNo:4}]
   * 将第一项{id:1,sortNo:1},插入{id:4,sortNo:4}之后
   * 则将数据：[{id:2,sortNo:1},{id:1,sortNo:2},{id:3,sortNo:3},{id:1,sortNo:4}]传给接口
   * @param oldIndex 旧的顺序，从0开始
   * @param newIndex 新插入的顺序
   * @return
   */
  const onSortEnd = ({ oldIndex, newIndex }: SortEnd,) => {
    const data = dataSource;
    if (oldIndex === newIndex) return;
    // 往下移
    if (oldIndex < newIndex) {
      const oldData = data[oldIndex];
      for (let i = oldIndex; i < newIndex; i++) {
        data[i] = data[i + 1];
      }
      data[newIndex] = oldData;
      data.map((item, index) => {
        item.sortNo = sortList[index];
      });
    }
    // 往上移
    if (oldIndex > newIndex) {
      const oldData = data[oldIndex];
      for (let i = oldIndex; i > newIndex; i--) {
        data[i] = data[i - 1];
      }
      data[newIndex] = oldData;
      data.map((item, index) => {
        item.sortNo = sortList[index];
      });
    }
    const res = data.map((item) => {
      return {
        id: item.id,
        sortNo: item.sortNo
      };
    });
    brandReorder({ items: res }).then((res) => {
      if (res === true) {
        handleRefresh();
      }
    });
  };
  /**
   * @description 排序-拖拽容器
   * @param props
   * @return
   */
  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass={styles.rowDragging}
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  /**
   * @description  排序-拖拽行
   * @param param1
   * @return
   */
  const DraggableBodyRow: React.FC<any> = ({ ...restProps }) => {
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };
  return (
    <div className={styles.brandCon}>
      <V2Container
        style={{ height: mainHeight }}
        emitMainHeight={(h) => setInnerMainHeight(h)}
        extraContent={{
          top:
          <div className='mb-20'>
            <V2Operate
              operateList={operateList}
              onClick={(btn) => methods[btn.func]()}
            />
          </div>
        }}
      >
        <V2Table
          ref={tableRef}
          rowKey='id'
          onFetch={loadData}
          filters={params}
          defaultColumns={columns}
          tableSortModule='consoleSystemIndustryMapBrandInfo'
          hideColumnPlaceholder
          pageSize={10}
          paginationConfig={{
            showSizeChanger: false
          }}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
          scroll={{
            y: innerMainHeight - 48 - 42
          }}
        />
      </V2Container>

      <ImportModal
        visible={showImportModal.visible}
        closeHandle={closeHandle}
        onSuccess={handleRefreshCurrent}
        title='导入品牌数据'
        fileName='品牌信息导入模板.xlsx'
        importFile={importIndustryBrand}
        extraParams={{ brandId: showImportModal.id }}
      />
      <EditModal editModal={editModal} setEditModal={setEditModal} onSuccess={(isUpdate) => isUpdate ? handleRefreshCurrent() : handleRefresh()} />
      <SetAreaModal areaModal={areaModal} setAreaModal={setAreaModal} onSuccess={handleRefreshCurrent}/>
    </div>
  );
};

export default BrandInfo;
