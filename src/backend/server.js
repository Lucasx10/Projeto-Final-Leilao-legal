const roomService = require('./services/roomService');
const app = require("express")();
const _ = require("lodash");
const httpServer = require("http").createServer(app);
const { instrument } = require("@socket.io/admin-ui");

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
      precoUltimoLance: 0.01,
    };

    rooms.push(room);
  });

  // ***********************************************************
  //                join-room event
  // ***********************************************************
  socket.on('join-room', (roomName=undefined) => {

    if (roomName) {
      socket.join(roomName);

      console.log('Successfully joined room: ' + roomName);
      io.in(socket.id).emit('join-room-msg', `Successfully joined room: '${roomName}'`);

    } else {
      io.in(socket.id).emit('join-room-err-msg', 'Please provide room name.');
    }
  });

  // ***********************************************************
  //                set-timer-duration event
  // ***********************************************************
  socket.on('set-timer-duration', (timerDuration) => {

    if (!isNaN(timerDuration)) {
      console.log('received: ' + timerDuration);
    
      var duration = parseInt(timerDuration, 20);        
      duration = duration > 0 ? duration : 20;

      const room = roomService.findRoom(rooms, socket);
      room.duration = duration;

      io.in(socket.id).emit('timer-duration', duration);
    }
  });

  socket.on('no-lances', (data) => {
    const room = roomService.findRoom(rooms, socket);
  
    if (room) {
      // Emitir um evento para informar ao cliente que ele não tem mais lances
      io.in(roomService.getRoomId(socket)).emit('no-lances', {
        msg: 'Você não tem mais lances disponíveis.',
      });
    }
  });

  // ***********************************************************
  //                set-timer-action event
  // ***********************************************************
  socket.on('set-timer-action', (timerAction) => {
    if (isNaN(timerAction)) {
      console.log(timerAction);
      const room = roomService.findRoom(rooms, socket);
      console.log(room);

      if (timerAction.timerAction === 'lance') {
        const room = roomService.findRoom(rooms, socket);

        // Cancelar o cronômetro anterior
        if (room.timerId) {
          clearInterval(room.timerId);
        }

        room.precoUltimoLance += 0.01;

        room.duration = 20;
        room.currentTime = room.duration;

        const data = {
          roomId: room.roomId,
          userUltimoLance: timerAction.userUltimoLance,
          precoUltimoLance: Number(room.precoUltimoLance),
        };

        io.in(roomService.getRoomId(socket)).emit('update-product', data);

        // Emitir evento para iniciar o cronômetro no frontend
        startCountdownTimer(room.duration, room);
      }
      
      if (timerAction.timerAction === 'start') {
        startCountdownTimer(room.duration, room);
      }

      if (timerAction.timerAction === 'pause') {
        const timerId = room.timerId;
        clearInterval(timerId);
      }

      if (timerAction.timerAction === 'resume') {
        startCountdownTimer(room.currentTime);
      }

      if (timerAction.timerAction === 'stop') {
        const timerId = room.timerId;
        clearInterval(timerId);

        rooms = roomService.removeRoom(rooms, socket);
        room.duration = 0;
        io.in(roomService.getRoomId(socket)).emit('set-timer-action', 0);
      }

    } else {
      io.in(socket.id).emit('timer-room-action-err', 'Please provide one of the following timer action: (start, pause, resume or stop)');
    }
  });

  // ***********************************************************
  //                disconnect event
  // ***********************************************************
  socket.on('disconnect', function () {
    console.log('User ' + socket.id + ' disconnected');
    io.in(roomService.getRoomId(socket)).emit('timer-conn-status', `${socket.id} disconnected.`)
 });

  socket.on("update-product", (data) => {
    const room = roomService.findRoom(rooms, socket);

    if (data.roomId === room.roomId) {
      // Faça o que for necessário quando o produto for atualizado
      console.log(`Produto do quarto ${data.roomId} atualizado:`, data);
      // Por exemplo, você pode atualizar variáveis ou enviar informações para o front-end
      io.sockets.in(roomService.getRoomId(socket)).emit('product-updated', {
        roomId: room.roomId,
        userUltimoLance: data.userUltimoLance,
        precoUltimoLance: data.precoUltimoLance,
      });
    }
  });
 
  // ***********************************************************
  //                        Timer  
  // ***********************************************************
  
  // Função modificada para iniciar o cronômetro
  function startCountdownTimer(duration, room) {
    if (duration !== 0 && room) { // Verifica se room é definido
      var timerId = setInterval(function () {
        if (duration <= 0) {
          clearInterval(timerId);
          io.sockets.in(roomService.getRoomId(socket)).emit('timer-countdown-end', {
            roomId: room.roomId,
            isRunning: false,
            currentTime: 0,
          });
        } else {
          io.sockets.in(roomService.getRoomId(socket)).emit('timer-countdown', {
            roomId: room.roomId,
            duration: duration,
            isRunning: true,
            currentTime: duration,
          });

          duration -= 1;
          room.currentTime = duration;
        }
      }, 1000, duration);

      room.timerId = timerId;
    }
  }
    
});


instrument(io, {auth: false});
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});


