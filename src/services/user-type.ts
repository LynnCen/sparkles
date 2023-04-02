
export interface Permission {
    label: string,
    value: number
}

export interface Access {
    id: string,
    key: string,
    p_key: string,
    name: string,
    permission: Permission[],
    children: Access[]
}

export interface LoginInfo {
    id: string,
    username: string,
    org_name: string,
    access: Access[]
}

export class LoginInfoRes implements LoginInfo {
    constructor(
        public id: string, 
        public username: string,
        public org_name: string,
        public access: Access[]
    ) {}
}
