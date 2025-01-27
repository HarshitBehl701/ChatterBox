import React, { useEffect } from 'react';
import  {useNavigate} from  "react-router-dom"
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from '../helpers/toastHelpers';
import { handleUserLogout } from '../helpers/commonHelper';

function Logout() {
    const  navigate  = useNavigate();
    const  token  = localStorage.getItem("token");
    useEffect(() => {
    if(!token)   navigate('/login');
    const main  = async ()  => {
        const response   = await handleUserLogout();
        if(response.status){
            handleSuccess('Successfully logged you out');
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000);

            return () => clearTimeout(timer);
        }else{
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000);
            handleError(response.message);
        }
    }

        main();
    }, []);

    return (
        <>
            <ToastContainer />
        </>
    );
}

export default Logout;
