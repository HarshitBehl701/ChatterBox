import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from '../helpers/toastHelpers';
import  {markUserOffline} from "../api/user";

function Logout() {
    const navigate = useNavigate();
    let  runOnce  =  false;
    useEffect(() => {

        const main  = async ()  => {
            if (runOnce  == false) {
                try{
                    const response  =  await markUserOffline(localStorage.getItem('token'),localStorage.getItem('user_name'));
    
                    if(response.status){
                        localStorage.removeItem('token');
                        localStorage.removeItem('user_name');
                        handleSuccess('Successfully logged you out');
                        runOnce =  true;
                        const timer = setTimeout(() => {
                            navigate('/login');
                        }, 2000);
    
                        return () => clearTimeout(timer);
                    }else{
                        handleError(response.message);
                    }
    
                }catch(error){
                    handleError(error.message);
                }
            }
        }

        main();
    }, [navigate]);

    return (
        <>
            <ToastContainer />
        </>
    );
}

export default Logout;
