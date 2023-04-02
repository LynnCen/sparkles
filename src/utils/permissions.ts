enum Permissions {
  view = 1,
  insert = 2,
  edit = 4,
  delete = 8,
  export = 32,
  forbidden = 16,
  import = 64
}

interface Permission {
  label:  keyof typeof Permissions,
  value: number
}

type Source = {
  key: string;
  permission?: Permission[];
  children?: Source[];
};

const allPermissions: Permission[] = [
  {
    label: 'view',
    value: Permissions.view
  },
  {
    label: 'insert',
    value: Permissions.insert
  },
  {
    label: 'edit',
    value: Permissions.edit
  },
  {
    label: 'delete',
    value: Permissions.delete
  },
  {
    label: 'forbidden',
    value: Permissions.forbidden
  },
  {
    label: 'export',
    value: Permissions.export
  },
  {
    label: 'import',
    value: Permissions.import
  },
];

const getPermissions = (data: Source[], path: string[]) => {
  
  if (path.length === 0) return [];
  if (path.length === 1) {
    const res = data.find((p) => p.key === path[0]);
    return res?.permission;
  }

  const parentPermissions = data.find((p) => p.key === path[0]);
  
  if (parentPermissions && parentPermissions.children) {
    const res = parentPermissions.children.find((p) => p.key === path[1]);
    return res?.permission;
  }
  return [];
};

const getPermissionsAsObj = (data: Source[], path: string[]) => {
  const res = getPermissions(data, path);
  
  if (!res?.length) return {};

  return allPermissions
    .map((p) => {
      if (
        res?.find(item => item.label === p.label && item.value === p.value)
      ) {
        return { [p.label]: true };
      }
      return { [p.label]: false };
    })
    .reduce((acc, cur) => ({ ...acc, ...cur }));
};

export default getPermissionsAsObj;
