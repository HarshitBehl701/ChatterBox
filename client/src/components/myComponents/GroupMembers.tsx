import React, { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IGroupMembersPopupProps } from "@/interfaces/componentInerface";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToastContainer } from "react-toastify";
import { getImagePathUrl, handleCatchErrors, handleToastPopup } from "@/utils/commonUtils";
import { Dot } from "lucide-react";
import { useUserContext } from "@/contexts/userContext";
import { IUserModal } from "@/interfaces/commonInterface";
import { updateGroup } from "@/api/groupApi";
import { useNavigate } from "react-router-dom";

const GroupMembers: React.FC<IGroupMembersPopupProps> = ({ trigger, groupData }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isAdminEditOpen,setIsAdminEditOpen]  = useState<number>(-1);
  const {userData}  = useUserContext();
  const navigate =   useNavigate();

  const transferOwnerShip  =  useCallback(async(user:IUserModal) =>{
    if(groupData && window.confirm(`Are you  sure you want to transfer ownership to ${user.name}(${user.username})`))
    {
      try {
        const response  =  await updateGroup({group_id:groupData._id,adminUserId:user._id});
        if(response.status)
        {
          handleToastPopup({message:'Successfully transfer group   ownership',type:"success"});
          setTimeout(()  => navigate('/groups'),1000);
        }else
          handleToastPopup({message:(response.message),type:"error"});
      } catch (error) {
        handleToastPopup({message:handleCatchErrors(error),type:"error"});
      }
    }
  },[groupData,navigate]);

  const removeMember  =  useCallback(async(user:IUserModal) =>{
    if(groupData && window.confirm(`Are you  sure you want to remove ${user.name}(${user.username}) from this group`))
    {
      try {
        const  members:IUserModal[] = groupData.members.filter((member) =>  member._id !==  user._id);
        const response  =  await updateGroup({group_id:groupData._id,members:members.map((member) => member._id).join(',')});
        if(response.status)
        {
          handleToastPopup({message:`Successfully remove ${user.name}(${user.username})   from this group`,type:"success"});
          setTimeout(()  => navigate('/groups'),1000);
        }else
          handleToastPopup({message:(response.message),type:"error"});
      } catch (error) {
        handleToastPopup({message:handleCatchErrors(error),type:"error"});
      }
    }
  },[groupData,navigate]);

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
          </DialogHeader>

          {/* Table Layout */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            {/* Scrollable Content */}
            <ScrollArea className="h-64 overflow-y-auto">
              <div className="divide-y divide-gray-700">
                {groupData?.members?.map((member,index) => (
                  <div key={member._id} className="flex items-center p-3 gap-4">
                    {/* Avatar Section (Left) */}
                    <div className="image relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={getImagePathUrl(
                            "group",
                            member.picture
                          )}
                          className="cursor-pointer"
                        />
                        <AvatarFallback>
                          <img
                            src="https://github.com/shadcn.png"
                            className="cursor-pointer"
                          />
                        </AvatarFallback>
                      </Avatar>
                      <Dot
                        className={`scale-200 -bottom-1 -right-1 absolute ${
                          (member.status  === 'online') ? "text-green-500" : "text-gray-600"
                        }`}
                      />
                    </div>

                    {/* Name & Username (Middle) */}
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-gray-100">{member.name}</span>
                      <span className="text-sm text-gray-400">@{member.username}</span>
                    </div>

                    {/* Manage Button (Right) */}
                    {groupData.adminUserId._id.includes(userData?._id as string) && 
                    <>
                      {isAdminEditOpen !== index && <Button size="sm" className="cursor-pointer" variant="secondary" onClick={() =>  setIsAdminEditOpen(index)}>
                      Manage
                      </Button>}
                      {isAdminEditOpen ==  index && 
                      <>
                      <Button size="sm"  variant={'link'} className="text-xs cursor-pointer text-red-500" onClick={()  =>  removeMember(member)}>Remove</Button>
                      <Button size="sm"  variant={'link'} className="text-xs cursor-pointer text-red-500" onClick={() => transferOwnerShip(member)}>Transfer Ownership</Button>
                      <Button size="sm"  variant={'link'} className="text-xs cursor-pointer text-red-500" onClick={() =>  setIsAdminEditOpen(-1)}>Cancel</Button>
                      </>
                      }
                    </>
                    }
                  </div>
                ))}
                {groupData?.members.length === 0  &&  <p className="italic text-xs p-3">No Members...</p>}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default GroupMembers;