import { message } from "antd";
import Config from "../../config/Config";
import DataService from "../../services/DataService";
import ModelBase from "./ModelBase";
import Tools from "../tools/Tools";
import OpenTerrain from "../../modules/Menu/OpenTerrain";

const { vrPlanner, maps } = Config;

export default class Model extends ModelBase {
    id: number;
    title: string;
    isNew: boolean;
    imageUrl: string;
    isModify: boolean;
    whethshare: boolean;
    static models: Model[] = [];

    constructor({
        geo,
        id = 0,
        title,
        url,
        color = "",
        scale = [1, 1, 1],
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        opacity = 1,
        imageUrl = "",
        whethshare = false,
        altitudeMode = vrPlanner.Feature.ALTITUDE_MODE_ABSOLUTE
    }) {
        super({
            geo,
            url,
            color,
            scale,
            rotateX,
            rotateY,
            rotateZ,
            opacity,
            altitudeMode
        });
        this.isNew = false;
        this.id = id;
        this.type = "build";
        this.title = title;
        this.isNew = false;
        this.isModify = false;
        this.imageUrl = imageUrl;
        this.whethshare = whethshare;
    }

    init() {
        super.init();
        // this.setScale(this.scale);
        // this.setRotation(this.rotate);
        // this.setOpacity(this.opacity);
        // this.setPosition(this.geo.x(), this.geo.y(), this.geo.z());
        // this.setModel(this.url);
        this.isModify = false;
    }

    static getById(id: number) {
        for (let i = 0; i < this.models.length; i++) {
            const model = this.models[i];
            if (model.id === id) {
                return model;
            }
        }
        return null;
    }

    save(fn?) {
        this.geo = this.point.getGeoLocation();
        this.scale = [
            this.style.getScale().x,
            this.style.getScale().y,
            this.style.getScale().z
        ];
        const euler = this.getRotation();
        this.opacity = this.style.getOpacity();
        this.rotateX = euler.getX();
        this.rotateY = euler.getY();
        this.rotateZ = euler.getZ();
        this.init();
        DataService.modData(
            {
                id: this.id,
                title: this.title,
                scaleX: this.scale[0],
                scaleY: this.scale[1],
                scaleZ: this.scale[2],
                rotateX: this.rotateX,
                rotateY: this.rotateY,
                rotateZ: this.rotateZ,
                altitude: this.geo.z(),
                position: `[${this.geo.x()},${this.geo.y()},${this.geo.z()}]`,
                color: this.color,
                opacity: this.opacity,
                type: "build",
                planId: Config.PLANID,
                username: Config.USERNAME,
                whethshare: this.whethshare
            },
            (flag, res) => {
                if (flag) {
                    fn && fn();
                } else {
                    message.error(res.message);
                }
            }
        );
    }

    add(fn?) {
        DataService.addData(
            {
                title: this.title,
                scaleX: this.scale[0],
                scaleY: this.scale[1],
                scaleZ: this.scale[2],
                rotateX: this.rotateX,
                rotateY: this.rotateY,
                rotateZ: this.rotateZ,
                altitude: this.geo.z(),
                position: `[${this.geo.x()},${this.geo.y()},${this.geo.z()}]`,
                color: this.color,
                type: "build",
                planId: Config.PLANID,
                username: Config.USERNAME,
                imageUrl: this.imageUrl,
                url: this.url
            },
            (flag, res) => {
                if (flag) {
                    this.id = res.data;
                    fn && fn();
                    Model.set(this);
                } else {
                    message.error(res.message);
                }
            }
        );
    }

    remove() {
        const layer = Config.maps.getLayerById("buildLayer");
        layer.removeFeature(this.point);
        Model.remove(this);
    }

    copy() {
        const obj = new Model(this);
        const _this = obj;
        _this.init();
        _this.add(OpenTerrain.BindClick(_this));
        const layer = maps.getLayerById("buildLayer");
        layer.addFeature(_this.point);
    }

    static set(model: Model) {
        model.isNew = false;
        Model.models.unshift(model);
        Model.models.sort(Tools.compare("id"));
        Model.models.reverse();
    }

    static remove(model: Model) {
        for (let i = 0; i < Model.models.length; i++) {
            const item = Model.models[i];
            if (item.id === model.id) {
                Model.models.splice(i, 1);
                break;
            }
        }
    }
}