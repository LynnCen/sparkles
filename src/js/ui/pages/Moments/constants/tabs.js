/**
 * @Author Pull
 * @Date 2021-10-13 16:21
 * @project tabs
 */
import localeFormat from "utils/localeFormat";

export const MomentsTabEnum = {
    Friends: "1",
    Trending: "2",
    Topic: "3",
};
export const Tab = [
    {
        label: "friend",
        to: "/moments/list/1",
        id: MomentsTabEnum.Friends,
    },
    {
        label: "trending",
        to: "/moments/list/2",
        id: MomentsTabEnum.Trending,
    },
    {
        label: "topic",
        to: "/moments/topic",
        id: MomentsTabEnum.Topic,
    },
];
export const DefaultMomentsEntry = Tab[1];

export const MomentsTypeTab = [
    {
        label: "Moments",
        subPathName: "moments",
        value: "1",
    },
    // {
    //     label: "Picture",
    //     subPathName: "picture",
    //     value: "2",
    // },
    // {
    //     label: "Video",
    //     subPathName: "video",
    //     value: "3",
    // },
];
export const DefaultMomentsTypeTb = MomentsTypeTab[0];
