/**
 * @Description 拓店创建的机会点表单配置页
 * TODO 页面结构拆分
 */
import TableEmpty from '@/common/components/FilterTable/TableEmpty';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { post } from '@/common/request';
import { MenuOutlined, EditOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMethods } from '@lhb/hook';
import { Button, ConfigProvider, message, Space, Spin, Table, Switch, Form } from 'antd';
import { ControlType } from '@/common/enums/control';
import EditGroupNameModal from './Modal/EditGroupName';
import EditFieldNameModal from './Modal/EditFieldName';
import LinkDisplayConfig from './Modal/LinkDisplayConfig';
import FieldLimitSet from './Modal/FieldLimitSet';
import styles from './entry.module.less';

import React, { FC, useEffect, useState } from 'react';
import ShowMore from '@/common/components/Data/ShowMore';
import IconFont from '@/common/components/IconFont';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import FormInput from '@/common/components/Form/FormInput';
import { EditComputeModalValuesProps } from './ts-config';
import EditComputeOperate from './Modal/EditComputeOperate';
import SurroundSearchSet from './Modal/SurroundSearchSet';
import ImportFileSet, { ImportFileConfigProps } from './Modal/ImportFileSet';
import SelectRedMarkSet from './Modal/SelectRedMarkSet';
import NumberRedMarkSet from './Modal/NumberRedMarkSet';
import StoreTemplateHint from './StoreTemplateHint';
import { refactorPermissions } from '@lhb/func';
const WFC: any = React.createContext(null);

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
  templateId: number;
  onSearch: any;
}

const Row = ({ children, templateId, onSearch, ...props }: RowProps) => {
  const [form] = Form.useForm();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });
  // const { setEditGroup }: any = useContext(WFC);

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 99 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as any).key === 'categoryName') {
          const record = (child as any).props.record;
          form.setFieldValue('name', record.name);
          return React.cloneElement(child as any, {
            children: (
              <Space direction='horizontal'>
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{ touchAction: 'none', cursor: 'move' }}
                  {...listeners}
                />
                {record.isGroup && (
                  <Space size={10}>
                    {/* <div
                      className='bold'
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {record.name}
                    </div> */}
                    {/* <EditOutlined
                      onClick={() => {
                        setEditGroup({ id: record.id, visible: true, name: record.name });
                      }}
                      style={{ cursor: 'pointer' }}
                    /> */}
                    <Form validateTrigger={['onChange', 'onBlur']} className={styles.formCon} form={form}>
                      <V2DetailItem
                        allowEdit
                        // value={record.name}
                        value={<ShowMore maxWidth='100px' text={record.name} />}
                        className={styles.detailItem}
                        valueStyle={{
                          marginTop: '0px',
                          fontWeight: 'bold',
                          background: 'transparent',
                        }}
                        editConfig={{
                          formCom: (
                            <FormInput
                              config={{
                                style: {
                                  width: '130px',
                                  height: '32px',
                                  padding: '6px 8px',
                                  fontWeight: 'bold',
                                  background: 'transparent',
                                },
                                value: record.name,
                              }}
                              name='name'
                            />
                          ),
                          onCancel() {
                            form.setFieldValue('name', record.name);
                          },
                          onOK() {
                            form.validateFields().then((values: any) => {
                              // 保存-https://yapi.lanhanba.com/project/289/interface/api/47340
                              const url = '/dynamic/group/add';
                              const params = {
                                templateId,
                                ...values,
                                id: record.id,
                              };
                              post(url, params, { proxyApi: '/blaster' }).then(() => {
                                onSearch();
                              });
                            });
                          },
                        }}
                      />
                    </Form>
                  </Space>
                )}
              </Space>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const StoreTemplateEdit: FC<any> = ({
  tenantId,
  templateId,
  params,
  onSearch,
  propertyTreeDrawInfo,
  setPropertyTreeDrawInfo,
  expandedRowKeys,
  setExpandedRowKeys,
}) => {
  // 数据源
  const [dataSource, setDataSource] = useState<any>([]);
  // 没用用的state
  // const [disabledOIds, setDisabledOIds] = useState<any>([]);
  // 所有行的key
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [templateHint, setTemplateHint] = useState<any>({
    id: null,
    hint: null,
    visible: false,
  });
  const [showEditGroup, setEditGroup] = useState({
    id: null,
    visible: false,
  });
  const [showEditField, setEditField] = useState({
    id: null,
    visible: false,
  });

  const [linkDisplayConfig, setLinkDisplayConfig] = useState({
    id: null,
    visible: false,
  });

  const [fieldLimitConfig, setFieldLimitConfig] = useState({
    id: null,
    visible: false,
  });

  const [surroundSearchConfig, setSurroundSearchConfig] = useState({
    id: null,
    visible: false,
  });

  const [importFileConfig, setImportFileConfig] = useState<ImportFileConfigProps>({
    id: null,
    visible: false,
    identification: '',
    importType: '',
  });

  const [selectRedMarkConfig, setSelectRedMarkConfig] = useState({
    id: null,
    visible: false,
  });

  const [numberRedMarkConfig, setNumberRedMarkConfig] = useState({
    id: null,
    visible: false,
  });

  const [editCompute, setEditCompute] = useState<EditComputeModalValuesProps>({ visible: false });
  // 定制组件：踩点组件、周边查询组件、详细地址组件只允许添加一次(controlType对应的值是10、25、26)
  // controlType定义于src/common/enums/control.ts
  const customComTypes = [10, 25, 26];
  const [customComIds, setCustomComIds] = useState<number[]>([]);

  const groupSort = async (params) => {
    post('/dynamic/group/reorder', params, { proxyApi: '/blaster' }).then(() => {
      onSearch();
      setLoading(false);
    });
  };

  const propertySort = async (params) => {
    post('/dynamic/property/reorder', params, { proxyApi: '/blaster' }).then(() => {
      onSearch();
      setLoading(false);
    });
  };

  const reorder = (active, over, list) => {
    // 1、 将active插入到over的后边/前面
    const activeItem = list.find(item => item.key === active.id);
    const overItem = list.find(item => item.key === over.id);
    if (activeItem.sortIndex < overItem.sortIndex) { // 插入到后边
      activeItem.sortIndex = overItem.sortIndex + 0.1;
    } else { // 插入到前边
      activeItem.sortIndex = overItem.sortIndex;
      overItem.sortIndex = overItem.sortIndex + 0.1;
    }
    // 2、重排序
    list.sort((a, b) => a.sortIndex - b.sortIndex);
    let idx = 0;
    list.forEach(item => {
      item.index = ++idx;
    });
  };

  const swapFirstGroup = (active, over) => {
    const cs: any = dataSource.map((item) => ({
      key: item.key,
      sortIndex: item.sortIndex,
    }));
    reorder(active, over, cs);
    groupSort({ templateId, orders: cs.map((item) => ({ id: item.key.split('-')[1], index: item.index })) });
  };

  const swapSecondGroup = (active, over) => {
    const cs: any = dataSource
      .filter((item) => Number(item.id) === Number(active.id.split('-')[1]))[0]
      .children.filter((item) => item.isGroup)
      .map((item) => ({
        key: item.key,
        sortIndex: item.sortIndex,
      }));

    reorder(active, over, cs);
    groupSort({ templateId, orders: cs.map((item) => ({ id: item.key.split('-')[2], index: item.index })) });
  };

  const swapFirstProperty = (active, over) => {
    const cs: any = dataSource
      .filter((item) => Number(item.id) === Number(active.id.split('-')[1]))[0]
      .children.filter((item) => !item.isGroup)
      .map((item) => ({
        key: item.key,
        sortIndex: item.sortIndex,
      }));
    reorder(active, over, cs);
    propertySort({ templateId, orders: cs.map((item) => ({ id: item.key.split('-')[2], index: item.index })) });
  };

  const swapSecondProperty = (active, over) => {
    const cs: any = dataSource
      .filter((item) => Number(item.id) === Number(active.id.split('-')[1]))[0]
      .children.filter((item) => item.isGroup && Number(item.id) === Number(active.id.split('-')[2]))[0]
      .children.map((item) => ({
        key: item.key,
        sortIndex: item.sortIndex,
      }));
    reorder(active, over, cs);
    propertySort({ templateId, orders: cs.map((item) => ({ id: item.key.split('-')[3], index: item.index })) });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setLoading(true);
    if (active.id !== over?.id) {
      if ((active.id as any).includes('firstGroup') && (over?.id as any).includes('firstGroup')) {
        swapFirstGroup(active, over);
        return;
      }
      if ((active.id as any).includes('secondGroup') && (over?.id as any).includes('secondGroup') && ((active.id as any).split('-')[1] === (over?.id as any).split('-')[1])) {
        swapSecondGroup(active, over);
        return;
      }
      if (
        (active.id as any).includes('firstProperty') &&
        (over?.id as any).includes('firstProperty') &&
        (active.id as any).split('-')[1] === (over?.id as any).split('-')[1]
      ) {
        swapFirstProperty(active, over);
        return;
      }
      if (
        (active.id as any).includes('secondProperty') &&
        (over?.id as any).includes('secondProperty') &&
        (active.id as any).split('-')[2] === (over?.id as any).split('-')[2]
      ) {
        swapSecondProperty(active, over);
        return;
      }
      message.warn('不支持跨分类移动！');
    }
    setLoading(false);
  };

  const methods = useMethods({
    async loadData(params) {
      // https://yapi.lanhanba.com/project/289/interface/api/47333
      const { propertyGroupVOList: objectList, hint } = await post('/dynamic/template/detail', params, {
        isMock: false,
        mockId: 289,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      });
      // 刷新页面提示语
      setTemplateHint({
        ...templateHint,
        hint,
      });

      let sortNum = 0;
      if (objectList) {
        // 根据不同的组件类型显示对应的操作按钮
        const permissionsShow = (property) => {
          const permissions = property.isFixed === 0 ? [] : [{ name: '删除', event: 'delete' }];
          const controlType = property.controlType;
          if (
            property.isFixed === 1 &&
            (controlType === ControlType.INPUT.value ||
              controlType === ControlType.TEXT_AREA.value ||
              controlType === ControlType.UPLOAD.value ||
              controlType === ControlType.INPUT_NUMBER.value ||
              controlType === ControlType.CHECK_BOX.value)
          ) {
            permissions.unshift({ name: '限制', event: 'bindLimit' });
          }
          if (controlType === ControlType.SINGLE_RADIO.value || controlType === ControlType.CHECK_BOX.value) {
            permissions.unshift({ name: '关联显示', event: 'bindShow' });
          }
          if (controlType === ControlType.INPUT_NUMBER.value) {
            permissions.unshift({ name: '编辑', event: 'bindCompute' });
          }
          if (controlType === ControlType.SURROUND_SEARCH.value) {
            permissions.unshift({ name: '编辑', event: 'bindSurroundSearch' });
          }
          if (controlType === ControlType.DAILY_FLOW_PREDICT.value) {
            permissions.unshift({ name: '编辑', event: 'bindDailyFlowPredict' });
          }
          if (controlType === ControlType.REFERENCE_CONVERSION.value) {
            permissions.unshift({ name: '编辑', event: 'bindReferenceConversion' });
          }
          if (controlType === ControlType.REFERENCE_RENT.value) {
            permissions.unshift({ name: '编辑', event: 'bindReferenceRent' });
          }
          if (controlType === ControlType.SINGLE_RADIO.value || controlType === ControlType.CHECK_BOX.value) {
            permissions.unshift({ name: '标红设置', event: 'bindSelectRedMark' });
          }
          if (controlType === ControlType.INPUT_NUMBER.value) {
            permissions.unshift({ name: '标红设置', event: 'bindNumberRedMark' });
          }
          return permissions;
        };

        const isGroupFixed = (group) => {
          if (group && group.propertyConfigVOList && group.propertyConfigVOList.length) {
            // 服务端说是已经拿掉isFixed的逻辑了，暂时保留，待观察 20230815
            // 有不能删除的属性
            if (group.propertyConfigVOList.filter((property) => property.isFixed === 0).length > 0) {
              return true;
            }
          }
          // 有不能删除的子类
          if (group.childList && group.childList.length) {
            const subGroupList = group.childList;
            for (let i = 0; i < subGroupList.length; i++) {
              if (isGroupFixed(subGroupList[i])) {
                return true;
              }
            }
          }
          return false;
        };
        /**
         * 逻辑说明：遍历接口给的数据源，添加一些前端需要用的字段，遍历过后数据结构没有变化，只是增加了一个前端用来显示和判断的字段
         */
        const ds = objectList.map((item) => {
          // 遍历二级菜单（childList存放的是二级菜单）
          const childList =
            item.childList &&
            item.childList.map((secondGroup) => ({
              ...secondGroup,
              // 构造唯一值
              key: 'secondGroup-' + item.id + '-' + secondGroup.id,
              isGroup: true,
              sortIndex: ++sortNum,
              permissions: isGroupFixed(secondGroup)
                ? [{ name: '添加字段', event: 'addField' }]
                : [
                  { name: '添加字段', event: 'addField' },
                  { name: '删除', event: 'delete' },
                ],
              children:
                // 二级菜单下的字段
                secondGroup.propertyConfigVOList &&
                secondGroup.propertyConfigVOList.map((property) => ({
                  ...property,
                  key: 'secondProperty-' + item.id + '-' + secondGroup.id + '-' + property.id,
                  isGroup: false,
                  parentId: secondGroup.id,
                  propertyName: property.name,
                  remark: property.propertyConfigOptionVOList
                    ? property.propertyConfigOptionVOList.map((item) => item.name).join('、')
                    : '-',
                  anotherName: property.anotherName,
                  sortIndex: ++sortNum,
                  permissions: permissionsShow(property),
                })),
            }));
          // 按目前所有字段挂在二级菜单下的约定，这里的propertyConfigVOList永远都是空数组
          const propertyConfigVOList =
            item.propertyConfigVOList &&
            item.propertyConfigVOList.map((property) => ({
              ...property,
              key: 'firstProperty-' + item.id + '-' + property.id,
              isGroup: false,
              parentId: item.id,
              propertyName: property.name,
              remark: property.propertyConfigOptionVOList
                ? property.propertyConfigOptionVOList.map((item) => item.name).join('、')
                : '-',
              anotherName: property.anotherName,
              sortIndex: ++sortNum,
              permissions: permissionsShow(property),
            }));

          return {
            key: 'firstGroup-' + item.id,
            isGroup: true,
            name: item.name,
            id: item.id,
            parentId: null,
            sortIndex: ++sortNum,
            permissions: isGroupFixed(item)
              ? [
                { name: '添加二级', event: 'addSecondGroup' },
                // 目前约定的场景，一级菜单不能添加字段
                { name: '添加字段', event: 'addField', disabled: true },
              ]
              : [
                { name: '添加二级', event: 'addSecondGroup' },
                // 目前约定的场景，一级菜单不能添加字段
                { name: '添加字段', event: 'addField', disabled: true },
                { name: '删除', event: 'delete' },
              ],
            children: propertyConfigVOList.concat(childList),
          };
        });
        // 所有字段的属性id
        const oids: any = [];
        // 所有前端自定义的key
        const its: any = [];
        const customComIdsArr: number[] = []; // 定制组件的id
        ds.forEach((item) => {
          its.push(item.key);
          item.children &&
            item.children.length &&
            item.children.forEach((child) => {
              its.push(child.key);
              !child.isGroup && oids.push(child.propertyId);
              child.children &&
                child.children.length &&
                child.children.forEach((threeChild) => {
                  its.push(threeChild.key);
                  const { controlType, propertyId } = threeChild;
                  // 如果已经添加过定制组件时，找到对应的propertyId
                  if (customComTypes.includes(controlType)) {
                    customComIdsArr.push(propertyId);
                  }
                  !threeChild.isGroup && oids.push(threeChild.propertyId);
                });
            });
        });
        // setDisabledOIds(oids);
        // setPropertyTreeDrawInfo({ ...propertyTreeDrawInfo, disabledOIds: oids });
        setItems(its);
        setCustomComIds(customComIdsArr);

        // 默认展开一级分组
        if (ds && ds.length) {
          const initExpandedRowKeys = [ds[0].key];
          if (ds[0].children && ds[0].children.length) {
            initExpandedRowKeys.push(ds[0].children[0].key);
            if (ds[0].children[0].children && ds[0].children[0].children.length) {
              initExpandedRowKeys.push(ds[0].children[0].children[0].key);
            }
          }
          if (expandedRowKeys.length === 0) {
            setExpandedRowKeys(initExpandedRowKeys);
          }
        }

        setDataSource(ds);
      }

      setLoading(false);
    },
    // 操作项-删除
    handleDelete(record) {
      if (record.isGroup) {
        if (record.children && record.children.length) {
          ConfirmModal({
            content: '该分组下存在字段或分组，无法删除',
            onSure: (modal) => {
              modal.destroy();
            },
          });
        } else {
          ConfirmModal({
            content: '删除后，拓店人员提报时无法看到该分组',
            onSure: (modal) => {
              post('/dynamic/group/delete', { id: record.id, templateId }, { proxyApi: '/blaster' }).then(() => {
                modal.destroy();
                onSearch();
              });
            },
          });
        }
      } else {
        ConfirmModal({
          content: '删除后，拓店人员提报时无法看到该分组？',
          onSure: (modal) => {
            post('/dynamic/property/delete', { templateId, propertyIds: [record.id] }, { proxyApi: '/blaster' }).then(
              () => {
                // setDisabledOIds(disabledOIds.filter((item) => item !== record.id));
                // setPropertyTreeDrawInfo({
                //   ...propertyTreeDrawInfo,
                //   disabledOIds: disabledOIds.filter((item) => item !== record.id),
                // });
                modal.destroy();
                onSearch();
              }
            );
          },
        });
      }
    },
    // 添加分组
    handleAddFirstGroup() {
      post(
        '/dynamic/group/add',
        { templateId, categoryTemplateId: templateId, name: '一级分组' },
        { proxyApi: '/blaster' }
      ).then(() => {
        onSearch();
      });
    },
    // 操作项-添加二级分组
    handleAddSecondGroup(row) {
      post(
        '/dynamic/group/add',
        { templateId, categoryTemplateId: templateId, parentId: row.id, name: '二级分组' },
        { proxyApi: '/blaster' }
      ).then(() => {
        onSearch();
        // @ts-ignore
        setExpandedRowKeys((state) => [...state, row.key]);
      });
    },
    // 操作项-添加字段
    handleAddField(record) {
      // 不规范代码，setPropertyTreeDrawInfo时，数据源不可追溯（定义propertyTreeDrawInfo的数据和set的不一致）
      setPropertyTreeDrawInfo({
        ...propertyTreeDrawInfo,
        categoryTemplateId: templateId,
        categoryPropertyGroupId: record.id,
        // disabledOIds: disabledOIds, 无用字段，废弃
        visible: true,
        rowKey: record.key,
        rowData: record,
        // 踩点组件、周边查询组件、详细地址组件只允许添加一次
        customComIds,
      });
    },
    // 操作项-编辑（数字输入框类型的计算公式）
    handleBindCompute(record) {
      setEditCompute({
        id: record.id,
        propertyId: record.propertyId,
        categoryTemplateId: record.categoryTemplateId,
        categoryPropertyGroupId: record.categoryPropertyGroupId,
        templateRestriction: record.templateRestriction,
        visible: true,
      });
    },
    // 操作项-关联显示
    handleBindShow(record) {
      setLinkDisplayConfig({ ...record, visible: true, id: record.id });
    },

    handleBindLimit(record) {
      setFieldLimitConfig({ ...record, visible: true, id: record.id });
    },

    handleBindSurroundSearch(record) {
      setSurroundSearchConfig({ ...record, visible: true, id: record.id });
    },
    handleBindDailyFlowPredict(record) {
      setImportFileConfig({ ...record, visible: true, id: record.id, importType: 'flow' });
    },
    handleBindReferenceConversion(record) {
      setImportFileConfig({ ...record, visible: true, id: record.id, importType: 'conversion' });
    },
    handleBindReferenceRent(record) {
      setImportFileConfig({ ...record, visible: true, id: record.id, importType: 'rent' });
    },
    // 单选/多选标红设置
    handleBindSelectRedMark(record) {
      setSelectRedMarkConfig({ ...record, visible: true, id: record.id });
    },
    // 数字输入标红设置
    handleBindNumberRedMark(record) {
      setNumberRedMarkConfig({ ...record, visible: true, id: record.id });
    }
  });

  const emptyContent = <div>暂无内容，请先新增～</div>;

  //
  /**
   * @description 开关设置列
   * @param title 标题
   * @param key 唯一区分符
   * @param onlyIsFixed 是否在改字段的接口返回值isFixed为true时才展示
   * @return 列的渲染结构
   */
  const switchColumn = (title: string, key: string, onlyIsFixed = false) => {
    return {
      title: title,
      dataIndex: key,
      key: key,
      width: 80,
      render: (_, row) => {
        if (!row.children && (!onlyIsFixed || row?.isFixed === 1)) {
          const tplRestriction = row.templateRestriction && JSON.parse(row.templateRestriction) || {};
          const checked = tplRestriction[key] ? tplRestriction[key] : false;
          return ((
            <div className={styles.showSwitch}>
              <Switch
                size='small'
                onClick={(checked) => {
                  const restriction = row.templateRestriction ? JSON.parse(row.templateRestriction) : {};
                  restriction[key] = checked;
                  const params = {
                    templateId,
                    propertyConfigRequestList: [
                      {
                        id: row.id,
                        propertyId: row.propertyId,
                        categoryTemplateId: row.categoryTemplateId,
                        categoryPropertyGroupId: row.categoryPropertyGroupId,
                        templateRestriction: JSON.stringify(restriction),
                      },
                    ],
                  };
                  const url = '/dynamic/property/update';
                  setLoading(true);
                  post(url, params, { proxyApi: '/blaster', needHint: true }).then((success) => {
                    if (success) {
                      onSearch();
                    }
                  }).finally(() => {
                    setLoading(false);
                  });
                }}
                defaultChecked={checked}
              />
            </div>
          )
          );
        } else {
          return null;
        }
      },
    };
  };

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
      render: (value: any, row) => {
        return (
          !row.isGroup && (
            <Space size={10}>
              <div className='ellipsis'><ShowMore maxWidth='70px' text={row.anotherName} /></div>
              <EditOutlined
                onClick={() => {
                  setEditField({ ...row, visible: true });
                }}
                style={{ cursor: 'pointer' }}
              />
            </Space>
          )
        );
      },
    },
    {
      title: '设为必填',
      dataIndex: 'required',
      key: 'required',
      width: 78,
      render: (value, row) => {
        // console.log(11, row);
        return (!row.children && row?.isFixed === 1 && (
          <div className={styles.showSwitch}>
            <Switch
              size='small'
              onClick={(checked) => {
                const params = {
                  templateId,
                  propertyConfigRequestList: [
                    {
                      ...row,
                      required: checked ? 1 : 0,
                    },
                  ],
                };
                setLoading(true);
                post('/dynamic/property/update', params, { proxyApi: '/blaster', needHint: true }).then((success) => {
                  if (success) {
                    onSearch();
                  }
                }).finally(() => {
                  setLoading(false);
                });
              }}
              defaultChecked={Boolean(value)}
            />
          </div>
        )
        );
      },
    },
    switchColumn('机会点表单必填', 'chancePointRequired', true),
    switchColumn('点位评估表单必填', 'estimateRequired', true),
    switchColumn('换行显示', 'nextLine', false),
    switchColumn('分享不可见', 'shareHide', false),
    switchColumn('禁止编辑', 'disable', false),
    {
      title: '操作',
      dataIndex: 'permissions',
      key: 'permissions',
      fixed: 'right',
      whiteTooltip: true,
      width: 210,
      render: (value: any, record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: any) => {
            methods[btn.func](record);
          }}
        />
      ),
    },
  ];
  useEffect(() => {
    // navigate方法绑定到document-event上，页面内需要调用navigate方法直接使用dispatchNavigate
    templateId && methods.loadData({ id: templateId, templateId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, templateId]);

  return (
    <Spin spinning={loading}>
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ConfigProvider renderEmpty={() => <TableEmpty>{emptyContent}</TableEmpty>}>
            <div className='mb-12'>
              <Space style={{ marginBottom: 10, position: 'sticky', left: 0 }}>
                <Button type='primary' onClick={methods.handleAddFirstGroup}>
                添加分组
                </Button>
                {templateHint.hint ? <span className='inline-block fs-14 mr-16'>{ templateHint.hint || '' }</span> : <></>}
                <Button type='primary' onClick={() => setTemplateHint({
                  ...templateHint,
                  visible: true,
                  id: templateId,
                })}>页面提示语配置</Button>
              </Space>
            </div>
            <WFC.Provider value={{ setEditGroup }}>
              <Table
                components={{
                  body: {
                    row: (props) => Row({ ...props, templateId, onSearch }),
                  },
                }}
                bordered
                rowKey='key'
                columns={columns as any}
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
                          style={{ color: '#006AFF', marginRight: '5px' }}
                          iconHref='pc-common-icon-ic_open'
                          onClick={(e) => onExpand(record, e)}
                        />
                      ) : (
                        <span className='mr-18' />
                      )
                    ) : record.children && record.children.length ? (
                      <IconFont
                        style={{ color: '#AAAAAA', marginRight: '5px' }}
                        iconHref='pc-common-icon-a-ic_fold'
                        onClick={(e) => onExpand(record, e)}
                      />
                    ) : (
                      <span className='mr-18' />
                    );
                  },
                }}
              />
            </WFC.Provider>
          </ConfigProvider>
        </SortableContext>
      </DndContext>
      <StoreTemplateHint
        templateHint={templateHint}
        setTemplateHint={setTemplateHint}
        onSearch={onSearch}
      />

      <EditGroupNameModal
        templateId={templateId}
        onSearch={onSearch}
        setOperateModel={setEditGroup}
        operateModel={showEditGroup}
      />

      <EditFieldNameModal
        templateId={templateId}
        onSearch={onSearch}
        setOperateModel={setEditField}
        operateModel={showEditField}
      />

      <LinkDisplayConfig
        templateId={templateId}
        onSearch={onSearch}
        linkDisplayConfig={linkDisplayConfig}
        setLinkDisplayConfig={setLinkDisplayConfig}
      />

      <FieldLimitSet
        templateId={templateId}
        onSearch={onSearch}
        fieldLimitConfig={fieldLimitConfig}
        setFieldLimitConfig={setFieldLimitConfig}
      />
      <SurroundSearchSet
        templateId={templateId}
        onSearch={onSearch}
        surroundSearchConfig={surroundSearchConfig}
        setSurroundSearchConfig={setSurroundSearchConfig}
      />
      <ImportFileSet
        tenantId={tenantId}
        templateId={templateId}
        config={importFileConfig}
        setConfig={setImportFileConfig}
      />
      <SelectRedMarkSet
        templateId={templateId}
        onSearch={onSearch}
        propertyConfig={selectRedMarkConfig}
        setPropertyConfig={setSelectRedMarkConfig}
      />
      <NumberRedMarkSet
        templateId={templateId}
        onSearch={onSearch}
        propertyConfig={numberRedMarkConfig}
        setPropertyConfig={setNumberRedMarkConfig}
      />
      <EditComputeOperate
        templateId={templateId}
        onSearch={onSearch}
        editCompute={editCompute}
        setEditCompute={setEditCompute}
      />
    </Spin>
  );
};

export default StoreTemplateEdit;
