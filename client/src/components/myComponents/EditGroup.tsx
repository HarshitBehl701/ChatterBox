import React, { FormEvent, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IUpdateGroup } from "@/interfaces/apiInterfaces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { validateSchema } from "@/validations/validateSchema";
import { updateGroupSchemaValidation } from "@/validations/schemas/groupSchemas";
import {
  getImagePathUrl,
  handleCatchErrors,
  handleToastPopup,
} from "@/utils/commonUtils";
import { updateGroup } from "@/api/groupApi";
import { ToastContainer } from "react-toastify";
import { IEditGroupProps } from "@/interfaces/componentInerface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { IUserModal } from "@/interfaces/commonInterface";
import { getAllActiveUsers } from "@/api/userApi";
import { useUtilsContext } from "@/contexts/utilsContext";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const EditGroup: React.FC<IEditGroupProps> = ({ trigger ,groupData}) => {
  const [open, setOpen] = useState(false);
  const [users,setUsers] = useState<IUserModal[] | null>(null);
  const [formData, setFormData] = useState({group_id:groupData._id} as IUpdateGroup);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<IUserModal[]>([]);
  const  {isUserAGroupMember} = useUtilsContext();
  const  navigate   =  useNavigate();

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(formData)
    {
        const { name, value, type, files } = e.target;
        if (type === "file" && files) {
        const file = files[0];
        setFormData((prev) => ({ ...prev, groupPicture: file }));
        setPreview(URL.createObjectURL(file));
        } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }
  },[formData]);

  const handleSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault();
      const validateFormData = validateSchema(updateGroupSchemaValidation, formData);
      if (Array.isArray(validateFormData)) {
        validateFormData.forEach((error) =>
          handleToastPopup({ message: error, type: "error" })
        );
      } else {
        const  groupMembers:string[] = groupData.members.length > 0 ? groupData.members.map((member) => member._id) : [];
        if(selectedMembers.length  >  0)
          groupMembers.push(...selectedMembers.map((member) => member._id));

        try {
          const response = await updateGroup({...formData,members:groupMembers.join(',')});
          if (response.status) {
            handleToastPopup({
              message: "Successfully updated Group details",
              type: "success",
            });
            setTimeout(() => navigate('/groups'),1000);
            setOpen(false);
          } else {
            handleToastPopup({ message: response.message, type: "error" });
          }
        } catch (error) {
          handleToastPopup({ message: handleCatchErrors(error), type: "error" });
        }
      }
    },
    [formData,selectedMembers,groupData.members,navigate]
  );

  const handleMemberSelection = (data: string) => {
    if (!data) return; // Prevent parsing empty or undefined values
    try {
      const user = JSON.parse(data);
      if (!user || !user._id) return; // Ensure valid user object
      setSelectedMembers((prev) => {
        if (prev.some((m) => m._id === user._id)) return prev; // Prevent duplicate selections
        return [...prev, user];
      });
    } catch (error) {
      console.error("Invalid JSON data:", data, error);
    }
  };
  
  const removeMember = (_id: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m._id !== _id));
  };

   const handleSelectMembersPopulate  = useCallback(async() => {
        if(users === null)
        {
          try {
              const  response =  await getAllActiveUsers();
  
              if(response.status)
              {
                const  filterData = (response.data.users as  IUserModal[]).filter((data) => !isUserAGroupMember(groupData,data._id));
                setUsers(filterData);
              }else{
                throw  new  Error((response.message));
              }
          } catch (error) {
            throw  new  Error(handleCatchErrors(error));
          }
        }
    },[users,isUserAGroupMember,groupData]);

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <label htmlFor="groupPicture" className="cursor-pointer">
                <Avatar className="w-full h-full rounded-full border-2 border-gray-700">
                  <AvatarImage
                    src={preview ?? getImagePathUrl("group", groupData?.picture ?? "")}
                    alt="Group Picture"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <img
                      src="https://github.com/shadcn.png"
                      className="cursor-pointer"
                      alt="Fallback Avatar"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all rounded-full">
                  <Pencil size={20} className="text-white" />
                </div>
              </label>
              <input id="groupPicture" name="groupPicture" type="file" className="hidden" onChange={handleChange} />
            </div>

            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name ?? groupData.name}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
            />

          <div>
            <Label htmlFor="members" className="text-gray-300 mb-1">Add New Members</Label>
            <Select onValueChange={(value) => {if(typeof  value  ===  'string')handleMemberSelection(value)}} onOpenChange={handleSelectMembersPopulate}>
              <SelectTrigger className="bg-gray-800 w-full cursor-pointer text-white border-gray-600">
                <SelectValue placeholder="Select Members" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 w-full text-white border-gray-600">
                {Array.isArray(users) &&   users.map((user) => (
                  <SelectItem key={user.username} value={user ? JSON.stringify(user) : ""} className="cursor-pointer">
                    {user.name}({user.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(selectedMembers) && selectedMembers.map((data) => (
                <Badge key={data.name} className="bg-blue-600 text-white px-2 py-1 rounded flex items-center">
                  {data.name}
                  <Button
                    type="button"
                    className="ml-2 text-xs bg-transparent p-0  hover:bg-transparent cursor-pointer rounded"
                    onClick={() => removeMember(data._id)}
                  >
                    ✕
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" onClick={() => setOpen(false)} className="bg-red-500 hover:bg-red-600">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default EditGroup;