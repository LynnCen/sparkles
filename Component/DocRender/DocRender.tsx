import type { NavTree, TreeNode, NavItemNode } from "./data";
import Link from "next/link";
import { FC, Fragment, useState } from "react";
import styles from "./doc.module.scss";
import classNames from "classnames";
import Search from "../Search/search";

interface IProps {
    tree: NavTree;
    defaultActiveId: string;
    linkPrefix: string;
}
type RenderTreeNode = TreeNode & { active?: boolean };
export const DocRender: FC<IProps> = ({ tree, defaultActiveId, linkPrefix }) => {
    const [] = useState<string[]>([]);
    const [renderTree] = useState<RenderTreeNode[]>(() =>
        tree.map((node) => {
            if (node.sub && node.sub.find((item) => item.linkId === defaultActiveId)) {
                return { ...node, active: true };
            }
            return node;
        })
    );

    const renderTitleBar = (item: TreeNode) => {
        if (item.type === "nav") return <h1>{item.title}</h1>;
    };

    const renderSubItem = (item: NavItemNode[]) =>
        item.map((node) => (
            <div key={node.linkId}>
                <Link href={`${linkPrefix}${node.linkId}`}>{node.title}</Link>
            </div>
        ));

    const handleSearch = (text: string) => {};

    return (
        <section className={styles.docContainer}>
            <nav className={styles.nav}>
                <aside>
                    <Search onSearch={handleSearch} />
                </aside>

                <div className={styles.title}>目录</div>

                <section className={styles.navList}>
                    {renderTree.map((item, i) => (
                        <Fragment key={`${item.type}_${i}`}>
                            {renderTitleBar(item)}
                            <div
                                className={classNames(styles.subNav, {
                                    [styles.show]: item.active,
                                })}
                            >
                                {item.sub ? renderSubItem(item.sub) : null}
                            </div>
                        </Fragment>
                    ))}
                </section>
            </nav>
        </section>
    );
};

export default DocRender;
