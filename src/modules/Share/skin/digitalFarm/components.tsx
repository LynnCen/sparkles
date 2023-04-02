import React, { useState, useEffect } from 'react'

const scss = require("../../../../styles/scss/sharepage.scss");

export const IndustrialLabel1 = ({ title, imageUrl }) => {
    return <div className={scss['industrial-label1']}>
        <img className={scss['label-img']} src={imageUrl} alt="" />
        <div className={scss['label-title']}>{title}</div>
    </div>
}
export const IndustrialLabel2 = ({ title, number, imageUrl }) => {
    return <div className={scss['industrial-label2']}>
        <img className={scss['label-img']} src={imageUrl} alt="" />
        <div className={scss['label-number']}>{number}</div>
        <div className={scss['label-title']}>{title}<span>(吨)</span></div>
    </div>
}



