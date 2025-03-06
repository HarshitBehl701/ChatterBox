import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import GroupModal from '../../modals/GroupModal';
import GroupChatsModal from '../../modals/GroupChatsModal';
import { Redis } from 'ioredis';
import { handleCatchErrorResponse } from '../../utils/commonUtils';

interface CustomSocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> {
    user?: any;
}

interface GroupChatData {
    groupId: string;
    message?: string;
}

const handleGroupJoin = async (socket: CustomSocket, data: GroupChatData) => {
    try {
        if (!data || !data.groupId) {
            socket.emit('error', { message: 'Bad Request: Invalid data' });
            return;
        }

        const user = socket.user;
        if (!user) return;

        const { groupId } = data;

        const group = await GroupModal.findOne({
            _id: groupId,
            $or: [{ members: user._id }, { adminUserId: user._id }],
            status: 'active',
            is_active: 1,
        });

        if (!group) {
            socket.emit('error', { message: 'Invalid Request' });
            return;
        }

        socket.join(groupId);
    } catch (error) {
        socket.emit('error', { message: `Internal Server Error: ${handleCatchErrorResponse(error)}` });
    }
};

const handleGroupChatSendMessage = async (
    socket: CustomSocket,
    data: GroupChatData,
    io: any,
    pub: Redis
) => {
    try {
        if (!data || !data.groupId || !data.message) {
            socket.emit('error', { message: 'Bad Request: Invalid data' });
            return;
        }

        const user = socket.user;
        if (!user) return;

        const { groupId, message } = data;

        const group = await GroupModal.findOne({
            _id: groupId,
            $or: [{ members: user._id }, { adminUserId: user._id }],
            status: 'active',
            is_active: 1,
        });

        if (!group) {
            socket.emit('error', { message: 'Invalid Request' });
            return;
        }

        try {
            await GroupChatsModal.create({
                sender_user_id: user._id,
                group_id: groupId,
                message: message,
            });

            await pub.publish(
                'INCOMING_GROUP_MESSAGE',
                JSON.stringify({ from: user, to: group, message: message })
            );
        } catch (chatCreateError) {
            socket.emit('error', { message: `Internal Server Error: ${handleCatchErrorResponse(chatCreateError)}` });
            return;
        }
    } catch (error) {
        socket.emit('error', { message: `Internal Server Error: ${handleCatchErrorResponse(error)}` });
        return;
    }
};

export { handleGroupJoin, handleGroupChatSendMessage };