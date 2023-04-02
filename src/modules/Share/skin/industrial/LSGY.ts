import { message } from "antd";
import { imageStitch } from "../../../../utils/canvas";
import ResourceList from "../../../List/ResourceList";

export default class LSGY {
  static key = "lsgyAuth";
  static checkAuth() {
    let lsgyAuth = localStorage.getItem(this.key) || "";
    try {
      lsgyAuth = JSON.parse(lsgyAuth);
    } catch (err) {
      console.log(err);
    } finally {
      return eval(lsgyAuth);
    }
  }
  static login(): Promise<{ access_token: string }> {
    const time = Date.now();
    return fetch(`${process.env.lsgyAPI}/auth/login`, {
      method: "post",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "username=18511337925&password=123456"
    })
      .then(r => r.json())
      .then(r => {
        let obj = {
          access_token: r.data.access_token,
          expires_in: time + (r.data.expires_in - 60) * 1000
        };
        localStorage.setItem(this.key, JSON.stringify(obj));
        return obj;
      })
      .catch(message.error);
  }
  static async getAuth(): Promise<{ access_token: string }> {
    const auth = this.checkAuth();
    if ((auth && auth.expires_in && Date.now() >= auth.expires_in) || !auth) {
      return await this.login();
    }
    return Promise.resolve(auth);
  }
  static async getComcount() {
    const { access_token } = await LSGY.getAuth();
    if (access_token) {
      return fetch(`${process.env.lsgyAPI}/interface/comcount`, {
        headers: { Authorization: `Bearer ${access_token}` }
      })
        .then(r => r.json())
        .catch(message.error);
    }
    return Promise.resolve();
  }
  static async getCompany() {
    const { access_token } = await LSGY.getAuth();
    const fetchPage = async (page = 1) =>
      fetch(
        `${
          process.env.lsgyAPI
        }/zone/company?keyword=&area_no=&trade=&outvalue=&staff_size=&area=&industry_code=&page=${page}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
        .then(r => r.json())
        .catch(message.error);
    let res = await fetchPage();
    const last_page = res.data.company.last_page;
    res = res.data.company.data;
    if (last_page > 1) {
      for (let i = 2; i <= last_page; i++) {
        res.push(...(await fetchPage(i)).data.company.data);
      }
    }
    return Promise.resolve(res);
  }
  static genCompanyMark = async companys => {
    const flags = ["sociaty", "has_partymember", "standard_sized", "billion_sized"];
    const data = await Promise.all(
      companys.map(async e => {
        const imageUrl = await imageStitch(
          flags
            .filter(f => e[f])
            .map(e => `${process.env.publicPath}images/placemarker/icon_${e}.png`),
          { type: "blob" }
        );
        return {
          title: e.company_name,
          lon: e.lon,
          lat: e.lat,
          _settings: { imageUrl, whethshare: true, altitude: 30 },
          tabs: [
            {
              type: "externalLink",
              name: e.company_name,
              icon: "/res/image/icon/admin/22111565593485350.png",
              items: [],
              str: `${process.env.publicPath}lsgy/?id=${e.id}`
            }
          ]
        };
      })
    );
    ResourceList.handlePointsData(data);
  };
}
