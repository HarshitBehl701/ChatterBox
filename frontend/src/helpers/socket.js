import io from "socket.io-client";

let socket = null;

export const getSocket = (requestBy) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem("token"),
        request_by: requestBy,
      },
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
