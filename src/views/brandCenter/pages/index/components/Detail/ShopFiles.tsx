import V2Table from '@/common/components/Data/V2Table';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2Operate from '@/common/components/Others/V2Operate';
import { post } from '@/common/request';
import { deepCopy, downloadFile, beautifyTheByte, refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { FC } from 'react';
/*
  品牌详情-附件Tab
*/

const ShopFiles: FC<any> = ({
  info,
  permissions,
  changeDetail,
}) => {
  const methods = useMethods({
    async loadData () {
      return {
        dataSource: info,
        count: info.length,
      };
    },
    handleDownload(item) {
      downloadFile({ name: item.name, downloadUrl: item.url + '?attname=' + item.name });
    },
    handleRemove(item, index) {
      V2Confirm({
        content: '此操作将永久删除该数据, 是否继续？',
        onSure(modal: any) {
          post('/brand/deleteAnnex', {
            annexId: item.id,
          }, {
            isMock: false,
            proxyApi: '/mdata-api',
            needHint: true
          }).then(() => {
            V2Message.success('删除成功');
            const mdBrandAnnexDtos = deepCopy(info);
            mdBrandAnnexDtos.splice(index, 1);
            changeDetail({
              brandAnnex: [...mdBrandAnnexDtos]
            }, false);
            modal.destroy();
          });
        }
      });
    }
  });
  const columns: any[] = [
    { key: 'name', title: '文件名称', dragChecked: true },
    { key: 'size', title: '附件大小', dragChecked: true, render(val) {
      return beautifyTheByte(val);
    } },
    {
      title: '操作',
      key: 'operate',
      render: (_, record: any, index: number) => {
        const operates = [{ event: 'download', name: '下载' }];
        if (permissions?.find(item => item.event === 'brandLibrary:update')) {
          operates.push({ event: 'remove', name: '删除' });
        }
        return (
          <V2Operate
            operateList={refactorPermissions(operates)}
            onClick={(btn: any) => methods[btn.func](record, index)}
          />
        );
      },
      dragChecked: true
    }
  ];
  return (
    <div style={{ marginTop: '20px' }}>
      <V2Table
        rowKey='id'
        filters={info} // 可以直接唤起接口更新
        type='easy'
        hideColumnPlaceholder
        pagination={false}
        defaultColumns={columns}
        onFetch={methods.loadData}
      />
    </div>
  );
};

export default ShopFiles;
