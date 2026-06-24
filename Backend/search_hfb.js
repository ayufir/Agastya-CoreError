const fs = require("fs");
const file = "d:\\Agastya CoreError\\banker-main\\client\\src\\pages\\Bank-Form\\Home-FirstBank\\HomeFirstBank.jsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");
lines.forEach((line, index) => {
  if (line.includes("handleDownloadAll") || line.includes("Download") || line.includes("download")) {
    console.log(`${index + 1}: ${line}`);
  }
});
