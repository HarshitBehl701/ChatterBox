import { FormEvent, useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { validateSchema } from "@/validations/validateSchema";
import { registerUserValidationSchema } from "@/validations/schemas/userSchemas";
import { handleCatchErrors, handleToastPopup } from "@/utils/commonUtils";
import { register } from "@/api/userApi";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = useCallback(async(ev:FormEvent) =>{
     ev.preventDefault();
     const  validateForm  =  validateSchema(registerUserValidationSchema,formData);
     if(Array.isArray(validateForm))
     {
       validateForm.map((err)  =>handleToastPopup({message:err,type:"error"}))
     }else{
       try {
           const response   = await  register(formData);
           if(response.status){
             handleToastPopup({message:"Successfully Register",type:"success"}) ;
              setTimeout(() =>  navigate("/login"),1000);
           }else  
             handleToastPopup({message:(response.message),type:"error"}) ;
 
       } catch (error) {
         handleToastPopup({message:handleCatchErrors(error),type:"error"}) ;
       }
     }
 
   },[formData,navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(ev) => setFormData({ ...formData, name: ev.target.value })}
                required
            />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(ev) =>  setFormData({ ...formData, 'username': ev.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(ev) =>  setFormData({ ...formData, 'email': ev.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(ev) =>  setFormData({ ...formData, 'password': ev.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
}