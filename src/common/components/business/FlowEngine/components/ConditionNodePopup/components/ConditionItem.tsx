// import { useMethods } from '@lhb/hook';
// import { Col, Divider, Input, Row, Select } from 'antd';
// import { FC, useContext, useEffect } from 'react';
// import styles from './index.module.less';
// // import { deepCopy } from '@lhb/func';
// import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
// import { getStorage, setStorage } from '@lhb/cache';
// import WFC from '../../OperatorContext';
// const ConditionSet: FC<any> = ({
//   objRef,
//   expressions,
//   context,
//   conditionIndex,
// }) => {
//   const { setCopyObjRef }: any = useContext(context);
//   const { multipleSearch }: any = useContext(WFC);
//   // TODO 测试字段表单内容存储
//   // setStorage('flowFields', [
//   //   { name: '姓名', field: 'name' },
//   //   { name: '性别', field: 'sex' },
//   //   { name: '年龄', field: 'age' }
//   // ]);

//   const operations = [
//     { label: '大于', value: '>' },
//     { label: '大于等于', value: '>=' },
//     { label: '等于', value: '==' },
//     { label: '小于', value: '<' },
//     { label: '小于等于', value: '<=' },
//     { label: '不等于', value: '!=' },
//   ];

//   const methods = useMethods({
//     onDelete(index: any) {
//       expressions.splice(index, 1);
//       if (!expressions.length) {
//         objRef.conditions.splice(conditionIndex, 1);
//       }
//       setCopyObjRef({ ...objRef });
//     },
//     onAdd() {
//       expressions.push({
//         field: null,
//         operation: null,
//         value: '',
//       });
//       setCopyObjRef({ ...objRef });
//     },
//     onFieldChange(value: any, index: number) {
//       expressions[index].field = value;
//       setCopyObjRef({ ...objRef });
//     },
//     onOperationChange(value: any, index: number) {
//       expressions[index].operation = value;
//       setCopyObjRef({ ...objRef });
//     },
//     onInputBlur(value: any, index: number) {
//       expressions[index].value = value;
//       setCopyObjRef({ ...objRef });
//     },
//     async getFlowFieldsData() {
//       const data = await multipleSearch({}, 'flowFields');
//       const fields = data.map((item: any) => {
//         return {
//           ...item,
//           field: item?.field || item?.value,
//         };
//       });
//       setStorage('flowFields', fields);
//     },
//   });

//   useEffect(() => {
//     methods.getFlowFieldsData();
//   }, []);

//   return (
//     <>
//       {Array.isArray(expressions) &&
//         expressions.map((item, index) => {
//           return (
//             <div key={'expressions' + index} style={{ border: '1px solid red' }}>
//               <Row gutter={[4, 0]} align='middle' justify='end'>
//                 <Col span={4} className={styles.col}>
//                   <Divider />
//                 </Col>
//                 <Col span={6} className={styles.col}>
//                   <Select
//                     defaultValue={item.field}
//                     fieldNames={{ label: 'name', value: 'field' }}
//                     options={getStorage('flowFields')}
//                     className={styles.select}
//                     placeholder='字段名'
//                     onSelect={(value) => {
//                       methods.onFieldChange(value, index);
//                     }}
//                   />
//                 </Col>
//                 <Col span={6} className={styles.col}>
//                   <Select
//                     defaultValue={item.operation}
//                     options={operations}
//                     className={styles.select}
//                     placeholder='比较运算符'
//                     onSelect={(value) => {
//                       methods.onOperationChange(value, index);
//                     }}
//                   />
//                 </Col>
//                 <Col span={6} className={styles.col}>
//                   <Input
//                     defaultValue={item.value}
//                     maxLength={20}
//                     placeholder='请输入内容'
//                     onBlur={(e) => {
//                       methods.onInputBlur(e.target.value, index);
//                     }}
//                   />
//                 </Col>
//                 <Col
//                   span={2}
//                   className={styles.col}
//                   onClick={() => {
//                     methods.onDelete(index);
//                   }}
//                 >
//                   <DeleteOutlined />
//                 </Col>
//               </Row>
//               <div className={styles.connect}>且（&）</div>
//             </div>
//           );
//         })}
//       <Row gutter={[4, 0]}>
//         <Col span={4} className={styles.col}>
//           <Divider />
//         </Col>
//         <Col span={6} className={styles.add}>
//           <PlusCircleFilled onClick={methods.onAdd} />
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default ConditionSet;
import { useMethods } from '@lhb/hook';
import { Col, Divider, Input, Row, Select } from 'antd';
import { FC, useContext, useEffect } from 'react';
import styles from './index.module.less';
// import { deepCopy } from '@lhb/func';
import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import WFC from '../../OperatorContext';
import { ConditionOption } from '../../../index';
import { concatObjArray } from '@lhb/func';
import { Condition } from '../index';
/**
 * 默认的条件字段
 */
export const defaultConditionFields: ConditionOption[] = [
  { name: '姓名', field: 'name', controlType: 3 },
  { name: '性别', field: 'sex', controlType: 1 },
  { name: '年龄', field: 'age', controlType: 7 }
];

const ConditionSet: FC<any> = ({
  objRef,
  expressions,
  conditionIndex,
}) => {
  // console.log('expressions', expressions, objRef);
  const { setCopyObjRef, conditionFields, setConditionFields }: any = useContext(Condition);
  const { otherConditionFields }: any = useContext(WFC);

  /**
   *  动态化比较运算符
   * @param type 7:数字输入框，其他：其他输入框
   */
  const operations = (type: number) => {
    // 数字输入框时，需要显示大于、大于等于、等于、小于、小于等于、不等于
    if (type === 7) {
      return [
        { label: '大于', value: '>' },
        { label: '大于等于', value: '>=' },
        { label: '等于', value: '==' },
        { label: '小于', value: '<' },
        { label: '小于等于', value: '<=' },
        { label: '不等于', value: '!=' },
      ];
    } else {
      return [
        { label: '等于', value: '==' },
        { label: '不等于', value: '!=' },
      ];
    }

  };

  const methods = useMethods({
    onDelete(index: any) {
      expressions.splice(index, 1);
      if (!expressions.length) {
        objRef.conditions.splice(conditionIndex, 1);
      }
      setCopyObjRef({ ...objRef });
    },
    onAdd() {
      expressions.push({
        field: null,
        operation: null,
        value: '',
      });
      setCopyObjRef({ ...objRef });
    },
    onFieldChange(value: any, index: number, option: ConditionOption) {
      expressions[index].field = value;
      expressions[index].controlType = option.controlType;
      // 因为字段变化，所以操作符也要清空
      expressions[index].operation = null;
      objRef.fields = conditionFields;
      setCopyObjRef({ ...objRef });
    },
    onOperationChange(value: any, index: number) {
      expressions[index].operation = value;
      setCopyObjRef({ ...objRef });
    },
    onInputBlur(value: any, index: number) {
      expressions[index].value = value;
      setCopyObjRef({ ...objRef });
    },
    getConditionFields() {
      // console.log('otherConditionFields', otherConditionFields);
      const mergeConditionFields = concatObjArray(defaultConditionFields, otherConditionFields, 'field');


      const _fields = mergeConditionFields.map((item: any) => {
        return {
          ...item,
          field: item?.field || item?.value,
        };
      });
      setConditionFields(_fields);
    },
  });

  useEffect(() => {
    console.log('111', 111);
    methods.getConditionFields();
  }, []);

  return (
    <>
      {Array.isArray(expressions) &&
        expressions.map((item, index) => {
          return (
            <div key={'expressions' + index}>
              <Row gutter={[4, 0]} align='middle' justify='end'>
                <Col span={4} className={styles.col}>
                  <Divider />
                </Col>
                <Col span={6} className={styles.col}>
                  <Select
                    defaultValue={item.field}
                    fieldNames={{ label: 'name', value: 'field' }}
                    options={conditionFields}
                    className={styles.select}
                    placeholder='字段名'
                    onSelect={(value, option) => {
                      methods.onFieldChange(value, index, option);
                    }}
                  />
                </Col>
                <Col span={6} className={styles.col}>
                  <Select
                    defaultValue={item.operation}
                    options={operations(item.controlType)}
                    className={styles.select}
                    placeholder='比较运算符'
                    onSelect={(value) => {
                      methods.onOperationChange(value, index);
                    }}
                  />
                </Col>
                <Col span={6} className={styles.col}>
                  <Input
                    defaultValue={item.value}
                    maxLength={20}
                    placeholder='请输入内容'
                    onBlur={(e) => {
                      methods.onInputBlur(e.target.value, index);
                    }}
                  />
                </Col>
                <Col
                  span={2}
                  className={styles.col}
                  onClick={() => {
                    methods.onDelete(index);
                  }}
                >
                  <DeleteOutlined />
                </Col>
              </Row>
              <div className={styles.connect}>且（&）</div>
            </div>
          );
        })}
      <Row gutter={[4, 0]}>
        <Col span={4} className={styles.col}>
          <Divider />
        </Col>
        <Col span={6} className={styles.add}>
          <PlusCircleFilled onClick={methods.onAdd} />
        </Col>
      </Row>
    </>
  );
};

export default ConditionSet;
