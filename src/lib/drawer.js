$(document).ready(function () {
  let isClick = false;

  let obj = {
    width: "80vw",
    transform: "translateX(100%)",
  };

  let fn = function () {
    let resultObj = isClick ? obj : { ...obj, transform: "translateX(0)" };
    $("body").css({ overflow: !isClick ? "hidden" : "auto" });
    $(".tmm-drawer").toggleClass("tmm-drawer-open");
    $(".collapse-header").toggleClass("tmm-collapsed");
    $(".tmm-drawer-content-wrapper").css(resultObj);
    isClick = !isClick;
  };

  $(".collapse-header").click(fn);
  $(".tmm-drawer-mask").click(fn);

  let isClickMenu = false;

  let fun = function (e) {
    if (isClickMenu) return;
    e.stopPropagation();
    $(".tmm-dropdown")
      .css({ right: 0, top: 63 })
      .toggleClass("tmm-dropdown-hidden");
    isClickMenu = !isClickMenu;
  };
  $(".language_change").click(fun);

  $("body").click(function (e) {
    if (!isClickMenu) return;
    e.stopPropagation();
    $(".tmm-dropdown").toggleClass("tmm-dropdown-hidden");
    $(".tmm-dropdown-indrawer").toggleClass("tmm-dropdown-hidden");
    isClickMenu = !isClickMenu;
  });

  $(".tmm-drawer-language").click(function (e) {
    if (isClickMenu) return;
    e.stopPropagation();
    $(".tmm-dropdown-indrawer")
      .css({ left: 0, top: -45 })
      .toggleClass("tmm-dropdown-hidden");
    isClickMenu = !isClickMenu;
  });

  $(".tmm-drawer").click(function (e) {
    if (!isClickMenu) return;
    e.stopPropagation();
    $(".tmm-dropdown-indrawer").toggleClass("tmm-dropdown-hidden");
    isClickMenu = !isClickMenu;
  });
});
