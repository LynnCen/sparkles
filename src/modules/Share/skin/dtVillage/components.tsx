import React, { useEffect, useState } from 'react'

const scss = require("../../../../styles/scss/sharepage.scss");

export const LeftLabel = ({ data, content }) => {
    return <div className={scss['dtVillage-label']}>
        <img src={data.imgUrl} alt="" />
        <div>
            <div className={scss['label-title']}>{data.title} <span>{data.unit}</span></div>
            {content}
        </div>
    </div>
}
export const RightLabel = ({ data, content }) => {
    return <div className={scss['dtVillage-label']}>
        <img src={data.imgUrl} alt="" />
        <div>
            {content}
            <div className={scss['label-title']}>{data.title} <span>{data.unit}</span></div>
        </div>
    </div>
}

export const RightLabel2 = ({ data }) => {
    return <div className={scss['dtVillage-label']}>
        <img src={data.imgUrl} alt="" />
        <div>
            <div className={scss['label-number']}>{data.number1}</div>
            <div className={scss['label-title']}>{data.title1} <span>{data.unit1}</span></div>
        </div>
        <div>
            <div className={scss['label-number']}>{data.number2}</div>
            <div className={scss['label-title']}>{data.title2} <span>{data.unit2}</span></div>
        </div>
    </div>
}