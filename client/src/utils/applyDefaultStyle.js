// utils/applyDefaultStyle.js
export const applyDefaultStyles = (worksheet) => {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellRef];
      if (!cell) continue; // खाली सेल छोड़ दो

      // style object initialise करो
      cell.s = cell.s || {};

      /** 🟡 Border **/
      cell.s.border = {
        top: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
      };

      /** 🟢 Alignment **/
      cell.s.alignment = {
        horizontal: R === 0 ? "center" : "left", // पहली row centre, बाकी left
        vertical: "center",
        wrapText: true,
      };
    }
  }
};
