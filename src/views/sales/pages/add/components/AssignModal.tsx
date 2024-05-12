import { FC, useEffect, useRef, useState } from 'react';
import { message, Modal, Space, Button, Typography } from 'antd';
import { useMethods } from '@lhb/hook';
import { createTask } from '@/common/api/purchaseTask';
import FilterTable from '@/common/components/FilterTable';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';
import { PermissionSelectorValues } from '@/common/components/Modal/ts-config';
import { deepCopy } from '@lhb/func';
import { getPlaceRoleList } from '@/common/api/place';

const { Text, Paragraph } = Typography;

export interface OrderItemData {
  id: number;
  number: string;
  placeId: number;
  placeName: string;
  spotId: number;
  spotName: string;
  title: string;
  purchaser: number; // 采购人
  purchaserName: string;
}

export interface AssignModalData {
  visible: boolean;
  fromList: boolean;
  orderItems: OrderItemData[];
}

export interface AssignModalProps {
  data: AssignModalData,
  setData: Function;
  onClose?: Function;
  onComplete?: Function;
}

const AssignModal: FC<AssignModalProps> = ({
  data,
  setData,
  onClose,
  onComplete,
}) => {
  const tableRef: any = useRef();

  // 选择成员
  const [chooseUserValues, setChooseUserValues] = useState<PermissionSelectorValues>({
    visible: false,
    users: [],
    id: undefined,
    name: '',
  });
  const [dataSource, setDataSource] = useState<any[]>([]);

  const methods = useMethods({
    fetchData() {
      return {
        dataSource,
        count: dataSource.length,
      };
    },

    cancel() {
      setData({ ...data, visible: false, });
      onClose && onClose();
    },

    submit() {
      if (dataSource.find(itm => !itm.purchaser)) {
        message.warning('请指派采购人');
        return;
      }

      const saleOrders = dataSource.map(itm => ({
        saleOrderId: itm.id,
        purchaser: itm.purchaser,
      }));
      createTask({ saleOrders }).then(() => {
        message.success('指派成功');
        methods.cancel();
        onComplete && onComplete();
      });
    },

    toSpotDetail(spotId: number) {
      window.open(`${process.env.RESOURCE_SERVICE_URL}/pointMng/detail?tenantSpotId=${spotId}`);
    },

    async getSpotRole() {
      const roleList: any = await getPlaceRoleList({ tenantPlaceId: data.orderItems[0].spotId });
      const roles = roleList.filter((itm: any) => itm.roleName === '资源拓展');
      if (roles.length && roles[0].employeeList && roles[0].employeeList) {
        const employeeList = roles[0].employeeList;
        data.orderItems[0] = {
          ...data.orderItems[0],
          purchaser: employeeList[0].employeeId,
          purchaserName: employeeList[0].employeeName,
        };
      };
      setDataSource(data.orderItems);
    }
  });

  // 确定选择成员
  const onOkSelector = ({ users, visible }: PermissionSelectorValues) => {
    const tmpDataSource = deepCopy(dataSource);
    const selUser = Array.isArray(users) && users.length ? users[0] : null;
    tmpDataSource.forEach(itm => {
      if (itm.id === chooseUserValues.id) {
        itm.purchaser = selUser ? selUser.id : null;
        itm.purchaserName = selUser ? selUser.name : '';
      }
    });
    setDataSource(tmpDataSource);
    setChooseUserValues({ users, visible });
  };

  useEffect(() => {
    if (data.visible) {
      if (data.fromList && data.orderItems.length === 1) {
        methods.getSpotRole();
      } else {
        setDataSource(data.orderItems);
      }
    }
  }, [data.visible]);


  useEffect(() => {
    tableRef && tableRef.current && tableRef.current.onload(true);
  }, [dataSource]);

  // 列表项
  const columns = [
    {
      title: '点位名称',
      key: 'spotName',
      dataIndex: 'spotName',
      width: 200,
      render(_: string, record: any) {
        const { placeName, spotName, spotId } = record;
        return (
          <Space>
            <Paragraph ellipsis={{ tooltip: `${placeName}-${spotName}`, rows: 2 }}>
              <span className='pointer color-primary' onClick={() => {
                methods.toSpotDetail(spotId);
              }}>{placeName}-{spotName}</span>
            </Paragraph>
          </Space>
        );
      }
    },
    {
      title: '采购人',
      key: 'employeeList',
      dataIndex: 'employeeList',
      width: 200,
      render(_:string, recoder: any) {
        const { purchaser, purchaserName, id, spotName } = recoder;
        const onClick = () => {
          const users = purchaser && purchaserName ? [{
            id: purchaser,
            name: purchaserName,
            mobile: ''
          }] : [];
          setChooseUserValues({ visible: true, users, id, name: spotName });
        };

        return (
          <Space size={0}>
            <Text style={{ maxWidth: 150 }} ellipsis={{ tooltip: purchaserName }}>{purchaserName}</Text>
            <Button type='link' onClick={onClick}>指派</Button>
          </Space>
        );
      }
    },
  ];

  return (
    <Modal
      title='指派采购人'
      width='528px'
      open={data.visible}
      onOk={methods.submit}
      maskClosable={false}
      onCancel={methods.cancel}>
      <FilterTable
        ref={tableRef}
        columns={columns}
        onFetch={methods.fetchData}
        className='mt-8'
        paginationConfig={{
          showSizeChanger: false
        }}
        rowKey='id'
        pageSize={10}
      />
      <PermissionSelector
        title={`指派采购人-${chooseUserValues.name}`}
        type='ONE'
        values={chooseUserValues}
        onClose={setChooseUserValues}
        onOk={onOkSelector}
      />
    </Modal>
  );
};

export default AssignModal;
