import React, {
    Component,
    Fragment,
    useEffect,
    useState,
    useRef,
    useCallback,
    forwardRef,
} from "react";
import styles from "./styles.less";
import { Typography } from "antd";
const { Paragraph, Text } = Typography;
import localeFormat from "utils/localeFormat";
import session from "../../../../stores_new/session";
import { getSingleChatTarget, isGroup } from "@newSdk/utils";
import { inject, observer } from "mobx-react";
const multiRow = React.createRef();
@inject((stores) => ({
    getSessionInfo: stores.SessionInfoProxy.getSessionInfo,
    sessionInfoProxy: stores.SessionInfoProxy.sessionInfoProxy,
    focusSessionInfo: stores.NewSession.focusSessionInfo,
}))
@observer
export default class SessionProfile extends Component {
    state = {
        needMore: false,
        showDescription: false,
    };
    // const multiRow = useRef(null);
    // const [needMore, setNeedMore] = useState(false);
    // const [showDescription, setShowDescription] = useState(false);
    // useEffect(() => {
    //     if (!multiRow.current) return;
    //     const height = parseInt(window.getComputedStyle(multiRow.current).height);
    //     const lineHeight = parseInt(window.getComputedStyle(multiRow.current).lineHeight);
    //     if (height > lineHeight * 3) {
    //         setShowDescription(true);
    //         setNeedMore(true);
    //     }
    // }, []);
    componentDidMount() {
        if (!multiRow.current) return;
        const height = parseInt(window.getComputedStyle(multiRow.current).height);
        const lineHeight = parseInt(window.getComputedStyle(multiRow.current).lineHeight);
        if (height > lineHeight * 3) {
            this.setState({
                needMore: true,
                showDescription: true,
            });
            // setShowDescription(true);
            // setNeedMore(true);
        }
    }
    render() {
        const { sessionInfoProxy, focusSessionInfo } = this.props;
        const { needMore, showDescription } = this.state;
        const info = { ...focusSessionInfo, ...sessionInfoProxy(focusSessionInfo.chatId) };
        const { focusSessionId } = session;
        const group = isGroup(focusSessionId);
        let node = document.getElementById("paragraphContent");

        if (node) node.innerHTML = info.notice.replace(/\r/gi, "").replace(/\n/gi, "<br/>");
        // console.log(info.notice.replace(/\r/gi, "").replace(/\n/gi, "<br/>"));
        const text =
            " Just because someone doesn't love you the way you want them to, doesn't mean theydon't love Just because someone doesn't love you the way you want them to, doesn'tmean they don't love";
        return info.notice
            ? group && (
                  <section className={styles.profile}>
                      <aside className={styles.title}>{localeFormat({ id: "mp_info" })}</aside>
                      {/* <div className={styles.text}>{info.notice}</div> */}

                      <div
                          className={showDescription ? styles.showDescription : styles.content}
                          ref={multiRow}
                          dangerouslySetInnerHTML={{
                              __html: info.notice.replace(/\r/gi, "").replace(/\n/gi, "<br/>"),
                          }}
                      ></div>
                      {/* <Paragraph
                          id="paragraphContent"
                          ellipsis={{
                              rows: 3,
                              expandable: true,
                              symbol: "more",
                          }}
                          className={styles.content}
                      >
                          {info.notice}
                          <div
                              //   style={{ whiteSpace: "pre" }}
                              dangerouslySetInnerHTML={{
                                  __html: info.notice.replace(/\r/gi, "").replace(/\n/gi, "<br/>"),
                              }}
                          />

                          {info.notice.replace(/\r/gi, "").replace(/\n/gi, "<br/>")}
                      </Paragraph> */}
                      {needMore ? (
                          <span
                              className={styles.showMore}
                              onClick={() =>
                                  this.setState({
                                      showDescription: !showDescription,
                                      needMore: !needMore,
                                  })
                              }
                          >
                              More
                          </span>
                      ) : null}
                  </section>
              )
            : null;
    }
}
