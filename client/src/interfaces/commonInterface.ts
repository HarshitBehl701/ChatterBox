export  interface IUserModal{
    _id:string;
    name:string;
    picture:string;
    email:string;
    username:string;
    status:'online' | 'offline';
    friendsList:   IUserModal[];
    is_active: 0  | 1;
    createdAt:Date,
    updatedAt:Date,
}

export   interface IChatModal{
    sender_unique_id:  IUserModal;
    receiver_unique_id:   IUserModal;
    message:string;
    status:'sent' | 'delivered'  | 'read';
    is_active:0 | 1;
    createdAt:Date,
    updatedAt:Date,
}

export  interface  IFriendRequestModal{
    _id:string;
    request_sent_by_user_id:IUserModal;
    request_sent_to_user_id:IUserModal;
    status:'request'|'accepted'|'rejected';
    is_active:0 | 1;
}

export interface   IGroupChatModal{
    sender_user_id:IUserModal;
    group_id:IGroupModal;
    message:string;
    status:'sent' | 'delivered'  | 'read';
    is_active:0 | 1;
    createdAt:Date,
    updatedAt:Date,
}

export interface  IGroupModal{
    _id:string;
    name:string;
    adminUserId:IUserModal;
    picture:string;
    members:IUserModal[];
    status:'active'|'inactive';
    is_active:0 | 1;
    createdAt:Date,
    updatedAt:Date,
}

export interface IGroupRequestsModal{
    _id:string;
    groupId:IGroupModal;
    request_by:'group'|'user';
    userId:IUserModal;
    status:'request'|'accepted'|'rejected';
    is_active:0 | 1;
    createdAt:Date,
    updatedAt:Date,
}