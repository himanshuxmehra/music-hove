import { Socket } from "socket.io";

const io = require('socket.io')(3000,{
    cors: {
        origin: ["http://localhost:5173"],
      }
});

io.on('connection', function(socket:Socket) {

    console.log("-",socket.id)
    socket.on('sendMessage', (userId:String, messageContent:String, room) => {
        console.log(userId, "sent a message: ", messageContent)
        const payload = {
            userId: userId,
            message: messageContent
        }
        socket.to(room).emit('sendMessageToUsers', payload) 
    })

    socket.on("joinRoom", (room,cb) => {
        socket.join(room)
        console.log("Joined room")
        cb(`Joined ${room}`)
    })
});