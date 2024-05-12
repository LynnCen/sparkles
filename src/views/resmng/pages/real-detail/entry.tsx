import Operate from '@/common/components/Operate';
import { refactorPermissions, urlParams } from '@lhb/func';
import { Anchor, Tabs, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { resTemplateList } from '@/common/api/template';
import { post } from '@/common/request';
import Detaial from './Detail';
import { siteStore, pointStore } from './store';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import CategoryChooseModal from '../index/components/Modal/CategoryChooseModal';
import { CategoryChooseModalInfo } from '../index/ts-config';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const { getInfoById: getSiteInfoById } = siteStore;

const { getInfoById: getPointInfoById } = pointStore;

const { Link } = Anchor;
const renderAnchors = (anchors: { title: string, href: string }[]) => {
  return (
    <Anchor style={{ paddingTop: 20 }}>
      { anchors.map(anchor => {
        const { href, title } = anchor;
        return <Link key={href} title={title} href={`#${href}`}/>;
      })
      }
    </Anchor>
  );
};

const renderOperates = (operateExtra: any[], onAction?: (event: string) => void) => {
  const list = refactorPermissions(operateExtra);
  return list.map((item) => {
    const { event, text } = item;
    const res: any = {
      name: text,
      type: 'primary',
      onClick: () => onAction?.(event),
    };
    return res;
  });
  // eslint-disable-next-line
};



// const style: CSSProperties = {
//   width: 400
// };

// 由于编辑页面起了叫deatil，所以只能起这个来告诉维护者这才是真正的详情页(KA和资源共用同一个页面，通过isKA来判断)
const RealDetail = () => {
  const { search, } = useLocation();
  const { resourceType, id, categoryId, isKA, activeKey: key } = urlParams(search) as any as { resourceType: string, id: number, categoryId: number, isKA?: string, activeKey?: number };
  const [activeKey, setActiveKey] = useState<Partial<string>>(resourceType);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [categoryChooseModalInfo, setCategoryChooseModalInfo] = useState<CategoryChooseModalInfo>({ visible: false });
  const [spots, setSpots] = useState<any[]>([]);
  const selectedId = (activeKey === '0' || activeKey === '1') ? id : activeKey;

  // 编辑
  const handleUpdate = async () => {
    // 场地需要进行选择某个分类
    const { objectList = [] } = await resTemplateList({
      resourcesType: activeKey === '0' ? 0 : 1,
      useType: isKA === 'true' ? 4 : 0
    });

    if (objectList && objectList.length) {
      const current = spots.find(item => item.spotId === Number(selectedId));
      // 区分直接点击点位或者场地和通过场地里面点击对应的点位
      const selectedCategoryId = current ? current.categoryId : categoryId;
      dispatchNavigate(
        `/resmng/detail?id=${selectedId}&resourceType=${activeKey === '0' ? 0 : 1}&categoryId=${selectedCategoryId}&categoryTemplateId=${objectList[0].id}&isKA=${isKA}`
      );
    }
  };

  // 删除
  const handleDelete = () => {
    V2Confirm({
      onSure: (modal) => {
        const url = activeKey === '0' ? '/place/delete' : '/spot/delete';
        post(url, { id: selectedId, isKA }, true).then(() => {
          setTimeout(() => {
            modal.destroy();
            if (isKA === 'true') {
              dispatchNavigate('/resmngka');
            } else {
              dispatchNavigate('/resmng');
            }
          }, 1000);
        });
      },
      content: '此操作将永久删除该数据, 是否继续？'
    });
  };


  // 新增点位
  const handleCreateSpot = () => {
    setCategoryChooseModalInfo({ visible: true, placeId: id, resourceType: 1, isKA } as any);
  };



  // 详情
  const handleAction = (key: string) => {
    switch (key) {
      case 'delete':
        return handleDelete();
      case 'createSpot':
        handleCreateSpot();
        return;
      default:
        return handleUpdate();
    }
  };

  // 锚点列表
  const [anchors, setAnchors] = useState<{ title: string, href: string }[]>([]);

  // 详情操作按钮列表
  const [actions, setActions] = useState<any[]>([]);

  const onChange = (activeKey: any) => {
    setActiveKey(activeKey);
    if (activeKey === '0') {
      getInfo(selectedId as any, getSiteInfoById);
      return;
    } else {
      getInfo(selectedId as any, getPointInfoById);
    }
  };

  const getInfo = async (id: number, cb: Function) => {
    setLoading(true);
    const module = isKA === 'true' ? 'kamng' : 'resmng';
    const { resourceGroupList = [], permissions = [], resourceSpotList = [] } = await cb(id, module, isKA) || {};
    const anchors = resourceGroupList.map(item => ({ title: item.groupName, href: item.groupId }));

    unstable_batchedUpdates(() => {
      setLoading(false);
      setActions(permissions);
      setData(resourceGroupList);
      setAnchors(anchors);
      if ((Number(activeKey) === 0 || Number(activeKey) === 1) && resourceSpotList) {
        setSpots(resourceSpotList);
        if (activeKey === '1') {
          setActiveKey(Number(key) as any);
        }
      }
    });
  };

  useEffect(() => {
    if (activeKey === '0') {
      getInfo(selectedId as any, getSiteInfoById);
      return;
    }

    if (activeKey === '1') {
      getInfo(selectedId as any, getSiteInfoById);
      return;
    }

    getInfo(selectedId as any, getPointInfoById);
  }, [selectedId, activeKey]);
  const tabsItems = useMemo(() => {
    return spots?.map((item: any) => {
      const { spotId, spotName } = item;
      return { label: spotName, key: spotId };
    });
  }, [spots]);

  return (
    <Spin tip='数据正在加载中请稍等......' spinning={loading}>
      <Tabs activeKey={activeKey as any} onChange={onChange} items={[
        { label: '场地详情', key: '0' }
      ].concat(tabsItems)}/>
      <Layout
        actions={(<Operate showBtnCount={4} operateList={renderOperates(actions, handleAction)}/>)}
        anchors={renderAnchors(anchors)}
      >
        <Detaial data={data}/>
      </Layout>
      <CategoryChooseModal
        categoryChooseModalInfo={categoryChooseModalInfo}
        setCategoryChooseModalInfo={setCategoryChooseModalInfo}
      />
    </Spin>
  );
};

export default RealDetail;
