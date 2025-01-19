import  io  from "socket.io-client";
const socket = io(process.env.REACT_APP_API_URL,{
    auth:  {
        token:  localStorage.getItem('token')
    }
});

socket.on('connect_error', (err) => {
    console.error(err.message);
});

// Listen for incoming messages
socket.on('receive_message', (data) => {
    alert('New message received:' + data.message);
});

export  const  sendMessage = async  (message,receiver_id) => {
    try{
        socket.emit('send_message', { message: message, receiver_unique_id: receiver_id})
    }catch(error){
        return {message: error.message,status:false}
    }
}