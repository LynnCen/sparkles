import { withTranslation } from "../i18n";
import Layout from "../components/common/Layout";
import Main from "../components/Home/Main";
import Index from "../components/Home/Index";
import Encryption from "../components/Home/Encryption";
import Private from "../components/Home/Private";
import Communication from "../components/Home/Communication";
import Deletion from "../components/Home/Deletion";
import Download from "../components/Home/Download";
import FooterBanner from "../components/Home/FooterBanner";
import axios from "axios";

const Home = (props) => (
  <Layout>
    <Main {...props} />
    <Index {...props} />
    <Encryption {...props} />
    <Private {...props} />
    <Communication {...props} />
    <Deletion {...props} />
    <Download {...props} />
    <FooterBanner {...props} />
  </Layout>
);

Home.getInitialProps = async () => {
    let linkObj = {}
    try {
        const res = await axios({
            baseURL: process.env.apiUrl,
            url:"/upgrade/apk.json",
            method:'get'
        })
        linkObj = res.data.data
    } catch (e) {
        console.log("error", e)
        linkObj = {}
    }
    return {
        namespacesRequired: ["common", "home"],
        linkObj,
    }
};

export default withTranslation("home")(Home);
