import React, { FC } from "react";

interface IConfig {
    title: string,
    keywords: string,
    desc: string,

    showHeader?: boolean;
    showFooter?: boolean;
}

export default (config: IConfig) => {

    return (Page: React.FC) => () => {
        {

            return (
                <div>
                    <Page />
                </div>
            )
        }
    }
}