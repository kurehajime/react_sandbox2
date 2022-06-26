const fs = require("fs");    
const today = new Date();
const monthMM = ('0' + (today.getMonth() + 1)).slice(-2);
const dayDD = ('0' + today.getDate()).slice(-2);
const yyyymmdd = today.getFullYear()  + monthMM  + dayDD;
fs.writeFile(".env", 'VITE_BUILD_DATE=' + yyyymmdd, (err) => {
  if (err) throw err;
});