import jwt from 'jsonwebtoken';
import { ExtendedError, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import User, { IUser } from '../../modals/UserModal';
import ConnectionModal from '../../modals/ConnectionModal';

interface CustomSocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> {
    user?: IUser;
}

const socketMiddleware = async (socket: CustomSocket, next: (err?: ExtendedError) => void): Promise<void> => {
    try {
        const rawCookies = socket.request.headers.cookie;

        if (!rawCookies) {
            return next(new Error('No cookies found'));
        }

        // ✅ Convert cookie string into an object
        const cookies = Object.fromEntries(
            rawCookies.split('; ').map(cookie => cookie.split('='))
        );

        // ✅ Now you can access ULOGINTOKEN
        const token = cookies['ULOGINTOKEN'];

        if (!token) return next(new Error('Authentication token missing'));

        const decoded = jwt.verify(token, process.env.SECRET_KEY || '') as { id: string };

        const user = await User.findOne({
            _id: decoded.id,
            is_active: 1,
        }).select('_id name username picture status');

        if (!user) return next(new Error('User not found'));

        try {
            const previousConnection = await ConnectionModal.findOneAndUpdate(
                { userId: user._id, is_active: 1 },
                { socketId: socket.id },
                { new: true }
            );

            if (!previousConnection) {
                await ConnectionModal.create({
                    userId: user._id,
                    socketId: socket.id,
                    is_active: 1,
                });
            }

            socket.user = user;
            next(); // Call next without an argument to proceed
        } catch (connectionError) {
            return next(new Error('Database connection error'));
        }
    } catch (err) {
        return next(new Error('Invalid token'));
    }
};

export default socketMiddleware;