const getBankTagColor = (bankName) => {
  switch (bankName) {
    case "HomeFirst":
      return "blue";
    case "HFFC Bank":
      return "blue";
    case "ICICI Bank":
      return "green";
    case "Aditya Bank":
      return "orange";
    case "Piramal Bank":
      return "volcano";
    case "HeroFinCorp Bank":
      return "geekblue";
    case "Sundaram Bank":
      return "gold";
    case "Chola Bank":
      return "cyan";
    case "Manapuram Bank":
      return "purple";
    case "piramalNPA Bank":
      return "lime";
    case "Samasta Bank":
      return "magenta";
    case "Fedral Bank":
      return "red";
    case "Profectus Bank":
      return "green";
    case "Protium Bank":
      return "orange";
    case "Agriwise Bank":
      return "cyan";
    case "IDFC Bank":
      return "gold";
    case "Bajaj Bank":
      return "blue";
    case "Bajaj Ameriya Bank":
      return "purple";
    case "DmiFinance Bank":
      return "magenta";
    case "ICICI HFC Bank":
      return "lime";
    default:
      return "default";
  }
};

export default getBankTagColor;
