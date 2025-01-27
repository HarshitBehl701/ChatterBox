import { setUserOffline } from "./userHelpers";

// default  values
export const token = localStorage.getItem("token");
export const username = localStorage.getItem("user_name");
const importBackendBaseLink = import.meta.env.VITE_API_URL;

//common helpers
export const  removeLocalStorageVariables = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
}

export const getPicturePath = (name = null, type) => {
  switch (type) {
    case "user":
      return `${importBackendBaseLink}/user/${name}`;
    case "group":
      return `${importBackendBaseLink}/group/${name}`;
    default:
      return "/assets/images/user.jpg";
  }
};

export const handleUserLogout = async () => {
  try {
    const response = await setUserOffline();
    if (response.status) {
      removeLocalStorageVariables();
      return {message:  "Successfully Log  Out  User",status:true}
    } else {
      return {message:  response.message,status:   false}
    }
  } catch (error) {
    return { message: error.message, status: false };
  }
};
