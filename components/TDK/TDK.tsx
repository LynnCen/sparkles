import Head from 'next/head'
import { FC, useContext } from 'react'
import { useTranslation, i18n } from "next-i18next";
import Sotre from "../utils/context";
interface IProps {
    title?: string,
    description?: string,
    keywords?: string,
}
export const TDK: FC<IProps> = ({ description, keywords, title, children }) => {
    const { defaultActiveKey, store } = useContext(Sotre);
    const { t: f } = useTranslation("faqmenu");
    const { t: u } = useTranslation("user");
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={store.headerKey == 4 ? u("keyWords") : f("keyWords")} />
            <meta name="keywords" content={store.headerKey == 4 ? u("desciption") : f("desciption")} />
            {children}
        </Head>
    )
}

export default TDK;