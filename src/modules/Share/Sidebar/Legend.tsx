import { useState, useEffect } from "react";
import { connect } from "dva";
import Config from "../../../config/Config";
// import { importExcel } from "../../../utils/excel";
import LayerService from "../../../services/LayerService";
const css = require("../../../styles/custom.css");
const scss = require("../../../styles/scss/sharepage.scss");

export const Legend = connect(({ layerModel }, ownProps) => ({
  layers: layerModel.panels
}))(({ legendSource, layers, ...props }) => {
  const [legends, setLegends] = useState([]);
  useEffect(
    () => {
      if (layers.length) {
        const fileId = layers.reduce((r, c) => {
          r.push(
            ...c.legends.reduce((re, l) => {
              Array.isArray(l.dataId) &&
                re.push(
                  ...l.dataId.reduce(
                    (res, d) => (res.push(...d.children.map(e => e.id)), res),
                    []
                  )
                );
              return re;
            }, [])
          );
          return r;
        }, []);
        if (fileId.length) {
          LayerService.getSelectionList(
            { planId: Config.PLANID, fileId },
            (f, r) => {
              if (f && r.data.count) {
                getLegendData(r.data.list);
              }
            }
          );
        }
      }
    },
    [layers.length]
  );
  const getLegendData = async _legends => {
    setLegends(
      await Promise.all(
        [...new Set(_legends)].map((e: { jsonUrl }) =>
          fetch(Config.apiHost + e.jsonUrl).then(r => r.json())
        )
      ).then(r => r.filter(Array.isArray))
    );
  };
  return (
    <div
      className={scss["sidebar-legend"]}
      style={{ marginTop: layers.length ? 10 : 0 }}
    >
      <ul>
        {legends.map((l, i) => (
          <li key={l.id || i}>
            <div className={css["flex-center-between"]} data-text>
              {l.map((e, j) => (
                <span key={e.id || j}>{e.text}</span>
              ))}
            </div>
            <div
              data-color
              style={{
                backgroundImage: `linear-gradient(to right, ${l
                  .map(e => e.color)
                  .join(",")})`
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
});
