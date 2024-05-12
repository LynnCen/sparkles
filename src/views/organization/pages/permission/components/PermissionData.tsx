import { FC, useState, useEffect } from 'react';
import { Radio, Space } from 'antd';
import { roleDetail, roleScopes } from '@/common/api/role';

const DataPermission: FC<any> = ({ roleId, setRoleScope }) => {
  const [treeData, setTreeData] = useState<any>([]);

  const loadRoleInfo = async () => {
    if (roleId) {
      await roleDetail({ id: roleId }).then((role) => {
        setCheckedVal(role?.scope);
        setRoleScope(role?.scope); // 未修改角色数据权限的情况下直接保存，中台会默认更新未个人权限， 这个问题中台会在0713版本修复，这里先兼容
      });
    }
  };

  const loadScopeInfo = async () => {
    await roleScopes().then((scopes) => {
      setTreeData(Array.isArray(scopes) ? scopes : []);
    });
  };

  const [checkedVal, setCheckedVal] = useState<number>(0);
  useEffect(() => {
    loadRoleInfo();
    loadScopeInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeHandle = (e: any) => {
    const val = e.target.value;
    setCheckedVal(val);
    setRoleScope(val);
  };

  return (
    <>
      <Radio.Group value={checkedVal} onChange={changeHandle}>
        <Space direction='vertical'>
          {treeData.map((item) => (
            <Radio value={item.id} key={item.id}>
              {item.name}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </>
  );
};

export default DataPermission;
