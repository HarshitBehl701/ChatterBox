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

const {handleUserChatSendMessage,handleUserDisconnect}  = require('./sockets/controllers/userSocket');
const {handleGroupJoin,handleGroupChatSendMessage}  = require('./sockets/controllers/groupSocket');
const socketMiddleware =  require('./sockets/middlewares/socketMiddleware');

// Socket.IO
io.use(socketMiddleware);

io.on("connection",(socket) => {

    socket.on('send_user_chat_message',(data)  => handleUserChatSendMessage(socket,data,io));
    
    socket.on('group_join',(data) => handleGroupJoin(socket,data));
    
    socket.on('send_group_chat_message',(data)  => handleGroupChatSendMessage(socket,data,io));
    
    socket.on('disconnect', handleUserDisconnect);

})

// Http Requests
const userRouter =  require('./routers/userRouter');
const groupRouter =  require('./routers/groupRouter');

app.use("/v1/user",userRouter);
app.use("/v1/group",groupRouter);

server.listen(process.env.PORT);