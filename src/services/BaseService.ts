import HttpPost from "../utils/HttpPost";
import Config from "../config/Config";

abstract class BaseService {
  static request(url: string): HttpPost {
    return new HttpPost(Config.getAPI(url));
  }
  static completeUrl(url: string): HttpPost {
    return new HttpPost(url);
  }
}

export default BaseService;
