/**
 * @Description 收藏列表左侧内容
 */
import styles from './index.module.less';
import { Dropdown, Input, Modal, Typography } from 'antd';
import IconFont from '@/common/components/IconFont';
import { MoreOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import cs from 'classnames';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { post } from '@/common/request';
import { getFavoriteList } from '@/common/api/siteselectionmap';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { bigdataBtn } from '@/common/utils/bigdata';
import { isArray } from '@lhb/func';


const LeftContent = ({ open, leftKey, setLeftKey, folderNum, setFolderNum, isRefresh, setRefresh }) => {
  const [editItem, setEditItem] = useState<any>({});
  const [editVisible, setEditVisible] = useState(false);
  const [folderList, setFolderList] = useState<any>([]);
  const [editLoading, setEditLoading] = useState(false);

  const menuItems = [
    { key: 'edit', label: '编辑信息' },
    // { key: 'delete', label: '删除' }, // 0411版本暂时注释，接口还不支持
  ];

  useEffect(() => {
    if (!open) return;
    getFolderList();
  }, [open]);

  useEffect(() => {
    if (isRefresh) {
      getFolderList();
      setRefresh(false);
    };
  }, [isRefresh]);

  /* methods */
  /**
   * @description 获取文件夹列表
   */
  const getFolderList = () => {
    getFavoriteList({}).then((res) => {
      const { favoriteFolderListVOS: data, siteLocationFlag } = res;
      setFolderList(isArray(data) ? data : []);
      if (data.length) {
        const currentItem = data.find((item) => item.id === leftKey);
        const result = currentItem?.id ? currentItem : data[0];
        setFolderNum({
          clusterNum: result.clusterNum,
          siteLocationNum: result.siteLocationNum,
          siteLocationFlag: siteLocationFlag,
        });
        setLeftKey(result.id);
      }
    });
  };
  const onMenuClick = (e, item) => {
    e.domEvent.stopPropagation();
    if (e.key === 'edit') {
      setEditItem({
        id: item.id,
        label: item.name
      });
      setEditVisible(true);
    } else if (e.key === 'delete') {
      deleteCollect(item.id);
    }
  };
  // 编辑收藏夹
  const confirmEditCollect = () => {
    if (!editItem.label) {
      V2Message.warning('请输入收藏夹名称');
      return;
    }
    setEditLoading(true);
    // https://yapi.lanhanba.com/project/546/interface/api/70195
    post('/clusterLocationFavor/saveFolder', { name: editItem.label, id: editItem.id }, { needHint: true }).then(() => {
      bigdataBtn('11fabca5-5061-4082-860c-ea9c480e3b76', '选址地图', '添加收藏夹', '添加收藏夹');
      V2Message.success(`${editItem.id ? '编辑' : '添加'}成功`);
      getFolderList();
      setEditVisible(false);
    }).finally(() => setEditLoading(false));

  };
  // 删除收藏夹
  const deleteCollect = (id: number) => {
    V2Confirm({ content: '是否确认删除？', onSure: (modal: any) => {
      modal.destroy();
      // https://yapi.lanhanba.com/project/546/interface/api/70202
      post('/clusterLocationFavor/deleteFolder', { id }, { needHint: true }).then(() => {
        V2Message.success('删除成功');
        getFolderList();
      });
    } });
  };

  const folderChangeHandle = (item) => {
    setFolderNum({
      ...folderNum,
      clusterNum: item.clusterNum,
      siteLocationNum: item.siteLocationNum,
    });
    setLeftKey(item.id);
  };

  return (
    <div className={styles.left}>
      <div className={styles.leftHeader}>收藏夹（{folderList?.length}）</div>
      <div className={styles.collectList}>
        { folderList.map((item, index: number) => {
          return (
            <div key={item.id} className={cs(styles.listItem, leftKey === item.id && styles.listItemActive)} onClick={() => folderChangeHandle(item)}>
              <Typography.Text className={styles.listItemName} ellipsis={{ tooltip: item.name }}>{ item.name }</Typography.Text>
              {/* 默认文件夹不展示更多 */}
              { index > 0 && (
                <Dropdown menu={{ items: menuItems, onClick: (e) => onMenuClick(e, item) }} trigger={['hover']} placement='bottomRight'>
                  <MoreOutlined className={styles.itemMore} onClick={e => e.stopPropagation()} />
                </Dropdown>
              ) }
            </div>
          );
        }) }
      </div>
      <div className={styles.leftFooter} onClick={() => {
        setEditItem({ label: '', id: '' });
        setEditVisible(true);
      }}>
        <IconFont iconHref='iconic_add_xiangqing' className='mr-4 fs-14 c-006' />
        添加收藏夹
      </div>
      <Modal
        title={editItem.id ? '编辑' : '添加收藏夹'}
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={confirmEditCollect}
        confirmLoading={editLoading}
        centered
      >
        <Input
          value={editItem.label}
          onChange={(e) => setEditItem({ ...editItem, label: e.target.value })}
          showCount
          maxLength={10}
        />
      </Modal>
    </div>
  );
};

export default LeftContent;
