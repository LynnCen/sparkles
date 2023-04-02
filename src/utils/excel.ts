// import XLSX from "xlsx";
import { message } from "antd";

export async function importExcel(file: File, json = true) {
  // const {files} = file.target;
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  return new Promise((resolve, reject) => {
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      console.log(e);
      const XLSX = await import(/* webpackChunkName: "xlsx" */ "xlsx")
        .then(r => r)
        .catch(message.error);
      try {
        /* Parse data */
        const result = e.target!.result;
        const workbook = XLSX.read(result, { type: "binary" });
        /* Get first worksheet */
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        /* Convert array of arrays */
        let data: Array<any> = XLSX.utils.sheet_to_json(ws, { header: 1 });
        // console.log(ws, data, make_cols(ws["!ref"]));
        // for(const sheet in workbook.Sheets) {
        // }
        // console.log(data);
        if (json) {
          const res = [];
          data.length > 1 &&
            data.slice(1).forEach(item => {
              res.push(
                data[0].reduce((r, c, i) => {
                  r[c] = item[i];
                  return r;
                }, {})
              );
            });
          resolve(res);
        }
        resolve(data);
      } catch (e) {
        console.table(e);
        reject(e);
      }
    };
  });
}
/* make_cols(ws["!ref"]) generate an array of column objects */
const make_cols = refstr => {
  let o: Array<{ name; key }> = [],
    C = XLSX.utils.decode_range(refstr).e.c + 1;
  console.log(C);
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};
