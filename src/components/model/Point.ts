import Config from "../../config/Config";

export default class Point {
    point: any;
    geo: any;
    style: any;
    whethshare: boolean;
    contentId: number[];
    type: string = "";

    constructor({ geo, pointStyle, whethshare }) {
        this.point = new Config.vrPlanner.Feature.Point(geo);
        this.geo = geo;
        this.whethshare = !!whethshare;
        switch (pointStyle) {
            case "mark":
                this.style = new Config.vrPlanner.Style.PlacemarkStyle({
                    width: 25,
                    height: 25,
                    pivotY: 1,
                    scale: {
                        x: 0.03,
                        y: 0.03
                    },
                    autoScale: true,
                    autoScaleStart: 20,
                    autoScaleEnd: 400000
                });
                break;
            case "model":
                this.style = new Config.vrPlanner.Style.ModelStyle();
                break;
            case "point":
                this.style = new Config.vrPlanner.Style.PointStyle();
                this.point.setStyle(this.style);
                break;
            case "projected":
                this.style = new Config.vrPlanner.Style.ProjectedFeatureStyle();
                this.point.setStyle(this.style);
                break;
        }
    }

    setColor(color: string) {
        switch (this.style.getType()) {
            case "PointStyle":
                this.style.setColor(new Config.vrPlanner.Color(color));
                break;
            case "ProjectedFeatureStyle":
                this.style.setPointColor(new Config.vrPlanner.Color(color));
                break;
        }
    }

    setRadius(radius: number) {
        switch (this.style.getType()) {
            case "PointStyle":
                this.style.setRadius(radius);
                break;
            case "ProjectedFeatureStyle":
                this.style.setPointSize(radius);
                break;
        }
    }

    setOpacity(opacity: number) {
        this.point.setOpacity(opacity);
    }


    isVisible() {
        return this.point.isVisible();
    }

    setVisible(visible: boolean) {
        this.point.setVisible(visible);
    }

    active(time: number, vertices, vectors) {
        let _index = 0;
        setInterval(() => {
            let geo = this.point.getGeoLocation();
            geo = geo.add(vectors[_index].mul(8 * Math.random()));
            const d1 = vertices[_index].distance(vertices[_index + 1]);
            const d2 = vertices[_index].distance(geo);
            this.setOpacity(Math.random());
            if (d1 < d2) {
                _index = (_index + 1) % vectors.length;
                geo = vertices[_index].add(vectors[_index].mul(d2 - d1));
            }
            if (_index > vectors.length - 1) {
                _index = 0;
            }
            this.point.setGeoLocation(geo);
        }, time * 1000);
    }
}