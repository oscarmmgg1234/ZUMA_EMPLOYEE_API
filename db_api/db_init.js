
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

// Create a connection pool to your MySQL database
const pool = mysql.createPool({
  host: "zuma.mysql.database.azure.com",
  user: "oscar",
  port: 3306,
  password: "Omariscool1234!",
  database: "zuma_main",
  ssl: sslOptions,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

// Function to keep the connection alive
const keepAliveQuery = async () => {
  try {
    await promisePool.query("SELECT 1");
  } catch (err) {
    console.log("Error with keep-alive query:", err);
  }
};

// Keep the connection alive by sending a query every 60 seconds
setInterval(keepAliveQuery, 60000); // every 60 seconds

// Wrapper object to mimic the original db interface
const db = {
  connect: (callback) => {
    // Simulate the connect method for compatibility
    if (callback) callback();
  },
  query: (sql, params, callback) => {
    return promisePool
      .query(sql, params)
      .then(([rows, fields]) => {
        if (callback) callback(null, rows, fields);
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  },
  execute: (sql, params, callback) => {
    return promisePool
      .execute(sql, params)
      .then(([result]) => {
        if (callback) callback(null, result);
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  },
  end: () => promisePool.end(),
};

exports.db_init = () => db;
