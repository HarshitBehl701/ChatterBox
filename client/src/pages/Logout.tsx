import { logout } from "@/api/userApi";
import { useUserContext } from "@/contexts/userContext";
import { handleCatchErrors, handleToastPopup, unsetLocalStorageVariables } from "@/utils/commonUtils";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function Logout() {
const  {isLoggedIn,setIsLoggedIn,setUserData} = useUserContext();
  const  navigate  = useNavigate();
  useEffect(() =>  {
    if(isLoggedIn)
    {
      ;(async() =>{
        try {
            const response   = await  logout();
  
            if(response.status){
              unsetLocalStorageVariables();
              setUserData(null);
              setIsLoggedIn(false);
              handleToastPopup({message:'Logout  Successfully',type:"success"}) ;
              setTimeout(() =>  navigate('/login'),1000);
            }else
              handleToastPopup({message:(response.message),type:"error"}) ;
  
        } catch (error) {
          handleToastPopup({message:handleCatchErrors(error),type:"error"}) ;
        }
      })()
    }else{
      navigate("/login")
    }
  },[isLoggedIn,navigate,setIsLoggedIn,setUserData]);

  return (
    <ToastContainer />
  )
}

export default Logout