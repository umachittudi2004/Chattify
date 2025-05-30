import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin : ['http://localhost:5173'],
    }
})

export function getRecevierSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {};

io.on('connection', (socket) => {
    // console.log('a user connected',socket.id)
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id; // Store the socket ID for the user
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap)) // Emit the list of online users to all clients


    socket.on('disconnect', () => {
        console.log('user disconnected')
        // Remove the socket ID from the userSocketMap when the user disconnects
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap)) // Emit the updated list of online users to all clients
    })
    // socket.on('message', (message) => {
    //     console.log(message)
    //     io.emit('message', message)
    // })
})

export { io, server , app }

