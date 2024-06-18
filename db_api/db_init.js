
// const db = mysql.createConnection({
//   host: "192.168.1.25",
//   user: "oscy",
//   port: 3306,
//   password: "admin",
//   database: "zuma_main",
// });
const mysql = require("mysql2");
// // exports.db = db;
const fs = require("fs");
const tls = require("tls");

const sslOptions = {
  ca: fs.readFileSync("./cert/DigiCertGlobalRootCA.crt.pem"), // CA certificate (optional)
  rejectUnauthorized: true, // Reject unauthorized connections (optional, true by default)
  secureProtocol: "TLSv1_2_method", // Specify the TLS version (optional)
};
// Create a connection to your MySQL database
const db = mysql.createConnection({
  host: "zuma.mysql.database.azure.com",
  user: "oscar",
  port: 3306,
  password: "Omariscool1234!",
  database: "zuma_main",
  ssl: sslOptions,
});
exports.db_init = () => {return db};
