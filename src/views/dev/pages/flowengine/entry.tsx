import { FC } from 'react';
import styles from './entry.module.less';
import RowItem from './components/RowItem';

const Flowengine: FC<any> = () => {
  // const data = {
  //   name: '起始节点',
  //   type: 1,
  //   childNode: {
  //     name: '审批节点',
  //     type: 2,
  //     childNode: {
  //       name: '条件节点',
  //       type: 3,
  //       conditions: [
  //         {
  //           name: '条件节点1',
  //           type: 2,
  //           childNode: {
  //             name: '审批节点',
  //             type: 2,
  //           }
  //         },
  //         {
  //           name: '条件节点2',
  //           type: 2,
  //         },
  //         {
  //           name: '条件节点3',
  //           type: 2,
  //         },
  //       ],
  //       childNode: {
  //         name: '审批节点2',
  //         type: 2,
  //       }
  //     }
  //   },
  // };
  // const data = {
  //   name: '起始节点',
  //   type: 1,
  //   childNode: {
  //     name: '条件节点',
  //     type: 3,
  //     conditions: [
  //       {
  //         name: '条件节点1',
  //         type: 2,
  //         childNode: {
  //           name: '条件节点',
  //           type: 3,
  //           conditions: [
  //             {
  //               name: '条件节点1-1',
  //               type: 2,
  //             },
  //             {
  //               name: '条件节点1-2',
  //               type: 2,
  //             }
  //           ],
  //           childNode: {
  //             name: '审批节点',
  //             type: 2,
  //           }
  //         }
  //       },
  //       {
  //         name: '条件节点2',
  //         type: 2,
  //       },
  //     ],
  //   }
  // };


  const data = {
    name: '起始节点',
    type: 1,
    childNode: {
      name: '条件节点',
      type: 3,
      conditions: [
        {
          name: '条件节点1',
          type: 2,
          childNode: {
            name: '条件节点',
            type: 3,
            conditions: [
              {
                name: '条件节点1-1',
                type: 2,
              },
              {
                name: '条件节点1-2',
                type: 2,
              }
            ],
            childNode: {
              name: '审批节点',
              type: 2,
            }
          }
        },
        {
          name: '条件节点2',
          type: 2,
          childNode: {
            name: '条件节点',
            type: 3,
            conditions: [
              {
                name: '条件节点1-1',
                type: 2,
              },
              {
                name: '条件节点1-2',
                type: 2,
              }
            ],
            childNode: {
              name: '审批节点',
              type: 2,
            }
          }
        },
      ],
    }
  };
  return (
    <div className={styles.container}>
      <RowItem config={data}/>
    </div>
  );
};

export default Flowengine;
