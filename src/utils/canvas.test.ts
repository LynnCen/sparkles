import { imageStitch } from "./canvas";

it("imageStitch without crashing", async () => {
  const url = await imageStitch(
    new Array(4).fill(0).map((n, i) => `http://127.0.0.1:3000/images/placemarker/icon_${i}.png`)
  );
  console.log("url", url);
});
