const fs = require("fs");
const https = require("https");
import app from "./app";
// import mongocoonnect from "./services/DB/mongo";

const server = https.createServer(
  { key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") },
  app
);

require("dotenv").config();

async function startServer() {
  // await mongocoonnect();
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}
startServer();
