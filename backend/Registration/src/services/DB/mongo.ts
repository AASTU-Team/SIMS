import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
//import winston from 'winston';
const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;
import { Logger } from "winston";

interface LogMessage {
  level: string;
  message: string;
  timestamp: string;
  remoteAddress?: string;
}



const logger: Logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    colorize(),
    printf(({ level, message, timestamp, remoteAddress }: LogMessage) => {
      return `${timestamp} [${level}] [${remoteAddress ?? ''}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'exports/app.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'exports/exceptions.log' }),
  ],
});

mongoose.set('debug', (collectionName, methodName, arg1, arg2, arg3) => {
  let log = `${collectionName}.${methodName}(`;
  const args = [arg1, arg2, arg3].filter((arg) => arg != null);
  log += args.map((arg) => JSON.stringify(arg)).join(', ');
  log += ')';

  logger.info(log);
});


export = async function mongo(): Promise<void> {
  mongoose.connection.on("connected", () => console.log("connected"));
  mongoose.connection.on("error", (err: Error) => {
    console.log(`MongoDB connection error: ${err}`);
  });
  await mongoose.connect(process.env.MONGODB_URI || `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.gpom6d9.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`, {});
};