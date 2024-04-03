import React from "react";

/**
 * @Author Pull
 * @Date 2021-01-30 16:50
 * @project commonIcon
 */
export default class {
    /**
     * @description {搜索放大镜Icon}
     * */
    static Search({ bodyStyle = {}, title = "", overlayClassName = "" }) {
        return (
            <svg
                width="12px"
                height="12px"
                viewBox="0 0 12 12"
                version="1.1"
                className={overlayClassName}
                style={bodyStyle}
            >
                <title>{title}</title>
                <defs>
                    <filter
                        x="-130.5%"
                        y="-641.7%"
                        width="361.0%"
                        height="1383.3%"
                        filterUnits="objectBoundingBox"
                        id="filter-1"
                    >
                        <feOffset dx="0" dy="10" in="SourceAlpha" result="shadowOffsetOuter1" />
                        <feGaussianBlur
                            stdDeviation="15"
                            in="shadowOffsetOuter1"
                            result="shadowBlurOuter1"
                        />
                        <feColorMatrix
                            values="0 0 0 0 0.635294118   0 0 0 0 0.658823529   0 0 0 0 0.764705882  0 0 0 0.1 0"
                            type="matrix"
                            in="shadowBlurOuter1"
                            result="shadowMatrixOuter1"
                        />
                        <feMerge>
                            <feMergeNode in="shadowMatrixOuter1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <g id="Search-p-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="chat"
                        transform="translate(-105.000000, -18.000000)"
                        fill="currentColor"
                        fillRule="nonzero"
                    >
                        <g id="Search-g-13" transform="translate(72.000000, 0.000000)">
                            <g id="Search-g-4">
                                <g id="Search-g-5">
                                    <g id="Search-g-6" transform="translate(17.000000, 12.000000)">
                                        <g
                                            id="Search-gserch"
                                            filter="url(#filter-1)"
                                            transform="translate(16.000000, 6.000000)"
                                        >
                                            <g id="Search-g-s">
                                                <g id="Search-g-l">
                                                    <path
                                                        d="M5.5,2.66453526e-15 C8.53756612,2.66453526e-15 11,2.46243388 11,5.5 C11,6.85066261 10.5131369,8.08761225 9.70533302,9.04492664 C9.75836661,9.06766545 9.80910347,9.10199669 9.85355339,9.14644661 L11.267767,10.5606602 C11.4630291,10.7559223 11.4630291,11.0725048 11.267767,11.267767 C11.0725048,11.4630291 10.7559223,11.4630291 10.5606602,11.267767 L9.14644661,9.85355339 C9.10199669,9.80910347 9.06766545,9.75836661 9.04345289,9.70420515 C8.08761225,10.5131369 6.85066261,11 5.5,11 C2.46243388,11 0,8.53756612 0,5.5 C0,2.46243388 2.46243388,2.66453526e-15 5.5,2.66453526e-15 Z M5.5,1 C3.01471863,1 1,3.01471863 1,5.5 C1,7.98528137 3.01471863,10 5.5,10 C6.49482091,10 7.43694895,9.67720821 8.20824674,9.0924794 L8.39744386,8.94087539 L8.704,8.68 L8.94106903,8.40002312 C9.5690021,7.65587052 9.9399585,6.73257988 9.99331313,5.74749161 L10,5.5 C10,3.01471863 7.98528137,1 5.5,1 Z"
                                                        id="Search-g-shape"
                                                    />
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {弹框返回箭头 左箭头 icon}
     */
    static BackIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                {/*<title>back</title>*/}
                <title>{title}</title>
                <g
                    id="NewChatBackIcon-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="chat-Create-Group-Chat"
                        transform="translate(-199.000000, -163.000000)"
                        fill="currentColor"
                    >
                        <g id="NewChatBackIcon-23" transform="translate(179.000000, 140.000000)">
                            <g id="NewChatBackIcon-18">
                                <g
                                    id="NewChatBackIcon-16"
                                    transform="translate(1.000000, 1.000000)"
                                >
                                    <g
                                        id="NewChatBackIcon-11"
                                        transform="translate(18.000000, 22.000000)"
                                    >
                                        <g id="NewChatBackIcon-3">
                                            <path
                                                d="M6.5,3 C6.77614237,3 7,3.22385763 7,3.5 L7,12 L15.5,12 C15.7761424,12 16,12.2238576 16,12.5 C16,12.7761424 15.7761424,13 15.5,13 L6.5,13 L6.5,13 C6.22385763,13 6,12.7761424 6,12.5 L6,3.5 C6,3.22385763 6.22385763,3 6.5,3 Z"
                                                id="NewChatBackIcon-concat"
                                                transform="translate(11.000000, 8.000000) rotate(-315.000000) translate(-11.000000, -8.000000) "
                                            />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {弹框返回箭头 左箭头 icon}
     */
    static BackIcon2({ bodyStyle = {}, title = "", overlayClassName }) {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                style={bodyStyle}
                className={overlayClassName}
            >
                <title>{title}</title>
                <g
                    id="BackIcon2-Moments"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="BackIcon2-Moments-Topic-Detail"
                        transform="translate(-80.000000, -19.000000)"
                    >
                        <g id="BackIcon2-group-16" transform="translate(64.000000, 0.000000)">
                            <g
                                id="BackIcon2-group-dup-3"
                                transform="translate(16.000000, 19.000000)"
                            >
                                <rect
                                    id="BackIcon2-rect-1"
                                    fill="currentColor"
                                    opacity="0"
                                    x="0"
                                    y="0"
                                    width="16"
                                    height="16"
                                />
                                <path
                                    d="M5.86924598,1.7965953 C6.2038843,1.50650752 6.71129962,1.54150307 7.00258981,1.87476004 C7.27147307,2.18238187 7.26221411,2.63661426 6.99599652,2.93283782 L6.92410108,3.00342558 L1.88255186,7.37379124 C1.54791354,7.66387903 1.51277293,8.1691998 1.80406313,8.50245678 L1.84049237,8.54143528 L1.87944469,8.577914 L6.92720824,12.9992836 C7.26034505,13.2910803 7.29287731,13.7965743 6.99987108,14.128336 C6.72940378,14.4345775 6.27609655,14.4857399 5.94593625,14.2622929 L5.86613882,14.2006988 L0.818375266,9.77932925 C0.738031112,9.70895527 0.662482372,9.6333307 0.592230561,9.55295757 C-0.248029609,8.59163936 -0.18287892,7.15307321 0.715852411,6.27017539 L0.82769676,6.16696097 L5.86924598,1.7965953 Z"
                                    id="BackIcon2-path"
                                    fill="currentColor"
                                    fillRule="nonzero"
                                />
                                <rect
                                    id="BackIcon2-rect-3"
                                    fill="currentColor"
                                    x="0.8"
                                    y="7.2"
                                    width="15.2"
                                    height="1.6"
                                    rx="0.8"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {右箭头 Icon}
     */
    static RightArrow({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="12px"
                height="12px"
                viewBox="0 0 12 12"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>{title}</title>
                <g id="RightArrow-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="RightArrow--duplicate" transform="translate(-886.000000, -437.000000)">
                        <g id="RightArrow-16" transform="translate(352.000000, 0.000000)">
                            <g
                                id="RightArrow-RightArrow-3"
                                transform="translate(53.000000, 349.000000)"
                            >
                                <g id="RightArrow-15" transform="translate(0.000000, 62.000000)">
                                    <g id="-mockplus-" transform="translate(481.000000, 26.000000)">
                                        <g
                                            id="jiantou/you"
                                            transform="translate(-2.000000, 0.000000)"
                                        >
                                            <g id="Group" transform="translate(0.500000, 0.000000)">
                                                <rect
                                                    id="Rectangle"
                                                    fill="#D8D8D8"
                                                    opacity="0"
                                                    x="1.5"
                                                    y="0"
                                                    width="12"
                                                    height="12"
                                                />
                                                <path
                                                    d="M3,9.75 C2.58578644,9.75 2.25,9.41421356 2.25,9 C2.25,8.58578644 2.58578644,8.25 3,8.25 L8.25,8.249 L8.25,3 C8.25,2.58578644 8.58578644,2.25 9,2.25 C9.41421356,2.25 9.75,2.58578644 9.75,3 L9.75,9 L9.75,9 C9.75,9.37969577 9.46784612,9.69349096 9.10177056,9.74315338 L9,9.75 L9,9.75 L3,9.75 Z"
                                                    id="Combined-Shape"
                                                    fill="#DADCE7"
                                                    transform="translate(6.000000, 6.000000) rotate(-45.000000) translate(-6.000000, -6.000000) "
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static RightArrowBolder({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" style={bodyStyle}>
                <title>{title}</title>
                <g
                    id="RightArrowBolder-Moments"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="RightArrowBolder-Contact-New-friend-friend"
                        transform="translate(-786.000000, -460.000000)"
                    >
                        <g id="RightArrowBolder-g-16" transform="translate(344.000000, 0.000000)">
                            <g
                                id="RightArrowBolder-g-15"
                                transform="translate(160.000000, 370.000000)"
                            >
                                <g
                                    id="RightArrowBolder-14dup-2"
                                    transform="translate(0.000000, 90.000000)"
                                >
                                    <g
                                        id="RightArrowBolder-Group"
                                        transform="translate(282.000000, 0.000000)"
                                    >
                                        <rect
                                            id="RightArrowBolder-Rectangle"
                                            fill="#D8D8D8"
                                            opacity="0"
                                            x="0"
                                            y="0"
                                            width="14"
                                            height="14"
                                        />
                                        <path
                                            d="M4.65493706,2.87697762 C4.99610179,2.56376375 5.52939382,2.54296577 5.89608604,2.81225223 L5.98408067,2.88561592 L9.08350755,5.81169218 C9.77425844,6.46357605 9.80319275,7.49241076 9.17577959,8.1759535 L9.06513437,8.2865563 L5.9747358,11.1230831 C5.63353783,11.4362656 5.10024359,11.4570145 4.73357996,11.1876943 L4.64559312,11.1143225 C4.30919242,10.7966739 4.28690525,10.3001874 4.5761919,9.9588307 L4.65500321,9.87691667 L7.74520426,7.04044973 L4.64565835,4.11438429 C4.28118772,3.77029847 4.28534194,3.21629263 4.65493706,2.87697762 Z"
                                            id="RightArrowBolder-path"
                                            fill="currentColor"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {移除已选中项 小叉叉Icon}
     */
    static RemoveItem({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="14px"
                height="14px"
                viewBox="0 0 14 14"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                {/*<title>Remove</title>*/}
                <title>{title}</title>
                <g
                    id="NewChatRemoveItem-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="chat-Group-Detail-Remove"
                        transform="translate(-747.000000, -264.000000)"
                    >
                        <g id="NewChatRemoveItem-23" transform="translate(179.000000, 140.000000)">
                            <g
                                id="NewChatRemoveItem-21"
                                transform="translate(280.000000, 77.000000)"
                            >
                                <g
                                    id="NewChatRemoveItem-13"
                                    transform="translate(288.000000, 47.000000)"
                                >
                                    <g id="NewChatRemoveItem-22">
                                        <rect
                                            id="NewChatRemoveItem-rect"
                                            fill={bodyStyle.color || "#DADCE7"}
                                            x="0"
                                            y="0"
                                            width="14"
                                            height="14"
                                            rx="7"
                                        />
                                        <path
                                            d="M6.94974747,3.44974747 C7.22588984,3.44974747 7.44974747,3.67360509 7.44974747,3.94974747 L7.44974747,6.44974747 L9.94974747,6.44974747 C10.2258898,6.44974747 10.4497475,6.67360509 10.4497475,6.94974747 C10.4497475,7.22588984 10.2258898,7.44974747 9.94974747,7.44974747 L7.44974747,7.44974747 L7.44974747,9.94974747 C7.44974747,10.2258898 7.22588984,10.4497475 6.94974747,10.4497475 C6.67360509,10.4497475 6.44974747,10.2258898 6.44974747,9.94974747 L6.44974747,7.44974747 L3.94974747,7.44974747 C3.67360509,7.44974747 3.44974747,7.22588984 3.44974747,6.94974747 C3.44974747,6.67360509 3.67360509,6.44974747 3.94974747,6.44974747 L6.44974747,6.44974747 L6.44974747,3.94974747 C6.44974747,3.67360509 6.67360509,3.44974747 6.94974747,3.44974747 Z"
                                            id="NewChatRemoveItem-concat"
                                            fill={bodyStyle.innerColor || "#FFFFFF"}
                                            transform="translate(6.949747, 6.949747) rotate(-45.000000) translate(-6.949747, -6.949747) "
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static PlusOutLine({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="10px" height="10px" viewBox="0 0 10 10" style={bodyStyle}>
                <title>{title}</title>
                <g
                    id="PlusOutLine-p-3"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="PlusOutLine-Chat1"
                        transform="translate(-312.000000, -23.000000)"
                        fill="currentColor"
                    >
                        <g id="PlusOutLine-g-13" transform="translate(64.000000, 0.000000)">
                            <g id="PlusOutLine-g-25" transform="translate(241.000000, 16.000000)">
                                <g id="PlusOutLine-Group" transform="translate(7.000000, 7.000000)">
                                    <path
                                        d="M5,0 C5.55228475,0 6,0.44771525 6,1 L6,4 L9,4 C9.55228475,4 10,4.44771525 10,5 C10,5.55228475 9.55228475,6 9,6 L6,6 L6,9 C6,9.55228475 5.55228475,10 5,10 C4.44771525,10 4,9.55228475 4,9 L4,6 L1,6 C0.44771525,6 6.76353751e-17,5.55228475 0,5 C-6.76353751e-17,4.44771525 0.44771525,4 1,4 L4,4 L4,1 C4,0.44771525 4.44771525,0 5,0 Z"
                                        id="PlusOutLine-shape"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static PlusCircleOutLine({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="24px" height="24px" viewBox="0 0 24 24" style={bodyStyle}>
                <title>{title}</title>
                <g
                    id="PlusCircleOutLine-p-3"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="PlusCircleOutLine-contact--Add-alert"
                        transform="translate(-687.000000, -263.000000)"
                    >
                        <g
                            id="PlusCircleOutLine-g-18"
                            transform="translate(251.000000, 120.000000)"
                        >
                            <g
                                id="PlusCircleOutLine-g-7"
                                transform="translate(436.000000, 143.000000)"
                            >
                                <rect
                                    id="PlusCircleOutLine-rect"
                                    stroke="currentColor"
                                    x="0.5"
                                    y="0.5"
                                    width="23"
                                    height="23"
                                    rx="11.5"
                                />
                                <path
                                    d="M12,7.5 C12.5522847,7.5 13,7.94771525 13,8.5 L13,11.5 L16,11.5 C16.5522847,11.5 17,11.9477153 17,12.5 C17,13.0522847 16.5522847,13.5 16,13.5 L13,13.5 L13,16.5 C13,17.0522847 12.5522847,17.5 12,17.5 C11.4477153,17.5 11,17.0522847 11,16.5 L11,13.5 L8,13.5 C7.44771525,13.5 7,13.0522847 7,12.5 C7,11.9477153 7.44771525,11.5 8,11.5 L11,11.5 L11,8.5 C11,7.94771525 11.4477153,7.5 12,7.5 Z"
                                    id="PlusCircleOutLine-shape"
                                    fill="currentColor"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
    /**
     * @description {编辑图标}
     */
    static EditIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                t="1584766598709"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="EditIcon-2796"
                width="16"
                height="16"
                style={bodyStyle}
            >
                <title>{title}</title>
                <path
                    d="M883.65056 861.20448H510.8224c-20.19328 0-36.24448 15.68768-36.24448 35.42528 0 19.7376 16.0512 35.42528 36.24448 35.42528h372.82816c20.19328 0 36.2496-15.68768 36.2496-35.42528-0.00512-19.7376-16.05632-35.42528-36.2496-35.42528zM613.97504 224.384c-8.82176 0-19.52768 4.9152-28.53376 13.91616-13.952 13.95712-18.08384 32.01536-9.3184 40.77568l161.77152 161.77152c3.10784 3.10784 7.38816 4.59776 12.24192 4.59776 8.82176 0 19.52768-4.9152 28.53376-13.91616 13.95712-13.95712 18.08384-32.01536 9.3184-40.77568l-161.77152-161.77152c-3.11296-3.10784-7.38816-4.59776-12.24192-4.59776z"
                    fill="currentColor"
                    p-id="EditIcon-2797"
                />
                <path
                    d="M753.26976 143.08352l129.13152 129.13152L365.9776 788.63872l-206.93504 75.48416 77.47072-204.288L753.26976 143.08352m0-75.03872a60.53376 60.53376 0 0 0-42.94144 17.78688L184.8832 611.28192a60.7232 60.7232 0 0 0-13.83936 21.40672l-101.76 268.33408c-10.49088 27.66336 10.89536 54.92736 37.63712 54.92736 4.5824 0 9.32864-0.80384 14.09024-2.53952l271.34976-98.98496a60.7232 60.7232 0 0 0 22.12864-14.11072l525.16352-525.1584c23.71584-23.71584 23.71584-62.16192 0-85.87776L796.2112 85.83168a60.544 60.544 0 0 0-42.94144-17.78688z"
                    fill="currentColor"
                    p-id="EditIcon-2798"
                />
            </svg>
        );
    }

    static EditIcon2({ bodyStyle = {}, title = "", overlayClass = "" }) {
        return (
            <svg
                width="44px"
                height="44px"
                className={overlayClass}
                style={{
                    ...bodyStyle,
                }}
                viewBox="0 0 44 44"
            >
                <title>{title}</title>
                <g
                    id="EditIcon2-Moments"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g id="EditIcon2-Moments1" transform="translate(-627.000000, -2793.000000)">
                        <g id="EditIcon2-group-8" transform="translate(590.000000, 2759.000000)">
                            <g id="EditIcon2-group-9" transform="translate(35.000000, 34.000000)">
                                <g
                                    id="EditIcon2-group-10"
                                    transform="translate(22.000000, 22.000000) rotate(-45.000000) translate(-22.000000, -22.000000) translate(-1.000000, 15.000000)"
                                >
                                    <path
                                        d="M41.5857864,2 C42.1380712,2 42.6380712,2.22385763 43,2.58578644 C43.3619288,2.94771525 43.5857864,3.44771525 43.5857864,4 L43.5857864,4 L43.5857864,10 C43.5857864,10.5522847 43.3619288,11.0522847 43,11.4142136 C42.6380712,11.7761424 42.1380712,12 41.5857864,12 L41.5857864,12 L8.33725667,12 L2.62879933,7.00509983 L8.33830663,2 Z"
                                        id="EditIcon2-shape"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <rect
                                        id="EditIcon2-rect-duplicate"
                                        fill="currentColor"
                                        transform="translate(35.000000, 7.000000) rotate(-270.000000) translate(-35.000000, -7.000000) "
                                        x="28"
                                        y="5"
                                        width="14"
                                        height="4"
                                        rx="2"
                                    />
                                </g>
                                <rect
                                    id="EditIcon2-rect-1"
                                    fill="currentColor"
                                    x="24"
                                    y="34"
                                    width="20"
                                    height="4"
                                    rx="2"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {展示更多 下箭头Icon}
     */
    static ShowMoreIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                t="1584625243832"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="ShowMoreIcon1883"
                width="32"
                height="18"
                style={bodyStyle}
            >
                <title>{title}</title>
                <path d="M511.1 512.9l1.8-1.8-1.8 1.8z" fill="#8a8a8a" p-id="ShowMoreIcon1884" />
                <path
                    d="M510.9 510.9l2.2 2.2c-0.7-0.8-1.4-1.5-2.2-2.2z"
                    fill="#8a8a8a"
                    p-id="ShowMoreIcon1885"
                />
                <path
                    d="M512.1 648.1c8.3 0 15.8-3.1 21.5-8.3l2.2-2.2 21.5-21.5L743 430.4c12.4-12.4 12.4-32.8 0-45.3-12.4-12.4-32.8-12.4-45.3 0L512 570.9 326.2 385.2c-12.4-12.4-32.8-12.4-45.3 0-12.4 12.4-12.4 32.8 0.1 45.2l185.7 185.7 21.8 21.8 1.8 1.8c5.7 5.3 13.4 8.5 21.8 8.4z"
                    fill="#8a8a8a"
                    p-id="ShowMoreIcon1886"
                />
                <path d="M512.9 511.1l-1.8 1.8 1.8-1.8z" fill="#8a8a8a" p-id="ShowMoreIcon1887" />
                <path
                    d="M513.1 513.1l-2.2-2.2c0.7 0.8 1.4 1.5 2.2 2.2z"
                    fill="#8a8a8a"
                    p-id="ShowMoreIcon1888"
                />
            </svg>
        );
    }

    /**
     * @description {Male Icon}
     */
    static MaleIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="20px"
                height="20px"
                viewBox="0 0 30 30"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                <title>{title}</title>
                <g id="Chats" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-750.000000, -1306.000000)" fill="#0BCADE">
                        <g transform="translate(120.000000, 1306.000000)">
                            <g transform="translate(630.000000, 0.000000)">
                                <path
                                    d="M12,6 C18.627417,6 24,11.372583 24,18 C24,24.627417 18.627417,30 12,30 C5.372583,30 0,24.627417 0,18 C0,11.372583 5.372583,6 12,6 Z M12,10 C7.581722,10 4,13.581722 4,18 C4,22.418278 7.581722,26 12,26 C16.418278,26 20,22.418278 20,18 C20,13.581722 16.418278,10 12,10 Z"
                                    fillRule="nonzero"
                                ></path>
                                <path d="M28,1.59872116e-14 C29.1045695,1.59872116e-14 30,0.8954305 30,2 L30,10 C30,11.1045695 29.1045695,12 28,12 C26.8954305,12 26,11.1045695 26,10 L25.9999805,7.47 L21.0961941,12.3743687 C20.3151455,13.1554173 19.0488155,13.1554173 18.267767,12.3743687 C17.4867184,11.5933201 17.4867184,10.3269901 18.267767,9.54594155 L23.8119805,4 L20,4 C18.8954305,4 18,3.1045695 18,2 C18,0.8954305 18.8954305,1.61901177e-14 20,1.59872116e-14 L28,1.59872116e-14 L28,1.59872116e-14 Z"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {Femal Icon}
     */
    static FemaleIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="20px"
                height="20px"
                viewBox="0 0 30 30"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                <title>{title}</title>
                <g id="Chats" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-840.000000, -1306.000000)" fill="#FE6869">
                        <g transform="translate(120.000000, 1306.000000)">
                            <g id="-mockplus-" transform="translate(720.000000, 0.000000)">
                                <g transform="translate(-1.000000, 0.000000)">
                                    <path
                                        d="M19,0 C25.627417,0 31,5.372583 31,12 C31,18.627417 25.627417,24 19,24 C12.372583,24 7,18.627417 7,12 C7,5.372583 12.372583,0 19,0 Z M19,4 C14.581722,4 11,7.581722 11,12 C11,16.418278 14.581722,20 19,20 C23.418278,20 27,16.418278 27,12 C27,7.581722 23.418278,4 19,4 Z"
                                        fillRule="nonzero"
                                    />
                                    <rect
                                        transform="translate(7.000000, 24.000000) rotate(-315.000000) translate(-7.000000, -24.000000) "
                                        x="0"
                                        y="22"
                                        width="14"
                                        height="4"
                                        rx="2"
                                    />
                                    <rect
                                        transform="translate(8.000000, 23.500000) rotate(-45.000000) translate(-8.000000, -23.500000) "
                                        x="0.5"
                                        y="21.5"
                                        width="15"
                                        height="4"
                                        rx="2"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {聊天 云朵Icon}
     */
    static ToChatIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                {/*<title><FormattedMessage id="SendMessage"/></title>*/}
                <title>{title}</title>
                <g id="ToChatIcon-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="chat-ToChatIcon" transform="translate(-304.000000, -255.000000)">
                        <g id="ToChatIcon-17" transform="translate(52.000000, 101.000000)">
                            <g id="ToChatIcon-2" transform="translate(252.000000, 154.000000)">
                                <rect
                                    id="Rectangle"
                                    stroke="#979797"
                                    fill="#D8D8D8"
                                    opacity="0"
                                    x="0.5"
                                    y="0.5"
                                    width="23"
                                    height="22"
                                />
                                <path
                                    d="M12,1.75 C8.87584457,1.75 6.04355169,2.79785251 3.99485693,4.50509815 C2.00022852,6.16728848 0.75,8.45873222 0.75,11 C0.75,13.5412678 2.00022852,15.8327115 3.99485693,17.4949019 C6.04355169,19.2021475 8.87584457,20.25 12,20.25 C12.7390198,20.25 13.4615871,20.191339 14.1613384,20.0791764 L21.3440397,21.0634465 L20.1605537,17.3627888 C22.0644909,15.712718 23.25,13.4741413 23.25,11 C23.25,8.45873222 21.9997715,6.16728848 20.0051431,4.50509815 C17.9564483,2.79785251 15.1241554,1.75 12,1.75 Z"
                                    id="ToChatIcon-shape"
                                    stroke="#5E6A81"
                                    strokeWidth="1.5"
                                    transform="translate(12.000000, 11.569797) scale(-1, 1) translate(-12.000000, -11.569797) "
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static MessageIcon({ title = "", styleObj = {}, overlayClassName }) {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className={overlayClassName}
                style={styleObj}
            >
                <title>{title}</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Chat-profile" transform="translate(-123.000000, -329.000000)">
                        <g transform="translate(16.000000, 133.000000)">
                            <g transform="translate(91.000000, 186.000000)">
                                <g
                                    id="chat_tanchaung_icon_xinjian"
                                    transform="translate(16.000000, 10.000000)"
                                >
                                    <rect
                                        fill="#D8D8D8"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="16"
                                        height="16"
                                    />
                                    <path
                                        d="M8,1.2 C12.1973641,1.2 15.6,4.2444637 15.6,8 C15.6,11.7555363 12.1973641,14.8 8,14.8 C6.79691372,14.8 5.65911927,14.5498785 4.64802857,14.1045829 L1.99320436,14.813945 C1.56635707,14.9280204 1.12785259,14.6744686 1.0137772,14.2476214 C0.97720544,14.1107771 0.977622626,13.9666764 1.01498612,13.8300462 L1.60414517,11.6746481 C0.842093377,10.6150052 0.4,9.35369626 0.4,8 C0.4,4.2444637 3.8026359,1.2 8,1.2 Z M8,2.8 C4.64907952,2.8 2,5.17022904 2,8 C2,8.98047028 2.31360188,9.92075041 2.9031179,10.7404801 C3.16622265,11.1063307 3.26200233,11.5648115 3.17009998,12.0029772 L3.14752652,12.0965178 L2.9252,12.9088 L4.23500251,12.5588115 C4.55467632,12.4733955 4.8921404,12.4893862 5.20112116,12.6032192 L5.29291462,12.6403009 C6.12371193,13.0061932 7.04397808,13.2 8,13.2 C11.3509205,13.2 14,10.829771 14,8 C14,5.17022904 11.3509205,2.8 8,2.8 Z"
                                        fill="currentColor"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {添加好友 Icon}
     */
    static AddFriendIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                t="1584022187270"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                style={bodyStyle}
            >
                <title>{title}</title>
                <path
                    d="M542.24 542.72c-114.24 0-207.36-93.12-207.36-207.36S427.52 128 542.24 128s207.36 93.12 207.36 207.36-93.12 207.36-207.36 207.36z m0-366.24C454.4 176.48 383.36 248 383.36 335.36c0 87.36 71.04 158.88 158.88 158.88 87.36 0 158.88-71.04 158.88-158.88 0-87.36-71.52-158.88-158.88-158.88z"
                    fill="#979797"
                />
                <path
                    d="M189.92 894.56c-13.44 0-24.48-11.04-24.48-24.48 0-207.84 168.96-376.8 376.8-376.8 13.44 0 24.48 11.04 24.48 24.48s-11.04 24.48-24.48 24.48C361.28 542.24 214.4 689.6 214.4 870.08c-0.48 13.44-11.04 24.48-24.48 24.48zM831.2 764.96h-182.88c-13.92 0-24.96-11.04-24.96-24.96 0-13.92 11.04-24.96 24.96-24.96h182.88c13.92 0 24.96 11.04 24.96 24.96 0 13.92-11.04 24.96-24.96 24.96z"
                    fill="#979797"
                />
                <path
                    d="M714.56 831.68v-182.88c0-13.92 11.04-24.96 24.96-24.96 13.92 0 24.96 11.04 24.96 24.96v182.88c0 13.92-11.04 24.96-24.96 24.96-13.44 0-24.96-11.04-24.96-24.96z"
                    fill="#979797"
                />
            </svg>
        );
    }

    /**
     * @description { 关闭 Icon}
     */
    static CloseIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                <title>{title}</title>
                <g id="CloseIcon-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="contact-News-CloseIcon" transform="translate(-920.000000, -16.000000)">
                        <g id="CloseIcon-6" transform="translate(855.000000, 16.000000)">
                            <g id="CloseIcon-duplicate" transform="translate(65.000000, 0.000000)">
                                <g id="CloseIcon-3">
                                    <rect
                                        id="CloseIcon-rect"
                                        fill="#D8D8D8"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="16"
                                        height="16"
                                    />
                                    <path
                                        d="M2.13514358,2.71925956 C2.32957507,2.50332151 2.66224532,2.485887 2.87818337,2.68031849 L7.96105893,7.25696021 L12.5377007,2.17408464 C12.7321321,1.95814659 13.0648024,1.94071208 13.2807404,2.13514358 C13.4966785,2.32957507 13.514113,2.66224532 13.3196815,2.87818337 L8.74233569,7.96184092 L13.8259154,12.5377007 C14.0418534,12.7321321 14.0592879,13.0648024 13.8648564,13.2807404 C13.6704249,13.4966785 13.3377547,13.514113 13.1218166,13.3196815 L8.03823697,8.74382177 L3.46229935,13.8259154 C3.26786785,14.0418534 2.93519761,14.0592879 2.71925956,13.8648564 C2.50332151,13.6704249 2.485887,13.3377547 2.68031849,13.1218166 L7.25696021,8.03894107 L2.17408464,3.46229935 C1.95814659,3.26786785 1.94071208,2.93519761 2.13514358,2.71925956 Z"
                                        id="CloseIcon-path"
                                        fill="#5E6A81"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static MulSelectCloseIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" style={bodyStyle}>
                <title>{title}</title>
                <defs>
                    <rect id="path-1" x="0" y="0" width="16" height="16" />
                </defs>
                <g
                    id="MulSelectCloseIcon-3"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g id="Chat-Select" transform="translate(-928.000000, -608.000000)">
                        <g id="MulSelectCloseIcon-17" transform="translate(344.000000, 600.000000)">
                            <g id="MulSelectCloseIcon" transform="translate(584.000000, 8.000000)">
                                <mask id="MulSelectCloseIcon-mask-2" fill="white">
                                    <rect
                                        id="MulSelectCloseIcon-path-2"
                                        x="0"
                                        y="0"
                                        width="16"
                                        height="16"
                                    />
                                </mask>
                                <rect
                                    id="MulSelectCloseIcon-path-3"
                                    x="0"
                                    y="0"
                                    width="16"
                                    height="16"
                                />
                                <path
                                    d="M8.07071068,0.0707106781 C8.40208153,0.0707106781 8.67071068,0.339339828 8.67071068,0.670710678 L8.67071068,7.46971068 L15.4707107,7.47071068 C15.8020815,7.47071068 16.0707107,7.73933983 16.0707107,8.07071068 C16.0707107,8.40208153 15.8020815,8.67071068 15.4707107,8.67071068 L8.67071068,8.66971068 L8.67071068,15.4707107 C8.67071068,15.8020815 8.40208153,16.0707107 8.07071068,16.0707107 C7.73933983,16.0707107 7.47071068,15.8020815 7.47071068,15.4707107 L7.46971068,8.66971068 L0.670710678,8.67071068 C0.339339828,8.67071068 0.0707106781,8.40208153 0.0707106781,8.07071068 C0.0707106781,7.73933983 0.339339828,7.47071068 0.670710678,7.47071068 L7.47071068,7.46971068 L7.47071068,0.670710678 C7.47071068,0.339339828 7.73933983,0.0707106781 8.07071068,0.0707106781 Z"
                                    fill="#5E6A81"
                                    mask="url(#MulSelectCloseIcon-mask-2)"
                                    transform="translate(8.070711, 8.070711) rotate(-45.000000) translate(-8.070711, -8.070711) "
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static CloseIconBolder({ bodyStyle = {}, title = "", overlayClass }) {
        return (
            <svg
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                style={{
                    color: bodyStyle.color || "var(--color-lighter)",
                    ...bodyStyle,
                }}
                className={overlayClass}
            >
                <title>{title}</title>
                <g
                    id="CloseIconBolder-Moments"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="CloseIconBolder-Moments-Post"
                        transform="translate(-744.000000, -180.000000)"
                    >
                        <g
                            id="CloseIconBolder-group-23"
                            transform="translate(180.000000, 160.000000)"
                        >
                            <g
                                id="CloseIconBolder-mockplus-"
                                transform="translate(564.000000, 20.000000)"
                            >
                                <g
                                    id="CloseIconBolder-Group-3"
                                    transform="translate(10.000000, 10.000000) scale(-1, 1) translate(-10.000000, -10.000000) "
                                >
                                    <rect
                                        id="CloseIconBolder-Rectangle"
                                        fill="#D8D8D8"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="20"
                                        height="20"
                                    />
                                    <path
                                        d="M5.38252422,5.38252422 C5.89255651,4.87249193 6.71948224,4.87249193 7.22951453,5.38252422 L9.9990765,8.15208619 L12.7704855,5.38252422 C13.2805178,4.87249193 14.1074435,4.87249193 14.6174758,5.38252422 C15.1275081,5.89255651 15.1275081,6.71948224 14.6174758,7.22951453 L11.8460668,9.9990765 L14.6174758,12.7704855 C15.1275081,13.2805178 15.1275081,14.1074435 14.6174758,14.6174758 C14.1074435,15.1275081 13.2805178,15.1275081 12.7704855,14.6174758 L9.9990765,11.8460668 L7.22951453,14.6174758 C6.71948224,15.1275081 5.89255651,15.1275081 5.38252422,14.6174758 C4.87249193,14.1074435 4.87249193,13.2805178 5.38252422,12.7704855 L8.15208619,9.9990765 L5.38252422,7.22951453 C4.87249193,6.71948224 4.87249193,5.89255651 5.38252422,5.38252422 Z"
                                        id="CloseIconBolder-path-2"
                                        fill="currentColor"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description { 浏览器打开 Icon}
     */
    static OpenInBrowser({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                <title>{title}</title>
                <g
                    id="OpenInBrowser-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g id="contact-News-详情" transform="translate(-888.000000, -16.000000)">
                        <g id="OpenInBrowser-6" transform="translate(855.000000, 16.000000)">
                            <g id="OpenInBrowser-4备份" transform="translate(33.000000, 0.000000)">
                                <g id="OpenInBrowser-3">
                                    <rect
                                        id="OpenInBrowser-rect"
                                        fill="#D8D8D8"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="16"
                                        height="16"
                                    />
                                    <path
                                        d="M8,0.5 C5.93225,0.5 4.05737339,1.34133339 2.69935339,2.69935339 C1.34133339,4.05737339 0.5,5.93225 0.5,8 C0.5,10.06775 1.34133339,11.9426266 2.69935339,13.3006466 C4.05737339,14.6586666 5.93225,15.5 8,15.5 C10.06775,15.5 11.9426266,14.6586666 13.3006466,13.3006466 C14.6586666,11.9426266 15.5,10.06775 15.5,8 C15.5,5.93225 14.6586666,4.05737339 13.3006466,2.69935339 C11.9426266,1.34133339 10.06775,0.5 8,0.5 Z"
                                        id="OpenInBrowser-path"
                                        stroke="#5E6A81"
                                        fillRule="nonzero"
                                    />
                                    <path
                                        d="M4.64538768,4.21548873 C4.56040157,4.21548873 4.47541546,4.24063684 4.40212849,4.29093306 C4.30424855,4.35810723 4.24286261,4.45859572 4.2227402,4.56676064 C4.20261778,4.67492556 4.22375889,4.79076693 4.29093306,4.88864686 L7.21735608,9.03664985 L11.1113531,11.7090669 C11.1846401,11.7593632 11.2696262,11.7845113 11.3546123,11.7845113 C11.4395984,11.7845113 11.5245845,11.7593632 11.5978715,11.7090669 C11.6957514,11.6418928 11.7571374,11.5414043 11.7772598,11.4332394 C11.7973822,11.3250744 11.7762411,11.2092331 11.7090669,11.1113531 L8.78264392,6.96335015 L4.64538768,4.21548873 Z"
                                        id="OpenInBrowser-path-rect"
                                        stroke="#5E6A81"
                                        transform="translate(8.000000, 8.000000) rotate(-90.000000) translate(-8.000000, -8.000000) "
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description { 复制连接 Icon}
     */
    static DuplicateLink({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                <title>{title}</title>
                <g
                    id="duplicateLink-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="contact-News-duplicateLink"
                        transform="translate(-855.000000, -16.000000)"
                    >
                        <g id="duplicateLink-6" transform="translate(855.000000, 16.000000)">
                            <g id="duplicateLink-4">
                                <g id="duplicateLink-3">
                                    <rect
                                        id="duplicateLink-rect"
                                        fill="#D8D8D8"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="16"
                                        height="16"
                                    />
                                    <g
                                        id="duplicateLink-5"
                                        transform="translate(8.131728, 8.131728) rotate(-45.000000) translate(-8.131728, -8.131728) translate(-0.368272, 5.131728)"
                                    >
                                        <rect
                                            id="duplicateLink-in-rect"
                                            stroke="#5E6A81"
                                            x="0.5"
                                            y="0.5"
                                            width="7"
                                            height="5"
                                            rx="1"
                                        />
                                        <rect
                                            id="duplicateLink-in-dup-rect"
                                            stroke="#5E6A81"
                                            x="9.5"
                                            y="0.5"
                                            width="7"
                                            height="5"
                                            rx="1"
                                        />
                                        <rect
                                            id="duplicateLink-in-other-rect"
                                            fill="#5E6A81"
                                            x="5"
                                            y="2.5"
                                            width="7"
                                            height="1"
                                            rx="0.5"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {loading}
     */
    static CuLoading({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="48px" height="48px" viewBox="0 0 48 48" version="1.1" style={bodyStyle}>
                <title>loading</title>
                <g
                    id="CuLoading-page-3"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="CuLoading-Chat-Loading"
                        transform="translate(-456.000000, -301.000000)"
                        fillRule="nonzero"
                    >
                        <g id="CuLoading-edit-4" transform="translate(355.000000, 250.000000)">
                            <g id="loading" transform="translate(101.000000, 51.000000)">
                                <rect
                                    id="CuLoading-rect"
                                    fill="#000000"
                                    opacity="0"
                                    x="0"
                                    y="0"
                                    width="48"
                                    height="48"
                                />
                                <path
                                    d="M24,10 C22.8,10 22,9.19999997 22,8 L22,2 C22,0.800000016 22.8,0 24,0 C25.2,0 26,0.800000016 26,2 L26,8 C26,9.20000002 25.2,10 24,10 Z M24,48 C22.8,48 22,47.2 22,46 L22,40 C22,38.8 22.8,38 24,38 C25.2,38 26,38.8 26,40 L26,46 C26,47.2 25.2,48 24,48 Z M8,26 L2,26 C0.800000016,26 0,25.2 0,24 C0,22.8 0.800000016,22 2,22 L8,22 C9.20000002,22 10,22.8 10,24 C10,25.2 9.20000002,26 8,26 Z M46,26 L40,26 C38.8,26 38,25.2 38,24 C38,22.8 38.8,22 40,22 L46,22 C47.2,22 48,22.8 48,24 C48,25.2 47.2,26 46,26 Z M37.8,18 C37.2,18 36.4,17.6 36,17 C35.4,16 35.8,14.8 36.8,14.2 L42,11.2 C43,10.6 44.2,11 44.8,12 C45.4,13 45,14.2 44,14.8 L38.8,17.8 C38.6,18 38.2,18 37.8,18 Z M5.00000002,37 C4.40000002,37 3.6,36.6 3.20000002,36 C2.60000002,35 3,33.8 4.00000003,33.2 L9.20000002,30.2 C10.2,29.6 11.4,30 12,31 C12.6,32 12.2,33.2 11.2,33.8 L6,36.8 C5.60000002,37 5.19999998,37 5.00000002,37 Z M32,12.2 C31.6,12.2 31.4,12.2 31,12 C30,11.4 29.8,10.2 30.2,9.20000002 L33.2,3.99999998 C33.8,3 35,2.79999998 36,3.19999997 C37,3.79999997 37.2,4.99999997 36.8,5.99999995 L33.8,11.1999999 C33.4,11.8 32.6,12.2 32,12.2 Z M13,45 C12.6,45 12.4,45 12,44.8 C11,44.2 10.8,43 11.2,42 L14.2,36.8 C14.8,36 16,35.6 17,36.2 C18,36.8 18.2,38 17.8,39 L14.8,44 C14.4,44.6 13.6,45 13,45 Z M10.2,18 C9.80000002,18 9.39999998,18 9.20000002,17.8 L3.99999998,14.8 C3,14.2 2.60000002,13 3.20000002,12 C3.80000002,11 5.00000002,10.8 6,11.2 L11.2,14.2 C12.2,14.8 12.4,16 11.8,17 C11.6,17.6 10.8,18 10.2,18 Z M43,37 C42.6,37 42.4,37 42,36.8 L36.8,33.8 C35.8,33.2 35.6,32 36,31 C36.6,30 37.8,29.8 38.8,30.2 L44,33.2 C45,33.8 45.2,35 44.8,36 C44.4,36.6 43.8,37 43,37 Z M16,12.2 C15.4,12.2 14.6,11.8 14.2,11.2 L11.2,6 C10.8,5.00000002 11,3.80000002 12,3.20000002 C13,2.60000002 14.2,3 14.8,3.99999998 L17.8,9.19999997 C18.2,10.2 18,11.4 17,11.8 C16.6,12 16.4,12.2 16,12.2 Z M35,45 C34.4,45 33.6,44.6 33.2,44 L30.2,38.8 C29.6,37.8 30,36.6 31,36 C32,35.4 33.2,35.8 33.8,36.8000001 L36.8,42 C37.4,43 37,44.2 36,44.8 C35.6,45 35.4,45 35,45 Z"
                                    id="CuLoading-shape"
                                    fill="#A2A8C3"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {loading_fail}
     */
    static CuFail({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="48px" height="48px" viewBox="0 0 48 48" style={bodyStyle}>
                <title>{title}</title>
                <g id="CuFail-page-3" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="CuFail-Chat-Loading-failed"
                        transform="translate(-456.000000, -272.000000)"
                    >
                        <g id="CuFail-edit-4" transform="translate(355.000000, 221.000000)">
                            <g id="CuFail-loading" transform="translate(100.000000, 50.000000)">
                                <rect
                                    id="CuFail-rect-1"
                                    fill="#000000"
                                    fillRule="nonzero"
                                    opacity="0"
                                    x="0"
                                    y="0"
                                    width="50"
                                    height="50"
                                />
                                <circle
                                    id="CuFail-circle-1"
                                    stroke="#A2A8C3"
                                    strokeWidth="4"
                                    cx="25"
                                    cy="25"
                                    r="22"
                                />
                                <rect
                                    id="CuFail-rect-2"
                                    fill="#A2A8C3"
                                    x="23"
                                    y="13"
                                    width="4"
                                    height="15"
                                    rx="2"
                                />
                                <circle
                                    id="CuFail-circle-2"
                                    fill="#A2A8C3"
                                    cx="25"
                                    cy="33.5"
                                    r="2.5"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static DeleteIcon({ bodyStyle = {}, title = "", overlayClass }) {
        return (
            <svg
                width="16px"
                height="16px"
                className={overlayClass}
                style={{ color: "#0D1324", ...bodyStyle }}
            >
                <title>{title}</title>
                <g
                    id="DeleteIcon-Moments"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g id="DeleteIcon-Moments-More" transform="translate(-452.000000, -300.000000)">
                        <g id="DeleteIcon-group-17" transform="translate(438.000000, 118.000000)">
                            <g
                                id="DeleteIcon-g-14dup-3"
                                transform="translate(0.000000, 170.000000)"
                            >
                                <g id="1" transform="translate(14.000000, 12.000000)">
                                    <rect
                                        id="DeleteIcon-rect"
                                        fill="#D8D8D8"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="16"
                                        height="16"
                                    />
                                    <g
                                        id="DeleteIcon-g-6"
                                        transform="translate(0.400000, 0.800000)"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M9.6,0 C10.4836556,0 11.2,0.7163444 11.2,1.6 L11.2,2.8 L14.4,2.8 C14.8418278,2.8 15.2,3.1581722 15.2,3.6 C15.2,4.0418278 14.8418278,4.4 14.4,4.4 L13.154,4.4 L13.1890705,11.9890697 C13.1949193,13.2844151 12.1735078,14.3447478 10.8899418,14.39791 L10.7890447,14.4 L4.41095527,14.4 C3.1155965,14.4 2.05992657,13.37377 2.01261066,12.0899753 L2.01098016,11.9890697 L2.0456,4.4 L0.8,4.4 C0.3581722,4.4 0,4.0418278 0,3.6 C0,3.1581722 0.3581722,2.8 0.8,2.8 L4,2.8 L4,1.6 C4,0.7163444 4.7163444,0 5.6,0 L9.6,0 Z M11.554,4.4 L3.6456,4.4 L3.61095527,12 C3.61095527,12.4217447 3.93730639,12.767266 4.35125034,12.7978057 L4.41095527,12.8 L10.7926881,12.8 C11.2144285,12.798071 11.5584599,12.4701496 11.5871141,12.0560709 L11.5890364,11.9963566 L11.554,4.4 Z M6,6 C6.4418278,6 6.8,6.3581722 6.8,6.8 L6.8,10 C6.8,10.4418278 6.4418278,10.8 6,10.8 C5.5581722,10.8 5.2,10.4418278 5.2,10 L5.2,6.8 C5.2,6.3581722 5.5581722,6 6,6 Z M9.2,6 C9.6418278,6 10,6.3581722 10,6.8 L10,10 C10,10.4418278 9.6418278,10.8 9.2,10.8 C8.7581722,10.8 8.4,10.4418278 8.4,10 L8.4,6.8 C8.4,6.3581722 8.7581722,6 9.2,6 Z M9.6,1.6 L5.6,1.6 L5.6,2.8 L9.6,2.8 L9.6,1.6 Z"
                                            id="DeleteIcon-shape"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static DisableIcon({ bodyStyle = {}, overlayClass, title = "" }) {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                className={overlayClass}
                style={{ color: "#0D1324", ...bodyStyle }}
            >
                <title>{title}</title>
                <g
                    id="DisableIcon-Moments"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="DisableIcon-Moments-More"
                        transform="translate(-452.000000, -260.000000)"
                    >
                        <g id="DisableIcon-g-17" transform="translate(438.000000, 118.000000)">
                            <g id="DisableIcon-g-14d-2" transform="translate(0.000000, 130.000000)">
                                <g id="1" transform="translate(14.000000, 12.000000)">
                                    <rect
                                        id="DisableIcon-rect"
                                        fill="#D8D8D8"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="16"
                                        height="16"
                                    />
                                    <path
                                        d="M8,0.4 C12.1973641,0.4 15.6,3.8026359 15.6,8 C15.6,10.0920776 14.7546865,11.9867217 13.3869802,13.3610117 C13.3827852,13.3651366 13.3784296,13.3695935 13.3740115,13.3740115 L13.3610117,13.3869802 C11.9867217,14.7546865 10.0920776,15.6 8,15.6 C3.8026359,15.6 0.4,12.1973641 0.4,8 C0.4,5.90792237 1.24531346,4.01327828 2.61301983,2.63898827 C2.61721484,2.63486339 2.62157041,2.63040652 2.62598846,2.62598846 L2.63898827,2.61301983 C4.01327828,1.24531346 5.90792237,0.4 8,0.4 Z M2,8 C2,11.3137085 4.6862915,14 8,14 C9.36831118,14 10.6296436,13.5419696 11.6390395,12.7708667 L3.22913333,4.36096045 C2.45803038,5.37035637 2,6.63168882 2,8 Z M8,2 C6.63168882,2 5.37035637,2.45803038 4.36096045,3.22913333 L12.7708667,11.6390395 C13.5419696,10.6296436 14,9.36831118 14,8 C14,4.6862915 11.3137085,2 8,2 Z"
                                        id="Combined-Shape"
                                        fill="currentColor"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static LinkIcon({ bodyStyle = {}, overlayClass, title = "" }) {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                className={overlayClass}
                style={{ color: "#0D1324", ...bodyStyle }}
            >
                <title>{title}</title>
                <g id="Moments" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Moments-More" transform="translate(-452.000000, -180.000000)">
                        <g id="LinkIcon-g-17" transform="translate(438.000000, 118.000000)">
                            <g id="LinkIcon-g-14d" transform="translate(0.000000, 50.000000)">
                                <g
                                    id="LinkIcon-mockplus-"
                                    transform="translate(14.000000, 12.000000)"
                                >
                                    <g
                                        id="chat/icon/new"
                                        transform="translate(-2.000000, -2.000000)"
                                    >
                                        <g
                                            id="LinkIcon-g-12"
                                            transform="translate(0.400000, 0.400000)"
                                        >
                                            <rect
                                                id="LinkIcon-rect"
                                                fill="#D8D8D8"
                                                opacity="0"
                                                x="1.6"
                                                y="1.6"
                                                width="16"
                                                height="16"
                                            />
                                            <g
                                                id="LinkIcon-g-2"
                                                transform="translate(9.600000, 9.600000) rotate(-45.000000) translate(-9.600000, -9.600000) translate(1.200000, 4.800000)"
                                                fill="currentColor"
                                            >
                                                <path
                                                    d="M6,3.63833408e-12 C6.4418278,3.82007759e-12 6.8,0.3581722 6.8,0.8 C6.8,1.20784105 6.49481185,1.54440158 6.1003503,1.59376686 L6,1.6 L4.8,1.6 C3.0326888,1.6 1.6,3.0326888 1.6,4.8 C1.6,6.53396571 2.97913511,7.94581715 4.70032827,7.99847727 L4.8,8 L6,7.999 L6,8 L6.1003503,8.00623314 C6.49481185,8.05559842 6.8,8.39215895 6.8,8.8 C6.8,9.2418278 6.4418278,9.6 6,9.6 L5.985,9.599 L4.8,9.6 C2.1490332,9.6 2.91073832e-12,7.4509668 2.91073832e-12,4.8 C2.91073832e-12,2.1490332 2.1490332,3.63833408e-12 4.8,3.63833408e-12 L6,3.63833408e-12 Z M11.6,1.6 C11.1581722,1.6 10.8,1.2418278 10.8,0.8 C10.8,0.3581722 11.1581722,3.82007759e-12 11.6,3.82007759e-12 L12,3.63833408e-12 C14.6509668,3.63833408e-12 16.8,2.1490332 16.8,4.8 C16.8,7.4509668 14.6509668,9.6 12,9.6 L11.6141042,9.59987817 C11.6094126,9.59995928 11.604711,9.6 11.6,9.6 C11.1581722,9.6 10.8,9.2418278 10.8,8.8 C10.8,8.3581722 11.1581722,8 11.6,8 L11.6,8 L11.6,7.999 L12,8 C13.7673112,8 15.2,6.5673112 15.2,4.8 C15.2,3.06603429 13.8208649,1.65418285 12.0996717,1.60152273 L12,1.6 L11.6,1.6 L11.6,1.6 Z M10.4,4 C10.8418278,4 11.2,4.3581722 11.2,4.8 C11.2,5.2418278 10.8418278,5.6 10.4,5.6 L6.4,5.6 C5.9581722,5.6 5.6,5.2418278 5.6,4.8 C5.6,4.3581722 5.9581722,4 6.4,4 L10.4,4 Z"
                                                    id="LinkIcon-shape"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static HumanIcon({ bodyStyle = {}, overlayClass, title = "" }) {
        return (
            <svg
                width="16px"
                height="16px"
                className={overlayClass}
                style={{ color: "#0D1324", ...bodyStyle }}
            >
                <title>{title}</title>
                <g
                    id="HumanIcon-Moments"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="HumanIcon-Moments-More"
                        transform="translate(-452.000000, -140.000000)"
                        fill="currentColor"
                    >
                        <g id="HumanIcon-g-17" transform="translate(438.000000, 118.000000)">
                            <g id="HumanIcon-g-14" transform="translate(0.000000, 10.000000)">
                                <g id="HumanIcon-g-11" transform="translate(14.000000, 12.000000)">
                                    <path
                                        d="M8.04019375,8 C9.87015247,8 11.7000037,8.49793145 13.5297474,9.49379436 C14.5592209,10.0541004 15.2,11.1323916 15.2,12.3044662 L15.2,13.6 C15.2,14.4836556 14.4836556,15.2 13.6,15.2 L2.4,15.2 C1.5163444,15.2 0.8,14.4836556 0.8,13.6 L0.8,12.3222951 C0.8,11.1434132 1.44817478,10.0600073 2.48695252,9.50259957 C4.35376917,8.50086652 6.20484958,8 8.04019375,8 Z M8.04019375,9.6 C6.4794097,9.6 4.88571562,10.0312228 3.24347642,10.9124476 C2.75005703,11.1772163 2.43289732,11.6793418 2.4024146,12.234264 L2.4,12.3222951 L2.4,13.6 L13.6,13.6 L13.6,12.3044662 C13.6,11.718429 13.2796104,11.179283 12.7648742,10.8991303 C11.1624265,10.0269763 9.59332875,9.6 8.04019375,9.6 Z M8,0.4 C9.7673112,0.4 11.2,1.8326888 11.2,3.6 C11.2,5.3673112 9.7673112,6.8 8,6.8 C6.2326888,6.8 4.8,5.3673112 4.8,3.6 C4.8,1.8326888 6.2326888,0.4 8,0.4 Z M8,2 C7.1163444,2 6.4,2.7163444 6.4,3.6 C6.4,4.4836556 7.1163444,5.2 8,5.2 C8.8836556,5.2 9.6,4.4836556 9.6,3.6 C9.6,2.7163444 8.8836556,2 8,2 Z"
                                        id="HumanIcon-Combined-Shape"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    // 相机
    static CameraIcon({ bodyStyle = {}, overlayClass, title = "" }) {
        return (
            <svg
                width="10px"
                height="10px"
                viewBox="0 0 10 10"
                version="1.1"
                style={bodyStyle}
                className={overlayClass}
            >
                <title>{title}</title>
                <g id="CameraIcon-3" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Chat-Group-more" transform="translate(-848.000000, -153.000000)">
                        <g id="CameraIcon-g-20" transform="translate(712.000000, 48.000000)">
                            <g id="CameraIcon-g-26" transform="translate(56.000000, 64.000000)">
                                <g id="CameraIcon-g-28" transform="translate(75.000000, 36.000000)">
                                    <g
                                        id="chat_tanchaung_icon_xinjian"
                                        transform="translate(5.000000, 5.000000)"
                                    >
                                        <rect
                                            id="CameraIcon-rect"
                                            fill="#D8D8D8"
                                            opacity="0"
                                            x="0"
                                            y="0"
                                            width="10"
                                            height="10"
                                        />
                                        <path
                                            d="M6.02029415,0.5 C6.73531568,0.5 7.3509379,1.0046895 7.49116516,1.7058258 L7.55,2 L7.75,2 C8.8545695,2 9.75,2.8954305 9.75,4 L9.75,7.5 C9.75,8.6045695 8.8545695,9.5 7.75,9.5 L2.25,9.5 C1.1454305,9.5 0.25,8.6045695 0.25,7.5 L0.25,4 C0.25,2.8954305 1.1454305,2 2.25,2 L2.45,2 L2.50883484,1.7058258 C2.6490621,1.0046895 3.26468432,0.5 3.97970585,0.5 L6.02029415,0.5 Z M6.02029415,1.5 L3.97970585,1.5 C3.75460648,1.5 3.55906102,1.65005686 3.4986517,1.86361385 L3.48941552,1.90194193 L3.43058068,2.19611614 C3.34043458,2.64684661 2.95559212,2.97580012 2.50080798,2.99872189 L2.45,3 L2.25,3 C1.71445115,3 1.27723028,3.42099212 1.25122383,3.95008991 L1.25,4 L1.25,7.5 C1.25,8.03554885 1.67099212,8.47276972 2.20008991,8.49877617 L2.25,8.5 L7.75,8.5 C8.28554885,8.5 8.72276972,8.07900788 8.74877617,7.54991009 L8.75,7.5 L8.75,4 C8.75,3.46445115 8.32900788,3.02723028 7.79991009,3.00122383 L7.75,3 L7.55,3 C7.0903433,3 6.69230403,2.68714401 6.58063688,2.2456868 L6.56941932,2.19611614 L6.51058448,1.90194193 C6.46643887,1.68121384 6.28094639,1.51889431 6.05968929,1.50154007 L6.02029415,1.5 Z M5,3.25 C6.1045695,3.25 7,4.1454305 7,5.25 C7,6.3545695 6.1045695,7.25 5,7.25 C3.8954305,7.25 3,6.3545695 3,5.25 C3,4.1454305 3.8954305,3.25 5,3.25 Z M5,4.25 C4.44771525,4.25 4,4.69771525 4,5.25 C4,5.80228475 4.44771525,6.25 5,6.25 C5.55228475,6.25 6,5.80228475 6,5.25 C6,4.69771525 5.55228475,4.25 5,4.25 Z"
                                            id="CameraIcon-s"
                                            fill="currentColor"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description {refresh}
     */
    static RefreshIcon({ bodyStyle = {}, title = "", overlayClassName = "" }) {
        return (
            <svg
                width="16px"
                height="15px"
                viewBox="0 0 16 16"
                version="1.1"
                className={overlayClassName}
                style={{
                    color: "#000",
                    ...bodyStyle,
                }}
            >
                <title>{title}</title>
                <g
                    id="RefreshIcon-g-moments"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g id="RefreshIcon-g-2-Moments" transform="translate(-888.000000, -20.000000)">
                        <g id="RefreshIcon-g-3" transform="translate(888.000000, 20.000000)">
                            <rect
                                id="RefreshIcon-rect"
                                fill="#000000"
                                opacity="0"
                                x="0"
                                y="0"
                                width="16"
                                height="16"
                            />
                            <path
                                d="M13.6007699,2.28476681 L13.6,1.6 C13.6,1.1581722 13.9581722,0.8 14.4,0.8 C14.8418278,0.8 15.2,1.1581722 15.2,1.6 L15.2,4.8 C15.2,5.20784105 14.8948119,5.54440158 14.5003503,5.59376686 L14.4,5.6 L11.2,5.6 C10.7581722,5.6 10.4,5.2418278 10.4,4.8 C10.4,4.3581722 10.7581722,4 11.2,4 L12.9974558,4.00040347 C11.0561034,1.56851688 7.57699596,0.854138051 4.8,2.45743742 C1.73892721,4.22474862 0.690126216,8.13892721 2.45743742,11.2 C4.22474862,14.2610728 8.13892721,15.3098738 11.2,13.5425626 C12.5020625,12.7908164 13.473692,11.6304523 13.9908127,10.2522928 C14.1460306,9.83862719 14.6072018,9.62911396 15.0208674,9.78433186 C15.434533,9.93954977 15.6440462,10.4007209 15.4888283,10.8143865 C14.8426379,12.5365249 13.6260933,13.9893778 12,14.9282032 C8.17365901,17.1373422 3.28093577,15.826341 1.07179677,12 C-1.13734223,8.17365901 0.173659012,3.28093577 4,1.07179677 C7.18157082,-0.765084 11.1004154,-0.168215602 13.6007699,2.28476681 Z"
                                id="RefreshIcon-shape"
                                fill="currentColor"
                                fillRule="nonzero"
                            />
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
    //  region:router 路由图标
    /**
     * @description { 聊天Icon --- 路由图标 }
     */
    static ChatMsgIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" style={bodyStyle}>
                <title>{title}</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="Chat-Select"
                        transform="translate(-22.000000, -150.000000)"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <g transform="translate(22.000000, 146.000000)">
                            <g transform="translate(0.000000, 4.000000)">
                                <path d="M10,1.83333333 C12.4958702,1.83333333 14.7586321,2.75502352 16.3953432,4.25534198 C17.9991827,5.72552817 19,7.75405406 19,10 C19,12.2459459 17.9991827,14.2744718 16.3953432,15.744658 C14.7586321,17.2449765 12.4958702,18.1666667 10,18.1666667 C8.37534612,18.1666667 6.85008708,17.7762724 5.53124937,17.0898322 L5.53124937,17.0898322 L3.41956327,17.6677634 C3.15325037,17.7407843 2.88255173,17.6989477 2.66017609,17.5722776 C2.43780046,17.4456075 2.26374783,17.234104 2.19072695,16.9677911 C2.14390568,16.7970302 2.1432636,16.6168993 2.18894526,16.4455127 L2.18894526,16.4455127 L2.6501916,14.7128956 C1.61325517,13.3849079 1,11.7583702 1,10 C1,7.75405406 2.00081733,5.72552817 3.60465682,4.25534198 C5.24136787,2.75502352 7.50412977,1.83333333 10,1.83333333 Z" />
                                <path
                                    d="M13.3333333,14.1666667 C12.962963,13.2461921 11.6363993,12.5 10,12.5 C8.36360074,12.5 7.03703704,13.2461921 6.66666667,14.1666667"
                                    id="Oval"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    transform="translate(10.000000, 13.333333) rotate(-180.000000) translate(-10.000000, -13.333333) "
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description { 好友Icon --- 路由图标 }
     */
    static ContractIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" style={bodyStyle}>
                <title>{title}</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Chat-Select" transform="translate(-22.000000, -218.000000)">
                        <rect fill="none" x="0" y="0" width="960" height="720" />
                        <g stroke="currentColor" strokeWidth="2">
                            <g transform="translate(22.000000, 146.000000)">
                                <g transform="translate(0.000000, 72.000000)">
                                    <rect
                                        strokeLinejoin="round"
                                        x="1.66666667"
                                        y="0.833333333"
                                        width="16.6666667"
                                        height="18.3333333"
                                        rx="4"
                                    />
                                    <rect
                                        x="7.66666667"
                                        y="5.16666667"
                                        width="4.66666667"
                                        height="4.66666667"
                                        rx="2.33333333"
                                    />
                                    <path
                                        d="M14.1666667,15 C13.7037037,14.0795254 12.3011865,13.3333333 10,13.3333333 C7.69881354,13.3333333 6.2962963,14.0795254 5.83333333,15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description { 设置Icon --- 路由图标 }
     */
    static MomentIcon({ bodyStyle = {}, overlayClass = "", title = "" }) {
        return (
            <svg
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                version="1.1"
                className={overlayClass}
                style={{
                    ...bodyStyle,
                }}
            >
                <title>{title}</title>
                <g id="Moments" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Moments-Topic-Detail" transform="translate(-22.000000, -286.000000)">
                        <rect x="0" y="0" width="960" height="720" />
                        <g
                            id="MomentIcon_1-19"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        >
                            <g id="MomentIcon_g-3" transform="translate(22.000000, 146.000000)">
                                <g
                                    id="MomentIcon-mockplus-"
                                    transform="translate(0.000000, 140.000000)"
                                >
                                    <g
                                        id="MomentIcon_Group-2"
                                        transform="translate(0.833333, 0.833333)"
                                    >
                                        <path
                                            d="M9.28115539,0.519148592 C9.67115323,0.325143345 10.0342605,0.260041238 10.8306975,0.247747748 C12.2061011,0.247747748 13.6286872,1.05506601 13.6286872,2.4062676 C13.6286872,3.29595074 13.0728799,4.06868421 12.263855,4.44616431 C13.0728799,4.82365403 13.6286872,5.59638749 13.6286872,6.48630146 C13.6286872,7.83727224 12.2061011,8.64456162 10.8306975,8.64456162 C9.89674548,8.64456162 8.99912824,8.32319204 8.19101039,7.8608306 C8.8166786,8.75445422 9.2795939,9.77841608 9.2795939,10.8506596 C9.2795939,12.2149915 8.41146621,13.6261261 6.95848838,13.6261261 C6.00179185,13.6261261 5.17085396,13.0747929 4.76494102,12.2722805 C4.35901773,13.0747929 3.52807986,13.6261261 2.57113511,13.6261261 C1.11840549,13.6261261 0.250308839,12.2149915 0.250308839,10.8506596 C0.250308839,10.1737541 0.204737685,9.98073246 0.498056586,9.36288095"
                                            id="MomentIcon_p1"
                                            strokeLinecap="round"
                                            transform="translate(6.938217, 6.936937) rotate(-180.000000) translate(-6.938217, -6.936937) "
                                        />
                                        <path
                                            d="M15.6657683,4.21171171 C17.1804617,4.21171171 18.0855856,5.69497589 18.0855856,7.12904506 C18.0855856,8.38906409 17.4823198,9.58565411 16.7139146,10.598727 C16.0562808,11.7988473 15.1027923,13.0270264 13.9004137,14.1482626 C13.0866803,14.9070812 12.2320364,15.5487649 11.3790033,16.06189 C10.2299283,17.110796 8.73073405,18.0855856 7.12904506,18.0855856 C5.69497589,18.0855856 4.21171171,17.1804293 4.21171171,15.6654771 C4.21171171,14.6679743 4.79122609,13.8015941 5.63475864,13.3783676 C4.79122609,12.9551303 4.21171171,12.0887501 4.21171171,11.0909885 C4.21171171,9.57629506 5.69497589,8.67117117 7.12904506,8.67117117 C7.83328196,8.67117117 8.51770491,8.8596194 9.16134743,9.16002238 C8.8596194,8.51770438 8.67117117,7.83328196 8.67117117,7.12904506 C8.67117117,5.69497589 9.57632743,4.21171171 11.0912796,4.21171171 C12.0887825,4.21171171 12.9551627,4.79122609 13.3783892,5.63475864 C13.8016264,4.79122609 14.6680066,4.21171171 15.6657683,4.21171171 Z"
                                            id="MomentIcon_s"
                                            transform="translate(11.148649, 11.148649) rotate(-180.000000) translate(-11.148649, -11.148649) "
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description { 设置Icon --- 路由图标 }
     */
    static SettingIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" style={bodyStyle}>
                <title>{title}</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Chat-Select" transform="translate(-22.000000, -286.000000)">
                        <g fillRule="nonzero" stroke="currentColor" strokeWidth="2">
                            <g transform="translate(22.000000, 146.000000)">
                                <g transform="translate(0.000000, 140.000000)">
                                    <path d="M15.584,16.594 L15.5967652,16.635233 C15.6007446,16.663319 15.5971572,16.6920807 15.5889375,16.7190166 C15.5734951,16.7696213 15.5413462,16.8149316 15.4977551,16.8510148 L15.4977551,16.8510148 L13.070304,18.1500562 C13.0008429,18.1698862 12.9284187,18.1716476 12.8597976,18.1571738 C12.7831891,18.1410154 12.7105528,18.104461 12.6543275,18.0464418 C12.2625461,17.6372294 10.9382911,16.6054522 9.94634426,16.6054522 C9.02220205,16.6054522 7.71816825,17.5342006 7.24430271,18.0339195 C7.17364477,18.1085304 7.05992647,18.137567 6.95306911,18.137567 C6.90935174,18.137567 6.86789612,18.1296564 6.82417327,18.1141571 L6.82417327,18.1141571 L4.48196583,16.8399089 C4.44699625,16.8082797 4.42136172,16.7693287 4.40897456,16.7259937 C4.3956877,16.6795112 4.3988007,16.6289045 4.41963903,16.5821412 L4.41963903,16.5821412 L4.396,16.629 C4.43782715,16.5355102 4.67799239,15.9643998 4.71470953,15.4085129 L4.71941623,15.2701461 C4.71941623,14.3367978 4.33101989,13.4878282 3.69837674,12.8734979 C3.07705032,12.2701568 2.21977242,11.8942678 1.27271427,11.8942678 L1.27271427,11.8942678 L1.26120568,11.9018821 C1.21485461,11.8588867 1.20422141,11.7867297 1.19033199,11.7156614 C1.18976231,11.7127465 1.18918686,11.709832 1.18860606,11.7069308 C1.18831226,11.7055695 1.1880872,11.7045112 1.18793162,11.7037635 C1.17962878,11.6638593 1,10.7339102 1,10.0081431 C1,9.27581977 1.182119,8.34140066 1.19029056,8.3001489 C1.20330961,8.23361041 1.21750413,8.16939084 1.24867984,8.12150828 C2.20910794,8.106 3.05220776,7.73789823 3.66438429,7.16343091 C4.32193922,6.54638043 4.71727,5.68978647 4.71727,4.74614006 C4.71727,4.12624547 4.42051676,3.4381765 4.41289334,3.42122566 C4.39440642,3.38095417 4.39674193,3.3362199 4.40913534,3.29567637 C4.42459052,3.24511662 4.45653623,3.19969124 4.50003208,3.16356806 L4.50003208,3.16356806 L6.98230506,1.84552379 C7.1963759,1.83333333 7.312524,1.86202967 7.39142323,1.94327201 C7.76470746,2.32180391 9.07657291,3.31249806 10.0493633,3.31249806 C11.0134255,3.31249806 12.3197563,2.34040078 12.6890113,1.96860666 C12.7634709,1.89394989 12.8801283,1.86359054 12.9911289,1.86359054 C13.0371087,1.86359054 13.0811235,1.87128625 13.1272297,1.88713588 L13.1272297,1.88713588 L15.5205695,3.18203793 C15.5535691,3.21177448 15.5759884,3.2506069 15.5878229,3.29175405 C15.600402,3.33548993 15.6020117,3.38399689 15.5819935,3.42783177 L15.582,3.425 L15.604,3.382 L15.5991247,3.39370023 C15.5600266,3.48271046 15.3198614,4.05310699 15.2831442,4.60964411 L15.2784375,4.74820306 C15.2784375,5.68120661 15.6671124,6.53000969 16.2997532,7.14433772 C16.9215435,7.74812925 17.7792359,8.12408131 18.7287531,8.12407478 C18.7297948,8.12407101 18.7369571,8.11316297 18.7398336,8.11581843 C18.7858483,8.15829711 18.7959741,8.22994972 18.8097094,8.3001489 L18.8097094,8.3001489 C18.8117013,8.31009184 18.8119174,8.31110918 18.8120684,8.31183501 C18.8203716,8.35174091 19,9.27804685 19,10.0081431 C19,10.7240482 18.829954,11.6312778 18.8274951,11.640141 C18.8272748,11.6409351 18.8244919,11.6486037 18.819351,11.662357 C18.8165751,11.6797105 18.8132666,11.6973109 18.8097927,11.7150245 C18.7966422,11.7820808 18.7819111,11.8467394 18.7498853,11.8947662 C17.7890447,11.9100988 16.9456204,12.2781559 16.3332901,12.8527675 C15.6758987,13.4696645 15.2805838,14.3261154 15.2805838,15.2701461 C15.2805838,15.9081348 15.6033842,16.6324238 15.6066224,16.638649 L15.602,16.629 L15.584,16.594 Z" />
                                    <path d="M10.0006733,7.66666667 C10.6435751,7.66666667 11.2265605,7.92879988 11.6489549,8.35123731 C12.0712127,8.77353821 12.3333333,9.3564302 12.3333333,9.9996665 C12.3333333,10.6433879 12.0715584,11.2267068 11.6491307,11.6491768 C11.2268165,12.0715333 10.6437036,12.3333333 10,12.3333333 C9.35646656,12.3333333 8.77333175,12.071429 8.35095608,11.6490111 C7.92855033,11.2265631 7.66666667,10.6433225 7.66666667,9.9996665 C7.66666667,9.35624892 7.92870441,8.77336849 8.35105516,8.35114528 C8.77369655,7.92863152 9.35713664,7.66666667 10.0006733,7.66666667 Z" />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
    /**
     * @description 群管理员
     */
    static GroupAdmin({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" style={bodyStyle}>
                <title>{title}</title>
                <defs>
                    <circle id="path-1" cx="5.29411765" cy="5.29411765" r="5.29411765"></circle>
                </defs>
                <g id="chat" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Chat-Group-More" transform="translate(-838.000000, -573.000000)">
                        <g id="Group-20" transform="translate(800.000000, 87.000000)">
                            <g id="Group-2" transform="translate(0.000000, 272.000000)">
                                <g id="Group-6" transform="translate(38.000000, 118.000000)">
                                    <g id="admin/qunzhu" transform="translate(0.000000, 96.000000)">
                                        <g id="webp-(1)" transform="translate(0.705882, 0.705882)">
                                            <mask id="mask-2" fill="white">
                                                <use xlinkHref="#path-1"></use>
                                            </mask>
                                            <circle
                                                stroke="#FFFFFF"
                                                strokeWidth="0.77"
                                                cx="5.29411765"
                                                cy="5.29411765"
                                                r="5.67911765"
                                                fill="#24C26E"
                                            ></circle>
                                            <path
                                                d="M5.11764706,8.11764706 L5.47058824,8.11764706 C6.83505644,8.11764706 7.94117647,9.22376709 7.94117647,10.5882353 L7.94117647,10.5882353 L7.94117647,10.5882353 L5.26822328,11.2941176 L2.64705882,10.5882353 C2.64705882,9.22376709 3.75317885,8.11764706 5.11764706,8.11764706 Z"
                                                id="Group"
                                                stroke="#24C26E"
                                                strokeWidth="0.5"
                                                fill="#E7FFF2"
                                                strokeLinejoin="round"
                                                mask="url(#mask-2)"
                                            ></path>
                                            <path
                                                d="M4.76470588,7.76470588 L5.82352941,7.76470588 L5.82352941,8.64705882 C5.82352941,8.93944487 5.58650369,9.17647059 5.29411765,9.17647059 C5.0017316,9.17647059 4.76470588,8.93944487 4.76470588,8.64705882 L4.76470588,7.76470588 L4.76470588,7.76470588 Z"
                                                id="Group"
                                                stroke="#D48400"
                                                strokeWidth="0.5"
                                                fill="#E7FFF2"
                                                strokeLinejoin="round"
                                                mask="url(#mask-2)"
                                            ></path>
                                            <path
                                                d="M6.59729415,3.01473391 C6.97859172,3.23906608 7.17477594,3.81890278 7.18584681,4.75424399 L7.1853675,4.95248769 C7.51482824,5.01211966 7.76470588,5.30040821 7.76470588,5.64705882 C7.76470588,6.03690688 7.44867159,6.35294118 7.05882353,6.35294118 C6.81410975,7.61538698 6.1837665,8.1788535 5.1722386,8.04444744 C4.30729622,7.95341275 3.78389561,7.38836199 3.60203678,6.34929514 L3.52941176,6.35294118 C3.13956371,6.35294118 2.82352941,6.03690688 2.82352941,5.64705882 C2.82352941,5.25721076 3.13956371,4.94117647 3.52941176,4.94117647 C3.53482632,4.94117647 3.54022664,4.94123743 3.54561207,4.94135871 L3.55165486,4.816886 L3.55165486,4.816886 C3.53381821,4.14607285 3.62456498,3.64772235 3.82389517,3.32183449 C4.12289047,2.83300271 5.98135193,2.65235116 6.59729415,3.01473391 Z"
                                                id="Group"
                                                stroke="#24C26E"
                                                strokeWidth="0.5"
                                                fill="#E7FFF2"
                                                strokeLinejoin="round"
                                                mask="url(#mask-2)"
                                            ></path>
                                            <path
                                                d="M4.94117647,9.20170346 L5.1133818,9.60545556 C4.99857825,10.4959342 4.94117647,10.9411735 4.94117647,10.9411735 C4.94117647,10.9411735 5.20395847,10.9411735 5.72952247,10.9411735 L5.48735257,9.60545556 L5.64705882,9.20170346 C5.59366533,9.09557063 5.41257146,9.02663637 5.29411765,9.02681157 C5.17727735,9.02700849 5.05196145,9.0693631 4.94117647,9.20170346 Z"
                                                id="path-10"
                                                stroke="#24C26E"
                                                strokeWidth="0.5"
                                                fill="#E7FFF2"
                                                strokeLinejoin="round"
                                                mask="url(#mask-2)"
                                            ></path>
                                            <path
                                                d="M3.96175644,3.27834101 C4.6461888,3.93563977 5.647761,4.18698076 6.96647305,4.03236395 C7.06033856,4.49752791 7.10329743,4.78038555 7.09534964,4.88093688 C7.51977576,3.98920454 7.51977576,3.23992017 7.09534964,2.63308376 C6.65271487,2.11533697 5.91538552,1.89354957 4.88336158,1.96772158 C4.26895816,1.96772158 3.92029292,2.26210136 3.83736587,2.85086091 C3.38974253,2.84963294 3.16949672,3.16835249 3.17662844,3.80701958 C3.25505617,4.46655244 3.32970688,4.84326211 3.40058058,4.9371486 C3.45521237,4.74776624 3.51860378,4.62716247 3.5907548,4.57533728 C3.92082038,4.27411553 4.0444876,3.84178344 3.96175644,3.27834101 Z"
                                                id="path"
                                                stroke="#24C26E"
                                                strokeWidth="0.5"
                                                fill="#E7FFF2"
                                                strokeLinejoin="round"
                                                mask="url(#mask-2)"
                                            ></path>
                                            <path
                                                d="M4.749603,8.11764706 C4.41650712,8.30437096 4.22154141,8.49090861 4.16470588,8.67725999 C4.4358387,9.20711523 4.59228422,9.49116583 4.63404245,9.52941176 C4.91343428,9.20191 5.13345935,9.03438065 5.29411765,9.02682371 C4.98984507,8.74711346 4.80834019,8.44405458 4.749603,8.11764706 Z"
                                                id="path-3"
                                                stroke="#24C26E"
                                                strokeWidth="0.5"
                                                fill="#E7FFF2"
                                                strokeLinejoin="round"
                                                mask="url(#mask-2)"
                                            ></path>
                                            <path
                                                d="M5.87996206,8.11764706 C5.54686618,8.30437096 5.35190048,8.49090861 5.29506495,8.67725999 C5.56619777,9.20711523 5.72264329,9.49116583 5.76440151,9.52941176 C6.04316181,9.20191 6.26287111,9.03438065 6.42352941,9.02682371 C6.15122838,8.86498142 5.97003926,8.56192254 5.87996206,8.11764706 Z"
                                                id="path-"
                                                stroke="#24C26E"
                                                strokeWidth="0.5"
                                                fill="#E7FFF2"
                                                strokeLinejoin="round"
                                                mask="url(#mask-2)"
                                                transform="translate(5.859297, 8.823529) scale(-1, 1) translate(-5.859297, -8.823529) "
                                            ></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description 群主
     */

    static GroupOwner({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="12px"
                height="12px"
                viewBox="0 0 12 12"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                <title>{title}</title>
                <defs>
                    <circle id="path-1" cx="5.29411765" cy="5.29411765" r="5.29411765"></circle>
                </defs>
                <g id="chat" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Chat-Group-More" transform="translate(-838.000000, -477.000000)">
                        <g id="GroupOwner-20" transform="translate(800.000000, 87.000000)">
                            <g id="GroupOwner-2" transform="translate(0.000000, 272.000000)">
                                <g id="GroupOwner-6" transform="translate(38.000000, 118.000000)">
                                    <g id="webp-(1)" transform="translate(0.705882, 0.705882)">
                                        <mask id="mask-2" fill="white">
                                            <use xlinkHref="#path-1"></use>
                                        </mask>
                                        <circle
                                            stroke="#FFFFFF"
                                            strokeWidth="0.77"
                                            cx="5.29411765"
                                            cy="5.29411765"
                                            r="5.67911765"
                                            fill="#D48400"
                                        ></circle>
                                        <path
                                            d="M5.11764706,8.11764706 L5.47058824,8.11764706 C6.83505644,8.11764706 7.94117647,9.22376709 7.94117647,10.5882353 L7.94117647,10.5882353 L7.94117647,10.5882353 L5.26822328,11.2941176 L2.64705882,10.5882353 C2.64705882,9.22376709 3.75317885,8.11764706 5.11764706,8.11764706 Z"
                                            id="rectangle"
                                            stroke="#D48400"
                                            strokeWidth="0.5"
                                            fill="#FFF6E7"
                                            strokeLinejoin="round"
                                            mask="url(#mask-2)"
                                        ></path>
                                        <path
                                            d="M4.76470588,7.76470588 L5.82352941,7.76470588 L5.82352941,8.64705882 C5.82352941,8.93944487 5.58650369,9.17647059 5.29411765,9.17647059 C5.0017316,9.17647059 4.76470588,8.93944487 4.76470588,8.64705882 L4.76470588,7.76470588 L4.76470588,7.76470588 Z"
                                            id="rectangle"
                                            stroke="#D48400"
                                            strokeWidth="0.5"
                                            fill="#FFF6E7"
                                            strokeLinejoin="round"
                                            mask="url(#mask-2)"
                                        ></path>
                                        <path
                                            d="M6.59729415,3.01473391 C6.97859172,3.23906608 7.17477594,3.81890278 7.18584681,4.75424399 L7.1853675,4.95248769 C7.51482824,5.01211966 7.76470588,5.30040821 7.76470588,5.64705882 C7.76470588,6.03690688 7.44867159,6.35294118 7.05882353,6.35294118 C6.81410975,7.61538698 6.1837665,8.1788535 5.1722386,8.04444744 C4.30729622,7.95341275 3.78389561,7.38836199 3.60203678,6.34929514 L3.52941176,6.35294118 C3.13956371,6.35294118 2.82352941,6.03690688 2.82352941,5.64705882 C2.82352941,5.25721076 3.13956371,4.94117647 3.52941176,4.94117647 C3.53482632,4.94117647 3.54022664,4.94123743 3.54561207,4.94135871 L3.55165486,4.816886 L3.55165486,4.816886 C3.53381821,4.14607285 3.62456498,3.64772235 3.82389517,3.32183449 C4.12289047,2.83300271 5.98135193,2.65235116 6.59729415,3.01473391 Z"
                                            id="ShapeCombination"
                                            stroke="#D48400"
                                            strokeWidth="0.5"
                                            fill="#FFF6E7"
                                            strokeLinejoin="round"
                                            mask="url(#mask-2)"
                                        ></path>
                                        <path
                                            d="M4.94117647,9.20170346 L5.1133818,9.60545556 C4.99857825,10.4959342 4.94117647,10.9411735 4.94117647,10.9411735 C4.94117647,10.9411735 5.20395847,10.9411735 5.72952247,10.9411735 L5.48735257,9.60545556 L5.64705882,9.20170346 C5.59366533,9.09557063 5.41257146,9.02663637 5.29411765,9.02681157 C5.17727735,9.02700849 5.05196145,9.0693631 4.94117647,9.20170346 Z"
                                            id="path-10"
                                            stroke="#D48400"
                                            strokeWidth="0.5"
                                            fill="#FFF6E7"
                                            strokeLinejoin="round"
                                            mask="url(#mask-2)"
                                        ></path>
                                        <path
                                            d="M3.96175644,3.27834101 C4.6461888,3.93563977 5.647761,4.18698076 6.96647305,4.03236395 C7.06033856,4.49752791 7.10329743,4.78038555 7.09534964,4.88093688 C7.51977576,3.98920454 7.51977576,3.23992017 7.09534964,2.63308376 C6.65271487,2.11533697 5.91538552,1.89354957 4.88336158,1.96772158 C4.26895816,1.96772158 3.92029292,2.26210136 3.83736587,2.85086091 C3.38974253,2.84963294 3.16949672,3.16835249 3.17662844,3.80701958 C3.25505617,4.46655244 3.32970688,4.84326211 3.40058058,4.9371486 C3.45521237,4.74776624 3.51860378,4.62716247 3.5907548,4.57533728 C3.92082038,4.27411553 4.0444876,3.84178344 3.96175644,3.27834101 Z"
                                            id="path"
                                            stroke="#D48400"
                                            strokeWidth="0.5"
                                            fill="#FFF6E7"
                                            strokeLinejoin="round"
                                            mask="url(#mask-2)"
                                        ></path>
                                        <path
                                            d="M4.749603,8.11764706 C4.41650712,8.30437096 4.22154141,8.49090861 4.16470588,8.67725999 C4.4358387,9.20711523 4.59228422,9.49116583 4.63404245,9.52941176 C4.91343428,9.20191 5.13345935,9.03438065 5.29411765,9.02682371 C4.98984507,8.74711346 4.80834019,8.44405458 4.749603,8.11764706 Z"
                                            id="path-3"
                                            stroke="#D48400"
                                            strokeWidth="0.5"
                                            fill="#FFF6E7"
                                            strokeLinejoin="round"
                                            mask="url(#mask-2)"
                                        ></path>
                                        <path
                                            d="M5.87996206,8.11764706 C5.54686618,8.30437096 5.35190048,8.49090861 5.29506495,8.67725999 C5.56619777,9.20711523 5.72264329,9.49116583 5.76440151,9.52941176 C6.04316181,9.20191 6.26287111,9.03438065 6.42352941,9.02682371 C6.15122838,8.86498142 5.97003926,8.56192254 5.87996206,8.11764706 Z"
                                            id="path-3-1"
                                            stroke="#D48400"
                                            strokeWidth="0.5"
                                            fill="#FFF6E7"
                                            strokeLinejoin="round"
                                            mask="url(#mask-2)"
                                            transform="translate(5.859297, 8.823529) scale(-1, 1) translate(-5.859297, -8.823529) "
                                        ></path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    /**
     * @description 群管理
     */
    static ManageGroup({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                <title>{title}</title>
                <g id="chat" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Chat-Group-More" transform="translate(-816.000000, -797.000000)">
                        <g id="ManageGroup-20" transform="translate(800.000000, 87.000000)">
                            <g id="ManageGroup-24" transform="translate(0.000000, 608.000000)">
                                <g id="ManageGroup-22-3" transform="translate(0.000000, 88.000000)">
                                    <g
                                        id="ManageGroup-11"
                                        transform="translate(16.000000, 14.000000)"
                                    >
                                        <rect
                                            id="rectangle"
                                            fill="#D8D8D8"
                                            opacity="0"
                                            x="0"
                                            y="0"
                                            width="16"
                                            height="16"
                                        ></rect>
                                        <path
                                            d="M7.93333333,0.666666667 C9.70064453,0.666666667 11.1333333,2.09935547 11.1333333,3.86666667 C11.1333333,5.63397787 9.70064453,7.06666667 7.93333333,7.06666667 C6.16602213,7.06666667 4.73333333,5.63397787 4.73333333,3.86666667 C4.73333333,2.09935547 6.16602213,0.666666667 7.93333333,0.666666667 Z M7.93333333,2.26666667 C7.04967773,2.26666667 6.33333333,2.98301107 6.33333333,3.86666667 C6.33333333,4.75032227 7.04967773,5.46666667 7.93333333,5.46666667 C8.81698893,5.46666667 9.53333333,4.75032227 9.53333333,3.86666667 C9.53333333,2.98301107 8.81698893,2.26666667 7.93333333,2.26666667 Z M7.26576062,8.44762389 C7.68073557,8.45645857 8.02472181,8.78442734 8.04679317,9.20559412 C8.06991556,9.64681647 7.73097857,10.0232422 7.28975622,10.0463646 C6.13351578,10.1069577 4.75333841,10.4488588 3.15584862,11.0781188 C2.4822911,11.3434389 2.03953125,11.9937167 2.03953125,12.7176471 L2.03953125,12.7176471 L2.03953125,13.6 L8.8,13.6 L8.85970494,13.6021943 C9.27364888,13.632734 9.6,13.9782553 9.6,14.4 C9.6,14.8418278 9.2418278,15.2 8.8,15.2 L8.8,15.2 L2.03953125,15.2 L1.95967511,15.1980419 C1.11311864,15.1564316 0.43953125,14.4568782 0.43953125,13.6 L0.43953125,13.6 L0.43953125,12.7176471 L0.441478089,12.6028809 C0.486803211,11.268035 1.32000877,10.0816151 2.56945108,9.58944899 C4.3160821,8.90144144 5.85939711,8.51912747 7.20602266,8.44855717 L7.20602266,8.44855717 Z M12.8,7.49760677 L15.1176915,8.83572656 C15.3652123,8.97863279 15.5176915,9.24273441 15.5176915,9.52854688 L15.5176915,12.2047865 C15.5176915,12.4905989 15.3652123,12.7547005 15.1176915,12.8976068 L12.8,14.2357266 C12.5524791,14.3786328 12.2475209,14.3786328 12,14.2357266 L9.68230855,12.8976068 C9.43478768,12.7547005 9.28230855,12.4905989 9.28230855,12.2047865 L9.28230855,9.52854688 C9.28230855,9.24273441 9.43478768,8.97863279 9.68230855,8.83572656 L12,7.49760677 C12.2475209,7.35470054 12.5524791,7.35470054 12.8,7.49760677 Z M12.4,9.114 L10.882,9.9904 L10.882,11.7424 L12.4,12.6192 L13.9176,11.7424 L13.9176,9.9904 L12.4,9.114 Z"
                                            id="Combined-Shape"
                                            fill="#0D1324"
                                        ></path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    // endregion:router

    // del
    static DelIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg style={bodyStyle} width="16px" height="16px" viewBox="0 0 16 16">
                <title>{title}</title>

                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="Contact-New-friend-friend"
                        transform="translate(-688.000000, -264.000000)"
                    >
                        <g transform="translate(344.000000, 0.000000)">
                            <g transform="translate(188.000000, 254.000000)">
                                <g transform="translate(140.000000, 0.000000)">
                                    <g id="1" transform="translate(16.000000, 10.000000)">
                                        <rect
                                            fill="#D8D8D8"
                                            opacity="0"
                                            x="0"
                                            y="0"
                                            width="16"
                                            height="16"
                                        />
                                        <g
                                            transform="translate(0.400000, 0.800000)"
                                            fill="currentColor"
                                        >
                                            <path d="M9.6,0 C10.4836556,0 11.2,0.7163444 11.2,1.6 L11.2,2.8 L14.4,2.8 C14.8418278,2.8 15.2,3.1581722 15.2,3.6 C15.2,4.0418278 14.8418278,4.4 14.4,4.4 L13.154,4.4 L13.1890705,11.9890697 C13.1949193,13.2844151 12.1735078,14.3447478 10.8899418,14.39791 L10.7890447,14.4 L4.41095527,14.4 C3.1155965,14.4 2.05992657,13.37377 2.01261066,12.0899753 L2.01098016,11.9890697 L2.0456,4.4 L0.8,4.4 C0.3581722,4.4 0,4.0418278 0,3.6 C0,3.1581722 0.3581722,2.8 0.8,2.8 L4,2.8 L4,1.6 C4,0.7163444 4.7163444,0 5.6,0 L9.6,0 Z M11.554,4.4 L3.6456,4.4 L3.61095527,12 C3.61095527,12.4217447 3.93730639,12.767266 4.35125034,12.7978057 L4.41095527,12.8 L10.7926881,12.8 C11.2144285,12.798071 11.5584599,12.4701496 11.5871141,12.0560709 L11.5890364,11.9963566 L11.554,4.4 Z M6,6 C6.4418278,6 6.8,6.3581722 6.8,6.8 L6.8,10 C6.8,10.4418278 6.4418278,10.8 6,10.8 C5.5581722,10.8 5.2,10.4418278 5.2,10 L5.2,6.8 C5.2,6.3581722 5.5581722,6 6,6 Z M9.2,6 C9.6418278,6 10,6.3581722 10,6.8 L10,10 C10,10.4418278 9.6418278,10.8 9.2,10.8 C8.7581722,10.8 8.4,10.4418278 8.4,10 L8.4,6.8 C8.4,6.3581722 8.7581722,6 9.2,6 Z M9.6,1.6 L5.6,1.6 L5.6,2.8 L9.6,2.8 L9.6,1.6 Z" />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    // video start
    static VideoStart({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="40px"
                height="40px"
                viewBox="0 0 40 40"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={bodyStyle}
            >
                <title>{title}</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Chat-Select" transform="translate(-526.000000, -355.000000)">
                        <g transform="translate(344.000000, 0.000000)">
                            <g transform="translate(46.000000, 231.000000)">
                                <g transform="translate(36.000000, 76.000000)">
                                    <g transform="translate(100.000000, 48.000000)">
                                        <circle
                                            fillOpacity="0.3"
                                            fill="#000000"
                                            cx="20"
                                            cy="20"
                                            r="20"
                                        />
                                        <path
                                            d="M24.0641006,16.4961509 L28.3270664,22.8905996 C28.9397713,23.809657 28.6914236,25.0513957 27.7723662,25.6641006 C27.4438312,25.8831239 27.0578158,26 26.6629658,26 L18.1370342,26 C17.0324647,26 16.1370342,25.1045695 16.1370342,24 C16.1370342,23.60515 16.2539102,23.2191346 16.4729336,22.8905996 L20.7358994,16.4961509 C21.3486043,15.5770935 22.590343,15.3287458 23.5094004,15.9414507 C23.729105,16.0879204 23.9176309,16.2764463 24.0641006,16.4961509 Z"
                                            fill="#FFFFFF"
                                            transform="translate(22.400000, 20.000000) rotate(-270.000000) translate(-22.400000, -20.000000) "
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static LoadingChrysanthemum({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="12px" height="12px" viewBox="0 0 12 12">
                <title>{title}</title>
                <g
                    id="Loading_Chrysanthemum-3"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="Loading_Chrysanthemum-g"
                        transform="translate(-409.000000, -450.000000)"
                        fillRule="nonzero"
                    >
                        <g
                            id="Loading_Chrysanthemum_g-16"
                            transform="translate(344.000000, 0.000000)"
                        >
                            <g
                                id="Loading_Chrysanthemum-9dup-4"
                                transform="translate(16.000000, 382.000000)"
                            >
                                <g
                                    id="Loading_Chrysanthemum-10"
                                    transform="translate(31.000000, 20.000000)"
                                >
                                    <g
                                        id="Loading_Chrysanthemum-loading"
                                        transform="translate(18.000000, 48.000000)"
                                    >
                                        <rect
                                            id="Loading_Chrysanthemum-rect"
                                            fill="#000000"
                                            opacity="0"
                                            x="0"
                                            y="0"
                                            width="12"
                                            height="12"
                                        />
                                        <g id="Loading_Chrysanthemum-g-11" fill="#5E6A81">
                                            <path
                                                d="M6,2.5 C5.7,2.5 5.5,2.29999999 5.5,2 L5.5,0.5 C5.5,0.200000004 5.7,3.06421555e-14 6,3.06421555e-14 C6.3,3.06421555e-14 6.5,0.200000004 6.5,0.5 L6.5,2 C6.5,2.3 6.3,2.5 6,2.5 Z"
                                                id="Loading_Chrysanthemum_p1"
                                            />
                                            <path
                                                d="M6,12 C5.7,12 5.5,11.8 5.5,11.5 L5.5,9.99999999 C5.5,9.7 5.7,9.49999999 6,9.49999999 C6.3,9.49999999 6.5,9.7 6.5,9.99999999 L6.5,11.5 C6.5,11.8 6.3,12 6,12 Z"
                                                id="Loading_Chrysanthemum_p2"
                                                opacity="0.3"
                                            />
                                            <path
                                                d="M2,6.5 L0.5,6.5 C0.200000004,6.5 2.11830553e-13,6.3 2.11830553e-13,6 C2.11830553e-13,5.7 0.200000004,5.5 0.5,5.5 L2,5.5 C2.3,5.5 2.5,5.7 2.5,6 C2.5,6.3 2.3,6.5 2,6.5 Z"
                                                id="Loading_Chrysanthemum_p3"
                                                opacity="0.7"
                                            />
                                            <path
                                                d="M11.5,6.5 L9.99999999,6.5 C9.7,6.5 9.49999999,6.3 9.49999999,6 C9.49999999,5.7 9.7,5.5 9.99999999,5.5 L11.5,5.5 C11.8,5.5 12,5.7 12,6 C12,6.3 11.8,6.5 11.5,6.5 Z"
                                                id="Loading_Chrysanthemum_p4"
                                                opacity="0.3"
                                            />
                                            <path
                                                d="M9.45,4.5 C9.3,4.5 9.1,4.4 9,4.25 C8.85,4.00000001 8.95,3.70000001 9.2,3.55000001 L10.5,2.8 C10.75,2.65 11.05,2.74999999 11.2,3 C11.35,3.25 11.25,3.55 11,3.7 L9.7,4.45 C9.65,4.5 9.55,4.5 9.45,4.5 Z"
                                                id="Loading_Chrysanthemum_p5"
                                                opacity="0.3"
                                            />
                                            <path
                                                d="M1.25,9.25 C1.1,9.25 0.9,9.15 0.800000004,9 C0.650000004,8.75 0.75,8.45 1.00000001,8.3 L2.3,7.55 C2.55,7.4 2.85,7.5 3,7.75000001 C3.15,8 3.05,8.3 2.8,8.45 L1.5,9.2 C1.4,9.25 1.3,9.25 1.25,9.25 Z"
                                                id="Loading_Chrysanthemum_p6"
                                                opacity="0.5"
                                            />
                                            <path
                                                d="M8,3.05 C7.90000001,3.05 7.85,3.05 7.75000001,3 C7.50000001,2.85 7.45000001,2.55 7.55,2.3 L8.3,0.999999996 C8.45,0.75 8.75,0.699999996 9,0.799999992 C9.25,0.949999992 9.3,1.24999999 9.2,1.49999999 L8.45,2.79999998 C8.35,2.95 8.15,3.05 8,3.05 Z"
                                                id="Loading_Chrysanthemum_p7"
                                                opacity="0.3"
                                            />
                                            <path
                                                d="M3.25,11.25 C3.15,11.25 3.1,11.25 3,11.2 C2.75,11.05 2.7,10.75 2.8,10.5 L3.55,9.2 C3.7,9 4,8.9 4.25,9.05 C4.5,9.2 4.55,9.5 4.45000001,9.75 L3.7,11 C3.6,11.15 3.4,11.25 3.25,11.25 Z"
                                                id="Loading_Chrysanthemum_p8"
                                                opacity="0.4"
                                            />
                                            <path
                                                d="M2.55,4.5 C2.45,4.5 2.35,4.5 2.3,4.45 L0.999999996,3.7 C0.75,3.55 0.650000004,3.25 0.800000004,3 C0.950000004,2.75 1.25,2.7 1.5,2.8 L2.8,3.55 C3.05,3.7 3.1,4 2.95,4.25 C2.9,4.4 2.7,4.5 2.55,4.5 Z"
                                                id="Loading_Chrysanthemum_p9"
                                                opacity="0.8"
                                            />
                                            <path
                                                d="M10.75,9.25 C10.65,9.25 10.6,9.25 10.5,9.19999999 L9.2,8.44999999 C8.95000001,8.29999999 8.9,7.99999999 9,7.75 C9.15,7.5 9.45,7.45 9.7,7.54999999 L11,8.29999999 C11.25,8.44999999 11.3,8.74999999 11.2,8.99999999 C11.1,9.15 10.95,9.25 10.75,9.25 Z"
                                                id="Loading_Chrysanthemum_p10"
                                                opacity="0.3"
                                            />
                                            <path
                                                d="M4,3.05 C3.85,3.05 3.64999999,2.95000001 3.55,2.80000001 L2.8,1.5 C2.7,1.25 2.75,0.950000004 3,0.800000004 C3.25,0.650000004 3.55,0.75 3.7,0.999999996 L4.45,2.29999999 C4.55,2.55 4.5,2.85 4.25,2.95 C4.15,3 4.1,3.05 4,3.05 Z"
                                                id="Loading_Chrysanthemum_p11"
                                                opacity="0.9"
                                            />
                                            <path
                                                d="M8.75,11.25 C8.6,11.25 8.4,11.15 8.3,11 L7.55,9.70000001 C7.4,9.45000001 7.5,9.15000001 7.75000001,9.00000001 C8,8.85000001 8.3,8.95000001 8.45,9.20000002 L9.2,10.5 C9.35,10.75 9.25000001,11.05 9,11.2 C8.9,11.25 8.85,11.25 8.75,11.25 Z"
                                                id="Loading_Chrysanthemum_p12"
                                                opacity="0.3"
                                            />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static FailFilled({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="12px" height="12px" viewBox="0 0 12 12">
                <title>{title}</title>
                <g
                    id="FailFilled-page-3"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g id="Chat-FailFilled-dep" transform="translate(-408.000000, -542.000000)">
                        <g id="FailFilled-16" transform="translate(344.000000, 0.000000)">
                            <g id="FailFilled-9dup-3" transform="translate(16.000000, 439.000000)">
                                <g id="FailFilled-10" transform="translate(31.000000, 20.000000)">
                                    <g
                                        id="FailFilled-10"
                                        transform="translate(17.000000, 83.000000)"
                                    >
                                        <circle
                                            id="FailFilled-cir"
                                            fill="#A2A8C3"
                                            cx="6"
                                            cy="6"
                                            r="6"
                                        />
                                        <rect
                                            id="FailFilled-rect"
                                            fill="#FFFFFF"
                                            x="5.5"
                                            y="2.5"
                                            width="1"
                                            height="4"
                                            rx="0.5"
                                        />
                                        <circle
                                            id="FailFilled-cir-2"
                                            fill="#FFFFFF"
                                            cx="6"
                                            cy="8.25"
                                            r="1"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static CloseCircleIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="14px" height="14px" viewBox="0 0 14 14">
                <title>{title}</title>
                <g
                    id="CloseCircleIcon-3"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="contact--Add-CloseCircleIcon"
                        transform="translate(-681.000000, -213.000000)"
                    >
                        <g id="CloseCircleIcon-18" transform="translate(251.000000, 120.000000)">
                            <g id="CloseCircleIcon-6" transform="translate(20.000000, 85.000000)">
                                <g
                                    id="CloseCircleIcon-22"
                                    transform="translate(410.000000, 8.000000)"
                                >
                                    <rect
                                        id="CloseCircleIcon-rect"
                                        fill="var(--color-bg-primary)"
                                        x="0"
                                        y="0"
                                        width="14"
                                        height="14"
                                        rx="7"
                                    />
                                    <path
                                        d="M6.94974747,3.44974747 C7.22588984,3.44974747 7.44974747,3.67360509 7.44974747,3.94974747 L7.44974747,6.44974747 L9.94974747,6.44974747 C10.2258898,6.44974747 10.4497475,6.67360509 10.4497475,6.94974747 C10.4497475,7.22588984 10.2258898,7.44974747 9.94974747,7.44974747 L7.44974747,7.44974747 L7.44974747,9.94974747 C7.44974747,10.2258898 7.22588984,10.4497475 6.94974747,10.4497475 C6.67360509,10.4497475 6.44974747,10.2258898 6.44974747,9.94974747 L6.44974747,7.44974747 L3.94974747,7.44974747 C3.67360509,7.44974747 3.44974747,7.22588984 3.44974747,6.94974747 C3.44974747,6.67360509 3.67360509,6.44974747 3.94974747,6.44974747 L6.44974747,6.44974747 L6.44974747,3.94974747 C6.44974747,3.67360509 6.67360509,3.44974747 6.94974747,3.44974747 Z"
                                        id="CloseCircleIcon-shape"
                                        fill="var(--spec-searchNewFriend-clear-icon)"
                                        transform="translate(6.949747, 6.949747) rotate(-45.000000) translate(-6.949747, -6.949747) "
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static MoreAction({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" style={bodyStyle}>
                <title>{title}</title>
                <g id="MoreAction-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="MoreAction-Chat-Enter" transform="translate(-1049.000000, -51.000000)">
                        <g id="MoreAction-16" transform="translate(381.000000, 31.000000)">
                            <g id="MoreAction-30" transform="translate(548.000000, 20.000000)">
                                <g id="MoreAction-3" transform="translate(120.000000, 0.000000)">
                                    <rect
                                        id="MoreAction-rect"
                                        fill="#000000"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="16"
                                        height="16"
                                    />
                                    <path
                                        d="M1.6,6.4 C2.4836556,6.4 3.2,7.1163444 3.2,8 C3.2,8.8836556 2.4836556,9.6 1.6,9.6 C0.7163444,9.6 0,8.8836556 0,8 C0,7.1163444 0.7163444,6.4 1.6,6.4 Z M8,6.4 C8.8836556,6.4 9.6,7.1163444 9.6,8 C9.6,8.8836556 8.8836556,9.6 8,9.6 C7.1163444,9.6 6.4,8.8836556 6.4,8 C6.4,7.1163444 7.1163444,6.4 8,6.4 Z M14.4,6.4 C15.2836556,6.4 16,7.1163444 16,8 C16,8.8836556 15.2836556,9.6 14.4,9.6 C13.5163444,9.6 12.8,8.8836556 12.8,8 C12.8,7.1163444 13.5163444,6.4 14.4,6.4 Z"
                                        id="MoreAction-shape"
                                        fill="currentColor"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static AttachmentIcon({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="20px" height="20px" viewBox="0 0 20 20" style={bodyStyle}>
                <title>{title}</title>
                <g
                    id="AttachmentIcon-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                >
                    <g
                        id="Chat-Enter-AttachmentIcon"
                        transform="translate(-404.000000, -680.000000)"
                    >
                        <g id="AttachmentIcon-27" transform="translate(380.000000, 590.000000)">
                            <g
                                id="AttachmentIcon-mockplus-"
                                transform="translate(24.000000, 90.000000)"
                            >
                                <g
                                    id="chat/tab/icon/AttachmentIcon"
                                    transform="translate(-1.000000, 0.000000)"
                                >
                                    <g
                                        id="AttachmentIcon-13"
                                        transform="translate(0.583333, 0.000000)"
                                    >
                                        <rect
                                            id="AttachmentIcon-rect"
                                            fill="#D8D8D8"
                                            opacity="0"
                                            x="0.416666667"
                                            y="0"
                                            width="20"
                                            height="20"
                                        />
                                        <path
                                            d="M10.9448058,16.9488505 C8.63166662,19.3503832 4.88132695,19.3503832 2.56818774,16.9488505 C0.285484573,14.5789169 0.255449004,10.7558702 2.47808104,8.34769677 L2.56818774,8.25213123 L5.31225229,5.40320596 C5.63130597,5.07196007 6.1485942,5.07196007 6.46764789,5.40320596 C6.77219913,5.71939522 6.78604237,6.22310953 6.5091776,6.55634653 L6.46764789,6.60275344 L3.72358334,9.45167871 C2.0485515,11.1907196 2.0485515,14.0102621 3.72358334,15.749303 C5.37115565,17.459835 8.02561666,17.4878766 9.70620171,15.8334275 L9.78941023,15.749303 L17.5883305,7.65235749 C18.625255,6.57580835 18.625255,4.83037732 17.5883305,3.75382817 C16.5739479,2.70068227 14.9430099,2.6777878 13.9018205,3.68514475 L13.8332948,3.75382817 L6.32322344,11.5508868 C5.92440633,11.9649442 5.92440633,12.6362638 6.32322344,13.0503212 C6.70608786,13.4478162 7.31731848,13.463716 7.71845219,13.0980206 L7.76746793,13.0503212 L14.844266,5.70309283 C15.1633197,5.37184694 15.6806079,5.37184694 15.9996616,5.70309283 C16.3042128,6.01928209 16.3180561,6.5229964 16.0411913,6.8562334 L15.9996616,6.90264031 L8.92286353,14.2498686 C7.88593906,15.3264178 6.20475231,15.3264178 5.16782784,14.2498686 C4.1534452,13.1967227 4.1313934,11.5034607 5.10167245,10.4224836 L5.16782784,10.3513393 L12.6778992,2.55428069 C14.3529311,0.815239769 17.0686943,0.815239769 18.7437261,2.55428069 C20.3912984,4.26481275 20.4183078,7.02071041 18.8247543,8.76551675 L18.7437261,8.85190497 L10.9448058,16.9488505 Z"
                                            id="AttachmentIcon-path"
                                            fill="currentColor"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static ContactsAdd({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" style={bodyStyle}>
                <title>{title}</title>
                <g id="ContactsAdd-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="ContactsAdd-Chat--Forword"
                        transform="translate(-620.000000, -275.000000)"
                        fill="currentColor"
                    >
                        <g
                            id="ContactsAdd-g-23-dup-2"
                            transform="translate(589.000000, 120.000000)"
                        >
                            <g id="ContactsAdd-g-31" transform="translate(0.000000, 141.000000)">
                                <g id="ContactsAdd-g-1" transform="translate(23.000000, 0.000000)">
                                    <g
                                        id="ContactsAdd-g-3"
                                        transform="translate(0.000000, 6.000000)"
                                    >
                                        <g
                                            id="ContactsAdd-g-11"
                                            transform="translate(8.000000, 8.000000)"
                                        >
                                            <path
                                                d="M6.99434837,8.72735852 C7.371629,8.73378964 7.68560576,9.0306138 7.70729468,9.41340413 C7.7300164,9.81442258 7.42334632,10.1579319 7.02232787,10.1806536 C5.99911086,10.2386291 4.78003558,10.5594916 3.37136764,11.14942 C2.67256766,11.4420674 2.21775568,12.1256202 2.21775568,12.8832244 L2.21775568,12.8832244 L2.21775568,13.8181818 L8.39957386,13.8181818 L8.45385108,13.8201766 C8.83016376,13.84794 9.12684659,14.1620503 9.12684659,14.5454545 C9.12684659,14.9471162 8.8012355,15.2727273 8.39957386,15.2727273 L8.39957386,15.2727273 L2.21775568,15.2727273 L2.14515919,15.2709472 C1.3755624,15.2331196 0.763210227,14.597162 0.763210227,13.8181818 L0.763210227,13.8181818 L0.763210227,12.8832244 L0.764879491,12.777414 C0.805970611,11.4760382 1.60258246,10.3132163 2.80950623,9.80777389 C4.35967895,9.15858554 5.73443653,8.79674718 6.94004523,8.72843733 L6.94004523,8.72843733 Z M12.3636364,9.09090909 C12.765298,9.09090909 13.0909091,9.41652018 13.0909091,9.81818182 L13.0902102,11.2720606 L14.5454545,11.2727273 C14.9471162,11.2727273 15.2727273,11.5983384 15.2727273,12 C15.2727273,12.4016616 14.9471162,12.7272727 14.5454545,12.7272727 L13.0902102,12.7270606 L13.0909091,14.1818182 C13.0909091,14.5834798 12.765298,14.9090909 12.3636364,14.9090909 C11.9619747,14.9090909 11.6363636,14.5834798 11.6363636,14.1818182 L11.6362102,12.7270606 L10.1818182,12.7272727 C9.78015655,12.7272727 9.45454545,12.4016616 9.45454545,12 C9.45454545,11.5983384 9.78015655,11.2727273 10.1818182,11.2727273 L11.6362102,11.2720606 L11.6363636,9.81818182 C11.6363636,9.41652018 11.9619747,9.09090909 12.3636364,9.09090909 Z M8.3030303,0.606060606 C10.1105077,0.606060606 11.5757576,2.07131052 11.5757576,3.87878788 C11.5757576,5.68626524 10.1105077,7.15151515 8.3030303,7.15151515 C6.49555294,7.15151515 5.03030303,5.68626524 5.03030303,3.87878788 C5.03030303,2.07131052 6.49555294,0.606060606 8.3030303,0.606060606 Z M8.3030303,2.06060606 C7.29887621,2.06060606 6.48484848,2.87463379 6.48484848,3.87878788 C6.48484848,4.88294197 7.29887621,5.6969697 8.3030303,5.6969697 C9.30718439,5.6969697 10.1212121,4.88294197 10.1212121,3.87878788 C10.1212121,2.87463379 9.30718439,2.06060606 8.3030303,2.06060606 Z"
                                                id="ContactsAdd-shape"
                                            />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
    static AtAll({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="12px" height="12px" viewBox="0 0 12 12" style={bodyStyle}>
                <title>{title}</title>
                <g id="chat" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="Chat-@-Select"
                        transform="translate(-410.000000, -484.000000)"
                        fill="currentColor"
                    >
                        <g id="AtAll-21" transform="translate(380.000000, 464.000000)">
                            <g id="AtAll-4" transform="translate(24.000000, 8.000000)">
                                <g id="AtAll-4" transform="translate(0.000000, 6.000000)">
                                    <g id="-mockplus-" transform="translate(6.000000, 6.000000)">
                                        <g
                                            id="liebiao/icon"
                                            transform="translate(0.000000, -1.000000)"
                                        >
                                            <g
                                                id="AtAll-11"
                                                transform="translate(0.000000, 0.700000)"
                                            >
                                                <path
                                                    d="M7.63477533,6.3 C8.60700993,6.3 9.5791925,6.52373176 10.551323,6.97119529 C11.319304,7.32468604 11.811329,8.0928061 11.811329,8.93823529 L11.811329,9.6 C11.811329,9.93137085 11.5426998,10.2 11.211329,10.2 L9.3,10.199 L9.3,10.5 C9.3,10.8313708 9.03137085,11.1 8.7,11.1 L0.9,11.1 C0.56862915,11.1 0.3,10.8313708 0.3,10.5 L0.3,9.74117647 C0.3,8.83501649 0.827902069,8.01189865 1.65146954,7.63392705 C2.66147705,7.17039418 3.66409343,6.92642951 4.65931866,6.90203304 L4.82512109,6.9 L4.86,6.9 L4.97941996,6.84855106 C5.81540273,6.50554902 6.64594297,6.32340311 7.47104067,6.30211332 L7.63477533,6.3 Z M4.82512109,8.1 C3.95347116,8.1 3.06534318,8.30538523 2.15200579,8.72455232 C1.77360185,8.89821865 1.52457885,9.26667582 1.50172043,9.6790153 L1.5,9.74117647 L1.5,9.9 L8.1,9.9 L8.1,9.74117647 C8.1,9.31880755 7.86610764,8.93314995 7.49598959,8.73684348 L7.4394624,8.70883672 C6.55437236,8.30035495 5.68607592,8.1 4.82512109,8.1 Z M7.94231057,7.61927547 C8.55078935,7.90009819 8.99839944,8.42218428 9.19280138,9.0412195 L9.17905857,8.99887954 L9.17905857,8.99887954 L10.611329,9 L10.611329,8.93823529 C10.611329,8.58115233 10.4144513,8.25500543 10.1025998,8.08766146 L10.049574,8.06126312 C9.24310459,7.69005203 8.45283473,7.50545941 7.6697733,7.50011934 C7.7566661,7.53551163 7.84948856,7.57643678 7.94231057,7.61927547 Z M4.95,1.5 C5.5643504,1.5 6.12119275,1.74622127 6.52722892,2.14536569 L6.49975907,2.11881409 L6.49975907,2.11881409 C6.8016347,1.92885075 7.15747147,1.81411159 7.53913405,1.80121771 L7.61132897,1.8 C8.77112695,1.8 9.71132897,2.74020203 9.71132897,3.9 C9.71132897,5.03563552 8.80989396,5.9607296 7.6835239,5.99878229 L7.61132897,6 C7.1179719,6 6.66435067,5.82987067 6.3059323,5.54507903 L6.32335821,5.53238116 C5.96129605,5.81176932 5.51174154,5.98329845 5.02281932,5.99884393 L4.95,6 C3.70735931,6 2.7,4.99264069 2.7,3.75 C2.7,2.53172482 3.66824232,1.53959474 4.87718068,1.50115607 L4.95,1.5 Z M4.95,2.7 C4.37010101,2.7 3.9,3.17010101 3.9,3.75 C3.9,4.32989899 4.37010101,4.8 4.95,4.8 C5.52989899,4.8 6,4.32989899 6,3.75 C6,3.17010101 5.52989899,2.7 4.95,2.7 Z M7.61132897,3 C7.4293914,3 7.26006285,3.05398562 7.11848839,3.14681176 C7.17161948,3.33947738 7.2,3.54142438 7.2,3.75 C7.2,4.05532549 7.13918378,4.34644659 7.02900421,4.61191045 L7.0375526,4.59101681 L7.0375526,4.59101681 C7.19170571,4.72182115 7.39238752,4.8 7.61132897,4.8 C8.10838525,4.8 8.51132897,4.39705627 8.51132897,3.9 C8.51132897,3.40294373 8.10838525,3 7.61132897,3 Z"
                                                    id="Combined-Shape"
                                                ></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static PolygonNotice({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" style={bodyStyle} height="16px" viewBox="0 0 16 16">
                <title>{title}</title>
                <g id="Notice-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Notice-Chat-Group-More" transform="translate(-817.000000, -604.000000)">
                        <g id="Notice--20" transform="translate(800.000000, 87.000000)">
                            <g id="Notice-24" transform="translate(1.000000, 509.000000)">
                                <g id="Notice-mockplus-" transform="translate(16.000000, 8.000000)">
                                    <g
                                        id="Notice-chat/icon/eyes"
                                        transform="translate(0.000000, -1.000000)"
                                    >
                                        <g id="Notice-g" transform="translate(0.000000, 0.600000)">
                                            <g
                                                id="Notice-3"
                                                transform="translate(0.000000, 0.336000)"
                                            >
                                                <rect
                                                    id="Notice-rect"
                                                    fill="#D8D8D8"
                                                    opacity="0"
                                                    x="0"
                                                    y="0.064"
                                                    width="16"
                                                    height="16"
                                                />
                                                <g
                                                    id="Notice-g-2"
                                                    transform="translate(0.800000, 0.911522)"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M10.9665329,0.768013232 C11.1192302,1.01874767 11.2,1.30666031 11.2,1.60023179 L11.2,4.088 L11.2695866,4.09087672 C12.9524138,4.18501509 14.288,5.57944165 14.288,7.28581108 C14.288,9.01541246 12.9157986,10.424519 11.2006618,10.4838649 L11.2,12.7047237 C11.2,13.5883793 10.4836556,14.3047237 9.6,14.3047237 C9.30642852,14.3047237 9.01851588,14.2239539 8.76778144,14.0712566 L3.317,10.752 L1.6,10.7524778 C0.7163444,10.7524778 0,10.0361334 0,9.15247775 L0,5.15247775 C0,4.26882215 0.7163444,3.55247775 1.6,3.55247775 L3.317,3.552 L8.76778144,0.233698853 C9.52249674,-0.225922766 10.5069113,0.01329793 10.9665329,0.768013232 Z M9.6,1.60023179 L4.8,4.52327775 L4.8,9.78127775 L9.6,12.7047237 L9.6,1.60023179 Z M3.199,5.152 L1.6,5.15247775 L1.6,9.15247775 L3.199,9.152 L3.199,5.152 Z M11.2007903,5.68972499 L11.2,8.88 L11.2336326,8.87927241 C12.0490385,8.80570087 12.688,8.12037471 12.688,7.28581108 C12.688,6.4400748 12.0318159,5.74759854 11.2007903,5.68972499 Z"
                                                        id="Notice-Combined-Shape"
                                                    />
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static DiamondDoc({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" style={bodyStyle}>
                <title>{title}</title>
                <g id="DiamondDoc-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="DiamondDoc-Chat-Group-More"
                        transform="translate(-817.000000, -660.000000)"
                    >
                        <g id="DiamondDoc-g-20" transform="translate(800.000000, 87.000000)">
                            <g id="DiamondDocg-24" transform="translate(1.000000, 509.000000)">
                                <g
                                    id="DiamondDoc-22dip-2"
                                    transform="translate(0.000000, 56.000000)"
                                >
                                    <g
                                        id="DiamondDoc-29"
                                        transform="translate(16.000000, 8.000000)"
                                    >
                                        <g
                                            id="DiamondDoc-chat/icon/eyes"
                                            transform="translate(-2.000000, -2.000000)"
                                        >
                                            <g
                                                id="DiamondDoc-11"
                                                transform="translate(0.800000, 0.800000)"
                                            >
                                                <rect
                                                    id="矩形"
                                                    fill="#D8D8D8"
                                                    opacity="0"
                                                    x="1.2"
                                                    y="1.2"
                                                    width="16"
                                                    height="16"
                                                />
                                                <path
                                                    d="M11.4627417,2.4117749 L15.9882251,6.9372583 C17.2379028,8.18693603 17.2379028,10.213064 15.9882251,11.4627417 L11.4627417,15.9882251 C10.213064,17.2379028 8.18693603,17.2379028 6.9372583,15.9882251 L2.4117749,11.4627417 C1.16209717,10.213064 1.16209717,8.18693603 2.4117749,6.9372583 L6.9372583,2.4117749 C8.18693603,1.16209717 10.213064,1.16209717 11.4627417,2.4117749 Z M8.12648057,3.48806354 L8.06862915,3.54314575 L3.54314575,8.06862915 C2.93724139,8.67453351 2.91888066,9.64549066 3.48806354,10.2735194 L3.54314575,10.3313708 L8.06862915,14.8568542 C8.67453351,15.4627586 9.64549066,15.4811193 10.2735194,14.9119365 L10.3313708,14.8568542 L14.8568542,10.3313708 C15.4627586,9.72546649 15.4811193,8.75450934 14.9119365,8.12648057 L14.8568542,8.06862915 L10.3313708,3.54314575 C9.72546649,2.93724139 8.75450934,2.91888066 8.12648057,3.48806354 Z M10.8,11.2 C11.2418278,11.2 11.6,11.5581722 11.6,12 C11.6,12.4418278 11.2418278,12.8 10.8,12.8 L7.6,12.8 C7.1581722,12.8 6.8,12.4418278 6.8,12 C6.8,11.5581722 7.1581722,11.2 7.6,11.2 L10.8,11.2 Z M12.4,8.4 C12.8418278,8.4 13.2,8.7581722 13.2,9.2 C13.2,9.6418278 12.8418278,10 12.4,10 L6,10 C5.5581722,10 5.2,9.6418278 5.2,9.2 C5.2,8.7581722 5.5581722,8.4 6,8.4 L12.4,8.4 Z M10.8,5.6 C11.2418278,5.6 11.6,5.9581722 11.6,6.4 C11.6,6.8418278 11.2418278,7.2 10.8,7.2 L7.6,7.2 C7.1581722,7.2 6.8,6.8418278 6.8,6.4 C6.8,5.9581722 7.1581722,5.6 7.6,5.6 L10.8,5.6 Z"
                                                    id="Combined-Shape"
                                                    fill="currentColor"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static CircleEyes({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" style={bodyStyle} height="16px" viewBox="0 0 16 16">
                <title>{title}</title>
                <g id="CircleEyes-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="CircleEyes-Chat-Group-More"
                        transform="translate(-817.000000, -722.000000)"
                    >
                        <g id="CircleEyes-20" transform="translate(800.000000, 87.000000)">
                            <g id="CircleEyes-24" transform="translate(1.000000, 509.000000)">
                                <g
                                    id="CircleEyes-22dup-3"
                                    transform="translate(0.000000, 112.000000)"
                                >
                                    <g
                                        id="CircleEyes-11"
                                        transform="translate(16.000000, 14.000000)"
                                    >
                                        <rect
                                            id="CircleEyes-rect"
                                            fill="#D8D8D8"
                                            opacity="0"
                                            x="0"
                                            y="0"
                                            width="16"
                                            height="16"
                                        />
                                        <path
                                            d="M8,2 C10.8618392,2 13.3542282,4.05092841 14.6505623,5.98625436 L14.7761783,6.17932137 C14.8369622,6.27558196 14.8946871,6.371373 14.9492497,6.46642368 L15.0541278,6.65545763 C15.0708945,6.68677202 15.0873022,6.71798408 15.103347,6.74908379 L15.1952313,6.93425356 C15.4576377,7.48523667 15.6,7.99331759 15.6,8.4 C15.6,8.80668241 15.4576377,9.31476333 15.1952313,9.86574644 L15.103347,10.0509162 C15.0873022,10.0820159 15.0708945,10.113228 15.0541278,10.1445424 L14.9492497,10.3335763 C14.8946871,10.428627 14.8369622,10.524418 14.7761783,10.6206786 L14.6505623,10.8137456 C13.3542282,12.7490716 10.8618392,14.8 8,14.8 C5.13816084,14.8 2.64577178,12.7490716 1.34943766,10.8137456 L1.22382171,10.6206786 C1.16303778,10.524418 1.10531286,10.428627 1.0507503,10.3335763 L0.945872243,10.1445424 C0.929105516,10.113228 0.912697814,10.0820159 0.896652965,10.0509162 L0.804768716,9.86574644 C0.542362349,9.31476333 0.4,8.80668241 0.4,8.4 C0.4,7.99331759 0.542362349,7.48523667 0.804768716,6.93425356 L0.896652965,6.74908379 C0.912697814,6.71798408 0.929105516,6.68677202 0.945872243,6.65545763 L1.0507503,6.46642368 C1.10531286,6.371373 1.16303778,6.27558196 1.22382171,6.17932137 L1.34943766,5.98625436 C2.64577178,4.05092841 5.13816084,2 8,2 Z M8,3.6 C6.54211394,3.6 5.02150684,4.34365373 3.74741768,5.59564147 C3.18866787,6.14469873 2.71853199,6.75670541 2.39635043,7.33743006 C2.13040142,7.81679687 2,8.21727183 2,8.4 C2,8.58272817 2.13040142,8.98320313 2.39635043,9.46256994 C2.71853199,10.0432946 3.18866787,10.6553013 3.74741768,11.2043585 C5.02150684,12.4563463 6.54211394,13.2 8,13.2 C9.45788606,13.2 10.9784932,12.4563463 12.2525823,11.2043585 C12.8113321,10.6553013 13.281468,10.0432946 13.6036496,9.46256994 C13.8695986,8.98320313 14,8.58272817 14,8.4 C14,8.21727183 13.8695986,7.81679687 13.6036496,7.33743006 C13.281468,6.75670541 12.8113321,6.14469873 12.2525823,5.59564147 C10.9784932,4.34365373 9.45788606,3.6 8,3.6 Z M8,5.6 C9.5463973,5.6 10.8,6.8536027 10.8,8.4 C10.8,9.9463973 9.5463973,11.2 8,11.2 C6.4536027,11.2 5.2,9.9463973 5.2,8.4 C5.2,6.8536027 6.4536027,5.6 8,5.6 Z M8,7.2 C7.3372583,7.2 6.8,7.7372583 6.8,8.4 C6.8,9.0627417 7.3372583,9.6 8,9.6 C8.6627417,9.6 9.2,9.0627417 9.2,8.4 C9.2,7.7372583 8.6627417,7.2 8,7.2 Z"
                                            id="Combined-Shape"
                                            fill="currentColor"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static OutlinePin({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" style={bodyStyle}>
                <title>{title}</title>
                <g id="OutlinePin-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="OutlinePin-Chat-Group-More"
                        transform="translate(-817.000000, -766.000000)"
                    >
                        <g id="OutlinePin-g-20" transform="translate(800.000000, 87.000000)">
                            <g id="OutlinePin-g-24" transform="translate(1.000000, 509.000000)">
                                <g
                                    id="OutlinePin-22dup-5"
                                    transform="translate(0.000000, 156.000000)"
                                >
                                    <g
                                        id="OutlinePin-mockplus-"
                                        transform="translate(16.000000, 14.000000)"
                                    >
                                        <g
                                            id="OutlinePin-chat/icon/eyes"
                                            transform="translate(-3.000000, -2.000000)"
                                        >
                                            <g
                                                id="OutlinePin--11"
                                                transform="translate(0.200000, 0.400000)"
                                            >
                                                <rect
                                                    id="OutlinePin-rect"
                                                    fill="#D8D8D8"
                                                    opacity="0"
                                                    x="2.8"
                                                    y="1.6"
                                                    width="16"
                                                    height="16"
                                                />
                                                <g
                                                    id="OutlinePin-2"
                                                    transform="translate(10.541154, 10.633975) rotate(-330.000000) translate(-10.541154, -10.633975) translate(3.541154, 2.433975)"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M6.78564065,0.111027254 C7.43369686,0.111027254 8.05618944,0.147800294 8.63534707,0.220339076 L8.63534707,0.220339076 L8.89950884,0.256354426 C10.9436588,0.558310571 12.3856406,1.32573536 12.3856406,2.51102725 C12.3856406,3.39273062 11.6483591,3.99801361 10.4630335,4.39319501 L10.4630335,4.39319501 L10.366,4.4244 L10.3664,5.386 L10.5066788,5.413171 C12.4777478,5.80148035 13.7509116,6.50872512 13.8053609,7.62002099 L13.8053609,7.62002099 L13.8071797,7.69474411 C13.8071797,8.77523866 12.5796935,9.53496806 10.7096821,9.94365474 L10.7096821,9.94365474 L10.4507529,9.99720602 C10.4069526,10.0057676 10.3628341,10.0141472 10.3184043,10.0223444 L10.3184043,10.0223444 L10.0481454,10.069336 L9.77074527,10.1119333 L9.48653363,10.150119 L9.19584009,10.1838762 C9.14686932,10.1891324 9.0976422,10.1942033 9.04816561,10.1990887 L9.04816561,10.1990887 L8.74836723,10.2261711 L8.74836723,10.2261711 L8.59632575,10.2380367 L8.28816418,10.2584058 C8.23636447,10.2614265 8.18434963,10.2642597 8.1321265,10.2669052 L8.1321265,10.2669052 L7.81634338,10.2805228 C7.73191948,10.2835369 7.6470025,10.2860734 7.56162014,10.2881308 L7.56076952,15.2679492 C7.56076952,15.709777 7.20259732,16.0679492 6.76076952,16.0679492 C6.31894172,16.0679492 5.96076952,15.709777 5.96076952,15.2679492 L5.96017968,10.2690273 L5.88223285,10.2669052 C5.85612129,10.2655825 5.8300618,10.2642128 5.80405523,10.2627962 L5.72619518,10.2584058 L5.41803361,10.2380367 L5.41803361,10.2380367 L5.26599212,10.2261711 L4.96619374,10.1990887 C4.91671715,10.1942033 4.86749003,10.1891324 4.81851926,10.1838762 L4.81851926,10.1838762 L4.52782572,10.150119 L4.24361409,10.1119333 L3.96621398,10.069336 L3.69595502,10.0223444 C1.60775665,9.63707636 0.207179677,8.84890875 0.207179677,7.69474411 C0.207179677,6.62198766 1.34355689,5.89800752 3.14039937,5.48740467 L3.14039937,5.48740467 L3.39536011,5.4321415 C3.4817439,5.41439601 3.56950862,5.3973249 3.65860636,5.3809246 L3.65860636,5.3809246 L3.92985081,5.33373258 C4.0674247,5.31113924 4.20789016,5.29004721 4.35108559,5.27044449 L4.35108559,5.27044449 L4.366,5.2684 L4.3656,4.7084 L4.27941409,4.69321717 C2.46652887,4.36023601 1.24226481,3.67259167 1.18755286,2.58738494 L1.18755286,2.58738494 L1.18564065,2.51102725 C1.18564065,1.47704922 2.28295685,0.761058781 3.92009425,0.394655353 L3.92009425,0.394655353 L4.1634642,0.343534571 C4.32819359,0.311122651 4.49780224,0.282052821 4.67177245,0.256354426 L4.67177245,0.256354426 L4.93593422,0.220339076 C5.51509185,0.147800294 6.13758443,0.111027254 6.78564065,0.111027254 Z M6.78564065,1.71102725 C5.57645837,1.71102725 4.45136207,1.86965246 3.64451031,2.13860304 C3.28777843,2.25751367 3.01755873,2.39083961 2.85802752,2.51656432 L2.85802752,2.51656432 L2.8652,2.5112 L2.90784781,2.54262143 C2.97101895,2.58683041 3.05027655,2.63357702 3.14458814,2.68082369 L3.14458814,2.68082369 L3.21812832,2.71632061 C3.70109369,2.94111028 4.41930108,3.12276483 5.26088699,3.22330124 C5.66314829,3.27135563 5.96599096,3.61252745 5.96599318,4.01764888 L5.96599318,4.01764888 L5.96600396,5.98107321 C5.96600622,6.39310084 5.65306138,6.73774255 5.24294371,6.77736918 C4.11928826,6.88593967 3.14834022,7.09629417 2.48217973,7.36624353 C2.18833529,7.48531861 1.97314714,7.60877218 1.85082704,7.71811302 L1.87917968,7.69502725 L1.89683058,7.70971113 L1.9415144,7.74285715 C2.16254712,7.89963117 2.52408831,8.06017659 2.9944173,8.20127529 C4.03216848,8.51260064 5.46762024,8.69474411 7.00717968,8.69474411 C8.54673912,8.69474411 9.98219088,8.51260064 11.0199421,8.20127529 C11.490271,8.06017659 11.8518122,7.89963117 12.072845,7.74285715 L12.072845,7.74285715 L12.1356,7.6948 L12.1098856,7.67373059 C12.0321975,7.61411345 11.9264737,7.54950791 11.7948057,7.48388538 L11.7948057,7.48388538 L11.7127083,7.44442159 C11.1843231,7.19925067 10.3956519,6.99171179 9.45420022,6.85832171 C9.05969714,6.80242633 8.76646192,6.46474446 8.76642777,6.06630127 L8.76642777,6.06630127 L8.76623488,3.81544555 C8.76620311,3.44474448 9.02084447,3.12257933 9.38152993,3.03699143 C9.91529232,2.9103337 10.3398663,2.74879062 10.6068072,2.58004601 C10.6405357,2.55872484 10.6702651,2.53821428 10.6959982,2.51890033 L10.6959982,2.51890033 L10.7056,2.5108 L10.6620979,2.47864089 C10.5169562,2.37702105 10.3025211,2.27194549 10.031171,2.17468667 L10.031171,2.17468667 L9.92677098,2.13860304 C9.11991923,1.86965246 7.99482292,1.71102725 6.78564065,1.71102725 Z"
                                                        id="OutlinePin-Combined-Shape"
                                                    />
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static OutlineMute({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" style={bodyStyle}>
                <title>{title}</title>
                <g id="OutlineMute-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Chat-Group-More" transform="translate(-817.000000, -809.000000)">
                        <g id="OutlineMute-20" transform="translate(800.000000, 87.000000)">
                            <g id="OutlineMute-24" transform="translate(1.000000, 509.000000)">
                                <g
                                    id="OutlineMute-22OutlineMute-6"
                                    transform="translate(0.000000, 200.000000)"
                                >
                                    <g
                                        id="OutlineMute-11"
                                        transform="translate(16.000000, 13.000000)"
                                    >
                                        <rect
                                            id="OutlineMute-rect"
                                            fill="#D8D8D8"
                                            opacity="0"
                                            x="0"
                                            y="0"
                                            width="16"
                                            height="16"
                                        />
                                        <path
                                            d="M14.7219353,1.08572446 C15.060395,1.36972589 15.1045422,1.87433037 14.8205408,2.2127901 L13.2386439,4.09825391 C13.4721742,4.72866566 13.6,5.41222636 13.6,6.12631579 L13.6,11.6 L14.9090909,11.6 C15.2906695,11.6 15.6,11.9581722 15.6,12.4 C15.6,12.8418278 15.2906695,13.2 14.9090909,13.2 L5.601,13.199 L4.02170892,15.0823367 C3.73770749,15.4207965 3.23310301,15.4649436 2.89464328,15.1809422 C2.55618355,14.8969408 2.51203638,14.3923363 2.79603781,14.0538766 L13.5948697,1.18432992 C13.8788711,0.845870192 14.3834756,0.801723021 14.7219353,1.08572446 Z M9.33333333,14 C9.70152317,14 10,14.2984768 10,14.6666667 C10,15.0348565 9.70152317,15.3333333 9.33333333,15.3333333 L6.66666667,15.3333333 C6.29847683,15.3333333 6,15.0348565 6,14.6666667 C6,14.2984768 6.29847683,14 6.66666667,14 L9.33333333,14 Z M8,0.4 C9.27768201,0.4 10.4554247,0.837542844 11.397746,1.5740905 L10.3672172,2.80019154 C9.73092367,2.31769529 8.9518468,2.02498596 8.10971108,2.00152649 L8,2 C5.83563161,2 4.06007661,3.77871864 4.00149266,6.01235543 L4,6.12631579 L3.999,10.389 L1.641,13.199 L1.09090909,13.2 C0.709330536,13.2 0.4,12.8418278 0.4,12.4 C0.4,11.9581722 0.709330536,11.6 1.09090909,11.6 L2.4,11.6 L2.4,6.12631579 C2.4,2.96375891 4.9072054,0.4 8,0.4 Z M11.9692653,5.61182734 L6.943,11.6 L12,11.6 L12,6.12631579 C12,5.95201573 11.9895489,5.78031408 11.9692653,5.61182734 Z"
                                            id="Combined-Shape"
                                            fill="currentColor"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static OutlineClear({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" style={bodyStyle}>
                <title>{title}</title>
                <g id="OutlineClear-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="OutlineClear-Chat-Group-More"
                        transform="translate(-816.000000, -862.000000)"
                    >
                        <g id="OutlineClear-g-20" transform="translate(800.000000, 87.000000)">
                            <g id="OutlineClear-g-34" transform="translate(0.000000, 761.000000)">
                                <g
                                    id="OutlineClear-g-11"
                                    transform="translate(16.000000, 14.000000)"
                                >
                                    <rect
                                        id="OutlineClear-rect"
                                        fill="#D8D8D8"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="16"
                                        height="16"
                                    />
                                    <path
                                        d="M8.8,0.4 C9.6836556,0.4 10.4,1.1163444 10.4,2 L10.4,4.4 L12.8,4.4 C13.6836556,4.4 14.4,5.1163444 14.4,6 L14.4,7.6 C14.4,8.26350876 13.996123,8.832687 13.4207975,9.07510614 L15.2986659,13.5343316 C15.5558475,14.1451378 15.2691781,14.8487809 14.6583719,15.1059625 C14.5109669,15.1680277 14.352642,15.2 14.1927035,15.2 L1.80729651,15.2 C1.14455481,15.2 0.607296513,14.6627417 0.607296513,14 C0.607296513,13.8400615 0.639268799,13.6817366 0.701334063,13.5343316 L2.57920245,9.07510614 C2.00387701,8.832687 1.6,8.26350876 1.6,7.6 L1.6,6 C1.6,5.1163444 2.3163444,4.4 3.2,4.4 L6,4.4 L6,2 C6,1.1163444 6.7163444,0.4 7.6,0.4 L8.8,0.4 Z M11.7376,9.2 L4.262,9.2 L2.4092,13.6 L5.2,13.6 L5.2,13.6 L5.2,11.6 C5.2,11.1581722 5.5581722,10.8 6,10.8 C6.4418278,10.8 6.8,11.1581722 6.8,11.6 L6.8,13.6 L9.2,13.6 L9.2,13.6 L9.2,11.6 C9.2,11.1581722 9.5581722,10.8 10,10.8 C10.4418278,10.8 10.8,11.1581722 10.8,11.6 L10.8,13.6 L13.5904,13.6 L11.7376,9.2 Z M8.8,2 L7.6,2 L7.6,4.4 C7.6,5.25687816 6.92641261,5.95643155 6.07985614,5.99804188 L6,6 L3.2,6 L3.2,7.6 L12.8,7.6 L12.8,6 L10.4,6 C9.54312184,6 8.84356845,5.32641261 8.80195812,4.47985614 L8.8,4.4 L8.8,2 Z"
                                        id="Combined-Shape"
                                        fill="currentColor"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static OutlineExpand({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" style={bodyStyle}>
                <title>{title}</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="Contact-New-friend-friend"
                        transform="translate(-80.000000, -308.000000)"
                    >
                        <g transform="translate(63.000000, 0.000000)">
                            <g transform="translate(0.000000, 48.000000)">
                                <g id="-mockplus-" transform="translate(1.000000, 248.000000)">
                                    <g id="Group" transform="translate(16.000000, 12.000000)">
                                        <rect
                                            id="Rectangle"
                                            fill="#D8D8D8"
                                            opacity="0"
                                            x="0"
                                            y="0"
                                            width="16"
                                            height="16"
                                        />
                                        <path
                                            d="M5.31992807,4.28797442 C5.70983061,3.93001572 6.31930722,3.90624659 6.73838405,4.21400255 L6.83894934,4.29784677 L10.3811515,7.64193392 C11.1705811,8.38694406 11.2036489,9.56275516 10.4866052,10.3439469 L10.3601536,10.4703501 L6.82826949,13.712095 C6.43832894,14.0700178 5.82884981,14.0937308 5.40980567,13.7859363 L5.30924928,13.7020828 C4.92479134,13.3390558 4.89932029,12.7716427 5.2299336,12.3815208 L5.32000367,12.2879048 L8.85166201,9.04622827 L5.30932382,5.70215348 C4.89278597,5.30891254 4.89753365,4.67576301 5.31992807,4.28797442 Z"
                                            fill="currentColor"
                                            transform="translate(8.000000, 9.000000) rotate(-270.000000) translate(-8.000000, -9.000000) "
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static OutlineClose({ bodyStyle = {}, title = "" }) {
        return (
            <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" style={bodyStyle}>
                <title>{title}</title>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g
                        id="Contact-New-friend-friend"
                        transform="translate(-80.000000, -268.000000)"
                    >
                        <g transform="translate(63.000000, 0.000000)">
                            <g transform="translate(0.000000, 48.000000)">
                                <g id="-mockplus-" transform="translate(1.000000, 208.000000)">
                                    <g id="Group" transform="translate(16.000000, 12.000000)">
                                        <rect
                                            id="Rectangle"
                                            fill="#D8D8D8"
                                            opacity="0"
                                            x="0"
                                            y="0"
                                            width="16"
                                            height="16"
                                        />
                                        <path
                                            d="M5.31992807,3.28797442 C5.70983061,2.93001572 6.31930722,2.90624659 6.73838405,3.21400255 L6.83894934,3.29784677 L10.3811515,6.64193392 C11.1705811,7.38694406 11.2036489,8.56275516 10.4866052,9.34394685 L10.3601536,9.47035005 L6.82826949,12.712095 C6.43832894,13.0700178 5.82884981,13.0937308 5.40980567,12.7859363 L5.30924928,12.7020828 C4.92479134,12.3390558 4.89932029,11.7716427 5.2299336,11.3815208 L5.32000367,11.2879048 L8.85166201,8.04622827 L5.30932382,4.70215348 C4.89278597,4.30891254 4.89753365,3.67576301 5.31992807,3.28797442 Z"
                                            fill="currentColor"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    static Duplicat({ bodyStyle = {}, title = "" }) {
        return (
            <svg
                width="15px"
                height="15px"
                viewBox="0 0 30 30"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                // xmlns:xlink="http://www.w3.org/1999/xlink"
            >
                <title>{title}</title>
                <g id="Chats" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="can" transform="translate(-390.000000, -1306.000000)" fill="#DADCE2">
                        <g id="group-8" transform="translate(120.000000, 1306.000000)">
                            <g
                                id="chat/list/icon/免打扰备份-9"
                                transform="translate(270.000000, 0.000000)"
                            >
                                <g id="group-2" transform="translate(1.000000, 1.000000)">
                                    <path
                                        d="M22,0 C25.2383969,0 27.8775718,2.56557489 27.9958615,5.77506174 L28,6 L28,16 C28,19.2383969 25.4344251,21.8775718 22.2249383,21.9958615 L22,22 C22,25.3137085 19.3137085,28 16,28 L16,28 L6,28 C2.6862915,28 0,25.3137085 0,22 L0,22 L0,12 C0,8.6862915 2.6862915,6 6,6 L6,6 C6,2.76160306 8.56557489,0.122428238 11.7750617,0.00413847206 L12,0 L22,0 Z M16,10 L6,10 C4.8954305,10 4,10.8954305 4,12 L4,12 L4,22 C4,23.1045695 4.8954305,24 6,24 L6,24 L16,24 C17.1045695,24 18,23.1045695 18,22 L18,22 L18,12 C18,10.8954305 17.1045695,10 16,10 L16,10 Z M22,4 L12,4 C10.9456382,4 10.0818349,4.81587779 10.0054857,5.85073766 L10,6 L16,6 C19.3137085,6 22,8.6862915 22,12 L22,12 L22,18 C23.0543618,18 23.9181651,17.1841222 23.9945143,16.1492623 L24,16 L24,6 C24,4.9456382 23.1841222,4.08183488 22.1492623,4.00548574 L22,4 Z"
                                        id="形状结合"
                                    ></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}
