const  ChatModal = require('../../modals/ChatsModal');
const UserModal  =  require('../../modals/UserModal');
const ConnectionModal = require('../../modals/ConnectionModal');

const handleSendMessage = async (socket, data,io) => {
    try {
        if (!data || !data.message || !data.to) {
            socket.emit('error', { message: 'Bad Request: Invalid data' });
            return;
        }

        const { message, to } = data;

        const receiverUser = await UserModal.findOne({
            username: to,
            is_active: 1,
        }); 

        if (!receiverUser) {
            return;
        }

        const chat = await ChatModal.create({
            sender_unique_id: socket.userId,
            receiver_unique_id: receiverUser._id,
            message: message,
            status: 'sent',
            is_active: 1,
        });

        
        const   toConnection   =  await ConnectionModal.findOne({username: to,is_active:1});

        if(!toConnection){
            return;
        }

        io.to(toConnection.socketId).emit('receive_message',{
            from: socket.username,
            message: message,
        });

    } catch (error) {
        socket.emit('error', { message: `Internal Server Error: ${error.message}` });
    }
};


const handleUserDisconnect = async (socket) => {
    try {
        const user = await UserModal.findOne({
            unique_token: socket.user_token,
            is_active: 1,
        });

        if (!user) {
            return;
        }

        user.status = 'offline';
        await user.save();
        
    } catch (error) {
        return;
    }
};


module.exports = {handleSendMessage,handleUserDisconnect};