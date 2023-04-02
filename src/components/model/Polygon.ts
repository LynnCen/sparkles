import Config from "../../config/Config";

const { vrPlanner, maps } = Config;
export default class Polygon {
    polygon: any; //vrplanner.Feature.Polygon()
    vertices: any[]; //vrplanner.GeoLocation
    color: string; //"#ffffff55"
    opacity: number;
    style: any;
    type: string = "";
    whethshare: boolean;
    contentId: number[];

    constructor({
        color = "#ffffff55",
        vertices = [],
        opacity = 1,
        polygonStyle = "ExtrudeStyle",
        whethshare = false
    }) {
        this.polygon = new vrPlanner.Feature.Polygon();
        switch (polygonStyle) {
            case "ExtrudeStyle":
                this.style = new vrPlanner.Style.ExtrudeStyle();
                break;
            case "ProjectedFeatureStyle":
                this.style = new vrPlanner.Style.ProjectedFeatureStyle();
                break;
            case "TerrainModificationStyle":
                this.style = new vrPlanner.Style.TerrainModificationStyle();
        }
        this.polygon.setStyle(this.style);
        this.vertices = vertices;
        this.color = color;
        this.opacity = opacity;
        this.whethshare = whethshare;
        this.setOpacity(opacity);
        this.setColor(color);
        if (this.vertices && this.vertices.length > 0) {
            this.polygon.addVertices(vertices);
        }
    }

    setStyle(polygonStyle: string, color: string, height: number) {
        switch (polygonStyle) {
            case "ExtrudeStyle":
                this.style = new vrPlanner.Style.ExtrudeStyle();
                this.style.setColor(new vrPlanner.Color(color));
                this.style.setHeight(height);
                break;
            case "ProjectedFeatureStyle":
                this.style = new vrPlanner.Style.ProjectedFeatureStyle();
                this.style.setPolygonColor(new vrPlanner.Color(color));
                break;
        }
        this.polygon.setStyle(this.style);
    }

    addVertex(geo: any) {
        /**
         * @description 添加顶点
         * @param geo vrplanner.GeoLocation
         */
        this.polygon.addVertex(geo);
    }

    setVertex(index, geo) {
        const vertices = this.vertices;
        vertices[index] = geo;
        this.setVerteices(vertices);
    }

    getVerteices() {
        return this.polygon.getVerteices();
    }

    delVertex(index: number) {
        const vertices = this.vertices;
        vertices.splice(index, 1);
        this.setVerteices(vertices);
    }

    setColor(color: string) {
        const style = this.polygon.getStyle();
        if (style) {
            switch (style.getType()) {
                case "ExtrudeStyle":
                    style.setColor(new vrPlanner.Color(color));
                    break;
                case "ProjectedFeatureStyle":
                    style.setPolygonColor(new vrPlanner.Color(color));
                    break;
            }
        }
    }

    isVisible() {
        return this.polygon.isVisible();
    }

    setVisible(visible: boolean) {
        this.polygon.setVisible(visible);
    }

    setOpacity(opacity) {
        const style = this.style;
        if (style) {
            if (style.getType() !== "TerrainModificationStyle") {
                style.setOpacity(opacity);
            }
        }
    }

    private setVerteices(vertices) {
        this.polygon.clearVertices();
        this.polygon.addVertices(vertices);
    }



    getNumVertices() {
        return this.polygon.getNumVertices();
    }

    focus() {
        const aabb = this.polygon.getAABB();
        const x = aabb.getHalfLengthX();
        const y = aabb.getHalfLengthY();
        const z = aabb.getHalfLengthZ();
        let side = 5;
        if (x > 2.5) {
            side = 25;
        } else if (y > 2.5) {
            side = 25;
        } else if (z > 2.5) {
            side = 25;
        }
        maps
            .getCamera()
            .flyTo(
                this.polygon
                    .getGeoLocation()
                    .add(new vrPlanner.Math.Double3(x + side, y + side, z + side)),
                this.polygon.getGeoLocation()
            );
    }
}
