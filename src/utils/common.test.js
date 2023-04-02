import { getOpacityFromColor, getOpaqueFromColor } from "./common";

describe("getOpacityFromColor", function() {
  it("opacity of color '#7ED32199' is `60`", function() {
    expect(getOpacityFromColor("#7ED32199")).toBe(60);
  });
  it("opacity of color '7ed32199' is `60`", function() {
    expect(getOpacityFromColor("7ED32199")).toBe(60);
  });
  it("opacity of color '#7ED321ss' is `NaN`", function() {
    expect(getOpacityFromColor("#7ED321ss")).toBe(NaN);
  });
  it("opacity of color '7ED321ss' is `NaN`", function() {
    expect(getOpacityFromColor("7ED321ss")).toBe(NaN);
  });
});
describe("getOpaqueFromColor", function() {
  it("opaque color of '#7ED32199' is `7ED321`", function() {
    expect(getOpaqueFromColor("#7ED32199")).toBe("7ED321");
  });
  it("opaque color of '7ed32199' is `7ED321`", function() {
    expect(getOpaqueFromColor("7ED32199")).toBe("7ED321");
  });
  it("opaque color of '#7ED321ss' is ``", function() {
    expect(getOpaqueFromColor("#7ED321ss")).toBe("");
  });
  it("opaque color of '7ED321ss' is ``", function() {
    expect(getOpaqueFromColor("7ED321ss")).toBe("");
  });
});
