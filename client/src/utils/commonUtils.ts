import { IHandleToastPopupParams, IToastPopupOptions } from "@/interfaces/specificInterfaces";
import {Bounce, toast}  from "react-toastify";

export  const isUserLoggedIn = ()  =>  {
    return  localStorage.getItem("ULOGINTOKEN") ? true :  false;
}

export  const setLocalStorage = (token:string) =>  {
    localStorage.setItem("ULOGINTOKEN",token);
}

export const unsetLocalStorageVariables = () =>{
    localStorage.removeItem('ULOGINTOKEN');
}

export const handleCatchErrors = (error:unknown) =>{
    return error  instanceof Error ? error.message : 'Something Went   Wrong';
} 

export  const formatDate =  (date:Date) => {
    const rawDate  = new Date(date);
    return rawDate.toLocaleDateString("en-GB",{
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}


export  const getImagePathUrl   = (type:string,imageUrl:string) => {
    const basePath = import.meta.env.VITE_API_BASE_URL;
    const imagePathObj =  {
        "main":'/api/v1/mainAssets',
        "user":'/api/v1/userAssets',
        "group":'/api/v1/groupAssets',
    }
    if(type  in imagePathObj)
        return basePath + imagePathObj[type as keyof typeof imagePathObj] + "/"  + imageUrl;
    return  "";
}   

export const handleToastPopup = (data:IHandleToastPopupParams) =>  {
    const options:IToastPopupOptions = {
        position: data.position ?? "top-right",
        autoClose: data.autoClose  ?? 5000,
        hideProgressBar: data.hideProgressBar ??  false,
        closeOnClick: data.closeOnClick  ?? false,
        pauseOnHover: data.pauseOnHover  ??   true,
        draggable: data.draggable  ?? true,
        progress: data.progress  ?? undefined,
        theme: data.theme ?? "light",
        transition: data.transition  ?? Bounce,
    }

    switch(data.type)
    {
        case  'error':
            toast.error(data.message,options); 
            break;
        case  'success':
            toast.success(data.message,options); 
            break;
        case  'warning':
            toast.warning(data.message,options); 
            break;
        case  'info':
            toast.info(data.message,options); 
            break;
        default:
            toast(data.message,options);
    }
}