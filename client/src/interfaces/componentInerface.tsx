import { IGroupModal } from "./commonInterface";

export interface ISearchComponentGroupUsersParam{
    currentPage:  string;
}

export   interface IEditProfilePopupProps {
    trigger: React.ReactNode;
}

export   interface IGroupMembersPopupProps {
    trigger: React.ReactNode;
    groupData:IGroupModal;
}

export   interface IEditGroupProps {
    trigger: React.ReactNode;
    groupData:IGroupModal;
}