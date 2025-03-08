import { FormEvent, useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { validateSchema } from "@/validations/validateSchema";
import { loginUserValidationSchema } from "@/validations/schemas/userSchemas";
import { handleCatchErrors, handleToastPopup, setLocalStorage } from "@/utils/commonUtils";
import { ToastContainer } from "react-toastify";
import { login } from "@/api/userApi";
import { ILoginUserResponse } from "@/interfaces/apiInterfaces";
import { useUserContext } from "@/contexts/userContext";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const {setUserData,setIsLoggedIn} = useUserContext();
  const  navigate  = useNavigate();
  
  const handleSubmit = useCallback(async(ev:FormEvent) =>{
    ev.preventDefault();
    const  validateForm  =  validateSchema(loginUserValidationSchema,formData);

    if(Array.isArray(validateForm))
    {
      validateForm.map((err)  =>handleToastPopup({message:handleCatchErrors(err),type:"error"}))
    }else{
      try {
          const response   = await  login(formData);
          if(response.status){
            const responseData  = (response.data as ILoginUserResponse);
            handleToastPopup({message:"Login Successfully",type:"error"}) ;
            setLocalStorage(responseData.token);
            setUserData(responseData.user);
            setIsLoggedIn(true);
            setTimeout(() => navigate("/home"),1000);
          }else
            handleToastPopup({message:(response.message),type:"error"}) ;

      } catch (error) {
        handleToastPopup({message:handleCatchErrors(error),type:"error"}) ;
      }
    }

  },[formData,setUserData,setIsLoggedIn,navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <Link  to={'/register'} className="text-center block text-xs hover:underline mt-2 text-blue-500">Already A  User?</Link>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
}