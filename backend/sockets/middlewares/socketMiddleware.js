const jwt = require('jsonwebtoken');
const UserModal = require('../../modals/UserModal');
const ConnectionModal =  require('../../modals/ConnectionModal');

const socketMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const request_by = socket.handshake.auth.request_by;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await UserModal.findOne({
            _id: decoded.id,
            is_active: 1,
        });

        if (!user) {
            return;
        }

        try{   
            
            if(request_by == 'user'){
                const  previousConnection = await ConnectionModal.findOneAndUpdate({username:  user.username, is_active:  1},{socketId: socket.id},{new: true});

                if(!previousConnection){
                    try{
                        const connect   =  await ConnectionModal.create({
                            username: user.username,
                            socketId: socket.id,
                            is_active: 1
                        });
                    }catch(connectionError){
                        return;
                    }
                }

                socket.userId = user._id;
                socket.username = user.username;
                
                user.status = 'online';
                await user.save();
                return next();
            }else if(request_by == 'group'){
                socket.userId = user._id;
                socket.username = user.username;
                user.status = 'online';
                await user.save();
               return next();
            }

            return next(new Error('Bad Request:  Invalid Request'));
        }catch(connectionError){
            return;    
        }
    } catch (err) {
        return;
    }
};


module.exports = socketMiddleware;