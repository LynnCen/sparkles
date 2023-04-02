import Config from "../../config/Config";
import Tools from "../tools/Tools";
import TerrainService from "../../services/TerrainService";
import { Mark } from ".";

const { maps, vrPlanner, ScenesSetData } = Config
export default class Terrain {
    id: number;
    opacity: number;
    altitude: number;
    url: string;
    layer: any;
    static terrains: Terrain[] = [];
    title: string;

    constructor({
        id = 0,
        opacity = 1,
        altitude = 0,
        url = "",
        isFocus = false,
        title = "",
        minLevel = 6,
        maxLevel = 22,
        windowSize = 1
    }) {
        this.layer = new vrPlanner.Layer.A3XTerrainLayer(
            `terrain${id}`,
            url
        );
        if (Config.PLANID === 2371) {
            if (id != 1393) {
                this.setVisible(false);
            }
        }
        this.layer.setLodMaxLevel(Number(maxLevel));
        this.layer.setLodMinLevel(Number(minLevel));
        this.layer.setLodWindowSize(256 * (Number(windowSize) + 1));
        this.layer.setMaxLevelSkip(8);
        this.layer.setFocusOnTerrain(isFocus);
        this.url = url;
        this.id = id;
        this.opacity = opacity;
        this.altitude = altitude;
        this.setAltitude(altitude);
        this.setOpacity(opacity);
        this.title = title;
        maps.addLayer(this.layer);
    }

    init() {
        this.setAltitude(this.altitude);
        this.setOpacity(this.opacity);
    }

    setOpacity(opacity: number) {
        this.opacity = opacity;
        this.layer.setOpacity(opacity);
    }

    setAltitude(altitude: number) {
        this.layer.setTranslation(
            new vrPlanner.Math.Double3(0, 0, altitude)
        );
    }

    remove() {
        maps.removeLayer(this.layer);
        Terrain.delTerrain(this);
    }

    focus() {
        this.layer.focus();
    }

    active(time: number = 8) {
        try {
            const aabb = this.layer.getMirroredLayerSettings().g.o;
            const maxAltitude = aabb.c + aabb.f - 20;
            const F = 30;
            this.layer.setTranslation(
                new vrPlanner.Math.Double3(0, 0, -maxAltitude)
            );
            const offsetZ = (this.altitude + maxAltitude) / (time * F);
            let i = 0;
            let j = 0;
            const camera = maps.getCamera();
            let lookAt;
            let isMove = true;
            const waitLookat = setInterval(() => {
                lookAt = camera.getFocusPosition();
                if (isMove) j -= 0.00001;
                else j += 0.00001;
                if (lookAt) {
                    clearInterval(waitLookat);
                    const position = camera.getPosition();
                    const interval = setInterval(() => {
                        i++;
                        j += 0.003;
                        if (i >= time * F) {
                            clearInterval(interval);
                            this.init();
                        }
                        camera.setPosition(
                            position.add(new vrPlanner.Math.Double3(0, 0, j))
                        );
                        this.layer.setTranslation(
                            new vrPlanner.Math.Double3(
                                0,
                                0,
                                -maxAltitude + i * offsetZ
                            )
                        );
                    }, 1000 / F);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    getInnerBounds() {
        return this.layer.getInnerBounds();
    }

    setVisible(isVisible: boolean) {
        this.layer.setVisible(isVisible);
    }

    isVisible() {
        return this.layer.isVisible();
    }

    static addTerrain(terrain: Terrain) {
        Terrain.terrains.unshift(terrain);
        Terrain.terrains.sort(Tools.compare("id"));
        Terrain.terrains.reverse();
    }

    static getById(id: number) {
        for (let i = 0; i < this.terrains.length; i++) {
            const terrain = this.terrains[i];
            if (terrain.id === id) {
                return terrain;
            }
        }
        return null;
    }

    static delTerrain(terrain: Terrain) {
        for (let i = 0; i < Terrain.terrains.length; i++) {
            const item = Terrain.terrains[i];
            if (item.id === terrain.id) {
                Terrain.terrains.splice(i, 1);
                break;
            }
        }
    }

    static isExist(id: number) {
        for (let i = 0; i < Terrain.terrains.length; i++) {
            const item = Terrain.terrains[i];
            if (item.id === id) {
                return true;
            }
        }
        return false;
    }
}