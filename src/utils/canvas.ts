import DataService from "../services/DataService";
import StrConfig from "../config/StrConfig";

export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function blobToDataURL(blob) {
  let fr = new FileReader();
  fr.readAsDataURL(blob);
  return new Promise((resolve, reject) => {
    fr.onload = e => resolve(e.target!.result);
  });
}

export async function imageStitch(
  urls: string[],
  options = { type: "base64" }
) {
  if (Array.isArray(urls)) {
    if (urls.length >= 1) {
      const canvas = document.createElement("canvas")! as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      let height = 0,
        width = 0;
      const sizePos: { size: number; pos: number }[] = [];
      const imgs = await Promise.all(
        urls.map(async (url, i) => {
          let img = new Image();
          img.src = url;
          return new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => {
              let gap = i < urls.length - 1 ? 5 : 0;
              height = Math.max(height, img.height);
              sizePos.push({ size: img.width, pos: width });
              width += img.width + gap;
              resolve(img);
            };
            img.onerror = reject;
          });
        })
      );
      canvas.width = width;
      canvas.height = height;
      imgs.forEach((img, i) => {
        ctx.drawImage(img, sizePos[i].pos, 0, sizePos[i].size, sizePos[i].size);
      });
      if (options.type == "blob") {
        return new Promise((resolve, reject) => {
          canvas.toBlob(async blob => {
            let data = {
              stage: "设计阶段",
              major: "港口",
              name: "test1",
              iconClassId: 8,
              projectId: 1017,
              type: 1
            };
            const formData = new FormData();
            Object.assign(data, { file: blob });
            Object.keys(data).forEach(key => formData.append(key, data[key]));
            DataService.upload(
              formData,
              StrConfig.UploadIcon,
              (flag: boolean, res) => {
                if (flag) resolve(res.data.url);
                else reject(res.message);
              }
            );
          });
        });
      } else {
        const url = canvas.toDataURL("image/png");
        return url;
      }
    } else return "";
  }
}

export async function htmlToSvg(
  html: string = `<div><em>example<em></div>`
  // options = { type: "base64" }
) {
  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.append(div);
  const width = div.children.length ? div.children[0].clientWidth + 10 : 0;
  console.log(width);
  let svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${div.clientHeight}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" >
          ${html}
        </div>
      </foreignObject>
    </svg>`;
  document.body.removeChild(div);
  const svg = new Blob([svgHtml], { type: "image/svg+xml;charset=utf-8" });

  // const url = URL.createObjectURL(svg); //
  // const img = new Image();
  // img.src = url;
  // document.body.append(img);

  // return new Promise((resolve, reject) => {
  //   img.onload = function() {
  //     console.log(img);
  //     console.log(img.src);
  //     return resolve(url);
  //     // ctx.drawImage(img, 0, 0);
  //     // URL.revokeObjectURL(url); //
  //   };
  // });

  return await blobToDataURL(svg);
  // img.src = url;
  // img.onload = function() {
  //   console.log(img);
  //   URL.revokeObjectURL(url); //
  //   return url;
  // };
}
