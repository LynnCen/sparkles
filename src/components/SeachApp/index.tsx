import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useIntl } from 'umi';
import { Button, Checkbox, Empty, Input } from 'antd';
import type { AppItem } from '@/services/appList';
import { queryAppByName } from '@/services/appList';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CloseCircleOutlined } from '@ant-design/icons';
import { findIndex } from 'lodash';
import generateImagePath from '@/utils/imagePath';

interface propsType {
  type?: number;
  isMultiple: boolean;
  onChange?: (id: string) => void;
  defaultSelected: AppItem[];
  onSelected?: (arr: any) => void;
}

type SelectedItemType = {
  appItem: AppItem;
  onClick?: (appItem: AppItem, e: MouseEvent) => void;
  checkable?: boolean;
};

const SelectedItem: React.FC<SelectedItemType> = ({ appItem, onClick, checkable }) => {
  const {
    logo: { bucketId, text, file_type },
  } = appItem;
  const url = generateImagePath(bucketId, text, file_type);
  const handleClick = (e) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onClick && onClick(appItem, e);
  };
  return (
    <div className={styles.programItem} key={appItem._id}>
      {checkable === undefined && ''}
      {checkable === true && <Checkbox checked={appItem.checked} onClick={handleClick} />}
      {checkable === false && <CloseCircleOutlined onClick={handleClick} />}
      <img className={styles.programItem_img} src={url} />
      <span className={styles.name}>{appItem.name}</span>
    </div>
  );
};

const SearchApp: React.FC<propsType> = (props) => {
  const { formatMessage } = useIntl();
  const [loading, toggleUploading] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>('');
  const [searchLs, setSearchLs] = useState<AppItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<AppItem[]>([]);

  const queryList = async () => {
    if (loading) return;
    toggleUploading(true);
    try {
      const ls = await queryAppByName(searchWord, props.type);
      const newSearchLs = ls.data.map((app) => {
        if (findIndex(selectedItems, (appItem) => appItem._id === app._id) > -1) {
          return { ...app, checked: true };
        }
        return { ...app };
      });
      setSearchLs(newSearchLs);
    } catch (e) {
      //
    } finally {
      toggleUploading(false);
    }
  };

  useEffect(() => {
    if (typeof props.onSelected === 'function') {
      props.onSelected(selectedItems);
    }
  }, [selectedItems]);

  useEffect(() => {
    if (props.defaultSelected) {
      setSelectedItems(props.defaultSelected);
    }
  }, [props.defaultSelected]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const search = value.trim();
    setSearchWord(search);
  };

  const onCheckItem = (item: AppItem, event: CheckboxChangeEvent) => {
    const { checked } = event.target;
    const { isMultiple } = props;
    const newLs = searchLs.map((appItem) => {
      return appItem._id === item._id
        ? { ...appItem, checked }
        : isMultiple
        ? { ...appItem }
        : { ...appItem, checked: false };
    });
    setSearchLs(newLs);

    if (isMultiple) {
      setSelectedItems((prevState) => {
        return checked ? prevState.concat(item) : prevState.filter((app) => app._id !== item._id);
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      checked ? setSelectedItems([item]) : setSelectedItems([]);
    }
    if (typeof props.onChange === 'function') {
      props.onChange(item._id);
    }
  };

  const onCancelItem = (appItem: AppItem) => {
    const { _id } = appItem;
    const newLs = searchLs.map((appItem) => {
      return appItem._id === _id ? { ...appItem, checked: false } : { ...appItem };
    });
    setSearchLs(newLs);
    setSelectedItems((prevState) => {
      return prevState.filter((app) => app._id !== appItem._id);
    });
    if (typeof props.onChange === 'function') {
      props.onChange(_id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.search_header}>
          <Input onChange={onChange} />
          <Button onClick={queryList}>查询</Button>
        </div>
        <div className={styles.search_result_container}>
          {searchLs.length ? (
            <div className={styles.search_result}>
              {searchLs.map((appItem) => {
                return (
                  <SelectedItem
                    key={appItem._id}
                    appItem={appItem}
                    onClick={onCheckItem}
                    checkable={true}
                  />
                );
              })}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </div>

      <div className={styles.selected_container}>
        <div className={styles.selected_label}>{formatMessage({ id: 'selected' })}</div>
        <div className={styles.search_result}>
          {selectedItems.map((appItem) => {
            return (
              <SelectedItem
                key={appItem._id}
                appItem={appItem}
                onClick={onCancelItem}
                checkable={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchApp;

export { SelectedItem };
