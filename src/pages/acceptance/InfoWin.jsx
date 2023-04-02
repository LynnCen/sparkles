/* eslint-disable no-undef */
import React, { useRef } from "react";
import { Image, Row, Col } from "antd";

export default function InfoWin({ data }) {
  const ref = useRef();
  return (
    <div>
      {data.slice(0, 5).map((e, i) => {
        return (
          <Row key={i} style={{ lineHeight: "28px" }}>
            <Col style={{ width: "5rem" }}>{e.label}</Col>
            <Col>
              {e.value}
              {e.key == "result" ? (
                <>
                  &nbsp;(
                  <a
                    style={{ color: "red" }}
                    onClick={(e) => {
                      ref.current.children[0].click();
                    }}
                  >
                    查看详情
                  </a>
                  )
                </>
              ) : (
                ""
              )}
            </Col>
          </Row>
        );
      })}
      <div ref={ref}>
        <Image.PreviewGroup ref={ref}>
          {data
            .find((d) => d.key == "picUrl")
            .value.split(",")
            .map((src, i) => (
              <Image key={i} loading={"lazy"} hidden src={src} />
            ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
}
