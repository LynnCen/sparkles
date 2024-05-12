/**
 * @description 审批流引擎
 * 为了能在location自定义及快速使用，从https://gitlab.lanhanba.com/fe/flow-engine拷贝的
 */
import { getStorage, setStorage } from '@lhb/cache';
import { deepCopy, randomString } from '@lhb/func';
import { Button, Space } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid'; // 用来生成不重复的key

import { NodeTemplates, NodeTypes, OptionTypes } from './utils/flow';
import EndNode from './components/End';
import WFC from './components/OperatorContext';
import Render from './components/Render';
import Zoom from './components/Zoom';
import styles from './index.module.less';

interface fieldsAccess {
  value: boolean | null;
  required: boolean | null;
}

interface FormFieldsItem {
  field: string;
  name: string;
  access?: fieldsAccess;
  children: FormFieldsItem[] | null;
}
/**
 * @description 额外的条件字段
 */
export interface ConditionOption{
  /**
   * @description 名称
   */
  name: string;
  /**
   * @description 标识
   */
  field: string;
  /**
   * @description 字段类型
   */
  controlType?:number;
}
/**
 * @description 部门树
 */
export interface DepartmentTreeItem{
  /**
   * @description 名称
   */
  name: string;
  /**
   * @description 部门id
   */
  id: number;
  /**
   * @description 编码
   */
  encode: string;
  /**
   * @description 创建时间
   */
  gmtCreate: string;
  /**
   * @description 修改时间
   */
  gmtModified: string;
  /**
   * @description 子部门列表
   */
  children?:DepartmentTreeItem[];
}

/** 全量角色 */
export interface RoleListItem{
  /**
   * @description 名称
   */
  name: string;
  /**
   * @description 角色id
   */
  id: number;
  /**
   * @description 编码
   */
  encode?: string;
  /**
   * @description 创建时间
   */
  gmtCreate?: string;
  /**
   * @description 修改时间
   */
  gmtModified?: string;
}

interface FlowEngineProps {
  /**
   * @description 模板选项
   */
  flowTemplateSelection: any;
  /**
   * @description 提交表单
   */
  handleSubmit: (params: any) => void;
  /**
   * @description 编辑回显数据
   */
  data: any;
  /**
   * @description 角色、岗位、用户等搜索接口
   */
  multipleSearch: (params: any, type: string) => void;
  /**
   * @description 部门树
   */
  departmentTreeList: DepartmentTreeItem[];
  /**
   * @description 表单权限字段
   */
  /**
   * @description 角色树
   */
  roleList: RoleListItem[];
  /**
   * @description 表单权限字段
   */
  formFields?: FormFieldsItem[];
  /**
   * @description 额外的条件字段
   */
  otherConditionFields?: ConditionOption[];
}

/**
 * @description 递归遍历树节点，更新节点key和access字段
 * @param data 表单字段
 * @param reset 是否需要重置默认值
 * * @param isBegin 是否是发起节点（字段默认改为可写）
 * @returns
 */
function updateFormFields(data: any[] = [], reset:boolean = false, isBegin:boolean = false): any {
  const accessValue = { value: isBegin ? 2 : 1, required: null };
  return data?.map((item: any) => {
    return {
      ...item,
      key: v4(),
      access: !reset ? item?.access || accessValue : accessValue,
      children: item?.children ? updateFormFields(item.children, reset, isBegin) : [],
    };
  });
}
const FlowEngine: FC<FlowEngineProps> = ({
  flowTemplateSelection = {},
  handleSubmit,
  data = {},
  multipleSearch,
  formFields = [],
  otherConditionFields = [],
  departmentTreeList = [],
  roleList = [],
}) => {
  const [config, setConfig] = useState<any>({});
  const [nodeArr, setNodeArr] = useState<any[]>([]);
  const [selection, setSelection] = useState({});
  const [isBegin, setIsBegin] = useState(true);
  // 每次进入将开始标志置为true，使得发起节点权限为可写
  useEffect(() => {
    setIsBegin(true);
    return () => {
      setIsBegin(false);
    };
  }, []);


  // 给传入的formFields添加key和access字段
  const _formFields: FormFieldsItem[] = useMemo(() => {
    if (formFields.length) {
      return updateFormFields(formFields, false, isBegin);
    } else {
      const arr:any[] = getFlowNodes();
      // 从开始节点取表单字段，开始节点必定有
      const getFormFields = arr.find((item: any) => item.type === OptionTypes.START)?.fields;
      return updateFormFields(getFormFields, true);
    }
  }, [formFields, isBegin]);

  // 如果没有额外的条件字段，从条件节点里面取（编辑回显时）
  const _otherConditionFields: ConditionOption[] = useMemo(() => {
    if (otherConditionFields?.length) {
      return otherConditionFields;
    } else {
      const arr:any[] = getFlowNodes();

      const fieldsArr: any[] = [];
      arr.map((item: any) => {
        if (item.type === OptionTypes.BRANCH) {
          fieldsArr.push(item.fields);
        }
      });
      // console.log('fieldsArr',  fieldsArr);
      return fieldsArr.find(item => item.length > 0) || [];
    }
  }, [otherConditionFields, nodeArr]);

  useEffect(() => {
    const arr = getFlowNodes();
    setStorage('flowNodes', arr);
  }, [nodeArr]);

  function getFlowNodes () {
    return deepCopy(nodeArr).map((item: any) => {
      delete item.childNode;
      Array.isArray(item.employeeIds) &&
        (item.employeeIds = item.employeeIds.map((item: any) => item.id));
      Array.isArray(item.positionIds) &&
        (item.positionIds = item.positionIds.map((item: any) => item.id));
      Array.isArray(item.roleIds) &&
        (item.roleIds = item.roleIds.map((item: any) => item.id));
      Array.isArray(item.ccEmployeeIds) &&
        (item.ccEmployeeIds = item.ccEmployeeIds.map((item: any) => item.id));
      Array.isArray(item.ccPositionIds) &&
        (item.ccPositionIds = item.ccPositionIds.map((item: any) => item.id));
      Array.isArray(item.ccRoleIds) &&
        (item.ccRoleIds = item.ccRoleIds.map((item: any) => item.id));
      return item;
    });
  }

  useEffect(() => {
    const arr = deepCopy(nodeArr).map((item: any) => {
      delete item.childNode;
      Array.isArray(item.employeeIds) &&
        (item.employeeIds = item.employeeIds.map((item: any) => item.id));
      Array.isArray(item.positionIds) &&
        (item.positionIds = item.positionIds.map((item: any) => item.id));
      Array.isArray(item.roleIds) &&
        (item.roleIds = item.roleIds.map((item: any) => item.id));
      Array.isArray(item.ccEmployeeIds) &&
        (item.ccEmployeeIds = item.ccEmployeeIds.map((item: any) => item.id));
      Array.isArray(item.ccPositionIds) &&
        (item.ccPositionIds = item.ccPositionIds.map((item: any) => item.id));
      Array.isArray(item.ccRoleIds) &&
        (item.ccRoleIds = item.ccRoleIds.map((item: any) => item.id));
      return item;
    });
    setStorage('flowNodes', arr);
    console.log(arr);
    console.log(config);
  }, [nodeArr]);

  function updateNode() {
    setConfig({ ...config });
    // console.log('config', JSON.stringify(config));
    treeTurnArr({ ...config }, null, []);
  }

  let currentNode: any = null;
  // 链表操作: 几种行为， 添加行为，删除行为，点击行为     pRef.childNode -> objRef.childNode -> 后继
  // 添加节点
  function onAddNode(type: string | number, pRef: any, objRef: any) {
    setIsBegin(false);
    const o = objRef.childNode;
    if (type === OptionTypes.APPROVER) {
      objRef.childNode = {
        ...NodeTemplates[OptionTypes.APPROVER],
        nodeCode: randomString(8),
        childNode: o,
        fields: _formFields, // 给子节点加入表单字段
      };
      // objRef.conditionNodes && objRef.conditionNodes.map((item:any) => {
      //   if (item.childNode) {
      //     item.childNode = {
      //       ... item.childNode,
      //       nextNode: [objRef.childNode.nodeCode]
      //     };
      //   }
      // });
    }
    if (type === OptionTypes.CONDITION) {
      objRef.childNode = {
        ...NodeTemplates[OptionTypes.CONDITION],
        childNode: o,
        conditionNodes: [
          { ...NodeTemplates[OptionTypes.BRANCH], nodeCode: randomString(8) },
          { ...NodeTemplates[OptionTypes.BRANCH], nodeCode: randomString(8) },
        ],
      };
    }
    if (type === OptionTypes.BRANCH) {
      objRef.conditionNodes.push({
        ...NodeTemplates[NodeTypes.BRANCH],
        nodeCode: randomString(8),
      });
    }
    updateNode();
  }
  // 删除节点
  function onDeleteNode( // 删除节点后更新驳回节点可以放在删除节点里做
    pRef: any,
    objRef: any,
    type: string | number,
    index: string | number,
  ) {
    if (window.confirm('是否删除节点？')) {
      if (type === NodeTypes.BRANCH) {
        // console.log([...objRef.conditionNodes], index);
        objRef.conditionNodes.splice(index, 1);
        // console.log(objRef.conditionNodes);
      } else {
        const newObj = objRef.childNode;
        pRef.childNode = newObj;
      }
      updateNode();
    }
  }

  // 获取节点
  function onSelectNode(pRef: any, objRef: any) {
    currentNode = {
      current: objRef,
      prev: pRef,
    };
    console.log('currentNode:', currentNode);
  }

  // 递归获取最末端节点码
  function diffLastNode(objRef: any, nodes = [], firstEnter = true) {
    // console.log('objRef', objRef, nodes, firstEnter);
    const lastNode: any = nodes || [];
    if (objRef.type !== OptionTypes.CONDITION) {
      // console.log('objRef.childNode', objRef.childNode);
      objRef.childNode
        ? diffLastNode(objRef.childNode, nodes, !firstEnter)
        : lastNode.push(objRef.nodeCode);
    } else {
      if (objRef.childNode && !firstEnter) {
        diffLastNode(objRef.childNode, nodes);
      } else {
        objRef.conditionNodes.forEach((item: any) => {
          if (!item.childNode) {
            lastNode.push(item.nodeCode);
          } else {
            diffLastNode(item.childNode, nodes, !firstEnter);
          }
        });
      }
    }
    // console.log('lastNode', lastNode);
    return lastNode;
  }

  // 树结构转数组
  function treeTurnArr(
    objRef: any,
    pRef: any = null,
    nodes: any = [],
    conditionChildNode: any = null,
  ) {
    // console.log('conditionChildNode', objRef, conditionChildNode, pRef);
    if (objRef.type !== OptionTypes.CONDITION) {
      // console.log('objRef', objRef);
      addPervNode(objRef, pRef);
      nodes.push(objRef);
      setNodeArr(nodes);

      let nextNode = objRef.childNode;
      // 目前设计是用条件分支子节点在 conditionChildNode 往下传作为分支的子节点
      // 如果分支没有子节点，就不应该传 conditionChildNode
      // 在一个条件分支结束时会把 conditionChildNode 传给下一个节点，这时候需要清空 conditionChildNode（不传位 null 就是清空）
      if (objRef?.nodeCode === conditionChildNode?.nodeCode) {

        if (objRef.childNode) {
          treeTurnArr(objRef.childNode, objRef, nodes);
        }
      } else {
        nextNode = objRef.childNode || conditionChildNode;

        if (objRef.childNode) {
          treeTurnArr(objRef.childNode, objRef, nodes, conditionChildNode);
        }
      }
      addNextNode(objRef, nextNode);
    } else {
      // conditionChildNode 作为条件分支的子节点
      // 如果分支没有子节点（分支接的就是分支，两个非并行分支中间没有子节点的情况），就不应该传 conditionChildNode
      let _conditionChildNode = conditionChildNode;
      if (conditionChildNode === objRef) {
        _conditionChildNode = null;
      }
      for (let i = 0; i < objRef.conditionNodes.length; i++) {
        const node = objRef.conditionNodes[i];
        addPervNode(node, pRef);
        const nextNode =
          node.childNode || objRef.childNode || _conditionChildNode;
        addNextNode(node, nextNode);
        nodes.push(node);
        setNodeArr(nodes);
        if (node.childNode) {
          treeTurnArr(
            nextNode,
            node,
            nodes,
            objRef.childNode || _conditionChildNode,
          );
        }
      }
      if (objRef.childNode) {
        treeTurnArr(
          objRef.childNode,
          objRef,
          nodes,
          _conditionChildNode || objRef.childNode,
        );
      }
    }
  }

  // 添加nextNode
  function addNextNode(node: any, nextNode: any) {
    if (nextNode) {
      // console.log('nextNode', node, nextNode);
      if (nextNode.type !== OptionTypes.CONDITION) {
        nextNode.nodeCode !== node.nodeCode &&
          (node.nextNode = [nextNode.nodeCode]);
      } else {
        const nextCodes = nextNode.conditionNodes.map(
          (item: any) => item.nodeCode,
        );
        if (!nextCodes.includes(node.nodeCode)) {
          node.nextNode = nextCodes;
        }
      }
    } else {
      node.nextNode = [];
    }
  }

  // 添加pervNode
  function addPervNode(node: any, pRef: any) {
    // console.log('addPervNode', node, pRef);
    if (pRef) {
      if (pRef.type !== OptionTypes.CONDITION) {
        node.prevNode = [pRef.nodeCode];
      } else {
        node.prevNode = diffLastNode(pRef);
      }
    } else {
      node.prevNode = [];
    }
  }

  // 数组转树结构
  function arrTurnTree(nodeArr: any, config: any) {
    nodeArr.forEach((item: any) => {
      if (item.type === OptionTypes.START) {
        config = item;
      } else {
        deepNodeCode(config, item);
      }
    });
    // console.log(config);
    setConfig(config);
    treeTurnArr({ ...config }, null, []); // 进详情调用，能触发setStorage('flowNodes', arr);
  }

  // 递归函数,拼装流程节点（拿nodeCode）
  function deepNodeCode(objRef: any, item: any) {
    if (objRef.type !== OptionTypes.CONDITION) {
      const nextNode = objRef.nextNode;
      if (nextNode.includes(item.nodeCode)) {
        if (item.type !== OptionTypes.BRANCH) {
          item.prevNode &&
            item.prevNode.length < 2 &&
            (objRef.childNode = item);
        } else {
          if (item.prevNode && item.prevNode.length < 2) {
            addConditionNode(objRef);
          }
        }
      } else {
        if (objRef.childNode) {
          deepNodeCode(objRef.childNode, item);
        }
      }
    } else {
      const prevNode = diffLastNode(objRef, [], true);
      if (prevNode.length >= 2) {
        // 条件分支的条件至少是2个
        if (prevNode.toString() === item.prevNode.toString()) {
          if (item.type !== OptionTypes.BRANCH) {
            objRef.childNode = item;
          } else {
            addConditionNode(objRef);
          }
        }
      }

      if (objRef.childNode) {
        deepNodeCode(objRef.childNode, item);
      }
      objRef.conditionNodes.forEach((node: any) => {
        deepNodeCode(node, item);
      });
    }

    // 拼装条件分支
    function addConditionNode(objRef: any) {
      if (objRef.childNode && objRef.childNode.conditionNodes) {
        objRef.childNode.conditionNodes.push(item);
      } else {
        objRef.childNode = {
          name: '条件分支',
          type: OptionTypes.CONDITION,
          childNode: null,
          conditionNodes: [item],
        };
      }
    }
  }

  function onSubmit() {
    const params = {
      id: data?.id ? +data.id : null,
      nodes: getStorage('flowNodes'),
      // 由外部表单传入
      // tenantId: 100000,
      // appId: 10001,
      // name: '测试',
      // code: 'test-01',
      // formUri: '',
    };
    handleSubmit?.(params);
  }

  useEffect(() => {
    // 如果没有流程模板
    if (
      flowTemplateSelection &&
      Object.keys(flowTemplateSelection).length !== 0
    ) {
      setSelection(flowTemplateSelection);
    }
  }, [Object.keys(flowTemplateSelection).length]);

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      // 获取流程编辑详情
      data.nodes = data.nodes.map((item: any) => {
        item.positionIds = item.positions || [];
        item.roleIds = item.roles || [];
        item.employeeIds = item.employees || [];
        item.ccPositionIds = item.ccPositions || [];
        item.ccRoleIds = item.ccRoles || [];
        item.ccEmployeeIds = item.ccEmployees || [];
        item.fields = updateFormFields(item.fields, false, item.name === '发起节点') || [];
        delete item.positions;
        delete item.roles;
        delete item.employees;
        delete item.ccPositions;
        delete item.ccRoles;
        delete item.ccEmployees;
        return item;
      });
      arrTurnTree(data.nodes, config);
    } else {
      setConfig({
        name: '发起节点',
        desc: '',
        nodeCode: randomString(8),
        prevNode: [],
        nextNode: [],
        type: 0, // 开始节点0 普通节点1 条件节点2
        roleIds: [],
        positionIds: [],
        employeeIds: [],
        buttons: [
          {
            name: '撤回',
            alias: '撤回',
            code: 'withdraw',
            enable: 1,
          },
        ],
        callbackParams: {
          // 高级设置-操作-回调参数
          withdraw: null,
        },
        fields: _formFields, // 表单权限-字段配置
        childNode: null,
      });
      // 将开始标志置为false，此后的节点权限为仅可写
      setIsBegin(false);
    }
    // getSelection();
  }, [Object.keys(data).length]);

  return (
    <div className={styles.workFlowContainer}>
      <WFC.Provider
        value={{
          nodeArr,
          config,
          selection,
          updateNode,
          onAddNode,
          onDeleteNode,
          onSelectNode,
          multipleSearch,
          otherConditionFields: _otherConditionFields,
          departmentTreeList,
          roleList
        }}
      >
        <section className={styles.dingflowDesign}>
          <Zoom>
            <Render config={config} />
            <EndNode />
          </Zoom>
        </section>
        <Space className={styles.footer}>
          <Button type='primary' onClick={onSubmit}>
            提交
          </Button>
        </Space>
      </WFC.Provider>
    </div>
  );
};

export default FlowEngine;
