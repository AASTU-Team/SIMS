import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
// const attendancerouter = require("./routes/attendance/attendance.route");
import { services } from "./services/api/apiservice";
import rateLimit from "express-rate-limit";

const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");
import morgan from "morgan";

app.use(cors());
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply the rate limiter to all requests
app.use(limiter);

services.forEach(({ route, target }) => {
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
    onProxyReq: (proxyReq: any, req: Request, res: Response) => {
      console.log("Proxy request:", req.method, req.url);

      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes: any, req: Request, res: any) => {
      console.log("Proxy response:", proxyRes.statusCode);

      // Forward response headers
      Object.keys(proxyRes.headers).forEach((key) => {
        res.setHeader(key, proxyRes.headers[key]);
      });
    },
    onError: (err: any, req: any, res: any) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy error");
    },
  };
  app.use(
    route,
    createProxyMiddleware({
      ...proxyOptions,
    })
  );
});

export = app;
