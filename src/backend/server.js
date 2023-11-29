const app = require("express")();
const _ = require("lodash");
const httpServer = require("http").createServer(app);

const port = process.env.PORT || 3001;

var rooms = [];

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    allowEIO3: true,
  },
});

io.on("connection", (socket) => {
  console.log("Usuario conectado: ", socket.id);
  io.in(socket.id).emit("timer-conn-status", `user ${socket.id} connected`);

  // Create-room event
  socket.on("create-room", (id_prod) => {
    socket.join(id_prod);
    io.in(id_prod).emit(
      "create-room-msg",
      `Successfully created and joined ${id_prod} room`
    );
    console.log(`Successfully created and joined ${id_prod} room`);

    const room = {
      roomId: id_prod,
      duration: 20,
      timerId: undefined,
      currentTime: 20,
      isRunning: false,
    };

    rooms.push(room);
  });

});

