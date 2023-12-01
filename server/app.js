import dotenv from "dotenv";
import mongoose from "mongoose";
import socketServer from "./socketServer.js";

dotenv.config();

mongoose
  .set("strictQuery", true) // remove a mongoose warning
  .connect(process.env.MONGO_URI)
  .then((mongoose) => {
    console.log("Connected to DB");
    const SOCKET_PORT = process.env.SOCKET_PORT || 8081;
    socketServer(SOCKET_PORT, mongoose);
    console.log(`Socket server running on port ${SOCKET_PORT}`);
  })
  .catch((error) => {
    console.log({ error });
    throw new Error(error);
  });
