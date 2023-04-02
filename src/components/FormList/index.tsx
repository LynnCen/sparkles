import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.less';
import { LogType } from '@/pages/VersionList/data';
import { debounce } from 'lodash';

const toggleParentItem = (arr: LogType[], parentIndex?: number) => {
  if (parentIndex || parentIndex === 0) {
    return arr.filter((item, index) => index !== parentIndex);
  }
  return (arr || []).concat({ title: '', log: [] });
};

const updateParentItem = (arr: LogType[], parentIndex: number, value: string) => {
  return arr.map((item, index) => {
    if (index === parentIndex) return { ...item, title: value };
    return { ...item };
  });
};

const toggleSubItem = (arr: LogType[], parentIndex: number, subIndex?: number) => {
  const res = arr.map((item, index) => {
    if (index === parentIndex) {
      return {
        ...item,
        log:
          !subIndex && subIndex !== 0
            ? item.log.concat('')
            : item.log.filter((_, idx) => idx !== subIndex),
      };
    }
    return { ...item };
  });

  return res;
};

const updateSubItem = (arr: LogType[], parentIndex: number, subIndex: number, text: string) => {
  const res = arr.map((item, index) => {
    if (index === parentIndex) {
      return {
        ...item,
        log: item.log.map((l, idx) => {
          if (idx === subIndex) {
            return text;
          }
          return l;
        }),
      };
    }
    return { ...item };
  });

  return res;
};

interface PropsType {
  value?: LogType[];
  onChange?: (arg: LogType[]) => void;
  isAddNew?: boolean;
}

const LogItem: React.FC<PropsType> = (props) => {
  const [dataSource, setDataSource] = useState<LogType[]>(props.value || []);
  const [isFirstSet, setIsFirstSet] = useState<Boolean>(false);

  useEffect(() => {
    if (props.isAddNew) return;
    if (!isFirstSet) {
      setDataSource(props.value || []);
      setIsFirstSet(!!props.value);
    }
  }, [isFirstSet, props.value]);

  return (
    <div className={styles.logContainer}>
      {(dataSource || []).map((item, pIndex) => {
        return (
          <div className={styles.item}>
            <div className={styles.title}>
              <span>Title:</span>
              <div className={styles.titleItem}>
                <Input
                  value={item.title || ''}
                  onChange={(e) => {
                    const newDataSource = updateParentItem(dataSource, pIndex, e.target.value);
                    setDataSource(newDataSource);
                    if (props.onChange) props.onChange(newDataSource);
                  }}
                />
                <div className={styles.itemDelete}>
                  <CloseOutlined
                    onClick={() => {
                      const newDataSource = toggleParentItem(dataSource, pIndex);
                      setDataSource(newDataSource);
                      if (props.onChange) props.onChange(newDataSource);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.logs}>
              <span>Logs:</span>
              <div className={styles.logsRight}>
                {item.log.map((log, i) => {
                  return (
                    <div className={styles.logItem} key={i}>
                      <Input
                        value={log}
                        onChange={(e) => {
                          const newDataSource = updateSubItem(
                            dataSource,
                            pIndex,
                            i,
                            e.target.value,
                          );
                          setDataSource(newDataSource);
                          if (props.onChange) props.onChange(newDataSource);
                        }}
                      />
                      <MinusCircleOutlined
                        onClick={() => {
                          const newDataSource = toggleSubItem(dataSource, pIndex, i);
                          setDataSource(newDataSource);
                          if (props.onChange) props.onChange(newDataSource);
                        }}
                      />
                    </div>
                  );
                })}
                {item.log.every((l) => l) && (
                  <div className={styles.logsAdd}>
                    <Button
                      type="dashed"
                      block
                      icon={<PlusCircleOutlined />}
                      onClick={debounce(() => {
                        const newDataSource = toggleSubItem(dataSource, pIndex);
                        setDataSource(newDataSource);
                        if (props.onChange) props.onChange(newDataSource);
                      }, 300)}
                    >
                      Add Log
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div className={styles.itemAdd}>
        <Button
          type="dashed"
          block
          icon={<PlusCircleOutlined />}
          onClick={() => {
            const newDataSource = toggleParentItem(dataSource);
            setDataSource(newDataSource);
          }}
        >
          Add Log Item
        </Button>
      </div>
    </div>
  );
};

export default LogItem;
