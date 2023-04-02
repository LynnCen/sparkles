import Config from "../../config/Config";

export default class Dimension {
    static Dimension(isToggle) {
        const { maps, vrPlanner } = Config;
        let timer: any = null;
        const m = maps.getCamera();
        const t = Math.abs(m.getPitch());
        const n = isToggle ? 89.9999e13 : 0;
        const d = Math.max(45, n);
        m.getFocusPosition((e) => {
            let geo = e.getGeoLocation();
            if (geo === null && isToggle) {
                m.flyTo(m.getPosition(), m.getPosition());
                timer = setTimeout(() => {
                    m.setMinPitch(n);
                    timer = null;
                }, 1e3);
                return;
            }
            if (Math.abs(geo.getLongitude()) < 1) {
                return m.setMinPitch(n);
            }
            if (geo !== null) {
                const a = m.getYaw();
                const c = (new vrPlanner.Math.Double4x4.create()).rotate(0, 0, 1, -a);
                const u = (new vrPlanner.Math.Double4x4.create()).rotate(1, 0, 0, -((isToggle ? n : d) - t));
                const l = (new vrPlanner.Math.Double4x4.create()).rotate(0, 0, 1, a);
                const s = m.getPosition();
                let g = new vrPlanner.Math.Double4(s.x(), s.y(), s.z(), 0).sub(new vrPlanner.Math.Double4(geo.x(), geo.y(), geo.z(), 0));
                g = c.mul(g);
                g = u.mul(g);
                g = l.mul(g);
                const f = new vrPlanner.Math.Double4(geo.x(), geo.y(), geo.z(), 0).add(g);
                geo = new vrPlanner.GeoLocation(geo.getLongitude(), geo.getLatitude(), geo.getAltitude());
                const p = new vrPlanner.GeoLocation(f.x(), f.y(), f.z());
                const tran = new vrPlanner.Transition(.16, vrPlanner.Interpolation.CubicBezier.EASE);
                isToggle ? m.flyTo(p, geo, !0) : m.flyTo(m.getPosition(), m.getLookAt(), false, tran);
                if (!isToggle) {
                    tran.bindEvent('transitioncompleted transitioncancelled', () => {
                        m.flyTo(p, geo);
                    });
                }
                timer = setTimeout(() => {
                    m.setMinPitch(n);
                    timer = null;
                }, 16);
            }
        });
    }
}