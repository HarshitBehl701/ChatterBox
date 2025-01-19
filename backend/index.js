const express =  require('express');
const  http =  require('http');
const  cors  =  require('cors');
const {Server} =  require('socket.io');
const app  =   express();
require('dotenv').config();
const db  = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ["GET", "POST"],
}))

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN, // frontend origin allowed
        methods: ["GET", "POST"],
    },
});

const {handleSendMessage,handleUserDisconnect}  = require('./sockets/controllers/userSocket');
const socketMiddleware =  require('./sockets/middlewares/socketMiddleware');

// Socket.IO
io.use(socketMiddleware);

io.on("connection",(socket) => {

    socket.on('send_message',(data)  => handleSendMessage(socket,data,io));

    socket.on('disconnect', handleUserDisconnect);

})

// Http Requests
const userRouter =  require('./routers/userRouter');
app.use("/v1/user",userRouter);

server.listen(process.env.PORT);