const UserModal = require("../../modals/UserModal");
const GroupModal = require("../../modals/GroupModal");
const GroupChatsModal = require("../../modals/GroupChatsModal");

const handleGroupJoin = async (socket, data) => {
  try {
    if (!data || !data.groupId) {
      socket.emit("error", { message: "Bad Request: Invalid data" });
      return;
    }

    const user = await UserModal.findOne({
      _id: socket.userId,
      username: socket.username,
      is_active: 1,
    });
    if (!user) {
      socket.emit("error", { message: "Invalid Request" });
      return;
    }

    const { groupId } = data;

    const group = await GroupModal.findOne({
      _id: groupId,
      $or: [
        {members: socket.userId},
        {adminUserId:  socket.userId}
      ],
      status: "active",
      is_active: 1,
    });
    
    if (!group) {
      socket.emit("error", { message: "Invalid Request" });
      return;
    }

    socket.join(groupId);
  } catch (error) {
    socket.emit("error", { message: `Internal Server Error: ${error.message}` });
  }
};

const handleGroupChatSendMessage = async (socket, data, io) => {
  try {
    if (!data || !data.groupId || !data.message) {
      socket.emit("error", { message: "Bad Request: Invalid data" });
      return;
    }

    const user = await UserModal.findOne({
      _id: socket.userId,
      username: socket.username,
      is_active: 1,
    });

    if (!user) {
      socket.emit("error", {
        message: `Invalid Request`,
      });
      return;
    }

    const { groupId, message } = data;

    const group = await GroupModal.findOne({
      _id: groupId,
      $or:  [
        {members: socket.userId},
        {adminUserId:  socket.userId}
      ],
      status: "active",
      is_active: 1,
    });

    if (!group) {
      socket.emit("error", {
        message: `Invalid Request`,
      });
      return;
    }

    try {
      const chat = await GroupChatsModal.create({
        sender_unique_id: user._id,
        group_id: groupId,
        message: message,
      });

      io.to(groupId).emit("receive_group_chat_message", {
        username: user.username,
        picture: user.picture,
        message: message,
      });
    } catch (chatCreateError) {
      socket.emit("error", {
        message: `Internal Server Error: ${chatCreateError.message}`,
      });
      return;
    }
  } catch (error) {
    socket.emit("error", {
      message: `Internal Server Error: ${error.message}`,
    });
    return;
  }
};

module.exports = {
    handleGroupJoin,
    handleGroupChatSendMessage,
  };