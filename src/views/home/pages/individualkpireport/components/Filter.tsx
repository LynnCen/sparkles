import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import { useMethods } from '@lhb/hook';
import { userPermissionList } from '@/common/api/brief';
import { gatherMethods, getKeysFromObjectArray } from '@lhb/func';
import { DepartMentResult } from '@/views/organization/pages/department/ts-config';
import { departmentPermissionList } from '@/common/api/department';
import dayjs from 'dayjs';
import SearchForm from '@/common/components/Form/SearchForm';


const Filter: React.FC<any> = ({ onSearch, searchForm }) => {

  const [userListOpt, setUserListOpt] = useState<any[]>([]);
  const [departmentListOpt, setDepartmentListOpt] = useState<any[]>([]);


  // const onExport = async () => {
  //   downloadFile({
  //     name: '个人绩效报表.xlsx',
  //     url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/个人绩效报表.xlsx',
  //   });
  // };

  const methods = useMethods({
    getUserList(departmentIds?:string[]|number[]) {
      userPermissionList({ departmentIds }).then((data) => {
        const res = data.objectList.map((item) => {
          return {
            label: `${item.name || null}`,
            value: item.id,
          };
        });
        setUserListOpt(res);

        const _userIds = searchForm.getFieldValue('userIds');
        // 如果选中了部门并且选中了人员
        if (departmentIds?.length && _userIds?.length) {
          // 当部门被删除时，需要删除对应部门下的人员
          const filterUserId = gatherMethods(_userIds, getKeysFromObjectArray(res, 'value'), 1);
          searchForm.setFieldValue('userIds', filterUserId);
        }
      });
    },
    async getDepartmentList() {
      const { objectList = [] }: DepartMentResult = await departmentPermissionList();
      setDepartmentListOpt(objectList);
    },
    onFinish(values) {
      const params = {
        ...values,
        start: dayjs(values.time[0]).format('YYYY-MM-DD'),
        end: dayjs(values.time[1]).endOf('month').format('YYYY-MM-DD'),
      };
      onSearch(params);
    },
    onRest() {
      searchForm.setFieldsValue({
        time: [dayjs().startOf('year'), dayjs().endOf('year')]
      });
    }
  });

  useEffect(() => {
    methods.getDepartmentList();
    methods.getUserList();
  }, []);

  return (
    <Row>
      <Col span={22}>
        <SearchForm labelLength ={3} form={searchForm} onSearch={methods.onFinish} onCustomerReset={methods.onRest}>
          <V2FormTreeSelect
            label={'开发部'}
            name='departmentIds'
            treeData={departmentListOpt}
            onChange={(value) => methods.getUserList(value)}
            placeholder='选择部门'
            config={{
              multiple: true,
              fieldNames: { label: 'name', value: 'id', children: 'children' },
              treeDefaultExpandAll: true,
              showSearch: true,
              treeNodeFilterProp: 'name',
            }}
          />
          <V2FormSelect
            label={'姓名'}
            name='userIds'
            options={userListOpt}
            placeholder='选择人员'
            config={{ mode: 'multiple' }} />
          <V2FormRangePicker
            label={'统计月份'}
            name={'time'}
            config={{
              format: 'YYYY.MM',
              suffixIcon: <DownOutlined />,
              // disabledDate: disabledDate,
              picker: 'month',
              // onCalendarChange: val => setDates(val),
              style: {
                width: 220
              },
              // onChange: val => setValue(val),
            }}
          />
        </SearchForm>
      </Col>
      <Col span={2} style={{ textAlign: 'right' }}>
        {/* <Button type='primary' onClick={onExport}>
          导出报表
        </Button> */}
      </Col>
    </Row>
  );
};

export default Filter;
