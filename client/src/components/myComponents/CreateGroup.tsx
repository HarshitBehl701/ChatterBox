import { useState, useCallback, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { validateSchema } from "@/validations/validateSchema";
import { createGroupSchemaValidation } from "@/validations/schemas/groupSchemas";
import { handleCatchErrors, handleToastPopup } from "@/utils/commonUtils";
import { createGroup } from "@/api/groupApi";
import { IUserModal } from "@/interfaces/commonInterface";
import { getAllActiveUsers } from "@/api/userApi";
import { ToastContainer } from "react-toastify";

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
  } as   {groupName:string,description:string,members:string[]});

  const handleMemberSelection = (member: { _id: string; displayText: string }) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m._id === member._id)) return prev; // Prevent duplicate selections
      return [...prev, member];
    });
  };
  
  const removeMember = (_id: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m._id !== _id));
  };
  
  const [selectedMembers, setSelectedMembers] = useState<{ _id: string; displayText: string }[]>([]);

  const [members,setMembers] = useState<IUserModal[]| null>(null);

  const handleSubmit = useCallback(async (ev: FormEvent) => {
    ev.preventDefault();
    const validateForm = validateSchema(createGroupSchemaValidation, { ...formData, members: selectedMembers.map((member) => member._id).join(",")});
    if (Array.isArray(validateForm)) {
      validateForm.forEach((err) => handleToastPopup({ message: err, type: "error" }));
    } else {
      try {
        const response = await createGroup({ ...formData, members: selectedMembers.map((member) => member._id).join(",") });
        if (response.status) {
          handleToastPopup({ message: "Successfully Created New Group", type: "success" });
          setTimeout(() => window.location.reload(), 1000);
        } else {
          handleToastPopup({ message: response.message, type: "error" });
        }
      } catch (error) {
        handleToastPopup({ message: handleCatchErrors(error), type: "error" });
      }
    }
  }, [formData,selectedMembers]);

  const handleSelectMembersPopulate  = useCallback(async() => {
      if(members === null)
      {
        try {
            const  response =  await getAllActiveUsers();

            if(response.status)
            {
              setMembers(response.data.users);
            }else{
              throw  new  Error((response.message));
            }
        } catch (error) {
          throw  new  Error(handleCatchErrors(error));
        }
      }
  },[members]);

  return (
    <>
      <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-700 hover:bg-green-800 cursor-pointer text-xs font-semibold text-white">Create Group</Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create a New Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="group-name" className="text-gray-300 mb-1">Group Name</Label>
            <Input
              id="group-name"
              type="text"
              placeholder="Enter group name"
              required
              className="bg-gray-800 text-white border-gray-600"
              value={formData.groupName}
              onChange={(e) => setFormData((prev) => ({ ...prev, groupName: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="group-description" className="text-gray-300 mb-1">Description</Label>
            <Textarea
              id="group-description"
              placeholder="Enter group description"
              required
              className="bg-gray-800 text-white border-gray-600 resize-none"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="members" className="text-gray-300 mb-1">Members</Label>
            <Select onValueChange={(value) => handleMemberSelection(JSON.parse(value))} onOpenChange={handleSelectMembersPopulate}>
              <SelectTrigger className="bg-gray-800 w-full cursor-pointer text-white border-gray-600">
                <SelectValue placeholder="Select Members" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 w-full text-white border-gray-600">
                {Array.isArray(members) &&   members.map((member) => (
                  <SelectItem key={member.username} value={JSON.stringify({_id:member._id,displayText:`${member.name}(${member.username})`})} className="cursor-pointer">
                    {member.name}({member.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(selectedMembers) && selectedMembers.map((data) => (
                <Badge key={data.displayText} className="bg-blue-600 text-white px-2 py-1 rounded flex items-center">
                  {data.displayText}
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

          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 cursor-pointer text-white">
            Create Group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
    <ToastContainer />
    </>
  );
}
