console.log("Hello Node")
const fs = require('fs');
console.log("Package Type: " + (fs.readFileSync('./package.json').includes('"type": "module"') ? "ESM" : "CJS"));
