const http = require("http");
import app from "./app";
import mongocoonnect from "./services/DB/mongo";
const server = http.createServer(app);

async function startServer() {
  await mongocoonnect();
  server.listen(7000, () => {
    console.log("Server is running on http://localhost:4000");
  });
}
startServer();
