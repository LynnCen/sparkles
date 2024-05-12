import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
import SearchForm from '@/common/components/Form/SearchForm';
import FormThreeLevelIndustry from '@/common/components/FormBusiness/FormThreeLevelIndustry';
import { Cascader, Anchor, Spin } from 'antd';
import { useMethods } from '@lhb/hook';
import { industryList } from '@/common/api/brand-center';
import { deepCopy, matchQuery } from '@lhb/func';
import cs from 'classnames';

const { Link } = Anchor;

const Industry: FC<any> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState({});
  const [secondLevelList, setSecondLevelList] = useState<any[]>([]);
  const [anchors, setAnchors] = useState<any[]>([]);
  const [currentAnchor, setCurrentAnchor] = useState('');
  const [selBrandId, setSelBrandId] = useState();

  useEffect(() => {
    methods.getIndustries();
  }, []);

  const methods = useMethods({
    async getIndustries() {
      setLoading(true);
      const data = await industryList();
      setLoading(false);
      let tmpSecondLevelList: any = [];
      if (Array.isArray(data) && data.length) {
        // 使用一级行业设置锚点
        setAnchors(data.map(itm => ({
          href: `brand_${itm.id}`,
          title: itm.name,
        })));
        // 默认选中第一个一级行业锚点
        setCurrentAnchor(`#brand_${data[0].id}`);

        // 汇总二级行业
        data.forEach(itm => {
          if (itm.children.length) {
            // 标记一级行业下的第1个二级行业
            itm.children[0].isFirstChildUnderLevelOne = true;
          }
          // @ts-ignore
          tmpSecondLevelList = [...tmpSecondLevelList, ...itm.children];
        });
      }
      setSecondLevelList(tmpSecondLevelList);
    },
    onSearch(values: any) {
      let vals = deepCopy(values);
      if (vals.industryIds) {
        if (vals.industryIds.length > 0) {
          vals = Object.assign(vals, {
            oneIndustryId: vals.industryIds[0],
          });
        }
        if (vals.industryIds.length > 1) {
          vals = Object.assign(vals, {
            twoIndustryId: vals.industryIds[1],
          });
        }
        if (vals.industryIds.length > 2) {
          vals = Object.assign(vals, {
            threeIndustryId: vals.industryIds[2],
          });
        }
      } else {
        vals = Object.assign(vals, {
          oneIndustryId: undefined,
          twoIndustryId: undefined,
          threeIndustryId: undefined,
        });
      }
      delete vals.industryIds;
      setParams({ ...params, ...vals, });

      if (vals.threeIndustryId) {
        setSelBrandId(vals.threeIndustryId);
        const element = document.querySelector(`#brand_${vals.threeIndustryId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (vals.twoIndustryId) {
        setSelBrandId(vals.twoIndustryId);
        const element = document.querySelector(`#brand_${vals.twoIndustryId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (vals.oneIndustryId) {
        setSelBrandId(undefined);
        const element = document.querySelector(`#brand_${vals.oneIndustryId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setSelBrandId(undefined);
      }

      // 切换选中对应的一级行业锚点
      if (vals.oneIndustryId) {
        setCurrentAnchor(`#brand_${vals.oneIndustryId}`);
      }
    },
    onReset() {
      setSelBrandId(undefined);
      setParams({});
    },
  });

  const onAnchorChange = (link: string) => {
    setCurrentAnchor(link);
  };

  return (
    <Spin tip='数据加载中...' spinning={loading} className={styles.spinWrapper}>
      {
      /*
        减去高度设置80 = 顶部条高度48 + container上margin16 + container下margin16；
        减去高度大于这个值，页面底部留白大于预期；
        减去高度小于这个值，页面底部留白小于预期，且页面右侧会出现不必要的滚动条；

        如果是作为外部加载页面，比如邻汇吧后台，不需要考虑顶部条高度48和container上下margin各16，则为0
      */
      }
      <div className={styles.container} style={{ height: matchQuery(location.search, 'source') ? '100vh' : 'calc(100vh - 80px)' }}>
        <SearchForm
          colon={false}
          onOkText='搜索'
          onSearch={methods.onSearch}
          onReset={methods.onReset}>
          <FormThreeLevelIndustry
            label='选择行业'
            name='industryIds'
            allowClear={true}
            config={{
              changeOnSelect: true,
              showCheckedStrategy: Cascader.SHOW_CHILD,
              showSearch: true,
              maxTagCount: 'responsive'
            }}
            placeholder='请选择'
          />
        </SearchForm>
        <div className={styles.industryContent}>
          <div className={styles.leftList}>
            {
              Array.isArray(anchors) && <Anchor affix={false} getCurrentAnchor={() => currentAnchor} onChange={onAnchorChange}>
                {
                  anchors.map(anchor => {
                    const { href, title } = anchor;
                    return <Link key={href} title={title} href={`#${href}`}/>;
                  })
                }
              </Anchor>
            }
          </div>
          <div className={styles.rightList}>
            {
              Array.isArray(secondLevelList) && secondLevelList.map((itm, idx) => (<div key={idx} className={cs(styles.secondLevelItem)}>
                {<div id={itm.isFirstChildUnderLevelOne ? `brand_${itm.parentId}` : ''} className={cs(styles.topDivider, !idx && styles.invisibleDivider)}></div>}
                <span id={`brand_${itm.id}`} className={cs(styles.secondLevelTitle, selBrandId === itm.id && styles.selectBrand)}>{itm.name}</span>
                <div className={styles.threeLevelWrapper}>
                  {
                    Array.isArray(itm.children) && itm.children.map((ittm, iddx) => (
                      <span key={iddx} id={`brand_${ittm.id}`} className={cs(styles.threeLevelItem, selBrandId === ittm.id && styles.selectBrand)}>{ittm.name}</span>
                    ))
                  }
                </div>
              </div>))
            }
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Industry;

