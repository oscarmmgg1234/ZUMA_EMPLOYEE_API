
// const db = mysql.createConnection({
//   host: "192.168.1.25",
//   user: "oscy",
//   port: 3306,
//   password: "admin",
//   database: "zuma_main",
// });
const mysql = require("mysql2");
const fs = require("fs");

const sslOptions = {
  ca: fs.readFileSync("./cert/DigiCertGlobalRootCA.crt.pem"), // CA certificate (optional)
  rejectUnauthorized: true, // Reject unauthorized connections (optional, true by default)
  secureProtocol: "TLSv1_2_method", // Specify the TLS version (optional)
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: "zuma.mysql.database.azure.com",
    user: "oscar",
    port: 3306,
    password: "Omariscool1234!",
    database: "zuma_main",
    ssl: sslOptions,
  });

  connection.connect((err) => {
    if (err) {
      console.log("Error connecting to MySQL:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  connection.on("error", (err) => {
    console.log("MySQL error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

exports.db_init = () => connection;
