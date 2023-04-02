import Polygon from "./Polygon";
import Config from "../../config/Config";
import Tools from "../tools/Tools";

const { vrPlanner, maps } = Config;
export default class Push extends Polygon {
    height: number;
    title: string;
    id: number;
    isNew: boolean;
    static pushs: any[] = [];

    constructor({
        height = 0,
        title = "塌陷" + Math.round(Math.random() * 100),
        vertices = [],
        id = 0,
        whethshare = false,
        isNew = false
    }) {
        super({ vertices, whethshare, polygonStyle: "TerrainModificationStyle" });
        this.isNew = isNew;
        this.height = height;
        this.title = title;
        this.id = id;
        this.isNew = false;
        this.type = "push";
        this.whethshare = whethshare;
        this.init();
    }

    init() {
        this.setHeight(this.height);
    }

    setHeight(height) {
        this.style.setHeight(
            (this.vertices.length ? this.vertices[0].z() : 0) + height
        );
    }

    remove() {
        const layer = maps.getLayerById("pushLayer");
        layer.removeFeature(this.polygon);
        Push.remove(this);
    }

    static getById(id: number) {
        for (let i = 0; i < this.pushs.length; i++) {
            const push = this.pushs[i];
            if (push.id === id) {
                return push;
            }
        }
        return null;
    }

    static set(push: Push) {
        push.isNew = false;
        Push.pushs.unshift(push);
        Push.pushs.sort(Tools.compare("id"));
        Push.pushs.reverse();
    }

    static remove(push: Push) {
        for (let i = 0; i < Push.pushs.length; i++) {
            const item = Push.pushs[i];
            if (item.id === push.id) {
                Push.pushs.splice(i, 1);
                break;
            }
        }
    }
}