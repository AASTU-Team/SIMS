const http = require("http");
import app from "./app";
// import mongocoonnect from "./services/DB/mongo";
const server = http.createServer(app);
require("dotenv").config();

async function startServer() {
  // await mongocoonnect();
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}
startServer();
