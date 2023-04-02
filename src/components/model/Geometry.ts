import Polygon from "./Polygon";
import { Balloon } from "./Mark";
import Config from "../../config/Config";
import Tools from "../tools/Tools";

const { vrPlanner, maps } = Config;
export default class Geometry extends Polygon {
    height: number;
    altitude: number;
    _title: string;
    isNew: boolean;
    id: number;
    level: boolean;
    polygonStyle: string;
    whethshare: boolean;
    balloon: any;
    static geometrys: any[] = [];

    // line: any;
    constructor({
        color = "7ED321CC",
        height = 30,
        altitude = 0,
        vertices = [],
        title = "新体块" + Math.round(Math.random() * 100),
        id = 0,
        opacity = 1,
        level = false,
        polygonStyle = "ExtrudeStyle",
        whethshare = false,
        contentId = []
    }) {
        super({ color, vertices, opacity, polygonStyle, whethshare });
        this.isNew = false;
        this.height = height;
        this.altitude = altitude;
        this.title = title;
        this.id = id;
        this.type = "area";
        this.level = level;
        this.polygonStyle = polygonStyle;
        this.setAltitude(altitude, level);
        this.setTransition();
        this.polygon.setStyle(this.style);
        // this.balloon = new vrPlanner.Balloon(
        //   `<div style="color: #fff">${title}</div>`
        // );
        this.balloon = new Balloon({ id, title, contentId });
        this.balloon.setVisible(false);
        this.polygon.setBalloon(this.balloon);
        this.polygon.bindEvent("mouseenter", () => {
            this.setOpacity(0.8);
            this.balloon.setVisible(true);
            this.polygon.bindEvent("mouseleave", () => {
                this.setOpacity(this.opacity);
                if (!this.balloon.showMessage) this.balloon.setVisible(false);
            });
        });
        this.polygon.bindEvent("click", e => {
            if (e.isLeftClick()) {
                if (this.balloon.showMessage) this.balloon.showBalloonData();
                else {
                    this.balloon.active();
                    Geometry.geometrys
                        .filter(g => g.id != this.id)
                        .forEach(g => g.balloon.showBalloonData(true));
                }
            }
        });
        this.setHeight(height);
        // this.setLine();
    }

    init() {
        if (this.polygonStyle !== this.style.getType()) {
            switch (this.polygonStyle) {
                case "ExtrudeStyle":
                    this.style = new vrPlanner.Style.ExtrudeStyle();
                    this.setTransition();
                    break;
                case "ProjectedFeatureStyle":
                    this.style = new vrPlanner.Style.ProjectedFeatureStyle();
                    break;
            }
        }
        this.setAltitude(this.altitude, this.level);
        this.setHeight(this.height);
        this.setColor(this.color);
        this.setStyle(this.polygonStyle, this.color, this.height);
        this.setOpacity(this.opacity);
        this.balloon.showBalloonData(true);
    }

    get title() {
        return this._title;
    }

    set title(title) {
        this._title = title;
        this.balloon &&
            ((this.balloon.title = title), this.balloon.setTitle({ title }));
    }

    get contentId() {
        return this.balloon.contentId;
    }

    set contentId(id: number[]) {
        this.balloon.contentId = id;
    }

    setHeight(height: number) {
        switch (this.style.getType()) {
            case "ExtrudeStyle":
                this.style.setHeight(height);
                break;
        }
        this.balloon.setOffsetY(this.altitude + height);
    }

    setAltitude(altitude: number, level: boolean) {
        switch (this.style.getType()) {
            case "ExtrudeStyle":
                if (this.vertices && this.vertices.length) {
                    const z = this.vertices[0].z() + altitude;
                    const newArray: any = [];
                    this.vertices.forEach(vertex => {
                        if (!level) {
                            const geo = new vrPlanner.GeoLocation(
                                vertex.x(),
                                vertex.y(),
                                vertex.z() + altitude
                            );
                            newArray.push(geo);
                        } else {
                            const geo = new vrPlanner.GeoLocation(
                                vertex.x(),
                                vertex.y(),
                                z
                            );
                            newArray.push(geo);
                        }
                    });
                    this.polygon.clearVertices();
                    this.polygon.addVertices(newArray);
                }
                break;
        }
    }

    setAtrr(height: number, color: string) {
        switch (this.style.getType()) {
            case "ExtrudeStyle":
                this.style.setHeight(height);
                this.style.setColor(new vrPlanner.Color(color));
                break;
            case "ProjectedFeatureStyle":
                this.style.setPolygonColor(new vrPlanner.Color(color));
                break;
        }
    }

    getId() {
        return this.polygon.getId();
    }

    remove() {
        const layer = maps.getLayerById("areaLayer");
        layer.removeFeature(this.polygon);
        Geometry.remove(this);
    }

    active(time) {
        if (!this.whethshare) {
            this.setHeight(1);
            this.setVisible(true);
            setTimeout(() => {
                this.setHeight(this.height);
            }, 1000);
        }
    }
    static set(geometry: Geometry) {
        geometry.isNew = false;
        Geometry.geometrys.unshift(geometry);
        Geometry.geometrys.sort(Tools.compare("id"));
        Geometry.geometrys.reverse();
    }

    static remove(geometry: Geometry) {
        for (let i = 0; i < Geometry.geometrys.length; i++) {
            const item = Geometry.geometrys[i];
            if (item.id === geometry.id) {
                Geometry.geometrys.splice(i, 1);
                break;
            }
        }
    }
    private setTransition() {
        switch (this.style.getType()) {
            case "ExtrudeStyle":
                const colInterPol = new vrPlanner.Interpolation.CubicBezier(
                    0.1,
                    0.6,
                    0.15,
                    0.7
                );
                const TransTime = 1.5;
                const colTrans = new vrPlanner.Transition(
                    TransTime,
                    colInterPol
                );
                const heightInterPol = vrPlanner.Interpolation.CubicBezier.EASE;
                const heightTrans = new vrPlanner.Transition(
                    TransTime,
                    heightInterPol
                );
                this.style.bindTransition("color", colTrans);
                this.style.bindTransition("height", heightTrans);
                break;
        }
    }

    static getById(id: number) {
        for (let i = 0; i < this.geometrys.length; i++) {
            const geometry = this.geometrys[i];
            if (geometry.id === id) {
                return geometry;
            }
        }
        return null;
    }
}