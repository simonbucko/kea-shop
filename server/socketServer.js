import { Server } from "socket.io";
import { resolveAndMapUserName } from "./routes/functions.js";
import ChatRoom from "./models/chatRoom.js"

const socketServer = (socketPort, mongoose) => {
    const io = new Server(socketPort, {
        cors: {
            origin: ['http://localhost:8080']
        }
    });
    registerChatRoomSocket(io)
    registerChatRoomsSocket(io)
    registerChangeStream(io, mongoose)
}

const registerChatRoomSocket = (io) => {
    io.of("/socket/chatroom").on("connection", (socket) => {
        console.log("socket.io, /chatrooom: User connected: ", socket.id);

        socket.on("newMessage", async (message, roomId) => {
            const currentRoomId = roomId || socket.id
            console.log(message, socket.id, currentRoomId)
            try {
                await ChatRoom.findOneAndUpdate(
                    { roomId: currentRoomId },
                    { $push: { messages: message } }).exec();
            } catch (error) {
                console.log("Error while updaing messages")
                console.log(error)
            }
            var room = io.of("/socket/chatroom").adapter.rooms.get(currentRoomId);
            // room is of Set here
            // it is only user that is connected
            if (room.size === 1) {
                try {
                    await ChatRoom.findOneAndUpdate(
                        { roomId: currentRoomId },
                        { $set: { hasUnreadMessages: true } }
                    ).exec()
                } catch (error) {
                    console.log("Error while updaing read messages")
                    console.log(error)
                }

            }
            io.of("/socket/chatroom").to(currentRoomId).emit("newMessage", message)
        })

        socket.on("joinRoom", (roomId) => {
            console.log(`${socket.id} user joined ${roomId} room`)
            socket.join(roomId)
        })

        socket.on("leaveRoom", (roomId) => {
            console.log(`${socket.id} user left ${roomId} room`)
            socket.leave(roomId)
        })

        socket.on("disconnect", () => {
            io.of("/socket/chatroom").to(socket.id).emit("userDisconnected")
            console.log("socket.io, /chatroom: User disconnected: ", socket.id);
        });
    });
}

const registerChatRoomsSocket = (io) => {
    io.of("/socket/chatrooms").on("connection", (socket) => {
        console.log("socket.io, /chatrooms: User connected: ", socket.id);

        socket.on("disconnect", () => {
            console.log("socket.io, /chatroooms: User disconnected: ", socket.id);
        });
    });
}

const registerChangeStream = (io, mongoose) => {
    const db = mongoose.connection;
    const collection = db.collection('chatrooms');
    const changeStream = collection.watch();
    changeStream.on('change', async (next) => {
        switch (next.operationType) {
            case 'insert': {
                let { fullDocument: chatRoom } = next
                chatRoom = await resolveAndMapUserName(chatRoom)
                io.of("/socket/chatrooms").emit("new-active-chat-room", chatRoom)
                break;
            }
            case 'update': {
                let { documentKey: { _id }, updateDescription: { updatedFields } } = next
                if (updatedFields?.hasUnreadMessages !== undefined && updatedFields?.hasUnreadMessages) {
                    io.of("/socket/chatrooms").emit("new-unread-messages", _id.toString())
                }
                if (updatedFields?.hasUnreadMessages !== undefined && !updatedFields?.hasUnreadMessages) {
                    io.of("/socket/chatrooms").emit("new-messages-read", _id.toString())
                }
                break;
            }
            default: {
                break;
            }
        }
    });
}

export default socketServer;