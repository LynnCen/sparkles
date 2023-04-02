import { useEffect, useState,useMemo } from "react";
import { useTranslation } from "next-i18next";
import { menuData, headerData } from "../utils/index";
interface useData {
  usermanualData: Array<menuData>;
  faqData: Array<menuData>;
  headerData: Array<headerData>;
}
function useData() {
  // const [data, setData] = useState({
  //   usermanualData: [],
  //   faqData: [],
  //   headerData: [],
  // });
  const { t } = useTranslation("common");
  const { t: f } = useTranslation("faqmenu");
  const { t: u } = useTranslation("user");
  const usermanualData: Array<menuData> = [
    {
      title: u("download&install"),
      path: "/usermanuall/download&install",
      subData: [
        {
          subtitle: u("download"),
          subPath: "/usermanual/download&install/download",
        },
        {
          subtitle: u("install"),
          subPath: "/usermanual/download&install/install",
        },
      ],
    },
    {
      title: u("login"),
      path: "/usermanual/login",
      subData: [
        {
          subtitle: u("login-how"),
          subPath: "/usermanual/login/howlogin",
        },
        {
          subtitle: u("login-err"),
          subPath: "/usermanual/login/errlogin",
        },
      ],
    },
    {
      title: u("contacts"),
      path: "/usermanual/contacts",
      subData: [
        {
          subtitle: u("contacts-add"),
          subPath: "/usermanual/contacts/contacts-add",
        },
        {
          subtitle: u("contacts-friends"),
          subPath: "/usermanual/contacts/contacts-friends",
        },
        {
          subtitle: u("contacts-delete"),
          subPath: "/usermanual/contacts/contacts-delete",
        },
        {
          subtitle: u("contacts-remarks"),
          subPath: "/usermanual/contacts/contacts-remarks",
        },
      ],
    },
    {
      title: u("chat"),
      path: "/usermanual/chat",
      subData: [
        {
          subtitle: u("chat-pages-brief"),
          subPath: "/usermanual/chat/pages-brief",
        },
        {
          subtitle: u("chat-send-text"),
          subPath: "/usermanual/chat/send-text",
        },
        {
          subtitle: u("chat-send-expression"),
          subPath: "/usermanual/chat/send-expression",
        },
        {
          subtitle: u("chat-send-img&video"),
          subPath: "/usermanual/chat/send-img&video",
        },
        {
          subtitle: u("chat-send-voice"),
          subPath: "/usermanual/chat/send-voice",
        },
        {
          subtitle: u("chat-send-file"),
          subPath: "/usermanual/chat/send-file",
        },
        {
          subtitle: u("chat-message"),
          subPath: "/usermanual/chat/message",
        },
        {
          subtitle: u("chat-status"),
          subPath: "/usermanual/chat/message-status",
        },
        {
          subtitle: u("chat-group"),
          subPath: "/usermanual/chat/group",
        },
        {
          subtitle: u("chat-nearby"),
          subPath: "/usermanual/chat/nearby",
        },
      ],
    },
    {
      title: u("video"),
      path: "/usermanual/video",
      subData: [
        {
          subtitle: u("video-single"),
          subPath: "/usermanual/video/single-video",
        },
        {
          subtitle: u("video-many"),
          subPath: "/usermanual/video/mul-video",
        },
      ],
    },
    {
      title: u("mobile-pay"),
      path: "/usermanual/pay",
      subData: [
        {
          subtitle: u("mobile-pay-password"),
          subPath: "/usermanual/pay/pay-password",
        },
        {
          subtitle: u("mobile-pay-redpacket-send"),
          subPath: "/usermanual/pay/send-redPacket-friend",
        },
        {
          subtitle: u("mobile-pay-redpacket-luckly"),
          subPath: "/usermanual/pay/lucky-redPacket",
          depData: [
            {
              subtitle: u("mobile-pay-redpacket-luckly-what"),
              subPath: "/usermanual/pay/lucky-redPacket/what",
            },
            {
              subtitle: u("mobile-pay-redpacket-luckly-where"),
              subPath: "/usermanual/pay/lucky-redPacket/where",
            },
          ],
        },
        {
          subtitle: u("mobile-pay-redpacket-receive"),
          subPath: "/usermanual/pay/receive-redPacket",
        },
        {
          subtitle: u("mobile-pay-wallet"),
          subPath: "/usermanual/pay/use-wallet",
        },
        {
          subtitle: u("mobile-pay-transfer"),
          subPath: "/usermanual/pay/transfer",
        },
        {
          subtitle: u("mobile-pay-qrcode"),
          subPath: "/usermanual/pay/QR-code",
        },
        {
          subtitle: u("mobile-pay-withdrawal"),
          subPath: "/usermanual/pay/withdrawal",
        },
      ],
    },
    {
      title: u("moments"),
      path: "/usermanual/moments",
      subData: [
        {
          subtitle: u("moments-intrudce"),
          subPath: "/usermanual/moments/introduce",
        },
        {
          subtitle: u("moments-all-friends"),
          subPath: "/usermanual/moments/browse-allmoments",
        },
        {
          subtitle: u("moments-single-friends"),
          subPath: "/usermanual/moments/browse-singlemoments",
        },
        {
          subtitle: u("moments-send"),
          subPath: "/usermanual/moments/send-moments",
        },
        {
          subtitle: u("moments-likes"),
          subPath: "/usermanual/moments/message-likes",
        },
      ],
    },
    {
      title: u("platform"),
      path: "/usermanual/platform",
      subData: [
        {
          subtitle: u("platform"),
          subPath: "/usermanual/platform/introduce",
        },
        {
          subtitle: u("platform-games"),
          subPath: "/usermanual/platform/games",
        },
      ],
    },
  ];
  const faqData: Array<menuData> = [
    // 热门问题
    {
      title: f("hot-questions"),
      path: "/faq/hot-questions",
      subData: [
        {
          subtitle: f("view-version"),
          subPath: "/faq/hot-questions/view-version",
        },
        {
          subtitle: f("change-lan"),
          subPath: "/faq/hot-questions/change-lan",
        },
        {
          subtitle: f("edit-mydata"),
          subPath: "/faq/hot-questions/edit-mydata",
        },
        {
          subtitle: f("err-login"),
          subPath: "/faq/hot-questions/err-login",
        },
        {
          subtitle: f("err-newmessage"),
          subPath: "/faq/hot-questions/err-newmessage",
        },
        {
          subtitle: f("err-voice"),
          subPath: "/faq/hot-questions/err-voice",
          depData: [
            {
              subtitle: f("confim-voice"),
              subPath: "/faq/hot-questions/err-voice/confim-voice",
            },
            {
              subtitle: f("where-voice"),
              subPath: "/faq/hot-questions/err-voice/where-voice",
            },
            {
              subtitle: f("why-voice"),
              subPath: "/faq/hot-questions/err-voice/why-voice",
            },
          ],
        },
        {
          subtitle: f("err-viewme-video"),
          subPath: "/faq/hot-questions/err-viewme-video",
          depData: [
            {
              subtitle: f("confim-author-video"),
              subPath:
                "/faq/hot-questions/err-viewme-video/confim-author-video",
            },
            {
              subtitle: f("err-video-work"),
              subPath: "/faq/hot-questions/err-viewme-video/err-video-work",
            },
          ],
        },
      ],
    },
    //about chat
    {
      title: f("about-chat"),
      path: "/faq/about-chat",
      subData: [
        {
          subtitle: f("is-konw-send"),
          subPath: "/faq/about-chat/is-konw-send",
        },
        {
          subtitle: f("update-see-message"),
          subPath: "/faq/about-chat/update-see-message",
        },
        {
          subtitle: f("delete-err-message"),
          subPath: "/faq/about-chat/delete-err-message",
        },
        {
          subtitle: f("group-max-limit"),
          subPath: "/faq/about-chat/group-max-limit",
        },
      ],
    },
    //about contacts
    {
      title: f("about-contacts"),
      path: "/faq/about-contacts",
      subData: [
        {
          subtitle: f("how-add-more-contacts"),
          subPath: "/faq/about-contacts/how-add-more-contacts",
        },
        {
          subtitle: f("how-delete-contacts"),
          subPath: "/faq/about-contacts/how-delete-contacts",
        },
        {
          subtitle: f("errmessage-Tips"),
          subPath: "/faq/about-contacts/errmessage-Tips",
        },
        {
          subtitle: f("contacts-add-remarks"),
          subPath: "/faq/about-contacts/contacts-add-remarks",
        },
      ],
    },
    //aobut video
    {
      title: f("about-video"),
      path: "/faq/about-video",
      subData: [
        {
          subtitle: f("videoing-change"),
          subPath: "/faq/about-video/videoing-change",
        },
        {
          subtitle: f("android-suspension-window"),
          subPath: "/faq/about-video/android-suspension-window",
        },
        {
          subtitle: f("view-videoing"),
          subPath: "/faq/about-video/view-videoing",
        },
        {
          subtitle: f("video-limit"),
          subPath: "/faq/about-video/video-limit",
        },
        {
          subtitle: f("another-videoing"),
          subPath: "/faq/about-video/another-videoing",
        },
      ],
    },
    //about-moments
    {
      title: f("about-moments"),
      path: "/faq/about-moments",
      subData: [
        {
          subtitle: f("delete-moments"),
          subPath: "/faq/about-moments/delete-moments",
        },
        {
          subtitle: f("on-view-moments"),
          subPath: "/faq/about-moments/on-view-moments",
        },
      ],
    },
    // aobut mobile pay
    {
      title: f("about-mobile-pay"),
      path: "/faq/about-mobile-pay",
      subData: [
        {
          subtitle: f("view-record"),
          subPath: "/faq/about-mobile-pay/view-record",
        },
        {
          subtitle: f("about-withdrawal"),
          subPath: "/faq/about-mobile-pay/about-withdrawal",
        },
        {
          subtitle: f("about-withdrawal-time"),
          subPath: "/faq/about-mobile-pay/about-withdrawal-time",
        },
        {
          subtitle: f("withdrawal-redpacket"),
          subPath: "/faq/about-mobile-pay/withdrawal-redpacket",
        },
        {
          subtitle: f("pay-limit"),
          subPath: "/faq/about-mobile-pay/pay-limit",
        },
      ],
    },
  ];
  const headerData: Array<headerData> = [
    {
      title: t("Home"),
      path: "https://tmmtmm.com.tr/",
      key: 1,
      menuData: [],
    },
    {
      title: t("Download"),
      path: "https://tmmtmm.com.tr/download.html",
      key: 2,
      menuData: [],
    },
    {
      title: t("Contacts"),
      path: "https://tmmtmm.com.tr/contact.html",
      key: 3,
      menuData: [],
    },
    {
      title: t("Usermanual"),
      path: "/usermanual",
      key: 4,
      menuData: usermanualData,
    },
    {
      title: f("faq"),
      path: "/faq/hot-questions/view-version",
      key: 5,
      menuData: faqData,
    },
  ];
  const data=useMemo(() => ({
    usermanualData,
    faqData,
    headerData
  }),[]) 
  // useEffect(() => {
  //   setData({
  //     usermanualData,
  //     faqData,
  //     headerData,
  //   });
  // }, []);

  return data;
}

export default useData;
