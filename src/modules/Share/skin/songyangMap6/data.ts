import Config from "../../../../config/Config";

export const data6 = [
    {
        inline: true,
        name: "危房",
        icon: `images/songyang/022.png`,
        click: false,
        data: [],
        requestUrl: Config.apiHost + "/Share/getSubMenu?subId=2346"
    },
    {
        inline: true,
        name: "地质灾害点",
        icon: `images/songyang/023.png`,
        click: false,
        data: [
        ],
        requestUrl: Config.apiHost + "/Share/getSubMenu?subId=2389"
    },
    {
        inline: true,
        name: "避灾点",
        icon: `images/songyang/024.png`,
        click: false,
        data: [
        ],
        requestUrl: Config.apiHost + "/Share/getSubMenu?subId=2390"
    },
    {
        inline: true,
        name: "小流域隐患",
        icon: `images/songyang/025.png`,
        click: true,
        data: [
        ],
        requestUrl: Config.apiHost + "/Share/getSubMenu?subId=2391"
    },
    {
        inline: true,
        name: "水库",
        icon: `images/songyang/026.png`,
        click: false,
        data: [
        ],
        requestUrl: Config.apiHost + "/Share/getSubMenu?subId=2392"
    },
    {
        inline: true,
        name: "山塘",
        icon: `images/songyang/027.png`,
        data: [
        ],
        requestUrl: Config.apiHost + "/Share/getSubMenu?subId=2393"
    },
    {
        inline: true,
        name: "渠",
        icon: `images/songyang/028.png`,
        click: false,
        data: [
        ],
        requestUrl: Config.apiHost + "/Share/getSubMenu?subId=2394"
    },
    {
        inline: true,
        name: "抢险人员",
        icon: `images/songyang/029.png`,
        click: false,
        data: [
        ],
        requestUrl: Config.apiHost + "/Share/getSubMenu?subId=2395"
    },
    {
        inline: true,
        name: "救灾路线",
        icon: `images/songyang/030.png`,
        click: true,
        data: [
        ],
        requestUrl: Config.apiHost + "/Share/getSubMenu?subId=2396"
    }
]