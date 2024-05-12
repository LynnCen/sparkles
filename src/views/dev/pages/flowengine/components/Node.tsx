
/**
 * @Description
 */

import { FC } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import RowItem from './RowItem';
import { isArray } from '@lhb/func';

const Node: FC<any> = ({
  node
}) => {

  return <div className={styles.nodeCon}>
    {
      node?.type === 1 ? <div>
        <div className={styles.cardCon}>
          <div className={styles.titCon}>
            {node?.name}
          </div>
          <div className={styles.contentCon}>
          内容
          </div>
        </div>
        <div className={styles.connectingLine}></div>
      </div>
        : null
    }
    {
      node?.type === 2 ? <div>
        <div className={styles.cardCon}>
          <div className={styles.titCon}>
            {node?.name}
          </div>
          <div className={styles.contentCon}>
            内容
          </div>
        </div>
        <div className={styles.connectingLine}></div>
      </div>
        : null
    }
    {
      node?.type === 3 ? <>
        {
          isArray(node?.conditions) && node?.conditions.length ? <div>
            <div className={styles.conditionCon}>
              {
                node.conditions.map((item: any) => <div className={styles.conditionItem}>
                  <div className={styles.cardCon}>
                    <div className={styles.titCon}>
                      {item?.name}
                    </div>
                    <div className={styles.contentCon}>
                      内容
                    </div>

                  </div>
                  <div className={styles.fullConnectingLine}></div>
                  <div style={{ height: '40px' }}></div>
                  {item.childNode && (
                    <RowItem config={item.childNode} />
                  )}
                </div>)
              }
            </div>
            <div className={styles.connectingLine}></div>
          </div> : null
        }
      </>
        : null
    }
  </div>;
};

export default Node;
