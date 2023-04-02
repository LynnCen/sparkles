import { useState, useEffect } from "react";
import React from "react";

export function Pagination({
  total,
  onPrevious = (e) => null,
  onNext = (e) => null,
  onChange = (page) => null,
  pageSize = 2,
  ...props
}) {
  const [page, setPage] = useState(1);
  const onPageChange = (page) => {
    setPage(page);
    onChange(page);
  };
  useEffect(() => {
    setPage(1);
  }, [total]);
  return (
    <div className={"card-layout-pagination"}>
      <span
        onClick={(e) => {
          total > pageSize && onPageChange(page == 1 ? Math.ceil(total / pageSize) : page - 1);
          onPrevious(e);
        }}
        data-previous
      >
        <img src={require("assets/icon/icon_left1.png")} alt="" />
      </span>
      <span
        style={{
          fontSize: "smaller",
          textAlign: "center",
          display: "inline",
        }}
      >
        {page}/{Math.ceil(total / pageSize)}
      </span>
      <span
        onClick={(e) => {
          total > pageSize && onPageChange(page < total / pageSize ? page + 1 : 1);
          onNext(e);
        }}
        data-next
      >
        <img src={require("assets/icon/icon_right1.png")} alt="" />
      </span>
    </div>
  );
}
