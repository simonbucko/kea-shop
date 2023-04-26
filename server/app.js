import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import mongoose from "mongoose"
import socketServer from "./socketServer.js";
//routes
import authRouter from "./routes/authRouter.js"
import orderRouter from "./routes/orderRouter.js"
import productsRouter from "./routes/productsRouter.js"
import chatRoomRouter from "./routes/chatRoomRouter.js"
import checkoutRouter from "./routes/checkoutRouter.js"

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
    .then((mongoose) => {
        console.log("Connected to DB")
        const app = express()
        //set up express app
        app.use(express.json())
        app.use(cors())
        //routers
        app.use("/api/auth", authRouter)
        app.use("/api/products", productsRouter)
        app.use("/api/order", orderRouter)
        app.use("/api/chatrooms", chatRoomRouter)
        app.use("/api/checkout", checkoutRouter)
        app.use("/test", (req, res) => { res.send("Backend is working and is ready for requests") })
        //spin up the server
        const PORT = process.env.PORT || 8000
        const SOCKET_PORT = process.env.SOCKET_PORT || 8001
        socketServer(SOCKET_PORT, mongoose)
        app.listen(PORT, () => {
            console.log("Server is runnig on port: ", PORT)
            console.log("Socket server is running on port: ", SOCKET_PORT)
        })
    })
    .catch((error) => {
        console.log({ error })
        throw new Error(error)
    })


