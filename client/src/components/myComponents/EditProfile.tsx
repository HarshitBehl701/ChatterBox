import React, { FormEvent, useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/contexts/userContext";
import { IUpdateUser } from "@/interfaces/apiInterfaces";
import { IEditProfilePopupProps } from "@/interfaces/componentInerface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { validateSchema } from "@/validations/validateSchema";
import { updateUserValidationSchema } from "@/validations/schemas/userSchemas";
import { getImagePathUrl, handleCatchErrors, handleToastPopup } from "@/utils/commonUtils";
import { updateUserDetails } from "@/api/userApi";
import { ToastContainer } from "react-toastify";

const EditProfilePopup: React.FC<IEditProfilePopupProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const { userData } = useUserContext();
  const [formData, setFormData] = useState<IUpdateUser | null>(null);
  const [preview, setPreview] = useState<string |null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "file" && e.target.files) {
      const file = e.target.files[0];
      setFormData({ ...formData, [name]: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = useCallback(async (ev: FormEvent) => {
    ev.preventDefault();
    if(formData)
    {
      const  validateFormData = validateSchema(updateUserValidationSchema,formData);
      if(Array.isArray(validateFormData))
      {
        validateFormData.map((error) => handleToastPopup({message:error,type:"error"}));
      } else{
        try {
          const response = await  updateUserDetails(formData);
          if(response.status)
          {
            handleToastPopup({message:"Successfully updated user details",type:"success"});
            setOpen(false);
          }else{
            handleToastPopup({message:(response.message),type:"error"});
          }
        } catch (error) {
            handleToastPopup({message:handleCatchErrors(error),type:"error"});
        }
      }  
    } 
  }, [formData]);

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <label htmlFor="profilePicture" className="cursor-pointer">
              <Avatar className="w-full h-full rounded-full object-cover border-2 border-gray-700">
                <AvatarImage src={preview ?? getImagePathUrl('user',userData?.picture ?? '')} className="object-cover object-center" alt="Profile Picture" />
                <AvatarFallback>
                <img src="https://github.com/shadcn.png" className="cursor-pointer" />
                </AvatarFallback>
              </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all rounded-full">
                  <Pencil size={20} className="text-white" />
                </div>
              </label>
              <input id="profilePicture" name="profilePicture" type="file" className="hidden" onChange={handleChange} />
            </div>
            <Label>Name</Label>
            <Input name="name" value={formData?.name ?? userData?.name} onChange={handleChange} className="bg-gray-800 border-gray-600 text-white" />
            
            <Label>Username</Label>
            <Input name="username" value={formData?.username ?? userData?.username} onChange={handleChange} className="bg-gray-800 border-gray-600 text-white" />
            
            <Label>Email</Label>
            <Input name="email" type="email" value={formData?.email ?? userData?.email} onChange={handleChange} className="bg-gray-800 border-gray-600 text-white" />
            
            <Label>Password</Label>
            <Input name="password" type="password" value={formData?.password ?? ''} onChange={handleChange} className="bg-gray-800 border-gray-600 text-white" />
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)}  type="button" className="  bg-red-500   hover:bg-red-600   cursor-pointer">Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 cursor-pointer">Save</Button>
          </div>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default EditProfilePopup;