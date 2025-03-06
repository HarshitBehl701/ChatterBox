import { IGroupModal, IUserModal } from "@/interfaces/commonInterface";
import { ISocketContext, ISocketContextProvider } from "@/interfaces/contextInterface";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Create context
// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<ISocketContext | null>(null);

export const SocketContextProvider = ({ children }: ISocketContextProvider) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const  [newMessageReceived,setNewMessageReceived] = useState<ISocketContext['newMessageReceived'] |null>(null);
    const  [currentPage,setCurrentPage] = useState<string |  null>(null);
    useEffect(() => {
        const connectionString = import.meta.env.VITE_API_BASE_URL;
        const newSocket = io(connectionString, { withCredentials: true });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        const messageListener = (data:string) => {
            setNewMessageReceived(JSON.parse(data));
        };

        if(currentPage   &&  currentPage.includes("user"))
            socket.on("incoming_message", messageListener);
        else  if(currentPage  &&   currentPage.includes('group'))
            socket.on("incoming_group_message", messageListener);

        return () => {
            socket.off("incoming_message", messageListener);
            socket.off("incoming_group_message", messageListener);
        };
    }, [socket,currentPage]);

    const sendUserMessage = useCallback((message: string, user: IUserModal) => {
        if (socket)
            socket.emit('send_message', { message: message, receiver_user_id: user._id });
    }, [socket]);

    const sendGroupMessage = useCallback((message: string, group: IGroupModal) => {
        if (!socket) return;
        // Ensure user joins the group before sending messages
            socket.emit('send_message_to_group', { message: message, groupId: group._id });
    }, [socket]);

    const  joinGroup = useCallback((group:IGroupModal) => {
        if(socket)
            socket.emit('group_join', { groupId: group._id });
    },[socket]);

    return (
        <SocketContext.Provider value={{ socket, sendUserMessage, sendGroupMessage,newMessageReceived,setNewMessageReceived,setCurrentPage,currentPage,joinGroup}}>
            {children}
        </SocketContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context)
        throw new Error('Socket Context Not Found');
    return context;
};
