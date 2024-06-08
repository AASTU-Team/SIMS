import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
const roomrouter = require("./routes/room/room.route");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Room API",
      version: "1.0.0",
      description: "Room API Information",
      contact: {
        name: "Amazing Developer",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./src/routes/room/room.route.ts"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/rooms", roomrouter);

export = app;
