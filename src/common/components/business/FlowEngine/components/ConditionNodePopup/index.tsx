// import { PlusOutlined } from '@ant-design/icons';
// import { getStorage } from '@lhb/cache';
// import { deepCopy } from '@lhb/func';
// import { useMethods } from '@lhb/hook';
// import { Button, Divider, Drawer, Form, Modal, Space } from 'antd';
// import { FC, createContext, useEffect, useState } from 'react';
// import ConditionSet from './components/ConditionSet';
// import styles from './index.module.less';
// import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
// import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

// export const Condition: any = createContext(null);
// const ConditionNodePopup: FC<any> = ({
//   visible,
//   onClose,
//   onSubmit,
//   objRef,
// }) => {
//   const [form] = Form.useForm();
//   // const Condition: any = createContext(null);
//   const [copyObjRef, setCopyObjRef] = useState<any>({});

//   useEffect(() => {
//     // copyObjRef.conditions
//     form.setFieldValue('nodeTitle', objRef.name);
//     visible && setCopyObjRef(deepCopy(objRef));
//   }, [visible]);

//   const methods = useMethods({
//     nodeNameChange(e: { target: { value: any } }) {
//       const value = e.target.value;
//       setCopyObjRef({ ...copyObjRef, name: value });
//     },
//     nodeNameBlur(e: { target: { value: any } }) {
//       const value = e.target.value;
//       !value && setCopyObjRef({ ...copyObjRef, name: '条件' });
//     },
//     addCondition() {
//       copyObjRef.conditions &&
//         copyObjRef.conditions.push({
//           logicOperation: 'or',
//           expressions: [
//             {
//               field: null,
//               operation: null,
//               value: '',
//             },
//           ],
//         });
//       setCopyObjRef({ ...copyObjRef });
//     },
//     getContent() {
//       const { conditions } = copyObjRef;
//       let desc = '';
//       const flowFields = getStorage('flowFields');
//       conditions.forEach((item: any, index: number) => {
//         desc += `${index ? ' 或 ' : ''}(`;
//         item.expressions.forEach((itm: any, inx: number) => {
//           const field = flowFields.find(
//             (item: any) => item.field === itm.field,
//           );
//           const name = field ? field.name : '';
//           desc += `${inx ? ' 且 ' : ''}[${name}${itm.operation}${itm.value}]`;
//         });
//         desc += ')';
//       });
//       return desc;
//     },
//     onConditionSubmit() {
//       const conditions = copyObjRef.conditions;
//       if (!conditions.length) {
//         Modal.error({
//           type: 'error',
//           content: '请添加条件',
//         });
//         return;
//       } else {
//         for (let i = 0; i < conditions.length; i++) {
//           const expressions = conditions[i].expressions;
//           for (let j = 0; j < expressions.length; j++) {
//             if (!expressions[j].field) {
//               Modal.error({
//                 type: 'error',
//                 content: '请选择字段名',
//               });
//               return;
//             } else if (!expressions[j].operation) {
//               Modal.error({
//                 type: 'error',
//                 content: '请选择比较运算符',
//               });
//               return;
//             } else if (!expressions[j].value) {
//               Modal.error({
//                 type: 'error',
//                 content: '请输入条件值',
//               });
//               return;
//             }
//           }
//         }
//         onSubmit({ ...copyObjRef, desc: this.getContent() });
//       }
//     },
//   });

//   return (
//     <>
//       <Drawer
//         className={styles.drawer}
//         title={
//           // <Input
//           //   style={{ width: 180 }}
//           //   placeholder='请输入节点名称'
//           //   maxLength={20}
//           //   value={copyObjRef.name}
//           //   onChange={methods.nodeNameChange}
//           //   onBlur={methods.nodeNameBlur}
//           // />
//           <Form form={form} validateTrigger={['onChange', 'onBlur']}>
//             <V2DetailItem
//               label='节点名称'
//               allowEdit
//               value={copyObjRef.name}
//               editConfig={{
//                 formCom: <V2FormInput
//                   name='nodeTitle'
//                   // rules={[{ required: true, message: '请输入节点名称' }]}
//                 />,
//                 onCancel() {
//                   form.setFieldValue('nodeTitle', copyObjRef.name);
//                 },
//                 onOK() {
//                   const name = form.getFieldValue('nodeTitle');
//                   form.setFieldValue('nodeTitle', name);
//                   setCopyObjRef({ ...copyObjRef, name: name || '条件' });
//                 }
//               }}
//             />
//           </Form>
//         }
//         closable={false}
//         onClose={onClose}
//         open={visible}
//         width={580}
//         footer={
//           <Space
//             align='center'
//             style={{ width: '100%', justifyContent: 'right' }}
//           >
//             <Button onClick={onClose}>取消</Button>
//             <Button type='primary' onClick={methods.onConditionSubmit}>
//               确定
//             </Button>
//           </Space>
//         }
//       >
//         <Condition.Provider
//           value={{ setCopyObjRef, conditions: copyObjRef.conditions }}
//         >
//           {Array.isArray(copyObjRef.conditions) &&
//             copyObjRef.conditions.map((item: any, index: number) => {
//               return (
//                 <div key={index}>
//                   {!!index && (
//                     <Divider plain key={'Divider' + index}>
//                       或（OR）
//                     </Divider>
//                   )}
//                   <ConditionSet
//                     key={'ConditionSet' + index}
//                     conditionIndex={index}
//                     expressions={item.expressions}
//                     objRef={copyObjRef}
//                     context={Condition}
//                   />
//                 </div>
//               );
//             })}
//           <Space
//             className={styles.addCondition}
//             onClick={methods.addCondition}
//             align='center'
//             size={0}
//             style={{
//               color: '#006aff',
//               fontSize: '12px',
//               cursor: 'pointer',
//               justifyContent: 'left',
//             }}
//           >
//             <PlusOutlined />
//             <span>添加或条件</span>
//           </Space>
//         </Condition.Provider>
//       </Drawer>
//     </>
//   );
// };

// export default ConditionNodePopup;

import { PlusOutlined } from '@ant-design/icons';
import { deepCopy, recursionEach, treeFind } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { Button, Divider, Drawer, Form, Modal, Space, Select, TreeSelect } from 'antd';
import { FC, createContext, useContext, useEffect, useState } from 'react';
import ConditionSet from './components/ConditionSet';
import styles from './index.module.less';
import WFC from '../OperatorContext';
import { ConditionOption } from '../../index';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

export const Condition: any = createContext(null);
const ConditionNodePopup: FC<any> = ({
  visible,
  onClose,
  onSubmit,
  objRef,
}) => {
  const [form] = Form.useForm();
  const { departmentTreeList, roleList }: any = useContext(WFC);
  const [copyObjRef, setCopyObjRef] = useState<any>({});
  const [conditionFields, setConditionFields] = useState<ConditionOption[]>([]); // 条件节点条件字段
  const [defaultSponsorDeptIds, setDefaultSponsorDeptIds] = useState<Array<number>>([]); // 默认发起人所属部门ids
  const [hasEditedDepartment, setHasEditedDepartment] = useState(false); // 是否


  useEffect(() => {
    form.setFieldValue('nodeTitle', objRef.name);
    if (visible) {
      const deepCopyObj = deepCopy(objRef || {});
      if (deepCopyObj.sysConditions?.sponsorDeptIds?.length) {
        setDefaultSponsorDeptIds([...(deepCopyObj.sysConditions?.sponsorDeptIds || [])]);
      }
      setCopyObjRef(deepCopyObj);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && departmentTreeList?.length) {
      methods.filterDepartmentIds(objRef.sysConditions?.sponsorDeptIds || []);
    }
  }, [departmentTreeList, visible]);

  const methods = useMethods({
    nodeNameChange(e: { target: { value: any } }) {
      const value = e.target.value;
      setCopyObjRef({ ...copyObjRef, name: value });
    },
    nodeNameBlur(e: { target: { value: any } }) {
      const value = e.target.value;
      !value && setCopyObjRef({ ...copyObjRef, name: '条件' });
    },
    addCondition() {
      copyObjRef.conditions &&
        copyObjRef.conditions.push({
          logicOperation: 'or',
          expressions: [
            {
              field: null,
              operation: null,
              value: '',
              controlType: null,
            },
          ],
        });
      setCopyObjRef({ ...copyObjRef });
    },
    getContent() {
      const { conditions, sysConditions } = copyObjRef;
      // 发起人所属部门
      let sponsorDeptText = '';
      const sponsorDeptIds = hasEditedDepartment ? sysConditions.sponsorDeptIds : defaultSponsorDeptIds;
      const sponsorDept = deepCopy(departmentTreeList);
      if (sysConditions.sponsorDeptIds?.length) {
        sponsorDeptText += '发起人所属部门：';
        sponsorDeptIds.map((item: number|string, index: number) => {
          sponsorDeptText += `${index ? ' 或 ' : ''}`;
          let dept: any = null;
          // 防止 localStorage 里面的 部门数据被删除报错
          try {
            dept = treeFind(sponsorDept, (itm: any) => item === itm.id);

          } catch (error) {
            dept = { name: '' };
          }
          sponsorDeptText += `${dept?.name || ''}`;
        });
      }
      // 发起人所属角色
      let sponsorRoleIds = '';
      const sponsorRole = deepCopy(roleList);
      if (sysConditions.sponsorRoleIds && sysConditions.sponsorRoleIds.length) {
        sponsorRoleIds += '发起人所属角色：';
        sysConditions.sponsorRoleIds.map((item: number|string, index: number) => {
          sponsorRoleIds += `${index ? ' 或 ' : ''}`;
          let dept: any = null;
          // 防止 localStorage 里面的 部门数据被删除报错
          try {
            dept = sponsorRole.find((itm:any) => item === itm.id);

          } catch (error) {
            dept = { name: '' };
          }
          sponsorRoleIds += `${dept?.name || ''}`;
        });
      }

      // 条件
      let desc = '';

      conditions.forEach((item: any, index: number) => {
        desc += `${index ? ' 或 ' : ''}(`;
        item.expressions.forEach((itm: any, inx: number) => {
          const field = conditionFields.find(
            (item: any) => item.field === itm.field,
          );
          const name = field ? field.name : '';
          desc += `${inx ? ' 且 ' : ''}[${name}${itm.operation}${itm.value}]`;
        });
        desc += ')';
      });

      let text = '';
      if (sponsorDeptText) {
        text += `${sponsorDeptText}`;
      }
      if (sponsorRoleIds) {
        if (text !== '') {
          text += ' 且 ';
        }
        text += `${sponsorRoleIds}`;
      }
      if (desc) {
        if (text !== '') {
          text += ' 且 ';
        }
        text += `${desc}`;
      }

      return text;
    },
    onConditionSubmit() {
      const conditions = copyObjRef.conditions;
      const sysConditions = copyObjRef.sysConditions;
      const hasSysConditions = Object.values(sysConditions).some((item:any) => item.length > 0);
      // 发起人属于或者条件，必须填一个
      if (!conditions?.length && !hasSysConditions) {
        Modal.error({
          type: 'error',
          content: '请添加条件',
        });
        return;
      } else {
        for (let i = 0; i < conditions?.length; i++) {
          const expressions = conditions[i].expressions;
          for (let j = 0; j < expressions.length; j++) {
            if (!expressions[j].field) {
              Modal.error({
                type: 'error',
                content: '请选择字段名',
              });
              return;
            } else if (!expressions[j].operation) {
              Modal.error({
                type: 'error',
                content: '请选择比较运算符',
              });
              return;
            } else if (!expressions[j].value) {
              Modal.error({
                type: 'error',
                content: '请输入条件值',
              });
              return;
            }
          }
        }
        if (hasEditedDepartment) {
          onSubmit({ ...copyObjRef, desc: this.getContent() });
        } else {
          onSubmit({
            ...copyObjRef,
            sysConditions: { ...copyObjRef.sysConditions, sponsorDeptIds: defaultSponsorDeptIds },
            desc: this.getContent(),
          });
        }

      }
    },
    onSponsorRoleChange(value: number[] | string[]) {
      setCopyObjRef({
        ...copyObjRef,
        sysConditions: { ...copyObjRef.sysConditions, sponsorRoleIds: value },
      });
    },
    onSponsorDeptChange(value: number[] | string[]) {
      setHasEditedDepartment(true);
      setCopyObjRef({
        ...copyObjRef,
        sysConditions: { ...copyObjRef.sysConditions, sponsorDeptIds: value },
      });
    },
    // 过滤回显数据中的父部门信息
    filterDepartmentIds(ids: Array<number>) {
      const recordParentIds: any = [];
      recursionEach(departmentTreeList, 'children', (item: any) => {
        if (item.children?.length) {
          recordParentIds.push(item.id);
        }
      });
      const deepCopyObj = deepCopy(objRef || {});
      setCopyObjRef({
        ...deepCopyObj,
        sysConditions: { ...copyObjRef.sysConditions, sponsorDeptIds: ids.filter((item: number) => !recordParentIds.includes(item)), },
      });
    },

  });


  return (
    <>
      <Drawer
        className={styles.drawer}
        title={
          // <Input
          //   style={{ width: 180 }}
          //   placeholder='请输入节点名称'
          //   maxLength={20}
          //   value={copyObjRef.name}
          //   onChange={methods.nodeNameChange}
          //   onBlur={methods.nodeNameBlur}
          // />
          <Form form={form} validateTrigger={['onChange', 'onBlur']}>
            <V2DetailItem
              label='节点名称'
              allowEdit
              value={copyObjRef.name}
              editConfig={{
                formCom: <V2FormInput
                  name='nodeTitle'
                // rules={[{ required: true, message: '请输入节点名称' }]}
                />,
                onCancel() {
                  form.setFieldValue('nodeTitle', copyObjRef.name);
                },
                onOK() {
                  const name = form.getFieldValue('nodeTitle');
                  form.setFieldValue('nodeTitle', name);
                  setCopyObjRef({ ...copyObjRef, name: name || '条件' });
                }
              }}
            />
          </Form>

        }
        closable={false}
        onClose={onClose}
        open={visible}
        width={680}
        footer={
          <Space
            align='center'
            style={{ width: '100%', justifyContent: 'right' }}
          >
            <Button onClick={onClose}>取消</Button>
            <Button type='primary' onClick={methods.onConditionSubmit}>
              确定
            </Button>
          </Space>
        }
      >
        <Condition.Provider
          value={{
            setCopyObjRef,
            conditions: copyObjRef.conditions,
            conditionFields,
            setConditionFields }}
        >
          <p className={styles.title}>发起人身份判断条件</p>
          <div className={styles.sponsorConditional}>
            <div className={styles.department}>
              <span className='fs-14'>发起人所属部门：</span>
              <TreeSelect
                value={copyObjRef.sysConditions?.sponsorDeptIds}
                showSearch
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder='请选择发起人所属部门'
                allowClear
                multiple
                treeCheckable
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                treeDefaultExpandAll
                treeData={departmentTreeList}
                fieldNames={{ label: 'name', value: 'id' }}
                onChange={(value, option) => {
                  methods.onSponsorDeptChange(value, option);
                }}
              />
              <span>且</span>
            </div>
            <div className={styles.role}>
              <span className='fs-14'>发起人所属角色：</span>
              <Select
                showSearch
                mode='multiple'
                placeholder='请选择发起人所属角色'
                optionFilterProp='label'
                value={copyObjRef.sysConditions?.sponsorRoleIds}
                onChange={(newValue) => {
                  methods.onSponsorRoleChange(newValue);
                }}
                fieldNames={{ label: 'name', value: 'id' }}
                onSearch={methods.onSearch}
                filterOption={(input, option: any) => {
                  return (option?.name ?? '').includes(input);
                }
                }
                options={roleList}
              />
            </div>
          </div>
          <p className={styles.title}>表单字段判断条件</p>
          {Array.isArray(copyObjRef.conditions) &&
            copyObjRef.conditions.map((item: any, index: number) => {
              return (
                <div key={index}>
                  {!!index && (
                    <Divider plain key={'Divider' + index}>
                      或（OR）
                    </Divider>
                  )}
                  <ConditionSet
                    key={'ConditionSet' + index}
                    conditionIndex={index}
                    expressions={item.expressions}
                    objRef={copyObjRef}
                  />
                </div>
              );
            })}
          <Space
            className={styles.addCondition}
            onClick={methods.addCondition}
            align='center'
            size={0}
            style={{
              color: '#006aff',
              fontSize: '12px',
              cursor: 'pointer',
              justifyContent: 'left',
            }}
          >
            <PlusOutlined />
            <span>添加或条件</span>
          </Space>
        </Condition.Provider>
      </Drawer>
    </>
  );
};

export default ConditionNodePopup;
