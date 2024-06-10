const http = require("http");
import { Server } from "socket.io";
import app from "./app";
import mongocoonnect from "./services/DB/mongo";
const server = http.createServer(app);

export const io = new Server(server, {});
// const clientToSocketMap = new Map();

io.use((socket: any, next) => {
  const id = socket.handshake?.headers.authentication;
  console.log(socket);
  // Verify the token here
  socket["id"] = id;
  next();
});

io.on("connection", (socket: any) => {
  console.log(socket.id, socket.user_id);
  // notify students about registration req id and name=student
  socket.on("registrarion", (registrationGroup: any) => {
    // registrationGroup = JSON.parse(registrationGroup);
    socket.join("student");
    // console.log(
    //   `User joined group: ${registrationGroup.name + registrationGroup.id}`
    // );
  });
  socket.on("send_registration_message", (registrationGroup: any) => {
    registrationGroup = JSON.parse(registrationGroup);

    io.to(registrationGroup.name + registrationGroup.id).emit(
      "registrarion",
      "hi frm admin"
    );
  });
  socket.on("send_specific_message", (registerData: any) => {
    registerData = JSON.parse(registerData);
    io.to(registerData.id).emit("privatedata", "hi frm spec");
  });
  // clientToSocketMap.set("663a8a581f5ac9b89475633a", socket.id);
});

async function startServer() {
  await mongocoonnect();
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}
startServer();
