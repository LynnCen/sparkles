import Axios from "axios";

export default class Service {
  static getTownName(params: { x: number; y: number }) {
    return Axios.get("/home/town_name_by_point", { params });
  }
}
