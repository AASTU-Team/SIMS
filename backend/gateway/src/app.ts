import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
// const attendancerouter = require("./routes/attendance/attendance.route");

const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");
import morgan from "morgan";
import { plugin } from "mongoose";

const simpleRequestLogger = (proxyServer: any, options: any) => {
  proxyServer.on("proxyReq", (proxyReq: any, req: any, res: any) => {
    console.log(`[HPM] [${req.method}] ${req.url}`); // outputs: [HPM] GET /users
  });
};

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  "/attendance",
  createProxyMiddleware({
    target: "http://localhost:6000/attendance",
    changeOrigin: true,
    plugin: [simpleRequestLogger],
    // onProxyReq: (proxyReq: any, req: any, res: any) => {
    //   console.log("Forwarding request:", req.method, req.url, req.body);
    //   // Forward request body
    //   if (req.body) {
    //     let bodyData = JSON.stringify(req.body);
    //     proxyReq.setHeader("Content-Type", "application/json");
    //     proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    //     proxyReq.write(bodyData);
    //   }
    // },
    // onProxyRes: (proxyRes: any, req: any, res: any) => {
    //   // Forward response headers
    //   Object.keys(proxyRes.headers).forEach((key) => {
    //     res.setHeader(key, proxyRes.headers[key]);
    //     res.send("dn");
    //   });
    // },
  })
);

export = app;
