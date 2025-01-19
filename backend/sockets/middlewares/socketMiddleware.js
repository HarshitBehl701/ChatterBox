const jwt = require('jsonwebtoken');
const UserModal = require('../../modals/UserModal');
const ConnectionModal =  require('../../modals/ConnectionModal');

const socketMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await UserModal.findOne({
            _id: decoded.id,
            is_active: 1,
        });

        if (!user) {
            return next(new Error('Authentication failed: User not found or inactive'));
        }

        try{           
            const  previousConnection = await ConnectionModal.findOneAndUpdate({username:  user.username, is_active:  1},{socketId: socket.id},{new: true});

            if(!previousConnection){
                const connect   =  await ConnectionModal.create({
                    username: user.username,
                    socketId: socket.id,
                    is_active: 1
                });
            }

            socket.userId = user._id;
            socket.username = user.username;
            
            user.status = 'online';
            await user.save();
            next();
        }catch(connectionError){
            next(new Error('Connection Error: Some    Connection  Error Occurs'));    
        }
    } catch (err) {
        next(new Error('Authentication failed: Invalid or expired token'));
    }
};


module.exports = socketMiddleware;