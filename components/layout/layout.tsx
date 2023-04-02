import Head from "next/head";
import Link from "next/link";
import React, {
  ReactComponentElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import utilStyles from "./layout.module.scss";
import Header from "../header/header";
import Footer from "../footer/footer";
import Menu from "../Menu/menu";
import { useTranslation } from "next-i18next";
import Store from "../utils/context";
import { FC } from "react";
import { Drawer, Button } from "antd";
import { RenderMenu, RenderSearchItem } from "../renderMenu/renderMenu";
import useWindowSize from "../utils/useWindowSize";
import { menuData, headerData } from '../utils/index';
import useData from '../utils/useData'
interface LayoutProps {
  children: ReactNode;
}
interface Store {
  headerKey: number;
  menuData: Array<menuData>;
}
interface Search {
  searchState: boolean;
  searchItemData: { subtitle: string; subPath: string }[];
}
const Layout: FC<LayoutProps> = (props) => {
  const { width, height } = useWindowSize();
  // const { usermanualData, faqData, headerData } = useData()
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
          // depData: [
          //   {
          //     subtitle: u("mobile-pay-redpacket-luckly-what"),
          //     subPath: "/usermanual/pay/lucky-redPacket/what",
          //   },
          //   {
          //     subtitle: u("mobile-pay-redpacket-luckly-where"),
          //     subPath: "/usermanual/pay/lucky-redPacket/where",
          //   },
          // ],
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
          // depData: [
          //   {
          //     subtitle: f("confim-voice"),
          //     subPath: "/faq/hot-questions/err-voice/confim-voice",
          //   },
          //   {
          //     subtitle: f("where-voice"),
          //     subPath: "/faq/hot-questions/err-voice/where-voice",
          //   },
          //   {
          //     subtitle: f("why-voice"),
          //     subPath: "/faq/hot-questions/err-voice/why-voice",
          //   },
          // ],
        },
        {
          subtitle: f("err-viewme-video"),
          subPath: "/faq/hot-questions/err-viewme-video",
          // depData: [
          //   {
          //     subtitle: f("confim-author-video"),
          //     subPath:
          //       "/faq/hot-questions/err-viewme-video/confim-author-video",
          //   },
          //   {
          //     subtitle: f("err-video-work"),
          //     subPath: "/faq/hot-questions/err-viewme-video/err-video-work",
          //   },
          // ],
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
  const {
    container,
    contentBox,
    content,
    contentBox_bg_left,
    contentBox_bg_right,
  } = utilStyles;
  const { children } = props;

  // headerKey                    menuData
  // 0 delegate home
  // 1 delegate download
  // 3 delegate contacts
  // 4 delegate usermanual        usermanualData--leftMenuData
  // 5 delegate faq              faqData--leftMenuData
  const [store, setStore] = useState<Store>({
    headerKey: 4,
    menuData: usermanualData,
  });
  const [searchStore, setSearchStore] = useState<Search>({
    searchState: false,
    searchItemData: [],
  });
  const [defaultActiveKey, setDefaultActiveKey] = useState<string[]>(["1"]);
  const [drawerVisible, setdrawerVisible] = useState<boolean>(false);
  const [menuTitle, setMenuTitle] = useState([]);

  useEffect(() => {
    setMenuTitle(
      store?.menuData
        .map((item, index) =>
          item.subData.map((it: any, index) => (it.depData ? it.depData : it))
        )
        .flat(2)
    );
  }, [store]);
  // handling mask and then hide the Drawer
  const onClose = () => {
    setdrawerVisible(false);
  };
  // handling search when search value exist
  const onSearch = (value: string) => {
    const searchValue = [];
    menuTitle.forEach((item, index) => {
      if (item.subtitle.includes(value)) searchValue.push(item);
    });
    setSearchStore({
      searchState: true,
      searchItemData: searchValue,
    });
  };
  return (
    <Store.Provider
      value={{
        defaultActiveKey,
        setDefaultActiveKey,
        searchStore,
        setSearchStore,
        store,
        setStore,
        drawerVisible,
        setdrawerVisible,
        onSearch,
      }}
    >
      <div className={container}>
        <Head>
          <meta
            key="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
          />
        </Head>
        <Header
          Data={headerData}
          drawerVisible={drawerVisible}
          setdrawerVisible={setdrawerVisible}
        />
        <div className={contentBox}>
          <div className={contentBox_bg_left}></div>
          <div className={contentBox_bg_right}></div>
          <Menu />
          <Drawer
            placement="right"
            width={280}
            height={500}
            closable={false}
            onClose={onClose}
            visible={drawerVisible}
            getContainer={false}
            style={{ position: "absolute" }}
            autoFocus={false}
          >
            <RenderMenu />
          </Drawer>
          <div className={content}>
            {searchStore.searchState && width <= 750 ? (
              <RenderSearchItem />
            ) : (
              children
            )}
          </div>
        </div>
        <Footer />
      </div>
    </Store.Provider>
  );
};
export default Layout;
