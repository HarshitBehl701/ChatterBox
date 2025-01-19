import React   ,  {useState,useEffect} from 'react'
import  io  from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

function Test() {
    console.log(process.env.REACT_APP_API_URL);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Listen for incoming messages
        socket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Clean up the listener on component unmount
        return () => {
            socket.off('receive_message');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('send_message', { text: message, time: new Date().toLocaleTimeString() });
            setMessage('');
        }
    };

  return (
    <div  className='w-full  h-screen bg-white'>
{messages.map((msg, index) => (
                    <p key={index}>
                        {msg.text} - <small>{msg.time}</small>
                    </p>
                ))}
<input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className='border border-dark-800'
            />
            <button onClick={sendMessage}>Send</button>

    </div>
  )
}

export default Test