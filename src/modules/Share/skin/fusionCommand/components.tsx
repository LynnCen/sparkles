import React, { useState, useEffect } from 'react'

const scss = require("../../../../styles/scss/sharepage.scss");

export const ProgressBar = ({ data, color }) => {
    return <div className={scss['progress-bar']}>
        <div>
            <div style={{
                width: `${data}%`,
                height: '18px',
                background: color,
                borderRadius: '2px'
            }}></div>
        </div>
        <div>{data}%</div>
    </div>
}

export const GuaranteeData = ({ data }) => {
    return <div className={scss['guarantee-child']}>
        <img src={data.imageUrl} alt="" />
        <div>
            <div className={scss['text-box']}>
                <div>{data.title}:</div>
                <div className={scss['label-box']}>
                    {data.label.map((item, index) => {
                        return <div key={index}>{item}</div>
                    })}
                </div>
            </div>
            <div className={scss['details-box']}>

                <div className={scss['text-box']}>
                    <div className={scss['contact-title']}>联系人:</div>
                    <div className={scss['contact-text']}>{data.contact}</div>
                </div>

                <div className={scss['text-box']}>
                    <div className={scss['phone-title']}>电话:</div>
                    <div className={scss['phone-text']}>{data.phone}</div>
                </div>

            </div>
        </div>
    </div>
}

export const StatisticsData = ({ data }) => {
    return <div className={scss['statistics-child']}>
        {
            data.map((item, index) => {
                return <div key={index}>
                    <div className={scss['child-text']}><span>{item.number}</span>{item.unit}</div>
                    <div className={scss['child-title']}>{item.title}</div>
                </div>
            })
        }
    </div>
}