import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from '../helpers/toastHelpers';
import { setUserOffline } from '../helpers/userHelpers';

function Logout() {
    const navigate = useNavigate();
    let  runOnce  =  false;
    useEffect(() => {

        const main  = async ()  => {
            if (runOnce  == false) {
                const response   = await setUserOffline();
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
