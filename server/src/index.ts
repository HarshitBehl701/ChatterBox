import express, { Application } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import path from 'path';
import cookieParser from 'cookie-parser';
import Redis from 'ioredis';
import db from './config/db';
import { handleUserChatSendMessage, handleUserDisconnect } from './sockets/controllers/userSocket';
import { handleGroupJoin, handleGroupChatSendMessage } from './sockets/controllers/groupSocket';
import socketMiddleware from './sockets/middlewares/socketMiddleware';
import userRouter from './routers/userRouter';
import groupRouter from './routers/groupRouter';


function initServer() {
    const app: Application = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGIN as string,
            credentials: true,
        },
    });

    app.use(cookieParser());
    app.use(cors({
        origin: process.env.ALLOWED_ORIGIN as string,
        methods: ["GET", "POST"],
        credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/v1/mainAssets', express.static(path.join(process.cwd(), '/public')));
    app.use('/api/v1/userAssets', express.static(path.join(process.cwd(), '/public/assets/userAssets')));
    app.use('/api/v1/groupAssets', express.static(path.join(process.cwd(), '/public/assets/groupAssets')));

    io.use(socketMiddleware);

    const pub = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    });

    const sub = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    });

    sub.subscribe('INCOMING_MESSAGE');
    sub.subscribe('INCOMING_GROUP_MESSAGE');

    io.on("connection", (socket: Socket) => {
        socket.on('send_message', (data) => handleUserChatSendMessage(socket, data, pub));
        socket.on('group_join', (data) => handleGroupJoin(socket, data));
        socket.on('send_message_to_group', (data) => handleGroupChatSendMessage(socket, data, io, pub));
        socket.on('disconnect', () => handleUserDisconnect(socket));
    });

    sub.on("message", (channel: string, data: string) => {
        const obj = JSON.parse(data);
        if (channel === 'INCOMING_MESSAGE') {
            io.to(obj.to).emit("incoming_message", data);
        } else if (channel === 'INCOMING_GROUP_MESSAGE') {
            io.to(obj.to._id).emit("incoming_group_message", data);
        }
    });

    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/group", groupRouter);

    const port = process.env.PORT || 5000;
    server.listen(port, () => {
        db
        console.log(`Server is running on port ${port}`);
    });
}

initServer();