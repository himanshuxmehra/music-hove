
const io = require('socket.io')(3001,{
    cors: {
        origin: ["http://localhost:3000"],
      }
});

io.on('connection', (socket : any) => {
  socket.on('join-room', (roomId : any) => {
    socket.join(roomId);

    // Broadcast to other users when a new user joins
    socket.broadcast.to(roomId).emit('user-connected', socket.id);

    socket.on('send-signal', ({ userId, signalData }: any) => {
      io.to(userId).emit('receive-signal', { userId: socket.id, signalData });
    });

    socket.on('send-message', (message : string) => {
      io.to(roomId).emit('receive-message', { user: socket.id, message });
    });

    socket.on('disconnect', () => {
      io.to(roomId).emit('user-disconnected', socket.id);
    });
  });
});
