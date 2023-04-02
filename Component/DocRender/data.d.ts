export type NavItemNode = {
    title: string;
    linkId: string;
};
export type TreeNode = {
    type: "nav";
    title: string;
    sub?: Array<NavItemNode>;
};

export type NavTree = Array<TreeNode>;
