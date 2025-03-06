import { IUserModal } from "@/interfaces/commonInterface";
import  {io}    from "socket.io-client";
const baseUrl  =  import.meta.env.VITE_API_BASE_URL;

class SocketIO{
    private _socket;

    constructor(){
        this._socket  = io(baseUrl,{
            reconnectionDelayMax: 3000,
            withCredentials:true,
        });
    }

    get socket(){
        return  this._socket;
    }

    socketErrors(){
        this._socket.on('error',(message) => {
            return   message;
        })
    }

    receiveUserMessages(){
        this._socket.on('incoming_message',(data:{from:IUserModal,message:string}) =>  {
            return  data;
        })   
    }
    
    receiveGroupMessages(){
        this._socket.on('incoming_group_message',(data:{from:IUserModal,message:string}) =>  {
            return  data;
        })
    }

    sendMessageToUser(message:string,receiver_user_id:string){
        this._socket.emit('send_message',({message,receiver_user_id}))
    }

    sendMessageToGroup(groupId:string,message:string){
        this._socket.emit('send_message_to_group',({groupId,message}))
    }
    
    sendGroupJoinRequest(groupId:string){
        this._socket.emit('group_join',({groupId}))
    }
    
    disconnect(){
        this._socket.emit('disconnect')
    }
}

export  default SocketIO;