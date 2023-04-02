import Head from 'next/head'
import { FC } from 'react'

interface IProps  {
    title?: string,
    description?: string,
    keywords?: string,
}
export const TDK: FC<IProps> = ({ description, keywords, title, children }) => {


    return (
        <Head>
            <title>{ title }</title>
            <meta name="description" content={description}/>
            <meta name="keywords" content={keywords}/>
            {children}
        </Head>
    )
}

export default TDK;